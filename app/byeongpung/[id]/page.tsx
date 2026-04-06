"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { archiveByeongpungs } from "@/lib/data"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ByeongpungDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const byeongpungId = parseInt(id, 10)
  const byeongpung = archiveByeongpungs.find(b => b.id === byeongpungId)

  if (!byeongpung) {
    notFound()
  }

  // Find previous and next for navigation
  const currentIndex = archiveByeongpungs.findIndex(b => b.id === byeongpungId)
  const prevByeongpung = currentIndex > 0 ? archiveByeongpungs[currentIndex - 1] : null
  const nextByeongpung = currentIndex < archiveByeongpungs.length - 1 ? archiveByeongpungs[currentIndex + 1] : null

  return (
    <main className="min-h-screen bg-background grain-texture hanji-texture">
      {/* Header */}
      <header className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 lg:px-8 pt-8 lg:pt-12 pb-6 lg:pb-10"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <Link
              href="/archive"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs tracking-wider">아카이브</span>
            </Link>
            <span className="text-xs text-muted-foreground/60 font-mono">
              {byeongpung.completedAt}
            </span>
          </div>

          {/* Title */}
          <div className="text-center max-w-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs lg:text-sm tracking-widest text-muted-foreground mb-3"
            >
              {byeongpung.theme}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-serif tracking-tight text-foreground text-balance"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              {byeongpung.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-4 text-sm text-muted-foreground/70"
            >
              {byeongpung.totalParticipants}명의 관람객이 함께 완성한 이야기
            </motion.p>
          </div>
        </motion.div>
      </header>

      {/* Byeongpung Viewer */}
      <section className="relative z-10 py-4 lg:py-8">
        <ByeongpungViewer byeongpung={byeongpung} />
      </section>

      {/* Navigation between byeongpungs */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 px-4 lg:px-8 py-8 lg:py-16"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {prevByeongpung ? (
              <Link
                href={`/byeongpung/${prevByeongpung.id}`}
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <p className="text-xs tracking-wider text-muted-foreground/60 mb-1">이전</p>
                  <p 
                    className="text-sm font-serif"
                    style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
                  >
                    {prevByeongpung.theme}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextByeongpung ? (
              <Link
                href={`/byeongpung/${nextByeongpung.id}`}
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="text-right">
                  <p className="text-xs tracking-wider text-muted-foreground/60 mb-1">다음</p>
                  <p 
                    className="text-sm font-serif"
                    style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
                  >
                    {nextByeongpung.theme}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 px-4 lg:px-8 py-8 lg:py-16"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-16 h-px bg-border mb-8" />
          
          <Link
            href="/archive"
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 hover:border-foreground/30 transition-all duration-300 hover:bg-card/50"
          >
            <span className="text-sm tracking-wider text-foreground/80 group-hover:text-foreground transition-colors">
              모든 아카이브 보기
            </span>
          </Link>

          <p className="mt-8 text-xs text-muted-foreground/40 text-center">
            릴레이 병풍 아카이브
            <br />
            <span className="tracking-wider">2024</span>
          </p>
        </div>
      </motion.footer>
    </main>
  )
}
