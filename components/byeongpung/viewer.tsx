"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ByeongpungPanel } from "./panel"
import type { Byeongpung } from "@/lib/data"

interface ByeongpungViewerProps {
  byeongpung: Byeongpung
}

export function ByeongpungViewer({ byeongpung }: ByeongpungViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // For desktop horizontal scroll with mouse wheel
  const { scrollXProgress } = useScroll({
    container: containerRef,
  })

  const progressWidth = useTransform(scrollXProgress, [0, 1], ["0%", "100%"])

  // Handle scroll snap for mobile
  const handleScroll = () => {
    if (!containerRef.current || !isMobile) return
    
    const container = containerRef.current
    const scrollLeft = container.scrollLeft
    const panelWidth = container.scrollWidth / 6
    const newIndex = Math.round(scrollLeft / panelWidth)
    setActiveIndex(Math.min(Math.max(newIndex, 0), 5))
  }

  // Desktop horizontal scroll with mouse wheel
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
    <div className="relative w-full">
      {/* Panel indicators for mobile */}
      <div className="lg:hidden flex justify-center gap-2 mb-4">
        {byeongpung.panels.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!containerRef.current) return
              const panelWidth = containerRef.current.scrollWidth / 6
              containerRef.current.scrollTo({
                left: panelWidth * idx,
                behavior: "smooth"
              })
            }}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${idx === activeIndex 
                ? "bg-foreground/80 w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }
            `}
            aria-label={`패널 ${idx + 1}로 이동`}
          />
        ))}
      </div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`
          flex gap-3 lg:gap-4
          overflow-x-auto hide-scrollbar
          snap-x snap-mandatory lg:snap-none
          px-4 lg:px-8
          pb-4
          scroll-smooth
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
            />
          </div>
        ))}
      </div>

      {/* Desktop scroll progress indicator */}
      <div className="hidden lg:block mt-6 px-8">
        <div className="relative h-px bg-border/50 w-full max-w-md mx-auto">
          <motion.div
            className="absolute top-0 left-0 h-full bg-foreground/40"
            style={{ width: progressWidth }}
          />
        </div>
        <p className="text-center text-xs text-muted-foreground/60 mt-3 tracking-wider">
          마우스 휠로 탐색하세요
        </p>
      </div>

      {/* Swipe hint for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="lg:hidden text-center mt-2"
      >
        <p className="text-xs text-muted-foreground/50 tracking-wider">
          좌우로 스와이프
        </p>
      </motion.div>
    </div>
  )
}
