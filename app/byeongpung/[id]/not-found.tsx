"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background grain-texture hanji-texture flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4"
      >
        <div className="w-24 h-24 mx-auto mb-8 opacity-20">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-muted-foreground">
            <rect x="4" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="14" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="24" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="34" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="44" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="54" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </div>
        
        <h1 
          className="text-2xl lg:text-3xl font-serif text-foreground mb-4"
          style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
        >
          병풍을 찾을 수 없습니다
        </h1>
        
        <p className="text-sm text-muted-foreground/70 mb-8">
          요청하신 병풍이 존재하지 않거나 삭제되었습니다
        </p>
        
        <Link
          href="/archive"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 hover:border-foreground/30 transition-all duration-300 hover:bg-card/50 text-sm text-foreground/80"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          아카이브로 돌아가기
        </Link>
      </motion.div>
    </main>
  )
}
