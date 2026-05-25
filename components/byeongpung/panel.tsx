"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Panel } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ByeongpungPanelProps {
  panel: Panel
  index: number
  isActive?: boolean
  totalPanels?: number
  className?: string
}

export function ByeongpungPanel({
  panel,
  index,
  isActive = false,
  totalPanels = 6,
  className,
}: ByeongpungPanelProps) {
  const isComplete = panel.status === "complete"
  const showImage = Boolean(panel.image)

  // Alternating background colors for magazine style
  const bgColors = [
    "bg-stone-100",
    "bg-stone-100",
    "bg-stone-100",
    "bg-stone-100",
    "bg-stone-100",
    "bg-stone-100",
  ]
  const bgColor = bgColors[index % bgColors.length]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "relative flex-shrink-0",
        "w-[75vw] md:w-[45vw] max-xl:border-r max-xl:border-neutral-300",
        "lg:w-auto lg:flex-1",
        "expo-tland-panel",
        "overflow-hidden",
        "py-0",
        bgColor,
        className,
      )}
    >
      {showImage ? (
        <div className="relative h-full flex flex-col">
          <div className="flex-1 relative p-10 flex items-center justify-center">
            {isComplete ? (
              <a
                href={panel.image!}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full max-w-full aspect-[9/16] max-h-[min(68vh,540px)] lg:max-h-[min(72vh,580px)] expo-tland-panel-media overflow-hidden cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
                aria-label={`${panel.title} 이미지 원본 보기`}
              >
                <Image
                  src={panel.image!}
                  alt={panel.title}
                  fill
                  className="object-contain pointer-events-none"
                  sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 16vw"
                  priority={index < 2}
                  draggable={false}
                />
              </a>
            ) : (
              <div
                className="relative block w-full max-w-full aspect-[9/16] max-h-[min(68vh,540px)] lg:max-h-[min(72vh,580px)] expo-tland-panel-media overflow-hidden"
                aria-label="제작 중"
              >
                <Image
                  src={panel.image!}
                  alt="제작 중"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 16vw"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center px-3">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 opacity-30">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-neutral-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                </svg>
              </div>
              <p className="text-xs text-neutral-400">제작 중</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
