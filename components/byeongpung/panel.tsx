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
        relative flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-auto lg:flex-1
        aspect-[3/4] lg:aspect-[2/3]
        rounded-md overflow-hidden
        ${isActive ? "ring-1 ring-accent/50" : ""}
      `}
    >
      {/* Panel Frame */}
      <div className="absolute inset-0 bg-card grain-texture hanji-texture rounded-md">
        {isComplete && panel.image ? (
          <>
            {/* Completed Panel with Image */}
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 16vw"
            />
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Panel info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
              <p className="text-xs text-muted-foreground tracking-wider mb-1">
                {panel.author && `${panel.author}`}
              </p>
              <p className="text-sm lg:text-base text-foreground/90 leading-relaxed line-clamp-3 font-serif">
                {panel.story}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Incomplete Panel - Blurred Skeleton */}
            <div className="absolute inset-0 bg-muted/30 backdrop-blur-sm">
              {/* Abstract pattern for skeleton */}
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
              
              {/* Brush stroke hints */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent transform -rotate-12" />
                <div className="absolute top-1/2 left-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent transform rotate-6" />
                <div className="absolute top-3/4 left-1/5 w-2/5 h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent transform -rotate-3" />
              </div>
            </div>

            {/* Loading / Waiting State */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {isInProgress ? (
                <>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-12 h-12 mb-4 rounded-full border border-muted-foreground/30 flex items-center justify-center"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-t border-r border-muted-foreground/50 rounded-full"
                    />
                  </motion.div>
                  <motion.p
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-sm text-muted-foreground font-serif leading-relaxed"
                  >
                    다음 관람객이
                    <br />
                    이야기를 이어가고 있습니다...
                  </motion.p>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 mb-3 opacity-30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground/60 font-serif">
                    아직 열리지 않은 폭
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Panel Number Indicator */}
      <div className="absolute top-3 left-3 lg:top-4 lg:left-4">
        <span className="text-xs tracking-widest text-muted-foreground/70 font-mono">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Border frame effect */}
      <div className="absolute inset-0 rounded-md border border-border/50 pointer-events-none" />
    </motion.div>
  )
}
