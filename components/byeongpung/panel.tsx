"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Panel } from "@/lib/data"

interface ByeongpungPanelProps {
  panel: Panel
  index: number
  isActive?: boolean
}

export function ByeongpungPanel({ panel, index, isActive = false }: ByeongpungPanelProps) {
  const isComplete = panel.status === "complete"
  const isInProgress = panel.status === "in-progress"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      className={`
        relative flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[32vw] xl:w-auto xl:flex-1
        aspect-[3/4] lg:aspect-[2/3]
        min-h-[400px] lg:min-h-[550px]
        rounded-md overflow-hidden bg-muted
        ${isActive ? "ring-1 ring-accent/50" : ""}
      `}
    >
      {/* 1. 텍스처 배경 (맨 밑바닥 z-0) */}
      <div className="absolute inset-0 w-full h-full bg-card grain-texture hanji-texture z-0" />

      {isComplete && panel.image ? (
        /* 2. 이미지를 담는 전용 레이어 (w-full h-full 강제 주입!, z-10) */
        <div className="absolute inset-0 w-full h-full z-10">
          <Image
            src={panel.image}
            alt={panel.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 16vw"
            priority={index < 2}
          />
          {/* 그라데이션 및 텍스트 (이미지 위 z-20) */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-20" />
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 z-30">
            <p className="text-sm lg:text-base text-foreground/90 leading-relaxed line-clamp-3 font-serif">
              {panel.story}
            </p>
          </div>
        </div>
      ) : (
        /* 3. 미완성 스켈레톤 레이어 (z-10) */
        <div className="absolute inset-0 w-full h-full bg-muted/30 backdrop-blur-sm z-10">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 150" preserveAspectRatio="none">
              <defs>
                <pattern id={`pattern-${index}`} patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="10" cy="10" r="1" fill="currentColor" className="text-muted-foreground/30" />
                </pattern>
              </defs>
              <rect width="100" height="150" fill={`url(#pattern-${index})`} />
            </svg>
          </div>
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent transform -rotate-12" />
            <div className="absolute top-1/2 left-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent transform rotate-6" />
            <div className="absolute top-3/4 left-1/5 w-2/5 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent transform -rotate-3" />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
            {isInProgress ? (
              <>
                <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-12 h-12 mb-4 rounded-full border border-muted-foreground/30 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-t border-r border-muted-foreground/50 rounded-full" />
                </motion.div>
                <motion.p animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="text-sm text-muted-foreground font-serif leading-relaxed">
                  다음 관람객이<br />이야기를 이어가고 있습니다...
                </motion.p>
              </>
            ) : (
              <>
                <div className="w-8 h-8 mb-3 opacity-30">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground/60 font-serif">아직 열리지 않은 폭</p>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}