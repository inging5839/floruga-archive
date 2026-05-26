"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
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
    <main className="relative h-dvh w-full overflow-hidden bg-[#15110f] text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(214,188,150,0.18)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(255,221,178,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 flex h-full flex-col lg:flex-row">
        {/* 병풍 자동 슬라이드 영역 */}
        <section className="relative flex flex-1 flex-col px-6 pt-6 lg:px-8 lg:pt-8">
          <div className="relative flex-1 flex flex-col items-stretch justify-center">
            <div className="mb-3 lg:mb-5 flex items-end justify-between gap-6 w-full">
              <h1 className="text-2xl lg:text-4xl xl:text-5xl font-serif tracking-wide text-stone-50">
                지금까지 완성된 병풍
              </h1>
              <div className="shrink-0 min-h-[1em]">
                <AnimatePresence mode="wait">
                  {current && (
                    <motion.p
                      key={current.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-xs lg:text-lg text-stone-300"
                    >
                      {current.id}번째 이야기
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative w-full">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="w-full"
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

          {count > 1 && (
            <div className="mt-4 mb-8 flex items-center justify-center gap-2">
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

        {/* QR / 안내 영역 */}
        <aside className="flex w-full lg:w-[28rem] xl:w-[34rem] flex-col items-center justify-center gap-8 border-t lg:border-t-0 lg:border-l border-stone-700/60 bg-[#100c0a]/85 px-10 py-10 lg:px-14">
          <h2 className="text-center text-2xl lg:text-3xl xl:text-4xl font-serif leading-snug text-stone-50">
            디지털 전시관에서<br></br> 완성된 병풍을
            만나보세요
          </h2>

          <div className="relative aspect-square w-64 lg:w-80 xl:w-[22rem] bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
            <Image
              src="/qr_v2.png"
              alt="QR 코드 — 병풍연화 아카이브"
              fill
              priority
              sizes="(max-width: 1024px) 16rem, 22rem"
              className="object-contain p-2"
            />
          </div>

          <div className="text-center">
            <p className="text-sm lg:text-base text-stone-200">
              QR 코드를 스캔하면<br />홈페이지로 이동합니다
            </p>
            <p className="mt-3 text-xs lg:text-sm tracking-[0.3em] text-stone-400">
              WIGGLERBOOK.ART
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
