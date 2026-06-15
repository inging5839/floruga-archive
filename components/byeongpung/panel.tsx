"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Panel } from "@/lib/data"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { cn } from "@/lib/utils"

interface ByeongpungPanelProps {
  panel: Panel
  index: number
  isActive?: boolean
  totalPanels?: number
  className?: string
  variant?: "default" | "exhibition"
}

export function ByeongpungPanel({
  panel,
  index,
  isActive = false,
  totalPanels = 6,
  className,
  variant = "default",
}: ByeongpungPanelProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isComplete = panel.status === "complete"
  const showImage = Boolean(panel.image)
  const isExhibition = variant === "exhibition"
  const normalizedDepth = (index + 1) / Math.max(totalPanels, 1)
  const sidePanelOpacity = 0.12 + normalizedDepth * 0.06
  const sidePanelWidth = 68 + Math.round(normalizedDepth * 8)

  const sharedMediaFrameClass = isExhibition
    ? "relative block w-full max-w-full aspect-[9/16] max-h-[min(82vh,720px)] lg:max-h-[min(86vh,860px)] expo-tland-panel-media overflow-hidden panel-hanji shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
    : "relative block w-full max-w-full aspect-[9/16] max-h-[min(68vh,540px)] lg:max-h-[min(72vh,580px)] expo-tland-panel-media overflow-hidden panel-hanji shadow-[0_14px_32px_rgba(0,0,0,0.18)]"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "relative flex-shrink-0",
        "w-[75vw] md:w-[45vw] max-xl:border-r max-xl:border-stone-600/40",
        "lg:w-auto lg:flex-1",
        "expo-tland-panel",
        "overflow-hidden",
        "py-0",
        isExhibition
          ? "border-r border-white/25 bg-transparent"
          : "border-r border-stone-600/40 panel-hanji",
        className,
      )}
    >
      {showImage ? (
        <div className="relative h-full flex flex-col">
          <div
            className={cn(
              "relative flex-1 flex items-center justify-center overflow-hidden",
              isExhibition ? "p-2 lg:p-4" : "p-8 lg:p-10",
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-y-[14%] left-[4%] border-[3px] shadow-[0_12px_24px_rgba(0,0,0,0.25),inset_0_8px_14px_-12px_rgba(255,223,176,0.42)]",
                isExhibition
                  ? "border-[#c9a86a]/85 bg-gradient-to-b from-[#f5e3c3]/30 to-[#caa872]/10"
                  : "border-[#c9a86a]/85 bg-gradient-to-b from-[#f0e8de]/30 to-[#dccfbe]/10",
              )}
              style={{ width: `${sidePanelWidth}%`, opacity: sidePanelOpacity }}
              aria-hidden="true"
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-[13%] right-[4%] border-[3px] shadow-[0_12px_24px_rgba(0,0,0,0.25),inset_0_8px_14px_-12px_rgba(255,223,176,0.4)]",
                isExhibition
                  ? "border-[#c9a86a]/85 bg-gradient-to-b from-[#f5e3c3]/26 to-[#caa872]/8"
                  : "border-[#c9a86a]/85 bg-gradient-to-b from-[#efe3d7]/26 to-[#d9cab7]/8",
              )}
              style={{ width: `${sidePanelWidth}%`, opacity: sidePanelOpacity }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className={cn(
                sharedMediaFrameClass,
                "cursor-zoom-in text-left transition-all duration-300",
                "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_52%,transparent_48%,rgba(255,231,191,0.12)_68%,rgba(31,25,18,0.2)_100%)]",
                isComplete &&
                  "hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.28)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400",
                isActive && isComplete && "ring-1 ring-black/40",
                !isComplete && "opacity-95",
              )}
              aria-label={`${panel.title} 이미지 확대 보기`}
            >
              <Image
                src={panel.image!}
                alt={panel.title}
                fill
                className={cn(
                  "object-cover pointer-events-none",
                  !isComplete && "opacity-90",
                )}
                sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 16vw"
                priority={index < 2}
                draggable={false}
              />
            </button>
          </div>
          <ImageLightbox
            image={{ src: panel.image!, alt: panel.title }}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
          />
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
