"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { getRelaysForMainPage, type Byeongpung } from "@/lib/data"
import { ArrowRight } from "lucide-react"

function StorySummary({ byeongpung, heading }: { byeongpung: Byeongpung; heading: string }) {
  const panels = byeongpung.panels.filter((p) => p.status === "complete" && p.story)
  if (panels.length === 0) return null

  return (
    <div className="max-w-2xl mx-auto pt-8 lg:pt-10">
      <h2 className="text-xs tracking-widest text-muted-foreground mb-4 uppercase">{heading}</h2>
      <div className="space-y-4">
        {panels.map((panel, idx) => (
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
  )
}

export default function ByeongpungDetailPage() {
  const { featured, others } = getRelaysForMainPage()
  const completedPanels = featured.panels.filter((p) => p.status === "complete").length
  const inProgressPanel = featured.panels.find((p) => p.status === "in-progress")

  return (
    <main className="min-h-screen bg-background grain-texture hanji-texture">
      {/* Header — 최신(강조) 릴레이 기준 */}
      <header className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 lg:px-8 pt-8 lg:pt-12 pb-6 lg:pb-10"
        >
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Relay Byeongpung
            </span>
            <span className="text-xs text-muted-foreground/60 font-mono">
              {completedPanels}/6 완성
            </span>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[10px] sm:text-2xl tracking-[0.25em] text-accent/90 mb-3 uppercase"
            >
               병풍연화
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs lg:text-sm tracking-widest text-muted-foreground mb-3"
            >
              {featured.theme}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-serif tracking-tight text-foreground text-balance"
              style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
            >
              {featured.title}
            </motion.h1>

            {inProgressPanel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-4 text-sm text-muted-foreground/70"
              >
                {featured.totalParticipants > 0
                  ? `${featured.totalParticipants}명의 관람객이 함께 만들어가는 이야기`
                  : "관람객이 함께 만들어가는 이야기"}
              </motion.p>
            )}
          </div>
        </motion.div>
      </header>

      {/* 최신 릴레이 — 6폭 전체 + 시각적 강조 */}
      <section className="relative z-10 px-3 lg:px-8 pb-6 lg:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative mx-auto max-w-[2400px] overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card/40 via-card/20 to-transparent p-3 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)] ring-1 ring-accent/15 lg:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <ByeongpungViewer byeongpung={featured} />
        </motion.div>

        {/* <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative z-10 px-1 lg:px-0 py-8 lg:py-12"
        >
          <StorySummary byeongpung={featured} heading="지금까지의 이야기" />
        </motion.section> */}
      </section>

      {/* 이전 릴레이 병풍 — 스크롤로 순서대로 */}
      {others.length > 0 && (
        <section
          id="past-relays"
          className="relative z-10 border-t border-border/40 bg-background/40"
        >
          <div className="mx-auto max-w-[2400px] px-4 lg:px-8 py-10 lg:py-14">
            <h2 className="text-center text-xs tracking-[0.35em] text-muted-foreground uppercase mb-10 lg:mb-14">
              이전 병풍
            </h2>

            <div className="space-y-16 lg:space-y-24">
              {others.map((bp, sectionIdx) => (
                <motion.article
                  key={bp.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: Math.min(sectionIdx * 0.05, 0.3) }}
                  className="scroll-mt-8"
                >
                  <div className="mb-6 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
                    <div>
                      <p className="text-[20px] tracking-[0.2em] text-muted-foreground/80 font-mono mb-1">
                        #{bp.id}
                      </p>
                      <p className="text-xs tracking-widest text-muted-foreground mb-1">{bp.theme}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/30 bg-card/10 p-2 lg:p-5">
                    <ByeongpungViewer
                      byeongpung={bp}
                      className="max-w-5xl mx-auto opacity-[0.97]"
                    />
                  </div>

                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

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
