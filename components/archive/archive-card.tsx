"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Byeongpung } from "@/lib/data"

interface ArchiveCardProps {
  byeongpung: Byeongpung
  index: number
}

export function ArchiveCard({ byeongpung, index }: ArchiveCardProps) {
  // Use thumbnailImage if available, otherwise use first panel's image
  const thumbnailImage = byeongpung.thumbnailImage || byeongpung.panels[0]?.image
  const isComplete = byeongpung.completedAt !== undefined
  const completedPanels = byeongpung.panels.filter(p => p.status === 'complete').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.6, 
        ease: "easeOut" 
      }}
    >
      <Link
        href={isComplete ? `/byeongpung/${byeongpung.id}` : "#"}
        className={`group block relative overflow-hidden rounded-md bg-card grain-texture ${!isComplete ? 'cursor-not-allowed' : ''}`}
        onClick={(e) => !isComplete && e.preventDefault()}
      >
        {/* Thumbnail Container - Wide aspect ratio for folding screen */}
        <div className="relative aspect-[3/1] lg:aspect-[4/1] overflow-hidden">
          {thumbnailImage ? (
            <Image
              src={thumbnailImage}
              alt={byeongpung.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // Placeholder for incomplete byeongpung
            <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full border border-muted-foreground/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground/50">이야기를 기다리는 중...</p>
              </div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent ${isComplete ? 'opacity-60 group-hover:opacity-40' : 'opacity-80'} transition-opacity duration-500`} />
          
          {/* Subtle border frame */}
          <div className="absolute inset-0 border border-border/30 rounded-md group-hover:border-border/50 transition-colors duration-300" />

          {/* Incomplete badge */}
          {!isComplete && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs bg-muted/80 text-muted-foreground rounded-sm backdrop-blur-sm">
                {completedPanels}/6 폭
              </span>
            </div>
          )}
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground/70 tracking-wider mb-1 uppercase">
                {byeongpung.theme}
              </p>
              <h3 
                className={`text-sm lg:text-base font-serif truncate transition-colors ${isComplete ? 'text-foreground group-hover:text-foreground/90' : 'text-muted-foreground'}`}
                style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
              >
                {byeongpung.title}
              </h3>
            </div>
            
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-muted-foreground/50 font-mono">
                {byeongpung.totalParticipants > 0 ? `${byeongpung.totalParticipants}명 참여` : '참여 대기'}
              </p>
              {byeongpung.completedAt ? (
                <p className="text-xs text-muted-foreground/40 font-mono mt-0.5">
                  {byeongpung.completedAt}
                </p>
              ) : (
                <p className="text-xs text-accent/60 font-mono mt-0.5">
                  진행 중
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hover indicator - only for complete ones */}
        {isComplete && (
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 h-px bg-foreground/30 origin-left"
          />
        )}
      </Link>
    </motion.div>
  )
}
