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
  const thumbnailImage = byeongpung.thumbnailImage || byeongpung.panels[0]?.image
  const isComplete = byeongpung.completedAt !== undefined
  const completedPanels = byeongpung.panels.filter(p => p.status === 'complete').length

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "In Progress"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5, 
        ease: "easeOut" 
      }}
      className="group"
    >
      <Link
        href={isComplete ? `/byeongpung/${byeongpung.id}` : "#"}
        className={`block ${!isComplete ? 'cursor-not-allowed' : ''}`}
        onClick={(e) => !isComplete && e.preventDefault()}
      >
        {/* Card Header - Date and Category */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-neutral-500">
            {formatDate(byeongpung.completedAt)}
          </p>
          <span className={`px-3 py-1 text-xs border rounded-full ${
            isComplete 
              ? 'border-neutral-900 text-neutral-900' 
              : 'border-neutral-300 text-neutral-500'
          }`}>
            {isComplete ? 'Complete' : 'In Progress'}
          </span>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-neutral-100">
          {thumbnailImage ? (
            <Image
              src={thumbnailImage}
              alt={byeongpung.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-neutral-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-xs text-neutral-400">Waiting for stories...</p>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:underline underline-offset-2">
          {byeongpung.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">
          {byeongpung.theme}
        </p>

        {/* Footer - Author and Duration */}
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <span className="font-medium text-neutral-700">Panels</span>
            <span>{completedPanels}/6</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-neutral-700">Participants</span>
            <span>{byeongpung.totalParticipants}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
