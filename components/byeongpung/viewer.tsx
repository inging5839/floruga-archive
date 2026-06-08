"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ByeongpungPanel } from "./panel"
import type { Byeongpung } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ByeongpungViewerProps {
  byeongpung: Byeongpung
  className?: string
  title?: string
  variant?: "default" | "exhibition"
}

export function ByeongpungViewer({ byeongpung, className, title, variant = "default" }: ByeongpungViewerProps) {
  const isExhibition = variant === "exhibition"
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { scrollXProgress } = useScroll({
    container: containerRef,
  })

  const progressWidth = useTransform(scrollXProgress, [0, 1], ["0%", "100%"])

  const handleScroll = () => {
    if (!containerRef.current || !isMobile) return
    
    const container = containerRef.current
    const scrollLeft = container.scrollLeft
    const panelWidth = container.scrollWidth / byeongpung.panels.length
    const newIndex = Math.round(scrollLeft / panelWidth)
    setActiveIndex(Math.min(Math.max(newIndex, 0), byeongpung.panels.length - 1))
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container || isMobile) return

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (delta === 0) return

      const maxScrollLeft = container.scrollWidth - container.clientWidth
      if (maxScrollLeft <= 0) return

      const nextScrollLeft = container.scrollLeft + delta * 2
      const isTryingToScrollBeyondStart = delta < 0 && container.scrollLeft <= 0
      const isTryingToScrollBeyondEnd = delta > 0 && container.scrollLeft >= maxScrollLeft

      // Let the page keep scrolling vertically when horizontal scroll hits either edge.
      if (isTryingToScrollBeyondStart || isTryingToScrollBeyondEnd) return

      e.preventDefault()
      container.scrollLeft = Math.max(0, Math.min(nextScrollLeft, maxScrollLeft))
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [isMobile])

  return (
    <div className={cn("relative w-full", className)}>
      {title && (
        <div className="border border-b-0 border-stone-400/60 px-6 lg:px-12 py-4">
          <h2 className="text-xs text-stone-400 tracking-widest uppercase">
            {title}
          </h2>
        </div>
      )}

      {/* Panel indicators for mobile */}
      <div className="xl:hidden flex justify-center gap-2 mb-4 px-4">
        {byeongpung.panels.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!containerRef.current) return
              const panelWidth = containerRef.current.scrollWidth / byeongpung.panels.length
              containerRef.current.scrollTo({
                left: panelWidth * idx,
                behavior: "smooth"
              })
            }}
            className={`
              h-1 rounded-full transition-all duration-300
              ${idx === activeIndex 
                ? "bg-stone-100 w-6" 
                : "bg-stone-600 w-2 hover:bg-stone-400"
              }
            `}
            aria-label={`${idx + 1}번째 패널`}
          />
        ))}
      </div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={cn(
          "flex gap-0 overflow-x-auto hide-scrollbar snap-x snap-mandatory xl:snap-none scroll-smooth border",
          isExhibition ? "border-white/30 bg-transparent" : "border-stone-400/60 panel-hanji",
          title && "border-t-0",
        )}
        style={{
          scrollSnapType: isMobile ? "x mandatory" : "none"
        }}
      >
        {byeongpung.panels.map((panel, index) => (
          <ByeongpungPanel
            key={panel.id}
            panel={panel}
            index={index}
            isActive={isMobile && index === activeIndex}
            totalPanels={byeongpung.panels.length}
            variant={variant}
            className={cn(
              "snap-center shrink-0 min-w-0",
              isExhibition
                ? "xl:border-r xl:border-white/25 xl:last:border-r-0"
                : "xl:border-r xl:border-stone-600/60 xl:last:border-r-0",
            )}
          />
        ))}
      </div>

      {/* Desktop scroll progress indicator */}
      <div className="hidden xl:block mt-6">
        <div className={cn(
          "relative h-px w-full max-w-md mx-auto",
          isExhibition ? "bg-stone-700" : "bg-stone-700",
        )}>
          <motion.div
            className={cn(
              "absolute top-0 left-0 h-full",
              isExhibition ? "bg-white" : "bg-stone-200",
            )}
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* Swipe hint for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="xl:hidden text-center mt-3"
      >
        <p className="text-xs text-stone-500 tracking-wider uppercase">
          좌우로 밀어 감상해보세요
        </p>
      </motion.div>
    </div>
  )
}
