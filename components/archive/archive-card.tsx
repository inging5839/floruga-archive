"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { Byeongpung } from "@/lib/data"
import { formatKoreaDateTime } from "@/lib/datetime"

interface ArchiveCardProps {
  byeongpung: Byeongpung
  index: number
}

export function ArchiveCard({ byeongpung, index }: ArchiveCardProps) {
  const thumbnailImage = byeongpung.thumbnailImage || byeongpung.panels[0]?.image
  const isComplete = byeongpung.completedAt !== undefined

  const completedAtLabel = formatKoreaDateTime(byeongpung.completedAt)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5, 
        ease: "easeOut" 
      }}
      className="group border border-stone-400/60 p-4"
    >
      <Link
        href={isComplete ? `/byeongpung/${byeongpung.id}` : "#"}
        className={`block ${!isComplete ? 'cursor-not-allowed' : ''}`}
        onClick={(e) => !isComplete && e.preventDefault()}
      >
        <p className="mb-3 text-xs text-stone-400 tracking-[0.08em]">
          {byeongpung.id}번째 이야기
        </p>

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
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
                <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-stone-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-xs text-stone-500">이야기를 기다리고 있어요...</p>
              </div>
            </div>
          )}
        </div>

        {completedAtLabel && (
          <p className="mt-3 text-xs text-stone-400 leading-relaxed">
            {completedAtLabel} 완성
          </p>
        )}
      </Link>
    </motion.article>
  )
}
