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
  const isComplete = panel.status === "complete"
  const showImage = Boolean(panel.image)
  const isExhibition = variant === "exhibition"
  const normalizedDepth = (index + 1) / Math.max(totalPanels, 1)
  const sidePanelOpacity = 0.12 + normalizedDepth * 0.06
  const sidePanelWidth = 68 + Math.round(normalizedDepth * 8)

  const sharedMediaFrameClass = isExhibition
    ? "relative block w-full max-w-full aspect-[9/16] max-h-[min(82vh,720px)] lg:max-h-[min(86vh,860px)] expo-tland-panel-media overflow-hidden border-[6px] border-white bg-stone-50 shadow-[0_22px_46px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(255,228,170,0.55),inset_0_22px_24px_-18px_rgba(255,236,184,0.7),inset_0_-18px_22px_-20px_rgba(120,82,32,0.55),inset_20px_0_22px_-20px_rgba(255,224,158,0.55),inset_-20px_0_22px_-20px_rgba(255,224,158,0.55)]"
    : "relative block w-full max-w-full aspect-[9/16] max-h-[min(68vh,540px)] lg:max-h-[min(72vh,580px)] expo-tland-panel-media overflow-hidden border-[6px] border-white bg-stone-100 shadow-[0_18px_40px_rgba(0,0,0,0.38),inset_0_0_0_1px_rgba(255,241,214,0.26),inset_0_20px_22px_-18px_rgba(255,229,186,0.62),inset_0_-16px_20px_-20px_rgba(80,62,38,0.38),inset_18px_0_20px_-20px_rgba(255,224,178,0.42),inset_-18px_0_20px_-20px_rgba(255,224,178,0.38)]"

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
        isExhibition
          ? "border-r border-white/25 bg-transparent"
          : "border-r border-white/50 bg-[linear-gradient(to_bottom,#fefdfb_0%,#f5efe4_50%,#fffefc_100%)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_52%,rgba(211,186,150,0.28)_0%,rgba(211,186,150,0.16)_28%,rgba(211,186,150,0.06)_46%,transparent_72%)]",
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
            {isComplete ? (
              <a
                href={panel.image!}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  sharedMediaFrameClass,
                  "cursor-pointer transition-all duration-300",
                  isExhibition
                    ? "before:pointer-events-none before:absolute before:inset-[4.5%] before:border-[5px] before:border-white/60"
                    : "before:pointer-events-none before:absolute before:inset-[4.5%] before:border-[5px] before:border-white/70",
                  "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_52%,transparent_48%,rgba(255,231,191,0.22)_68%,rgba(31,25,18,0.34)_100%)]",
                  "hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.4)]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200",
                  isActive && "ring-1 ring-black/60",
                )}
                aria-label={`${panel.title} 이미지 원본 보기`}
              >
                <Image
                  src={panel.image!}
                  alt={panel.title}
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 16vw"
                  priority={index < 2}
                  draggable={false}
                />
              </a>
            ) : (
              <div
                className={cn(
                  sharedMediaFrameClass,
                  isExhibition
                    ? "before:pointer-events-none before:absolute before:inset-[4.5%] before:!border-[5px] before:border-white/60"
                    : "before:pointer-events-none before:absolute before:inset-[4.5%] before:!border-[5px] before:border-white/70",
                  "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_52%,transparent_50%,rgba(255,231,191,0.16)_70%,rgba(31,25,18,0.26)_100%)]",
                )}
                aria-label="제작 중"
              >
                <Image
                  src={panel.image!}
                  alt="제작 중"
                  fill
                  className="object-cover opacity-90"
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
