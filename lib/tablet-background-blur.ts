import {
  FilesetResolver,
  ImageSegmenter,
  type ImageSegmenterResult,
} from "@mediapipe/tasks-vision"

const WASM_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"

const MASK_THRESHOLD = 0.45
const DEFAULT_BLUR_PX = 18
const MASK_FEATHER_PX = 6

let segmenterPromise: Promise<ImageSegmenter> | null = null

function loadSegmenter(): Promise<ImageSegmenter> {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN)
      const options = {
        baseOptions: {
          modelAssetPath: MODEL_URL,
        },
        runningMode: "IMAGE" as const,
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      }

      try {
        return await ImageSegmenter.createFromOptions(vision, {
          ...options,
          baseOptions: { ...options.baseOptions, delegate: "GPU" },
        })
      } catch {
        return ImageSegmenter.createFromOptions(vision, {
          ...options,
          baseOptions: { ...options.baseOptions, delegate: "CPU" },
        })
      }
    })()
  }
  return segmenterPromise
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

function maskToAlphaCanvas(
  result: ImageSegmenterResult,
  width: number,
  height: number,
): HTMLCanvasElement | null {
  const confidenceMask = result.confidenceMasks?.[0]
  if (!confidenceMask) return null

  const maskW = confidenceMask.width
  const maskH = confidenceMask.height
  const floats = confidenceMask.getAsFloat32Array()
  const alpha = new Uint8ClampedArray(width * height * 4)

  for (let y = 0; y < height; y++) {
    const sy = Math.min(maskH - 1, Math.floor((y / height) * maskH))
    for (let x = 0; x < width; x++) {
      const sx = Math.min(maskW - 1, Math.floor((x / width) * maskW))
      const value = floats[sy * maskW + sx] ?? 0
      const a = value >= MASK_THRESHOLD ? 255 : 0
      const i = (y * width + x) * 4
      alpha[i] = 255
      alpha[i + 1] = 255
      alpha[i + 2] = 255
      alpha[i + 3] = a
    }
  }

  const maskCanvas = document.createElement("canvas")
  maskCanvas.width = width
  maskCanvas.height = height
  const maskCtx = maskCanvas.getContext("2d")
  if (!maskCtx) return null
  maskCtx.putImageData(new ImageData(alpha, width, height), 0, 0)

  if (MASK_FEATHER_PX > 0) {
    const feathered = document.createElement("canvas")
    feathered.width = width
    feathered.height = height
    const featherCtx = feathered.getContext("2d")
    if (!featherCtx) return maskCanvas
    featherCtx.filter = `blur(${MASK_FEATHER_PX}px)`
    featherCtx.drawImage(maskCanvas, 0, 0)
    return feathered
  }

  return maskCanvas
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

/** 전경 인물만 선명하게, 배경(뒤쪽 사람 포함)은 블러 처리한 JPEG data URL */
export async function captureWithBackgroundBlur(
  source: CanvasImageSource,
  width: number,
  height: number,
  blurPx: number = DEFAULT_BLUR_PX,
): Promise<string> {
  const sharp = document.createElement("canvas")
  sharp.width = width
  sharp.height = height
  const sharpCtx = sharp.getContext("2d")
  if (!sharpCtx) {
    throw new Error("canvas unavailable")
  }
  drawMirroredFrame(sharpCtx, source, width, height)

  const blurred = document.createElement("canvas")
  blurred.width = width
  blurred.height = height
  const blurredCtx = blurred.getContext("2d")
  if (!blurredCtx) {
    throw new Error("canvas unavailable")
  }
  blurredCtx.filter = `blur(${blurPx}px)`
  drawMirroredFrame(blurredCtx, source, width, height)
  blurredCtx.filter = "none"

  try {
    const segmenter = await loadSegmenter()
    const result = segmenter.segment(sharp)
    const mask = maskToAlphaCanvas(result, width, height)

    const output = document.createElement("canvas")
    output.width = width
    output.height = height

    if (mask) {
      compositeWithMask(output, sharp, blurred, mask)
      return output.toDataURL("image/jpeg", 0.92)
    }
  } catch (error) {
    console.warn("Background blur failed, using original frame", error)
  }

  return sharp.toDataURL("image/jpeg", 0.92)
}

/** 첫 촬영 지연을 줄이기 위해 모델을 미리 로드 */
export function preloadBackgroundBlurModel() {
  void loadSegmenter().catch((error) => {
    console.warn("Background blur model preload failed", error)
  })
}
