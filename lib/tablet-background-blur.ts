import {
  FilesetResolver,
  FaceDetector,
  type Detection,
} from "@mediapipe/tasks-vision"

const WASM_PATH = "/mediapipe/wasm"
const FACE_MODEL_PATH = "/mediapipe/blaze_face_short_range.tflite"

const DEFAULT_BLUR_PX = 24
const FACE_MASK_SCALE = 1.22
const MASK_FEATHER_PX = 8

let faceDetectorPromise: Promise<FaceDetector> | null = null

/** MediaPipe/TFLite가 INFO를 console.error로 찍어 Next.js 오버레이가 뜨는 것 방지 */
function isTfLiteInfoLog(args: unknown[]): boolean {
  const text = args.map((arg) => String(arg)).join(" ")
  return (
    text.startsWith("INFO:") ||
    text.startsWith("WARNING:") ||
    text.includes("XNNPACK delegate") ||
    text.includes("TensorFlow Lite")
  )
}

function installTfLogFilter(holdMs = 0): () => void {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (isTfLiteInfoLog(args)) return
    originalError(...args)
  }
  const restore = () => {
    console.error = originalError
  }
  if (holdMs > 0) {
    window.setTimeout(restore, holdMs)
  }
  return restore
}

function withSuppressedTfLogs<T>(run: () => T, holdMs = 250): T {
  const restore = installTfLogFilter(holdMs)
  try {
    return run()
  } finally {
    if (holdMs <= 0) restore()
  }
}

async function withSuppressedTfLogsAsync<T>(
  run: () => Promise<T>,
  holdMs = 500,
): Promise<T> {
  const restore = installTfLogFilter(holdMs)
  try {
    return await run()
  } finally {
    if (holdMs <= 0) restore()
  }
}

function loadFaceDetector(): Promise<FaceDetector> {
  if (!faceDetectorPromise) {
    faceDetectorPromise = withSuppressedTfLogsAsync(async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_PATH)
      return FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: FACE_MODEL_PATH,
          delegate: "CPU",
        },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.45,
      })
    })
  }
  return faceDetectorPromise
}

