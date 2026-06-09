"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { HeroBanner } from "@/components/layout/hero-banner"
import { useArchiveImages } from "@/hooks/use-archive-images"

const SLIDE_INTERVAL_MS = 10_000

export default function ExitPage() {
  const { completed, loading, error } = useArchiveImages()
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = completed
  const count = slides.length

  useEffect(() => {
    if (count <= 1) return
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [count])

  useEffect(() => {
    if (count > 0 && activeIndex >= count) setActiveIndex(0)
  }, [count, activeIndex])

  const current = count > 0 ? slides[activeIndex] : null

  return (
    <main
      className="relative h-dvh w-full overflow-hidden text-stone-100"
      style={{
        backgroundColor: "#15110f",
        backgroundImage: "url('/images/background-texture.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "1400px auto",
        backgroundPosition: "top center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(214,188,150,0.14)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(255,221,178,0.06)_0%,transparent_60%)]" />

      <div className="relative z-10 flex h-full flex-col portrait:pt-[6vh]">
        {/* Hero 배너 — 맨 위 전체폭 */}
        <div className="w-full shrink-0 overflow-hidden border-y border-stone-400/60 portrait:border-t-0">
          <HeroBanner alt="병풍연화 배너" priority portrait />
        </div>

        {/* 본문: 세로(9:16) → 세로 스택 / 가로(데스크톱) → 2단 */}
        <div className="relative flex min-h-0 flex-1 flex-col landscape:lg:flex-row">
          {/* QR / 안내 — 세로에서는 가운데, 가로에서는 우측 사이드 */}
          <aside className="order-1 flex shrink-0 flex-col items-center justify-center gap-5 border-b border-stone-400/60 bg-[#100c0a]/85 px-6 py-6 portrait:py-[4vh] landscape:lg:order-2 landscape:lg:w-[28rem] landscape:lg:border-b-0 landscape:lg:border-l landscape:lg:px-12 landscape:lg:py-10 xl:landscape:lg:w-[34rem]">
            <h2 className="text-center font-serif text-xl leading-snug text-stone-50 portrait:text-[3.4vw] sm:text-2xl landscape:lg:text-3xl xl:landscape:lg:text-4xl">
              디지털 전시관에서<br /> 완성된 병풍을 만나보세요
            </h2>

            <div className="relative aspect-square w-[42vw] max-w-[20rem] bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.55)] landscape:lg:w-80 xl:landscape:lg:w-[22rem]">
              <Image
                src="/qr_v2.png"
                alt="QR 코드 — 병풍연화 아카이브"
                fill
                priority
                sizes="(max-width: 1024px) 42vw, 22rem"
                className="object-contain p-2"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-stone-200 portrait:text-[2.2vw] sm:text-base">
                QR 코드를 스캔하면<br />홈페이지로 이동합니다
              </p>
              <p className="mt-2 text-xs tracking-[0.3em] text-stone-400 portrait:text-[1.6vw] sm:mt-3 sm:text-sm">
                WIGGLERBOOK.ART
              </p>
            </div>
          </aside>

          {/* 병풍 자동 슬라이드 — 세로에서는 맨 아래 */}
          <section className="order-2 relative flex min-h-0 flex-1 flex-col px-4 pt-4 sm:px-6 sm:pt-6 landscape:lg:order-1 landscape:lg:px-8 landscape:lg:pt-8">
            <div className="relative flex min-h-0 flex-1 flex-col items-stretch justify-center">
              <div className="mx-auto w-full max-w-[920px] min-h-0 flex flex-1 flex-col">
                <div className="mb-2 text-center min-h-[1.25em] shrink-0">
                  <AnimatePresence mode="wait">
                    {current && (
                      <motion.p
                        key={current.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-xs text-stone-300 portrait:text-[2.4vw] lg:text-lg"
                      >
                        {current.id}번째 이야기
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center">
                  <AnimatePresence mode="wait">
                    {current && (
                      <motion.div
                        key={current.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="w-full origin-top scale-[0.96] lg:scale-[0.92]"
                      >
                        <ByeongpungViewer byeongpung={current} variant="exhibition" className="w-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {loading && count === 0 && (
                    <div className="flex h-full items-center justify-center text-sm text-stone-400">
                      병풍을 불러오는 중…
                    </div>
                  )}

                  {!loading && count === 0 && (
                    <div className="flex h-full items-center justify-center text-sm text-stone-400">
                      {error ?? "아직 완성된 병풍이 없습니다"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {count > 1 && (
              <div className="mt-3 mb-4 flex shrink-0 items-center justify-center gap-2 sm:mb-6">
                {slides.map((bp, idx) => (
                  <span
                    key={bp.id}
                    className={`h-[3px] rounded-full transition-all duration-500 ${
                      idx === activeIndex ? "w-12 bg-stone-100" : "w-2 bg-stone-600"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
