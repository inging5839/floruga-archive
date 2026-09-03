"use client"

import { motion } from "framer-motion"
import { ArchiveCard } from "./archive-card"
import type { Byeongpung } from "@/lib/data"

interface ArchiveGalleryProps {
  byeongpungs: Byeongpung[]
  detailBasePath?: string
  allowIncomplete?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function ArchiveGallery({
  byeongpungs,
  detailBasePath,
  allowIncomplete = false,
  emptyTitle = "아직 완성된 병풍이 없습니다",
  emptyDescription = "첫 번째 릴레이 병풍의 참여자가 되어보세요",
}: ArchiveGalleryProps) {
  return (
    <div>
      {/* Gallery Grid - 3 columns like the magazine layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-12"
      >
        {byeongpungs.map((byeongpung, index) => (
          <ArchiveCard
            key={byeongpung.id}
            byeongpung={byeongpung}
            index={index}
            detailBasePath={detailBasePath}
            allowIncomplete={allowIncomplete}
          />
        ))}
      </motion.div>

      {/* Empty state */}
      {byeongpungs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <div className="w-16 h-16 mb-6 opacity-30">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-stone-500">
              <rect x="4" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="14" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="24" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="34" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="44" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="54" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-sm text-stone-400 text-center">
            {emptyTitle}
            <br />
            <span className="text-xs">{emptyDescription}</span>
          </p>
        </motion.div>
      )}
    </div>
  )
}