function drawMirroredFrame(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  width: number,
  height: number,
) {
  ctx.save()
  ctx.translate(width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(source, 0, 0, width, height)
  ctx.restore()
}

/** 가장 큰 얼굴 = 카메라에 가장 가까운 촬영 대상 */
function pickPrimaryFace(detections: Detection[]): Detection | null {
  let best: Detection | null = null
  let bestArea = 0

  for (const detection of detections) {
    const box = detection.boundingBox
    if (!box) continue
    const area = box.width * box.height
    if (area > bestArea) {
      bestArea = area
      best = detection
    }
  }

  return best
}

function scaleBoxToCanvas(
  box: NonNullable<Detection["boundingBox"]>,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const scaleX = targetWidth / sourceWidth
  const scaleY = targetHeight / sourceHeight
  return {
    cx: (box.originX + box.width / 2) * scaleX,
    cy: (box.originY + box.height / 2) * scaleY,
    rx: (box.width / 2) * scaleX * FACE_MASK_SCALE,
    ry: (box.height / 2) * scaleY * FACE_MASK_SCALE,
  }
}

function buildFaceEllipseMask(
  width: number,
  height: number,
  face: Detection,
  detectWidth: number,
  detectHeight: number,
): HTMLCanvasElement | null {
  const box = face.boundingBox
  if (!box) return null

  const { cx, cy, rx, ry } = scaleBoxToCanvas(
    box,
    detectWidth,
    detectHeight,
    width,
    height,
  )

  const maskCanvas = document.createElement("canvas")
  maskCanvas.width = width
  maskCanvas.height = height
  const maskCtx = maskCanvas.getContext("2d")
  if (!maskCtx) return null

  maskCtx.fillStyle = "#fff"
  maskCtx.beginPath()
  maskCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  maskCtx.fill()

  if (MASK_FEATHER_PX <= 0) return maskCanvas

  const feathered = document.createElement("canvas")
  feathered.width = width
  feathered.height = height
  const featherCtx = feathered.getContext("2d")
  if (!featherCtx) return maskCanvas
  featherCtx.filter = `blur(${MASK_FEATHER_PX}px)`
  featherCtx.drawImage(maskCanvas, 0, 0)
  return feathered
}

function compositeWithMask(
  output: HTMLCanvasElement,
  sharp: HTMLCanvasElement,
  blurred: HTMLCanvasElement,
  mask: HTMLCanvasElement,
) {
  const ctx = output.getContext("2d")
  if (!ctx) return

  ctx.clearRect(0, 0, output.width, output.height)
  ctx.drawImage(blurred, 0, 0)

  const fg = document.createElement("canvas")
  fg.width = output.width
  fg.height = output.height
  const fgCtx = fg.getContext("2d")
  if (!fgCtx) return

  fgCtx.drawImage(sharp, 0, 0)
  fgCtx.globalCompositeOperation = "destination-in"
  fgCtx.drawImage(mask, 0, 0)
  fgCtx.globalCompositeOperation = "source-over"

  ctx.drawImage(fg, 0, 0)
}

function detectFaces(
  detector: FaceDetector,
  source: HTMLCanvasElement,
) {
  return withSuppressedTfLogs(() => detector.detect(source), 400)
}

export type BackgroundBlurResult = {
  dataUrl: string
  blurred: boolean
  error?: string
}

/** 가장 큰 얼굴만 선명하게, 나머지(몸·의자·배경·다른 사람)는 블러 */
export async function captureWithBackgroundBlur(
  source: CanvasImageSource,
  width: number,
  height: number,
  blurPx: number = DEFAULT_BLUR_PX,
): Promise<BackgroundBlurResult> {
  const sharp = document.createElement("canvas")
  sharp.width = width
  sharp.height = height
  const sharpCtx = sharp.getContext("2d", { willReadFrequently: true })
  if (!sharpCtx) {
    throw new Error("canvas unavailable")
  }
  drawMirroredFrame(sharpCtx, source, width, height)

  const blurred = document.createElement("canvas")
  blurred.width = width
  blurred.height = height
  const blurredCtx = blurred.getContext("2d", { willReadFrequently: true })
  if (!blurredCtx) {
    throw new Error("canvas unavailable")
  }
  blurredCtx.filter = `blur(${blurPx}px)`
  drawMirroredFrame(blurredCtx, source, width, height)
  blurredCtx.filter = "none"

  try {
    const detector = await loadFaceDetector()
    const detectInput = document.createElement("canvas")
    detectInput.width = width
    detectInput.height = height
    const detectCtx = detectInput.getContext("2d", { willReadFrequently: true })
    if (!detectCtx) {
      throw new Error("detect canvas unavailable")
    }
    detectCtx.drawImage(sharp, 0, 0)

    const { detections } = detectFaces(detector, detectInput)
    const primaryFace = pickPrimaryFace(detections)
    if (!primaryFace) {
      return {
        dataUrl: sharp.toDataURL("image/jpeg", 0.92),
        blurred: false,
        error: "face not detected",
      }
    }

    const mask = buildFaceEllipseMask(
      width,
      height,
      primaryFace,
      width,
      height,
    )

    const output = document.createElement("canvas")
    output.width = width
    output.height = height

    if (mask) {
      compositeWithMask(output, sharp, blurred, mask)
      return {
        dataUrl: output.toDataURL("image/jpeg", 0.92),
        blurred: true,
      }
    }

    return {
      dataUrl: sharp.toDataURL("image/jpeg", 0.92),
      blurred: false,
      error: "face mask missing",
    }
  } catch (error) {
    if (!isTfLiteInfoLog([error])) {
      console.warn("Background blur failed, using original frame", error)
    }
    return {
      dataUrl: sharp.toDataURL("image/jpeg", 0.92),
      blurred: false,
      error: error instanceof Error ? error.message : "blur failed",
    }
  }
}

/** 첫 촬영 지연을 줄이기 위해 모델을 미리 로드 */
export function preloadBackgroundBlurModel() {
  void loadFaceDetector().catch((error) => {
    if (!isTfLiteInfoLog([error])) {
      console.warn("Face detector preload failed", error)
    }
  })
}
