"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { HeroBanner } from "@/components/layout/hero-banner"
import { SiteHeader } from "@/components/layout/site-header"
import { useArchiveImages } from "@/hooks/use-archive-images"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const { inProgress, completed, loading, error } = useArchiveImages()
  const featured = inProgress
  const others = completed

  return (
    <main className="min-h-dvh min-h-screen">
      <SiteHeader />

      {/* Hero Banner */}
      <section className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <HeroBanner priority />
        </motion.div>
      </section>

      {/* Featured Byeongpung */}
      <section className="md:py-6 lg:py-12 border-t border-stone-400/60 expo-tland-section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="px-6 lg:px-12 py-12 lg:py-20 expo-tland-section-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-stone-100 uppercase mb-8 lg:mb-14 font-black">
              제작중인 병풍
            </h2>
            {loading && !featured ? (
              <div className="flex items-center justify-center py-32 text-sm text-stone-400">
                병풍 데이터를 불러오는 중…
              </div>
            ) : featured ? (
              <ByeongpungViewer byeongpung={featured} />
            ) : (
              <div className="flex items-center justify-center py-32 text-sm text-stone-400">
                {error ?? "표시할 병풍이 없습니다"}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Past Relays */}
      {others.length > 0 && (
        <section className="border-t border-stone-400/60 expo-tland-section">
          <div className="px-6 lg:px-12 py-12 lg:py-20 expo-tland-section-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-stone-100 uppercase mb-8 lg:mb-14 font-black">
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
                      <p className="text-xs text-stone-400 tracking-[0.08em]">
                        {bp.id}번째 이야기
                      </p>
                    </div>
                    <Link
                      href={`/byeongpung/${bp.id}`}
                      className="text-xs text-stone-400 hover:text-stone-100 transition-colors flex items-center gap-1"
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
      <footer className="px-6 lg:px-12 py-12 lg:py-16 border-t border-stone-400/60 expo-tland-section-md">
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/archive"
            className="group flex items-center gap-3 px-8 py-4 border border-stone-300 text-stone-100 hover:bg-stone-100 hover:text-stone-900 rounded-full transition-all duration-300"
          >
            <span className="text-sm tracking-wider uppercase">
              모든 병풍 보러 가기
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center justify-between w-full pt-8 border-t border-stone-400/50">
            <p className="text-xs text-stone-500">
              병풍연화
            </p>
            <p className="text-xs text-stone-500">
              팀 꽃충이
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
