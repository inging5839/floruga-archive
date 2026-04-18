"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Panel } from "@/lib/data"

interface ByeongpungPanelProps {
  panel: Panel
  index: number
  isActive?: boolean
  totalPanels?: number
}

export function ByeongpungPanel({ panel, index, isActive = false, totalPanels = 6 }: ByeongpungPanelProps) {
  const isComplete = panel.status === "complete"
  const isInProgress = panel.status === "in-progress"

  // Alternating background colors for magazine style
  const bgColors = [
    "bg-stone-100",
    "bg-stone-200",
    "bg-neutral-100",
    "bg-stone-100",
    "bg-neutral-200",
    "bg-stone-200",
  ]
  const bgColor = bgColors[index % bgColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className={`
        relative flex-shrink-0 
        w-[75vw] md:w-[40vw] lg:w-auto lg:flex-1
        min-h-[500px] lg:min-h-[600px]
        overflow-hidden
        ${bgColor}
        ${isActive ? "ring-2 ring-neutral-900" : ""}
        border-r border-neutral-300 last:border-r-0
      `}
    >
      {isComplete && panel.image ? (
        <div className="relative h-full flex flex-col">
          {/* Top section with small text */}
          <div className="p-4 lg:p-6">
            <p className="text-[10px] lg:text-xs text-neutral-500 tracking-wider uppercase">
              {panel.createdAt || `Panel ${index + 1}`}
            </p>
          </div>

          {/* Image section - centered */}
          <div className="flex-1 relative px-4 lg:px-6 flex items-center justify-center">
            <div className="relative w-full aspect-[3/4] max-h-[350px] overflow-hidden">
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 16vw"
                priority={index < 2}
              />
            </div>
          </div>

          {/* Bottom section with title and story */}
          <div className="p-4 lg:p-6 mt-auto">
            <h3 className="text-lg lg:text-xl font-bold text-neutral-900 tracking-tight mb-2 uppercase">
              {panel.title}
            </h3>
            <p className="text-xs lg:text-sm text-neutral-600 leading-relaxed line-clamp-3">
              {panel.story}
            </p>
            {panel.author && (
              <p className="mt-3 text-[10px] text-neutral-400 tracking-wide">
                <span className="text-neutral-500">Text</span> {panel.author}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Top section */}
          <div className="p-4 lg:p-6">
            <p className="text-[10px] lg:text-xs text-neutral-400 tracking-wider uppercase">
              {isInProgress ? "In Progress" : "Coming Soon"}
            </p>
          </div>

          {/* Center content */}
          <div className="flex-1 flex items-center justify-center px-6">
            {isInProgress ? (
              <motion.div 
                className="text-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-12 mx-auto mb-4 border border-neutral-400 rounded-full flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-t border-r border-neutral-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-neutral-500 tracking-wide">
                  Creating...
                </p>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 opacity-30">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-neutral-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                  </svg>
                </div>
                <p className="text-xs text-neutral-400">Waiting</p>
              </div>
            )}
          </div>

          {/* Bottom section with title */}
          <div className="p-4 lg:p-6 mt-auto">
            <h3 className="text-lg lg:text-xl font-bold text-neutral-400 tracking-tight uppercase">
              {panel.title}
            </h3>
          </div>
        </div>
      )}
    </motion.div>
  )
}
