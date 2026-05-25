"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, RefreshCw, Send, Sparkles } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { TABLET_CONTENT_CLASS } from "./tablet-classes"

const WEIGHT_EXAMPLES = [
  { src: "/images/tablet_input_example_youngjun.png", label: "관람객 A" },
  { src: "/images/tablet_weight_example_face_0.png", label: "0%" },
  { src: "/images/tablet_weight_example_face_25.png", label: "25%" },
  { src: "/images/tablet_weight_example_face_50.png", label: "50%" },
  { src: "/images/tablet_weight_example_face_75.png", label: "75%" },
  { src: "/images/tablet_weight_example_face_100.png", label: "100%" },
] as const

/** 같은 LAN의 GPU FastAPI. Vercel env에 NEXT_PUBLIC_ 접두사로 설정 */
const GPU_BASE_URL = (
  process.env.NEXT_PUBLIC_WIGGLER_GPU_URL ?? "http://165.194.161.35:10001"
).replace(/\/$/, "")

export function TabletExperience() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [intensity, setIntensity] = useState([100])
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const visitorIdRef = useRef("")

  useEffect(() => {
    if (!visitorIdRef.current && typeof crypto !== "undefined" && crypto.randomUUID) {
      visitorIdRef.current = crypto.randomUUID().replace(/-/g, "").slice(0, 12)
    }
  }, [])

  const stopStream = useCallback(() => {
    setStream((prev) => {
      prev?.getTracks().forEach((t) => t.stop())
      return null
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        setStream(s)
        setCameraError(null)
      } catch {
        if (!cancelled) {
          setCameraError(
            "카메라를 사용할 수 없습니다. 브라우저에서 카메라 권한을 허용했는지 확인해 주세요.",
          )
        }
      }
    })()
    return () => {
      cancelled = true
      stopStream()
    }
  }, [stopStream])

  useEffect(() => {
    const video = videoRef.current
    // 촬영 후 <video>가 언마운트되었다가 다시 마운트될 때 stream은 같아도
    // 새 video 요소에 srcObject를 다시 연결해야 함
    if (!video || !stream || capturedUrl) return
    video.srcObject = stream
    void video.play().catch(() => {})
  }, [stream, capturedUrl])

  const capture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) return
    const w = video.videoWidth
    const h = video.videoHeight
    if (!w || !h) return
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.save()
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, w, h)
    ctx.restore()
    setCapturedUrl(canvas.toDataURL("image/jpeg", 0.92))
  }, [])

  const retake = useCallback(() => {
    setCapturedUrl(null)
    setSubmitStatus("idle")
    setSubmitError(null)
  }, [])

  const submitPhoto = useCallback(async () => {
    if (!capturedUrl) return
    if (!visitorIdRef.current) {
      setSubmitStatus("error")
      setSubmitError("방문자 ID를 준비 중입니다. 잠시 후 다시 시도해 주세요.")
      return
    }
    setSubmitStatus("loading")
    setSubmitError(null)
    try {
      const res = await fetch(`${GPU_BASE_URL}/sendFace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: capturedUrl,
          strength: intensity[0] ?? 0,
          user_id: visitorIdRef.current,
        }),
      })

      const body = (await res.json().catch(() => ({}))) as {
        error?: string
        detail?: string | { msg?: string }
      }

      if (!res.ok) {
        const detail =
          typeof body.detail === "string"
            ? body.detail
            : body.detail?.msg
        throw new Error(
          detail || body.error || `제출 실패 (${res.status})`,
        )
      }

      setSubmitStatus("done")
    } catch (err) {
      setSubmitStatus("error")
      const message =
        err instanceof Error ? err.message : "제출에 실패했습니다."
      const mixedContentBlock =
        typeof window !== "undefined" &&
        window.location.protocol === "https:" &&
        GPU_BASE_URL.startsWith("http:")
      setSubmitError(
        mixedContentBlock
          ? "HTTPS(wigglerbook.art) 페이지에서는 HTTP GPU 주소로 전송할 수 없습니다. 전시장에서는 HTTP로 접속한 태블릿 전용 URL을 쓰거나, GPU에 HTTPS를 설정해 주세요."
          : message === "Failed to fetch"
            ? "GPU 서버에 연결할 수 없습니다. 태블릿이 전시장 Wi‑Fi(같은 네트워크)에 연결되어 있는지, GPU 서버가 실행 중인지 확인해 주세요."
            : message || "제출에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      )
    }
  }, [capturedUrl, intensity])

  const strength = intensity[0] ?? 0

  return (
    <main className="min-h-[100dvh] bg-white">
      <header className="border-b border-neutral-200 shrink-0">
        <div className="px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-900 tracking-wide"
          >
            병풍연화
          </Link>
          <p className="text-[10px] sm:text-xs text-neutral-500 tracking-[0.2em] uppercase text-right leading-snug">
            관람객 사진 촬영
          </p>
        </div>
      </header>

      <div className={TABLET_CONTENT_CLASS}>
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-5 lg:space-y-6"
        >
          <div className="flex flex-col gap-1 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                병풍에 반영될 얼굴 촬영하기
              </h1>
             
            </div>
            {/* <p className="text-[10px] sm:text-xs text-neutral-400 tracking-widest uppercase shrink-0 lg:pb-0.5">
              Landscape 권장
            </p> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-stretch gap-6 lg:gap-0 rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            {/* Step 1 — 촬영 */}
            <section className="flex flex-col gap-3 p-4 sm:p-5 lg:border-r lg:border-neutral-200 min-h-0 min-w-0">
              <div>
                <p className="text-[10px] sm:text-xs text-neutral-500 tracking-widest uppercase mb-1">
                  Step 1
                </p>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                  얼굴 촬영
                </h2>
              </div>

              <div className="relative aspect-[4/3] w-full flex-1 min-h-[200px] max-h-[min(48vh,380px)] lg:max-h-[min(52vh,340px)] mx-auto overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                {cameraError ? (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{cameraError}</p>
                  </div>
                ) : capturedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data URL from canvas
                  <img
                    src={capturedUrl}
                    alt="촬영된 얼굴"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : stream ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                    playsInline
                    muted
                    autoPlay
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-500">
                    <div className="h-9 w-9 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
                    <span className="text-xs sm:text-sm">카메라 준비 중…</span>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" aria-hidden />

              <div className="mt-auto pt-1">
                {!capturedUrl ? (
                  <button
                    type="button"
                    onClick={capture}
                    disabled={!stream || !!cameraError}
                    className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full border border-neutral-900 bg-neutral-900 text-white text-sm sm:text-base font-medium tracking-wide hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
                  >
                    <Camera className="w-5 h-5 shrink-0" aria-hidden />
                    얼굴 촬영
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={retake}
                    className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full border border-neutral-300 text-neutral-900 text-sm sm:text-base font-medium hover:border-neutral-900 hover:bg-neutral-50 transition-colors touch-manipulation"
                  >
                    <RefreshCw className="w-5 h-5 shrink-0" aria-hidden />
                    다시 찍기
                  </button>
                )}
              </div>
            </section>

            {/* Step 2 — 강도 + 미리보기 */}
            <section className="flex flex-col gap-3 p-4 sm:p-5 lg:border-r lg:border-neutral-200 min-h-0 min-w-0 border-t border-neutral-200 lg:border-t-0 pt-6 lg:pt-5">
              <div>
                <p className="text-[10px] sm:text-xs text-neutral-500 tracking-widest uppercase mb-1">
                  Step 2
                </p>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                  병풍 반영 강도
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-snug">
                  낮을수록 원본에 가깝고, 높을수록 얼굴 특징이 더 강하게 반영됩니다.
                </p>
              </div>

              <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <Label
                    htmlFor="intensity-slider"
                    className="text-xs sm:text-sm font-medium text-neutral-900"
                  >
                    반영 강도
                  </Label>
                  <span className="text-xs sm:text-sm tabular-nums text-neutral-600 font-mono">
                    {strength}%
                  </span>
                </div>
                <Slider
                  id="intensity-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={intensity}
                  onValueChange={setIntensity}
                  className="py-2 [&_[data-slot=slider-track]]:bg-neutral-200 [&_[data-slot=slider-range]]:bg-neutral-900 [&_[data-slot=slider-thumb]]:border-neutral-900"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-neutral-500 gap-2">
                  <span>약함</span>
                  <span>강함</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 min-h-0 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-500 shrink-0" aria-hidden />
                  <h3 className="text-[11px] sm:text-xs font-semibold text-neutral-800 tracking-wide uppercase">
                    반영 강도 예시
                  </h3>
                </div>
              

                <div className="flex flex-row gap-1.5 sm:gap-2 min-w-0 items-stretch pt-0.5">
                  {WEIGHT_EXAMPLES.map(({ src, label }) => (
                    <figure
                      key={label}
                      className="flex min-w-0 flex-1 flex-col gap-1"
                    >
                      <div className="relative w-full aspect-[3/4] max-h-[min(32vh,220px)] mx-auto overflow-hidden rounded-md border border-neutral-200 bg-stone-100">
                        <Image
                          src={src}
                          alt={`반영 강도 ${label} 예시`}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 1024px) 20vw, 140px"
                        />
                      </div>
                      <figcaption className="text-center text-[9px] sm:text-[10px] font-mono text-neutral-600 tabular-nums shrink-0">
                        {label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {/* Step 3 — 제출 */}
            <section className="flex flex-col gap-3 p-4 sm:p-5 min-h-0 min-w-0 border-t border-neutral-200 lg:border-t-0 pt-6 lg:pt-5 lg:justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-neutral-500 tracking-widest uppercase mb-1">
                  Step 3
                </p>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                  사진 제출
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-snug">
                  촬영된 사진과 강도를 다시 한 번 확인해주세요.<br></br><b>제출 후에는 다시 시도 할 수 없습니다!</b>
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => void submitPhoto()}
                  disabled={!capturedUrl || submitStatus === "loading" || submitStatus === "done"}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full border border-neutral-900 bg-white text-neutral-900 text-sm sm:text-base font-medium tracking-wide hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none touch-manipulation"
                >
                  <Send className="w-5 h-5 shrink-0" aria-hidden />
                  {submitStatus === "loading" ? "제출 중…" : "사진 제출 하기"}
                </button>
                {submitStatus === "done" && (
                  <p className="text-xs sm:text-sm text-neutral-700 text-center leading-snug" role="status">
                    제출이 완료되었습니다. Step 1에서「다시 찍기」로 새로 시작할 수 있습니다.
                  </p>
                )}
                {submitStatus === "error" && submitError && (
                  <p
                    className="text-xs sm:text-sm text-red-700 text-center leading-snug"
                    role="alert"
                  >
                    {submitError}
                  </p>
                )}
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      <footer className="mt-auto px-4 sm:px-6 lg:px-10 py-5 lg:py-6 border-t border-neutral-200">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between text-xs text-neutral-400">
          <span>병풍연화</span>
          <span>팀 꽃충이</span>
        </div>
      </footer>
    </main>
  )
}
