"use client"

import { motion } from "framer-motion"
import { ArchiveCard } from "./archive-card"
import type { Byeongpung } from "@/lib/data"

interface ArchiveGalleryProps {
  byeongpungs: Byeongpung[]
}

export function ArchiveGallery({ byeongpungs }: ArchiveGalleryProps) {
  return (
    <div>
      {/* Gallery Grid - 3 columns like the magazine layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
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
          className="flex flex-col items-center justify-center py-24"
        >
          <div className="w-16 h-16 mb-6 opacity-30">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-neutral-400">
              <rect x="4" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="14" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="24" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="34" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="44" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="54" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-sm text-neutral-500 text-center">
            No completed byeongpungs yet
            <br />
            <span className="text-xs">Be the first to participate in a relay byeongpung</span>
          </p>
        </motion.div>
      )}
    </div>
  )
}
