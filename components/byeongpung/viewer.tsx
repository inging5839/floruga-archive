"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ByeongpungPanel } from "./panel"
import type { Byeongpung } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ByeongpungViewerProps {
  byeongpung: Byeongpung
  className?: string
}

export function ByeongpungViewer({ byeongpung, className }: ByeongpungViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
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
      e.preventDefault()
      container.scrollLeft += e.deltaY * 2
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [isMobile])

  return (
    <div className={cn("relative w-full", className)}>
      {/* Panel indicators for mobile */}
      <div className="lg:hidden flex justify-center gap-2 mb-4 px-4">
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
                ? "bg-neutral-900 w-6" 
                : "bg-neutral-300 w-2 hover:bg-neutral-400"
              }
            `}
            aria-label={`Panel ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`
          flex
          overflow-x-auto hide-scrollbar
          snap-x snap-mandatory lg:snap-none
          scroll-smooth
          border border-neutral-200
        `}
        style={{
          scrollSnapType: isMobile ? "x mandatory" : "none"
        }}
      >
        {byeongpung.panels.map((panel, index) => (
          <div
            key={panel.id}
            className="snap-center"
          >
            <ByeongpungPanel
              panel={panel}
              index={index}
              isActive={isMobile && index === activeIndex}
              totalPanels={byeongpung.panels.length}
            />
          </div>
        ))}
      </div>

      {/* Desktop scroll progress indicator */}
      <div className="hidden lg:block mt-6">
        <div className="relative h-px bg-neutral-200 w-full max-w-md mx-auto">
          <motion.div
            className="absolute top-0 left-0 h-full bg-neutral-900"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* Swipe hint for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="lg:hidden text-center mt-3"
      >
        <p className="text-xs text-neutral-400 tracking-wider uppercase">
          Swipe to explore
        </p>
      </motion.div>
    </div>
  )
}
