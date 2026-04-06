"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { currentByeongpung } from "@/lib/data"
import { ArrowRight } from "lucide-react"

export default function ByeongpungDetailPage() {
  const completedPanels = currentByeongpung.panels.filter(p => p.status === "complete").length
  const inProgressPanel = currentByeongpung.panels.find(p => p.status === "in-progress")

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
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Relay Byeongpung
            </span>
            <span className="text-xs text-muted-foreground/60 font-mono">
              {completedPanels}/6 완성
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
              {currentByeongpung.theme}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-serif tracking-tight text-foreground text-balance"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              {currentByeongpung.title}
            </motion.h1>

            {inProgressPanel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-4 text-sm text-muted-foreground/70"
              >
                4명의 관람객이 함께 만들어가는 이야기
              </motion.p>
            )}
          </div>
        </motion.div>
      </header>

      {/* Byeongpung Viewer */}
      <section className="relative z-10 py-4 lg:py-8">
        <ByeongpungViewer byeongpung={currentByeongpung} />
      </section>

      {/* Story Summary */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 px-4 lg:px-8 py-8 lg:py-12"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs tracking-widest text-muted-foreground mb-4 uppercase">
            지금까지의 이야기
          </h2>
          <div className="space-y-4">
            {currentByeongpung.panels
              .filter(p => p.status === "complete" && p.story)
              .map((panel, idx) => (
                <p
                  key={panel.id}
                  className="text-sm lg:text-base text-foreground/80 leading-relaxed font-serif"
                  style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
                >
                  <span className="text-muted-foreground/50 mr-2 font-mono text-xs">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {panel.story}
                </p>
              ))}
          </div>
        </div>
      </motion.section>

      {/* Footer Navigation */}
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
              모두의 아카이브 보기
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
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
