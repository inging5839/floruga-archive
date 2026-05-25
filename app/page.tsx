"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { SiteHeader } from "@/components/layout/site-header"
import { useArchiveImages } from "@/hooks/use-archive-images"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const { inProgress, completed, loading, error } = useArchiveImages()
  const featured = inProgress
  const others = completed
  const completedPanels = featured?.panels.filter((p) => p.status === "complete").length ?? 0
  const totalParticipants = featured?.totalParticipants ?? 0

  return (
    <main className="min-h-dvh min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Title */}
      <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-8 lg:pb-12 expo-tland-section-md">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[14vw] sm:text-4xl md:text-[3vw] lg:text-[6vw] font-black text-neutral-900 leading-none tracking-tighter expo-tland-hero-title"
            >
              병풍연화
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-3 mx-1 lg:m-2 sm:mt-2 sm:text-lg md:text-2xl lg:text-3xl text-neutral-800 font-serif leading-none"
            >
              아카이브 갤러리
            </motion.h2>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2 md:gap-2.5 lg:gap-3 flex-shrink-0 max-w-[40vw] sm:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative w-32 h-32 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-44 xl:h-44 flex-shrink-0 expo-tland-hero-qr"
            >
              <Image
                src="/qr_v2.png"
                alt="QR 코드 — 스캔 시 본인·타인 병풍 확인"
                fill
                className="object-contain"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-[10px] leading-snug text-neutral-600 text-center sm:text-xs md:text-sm lg:text-xl max-w-[9rem] sm:max-w-[11rem] md:max-w-[13rem] lg:max-w-[15rem]"
            >
              QR코드를 스캔하여
              <br />
              다양한 병풍을 확인해보세요!
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 flex flex-col md:flex-row md:items-end md:justify-end gap-4"
        >
          <div className="flex lg:items-center sm:items-start gap-6 lg:px-6 text-xs text-neutral-500">
            <span>
              완성된 병풍 <span className="text-neutral-900 font-medium">{completed.length}</span>개
            </span>
            {/* <span>
              현재 병풍 채워진 칸 <span className="text-neutral-900 font-medium">{completedPanels}</span>/6
            </span> */}
            <span>
              총 참여인원 <span className="text-neutral-900 font-medium">{totalParticipants}</span>명
            </span>
          </div>
        </motion.div>
      </section>

      {/* Featured Byeongpung */}
      <section className="md:py-6 lg:py-12 bg-neutral-50 border-t border-neutral-200 expo-tland-section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="px-6 lg:px-12 py-12 lg:py-20 expo-tland-section-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-neutral-900 uppercase mb-8 lg:mb-14 font-black">
              제작중인 병풍
            </h2>
            {loading && !featured ? (
              <div className="flex items-center justify-center py-32 text-sm text-neutral-500">
                병풍 데이터를 불러오는 중…
              </div>
            ) : featured ? (
              <ByeongpungViewer byeongpung={featured} />
            ) : (
              <div className="flex items-center justify-center py-32 text-sm text-neutral-500">
                {error ?? "표시할 병풍이 없습니다"}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Past Relays */}
      {others.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50 expo-tland-section">
          <div className="px-6 lg:px-12 py-12 lg:py-20 expo-tland-section-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-neutral-900 uppercase mb-8 lg:mb-14 font-black">
              완성된 병풍
            </h2>

            <div className="space-y-12 lg:space-y-24 expo-tland-stack">
              {others.slice(0, 2).map((bp, sectionIdx) => (
                <motion.article
                  key={bp.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: Math.min(sectionIdx * 0.05, 0.3) }}
                >
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      {/* <p className="text-sm text-neutral-400 font-mono mb-1">
                        #{String(bp.id).padStart(2, '0')}
                      </p> */}
                    </div>
                    <Link
                      href={`/byeongpung/${bp.id}`}
                      className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
                    >
                      자세히 보기
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <ByeongpungViewer byeongpung={bp} />
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 lg:py-16 border-t border-neutral-200 expo-tland-section-md">
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/archive"
            className="group flex items-center gap-3 px-8 py-4 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-full transition-all duration-300"
          >
            <span className="text-sm tracking-wider uppercase">
              모든 병풍 한 눈에 보기
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center justify-between w-full pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">
              병풍연화
            </p>
            <p className="text-xs text-neutral-400">
              팀 꽃충이
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
