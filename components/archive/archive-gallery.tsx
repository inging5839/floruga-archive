"use client"

import { motion } from "framer-motion"
import { ArchiveCard } from "./archive-card"
import type { Byeongpung } from "@/lib/data"

interface ArchiveGalleryProps {
  byeongpungs: Byeongpung[]
}

export function ArchiveGallery({ byeongpungs }: ArchiveGalleryProps) {
  return (
    <div className="px-4 lg:px-8">
      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
      >
        {byeongpungs.map((byeongpung, index) => (
          <ArchiveCard
            key={byeongpung.id}
            byeongpung={byeongpung}
            index={index}
          />
        ))}
      </motion.div>

      {/* Empty state */}
      {byeongpungs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-16 h-16 mb-6 opacity-20">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-muted-foreground">
              <rect x="4" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="14" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="24" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="34" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="44" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="54" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground/60 font-serif text-center">
            아직 완성된 병풍이 없습니다
            <br />
            <span className="text-xs">첫 번째 릴레이 병풍에 참여해 보세요</span>
          </p>
        </motion.div>
      )}
    </div>
  )
}
