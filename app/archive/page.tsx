"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArchiveGallery } from "@/components/archive/archive-gallery"
import { archiveByeongpungs, currentByeongpung } from "@/lib/data"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-background grain-texture hanji-texture">
      {/* Header */}
      <header className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8 lg:pb-12"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 lg:mb-16">
            <Link
              href="/"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs tracking-wider">진행 중인 병풍</span>
            </Link>
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Archive
            </span>
          </div>

          {/* Title */}
          <div className="max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-serif tracking-tight text-foreground text-center lg:text-left text-balance"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              모두의 아카이브
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-4 lg:mt-6 text-sm lg:text-base text-muted-foreground/70 text-center lg:text-left max-w-xl"
            >
              관람객들이 함께 완성한 릴레이 병풍을 감상하세요.
              <br className="hidden lg:block" />
              각각의 병풍은 여섯 명의 이야기가 모여 하나의 서사가 됩니다.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-8"
            >
              <div className="text-center lg:text-left">
                <p className="text-2xl lg:text-3xl font-serif text-foreground">
                  {archiveByeongpungs.length}
                </p>
                <p className="text-xs text-muted-foreground/60 tracking-wider mt-1">
                  완성된 병풍
                </p>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center lg:text-left">
                <p className="text-2xl lg:text-3xl font-serif text-foreground">
                  {archiveByeongpungs.reduce((acc, b) => acc + b.totalParticipants, 0)}
                </p>
                <p className="text-xs text-muted-foreground/60 tracking-wider mt-1">
                  총 참여자
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Current in-progress banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="px-4 lg:px-8 pb-8"
      >
        <Link
          href="/"
          className="group block max-w-4xl mx-auto p-4 lg:p-6 rounded-lg bg-card/50 border border-border/30 hover:border-border/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-accent tracking-wider mb-0.5">현재 진행 중</p>
              <p 
                className="text-sm lg:text-base text-foreground font-serif truncate"
                style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
              >
                {currentByeongpung.title} — {currentByeongpung.theme}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-muted-foreground font-mono">
                {currentByeongpung.panels.filter(p => p.status === "complete").length}/6
              </span>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* Divider */}
      <div className="px-4 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs text-muted-foreground/40 tracking-widest uppercase">완성된 작품</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="relative z-10 py-8 lg:py-12">
        <ArchiveGallery byeongpungs={archiveByeongpungs} />
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 px-4 lg:px-8 py-12 lg:py-20"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-16 h-px bg-border mb-8" />
          
          <p className="text-xs text-muted-foreground/40 text-center">
            릴레이 병풍 아카이브
            <br />
            <span className="tracking-wider">2024</span>
          </p>
        </div>
      </motion.footer>
    </main>
  )
}
