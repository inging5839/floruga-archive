"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4"
      >
        <div className="w-24 h-24 mx-auto mb-8 opacity-20">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-stone-500">
            <rect x="4" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="14" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="24" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="34" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="44" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="54" y="12" width="8" height="40" rx="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </div>
        
        <h1
          className="text-2xl lg:text-3xl font-serif text-stone-100 mb-4"
          style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
        >
          병풍을 찾을 수 없습니다
        </h1>

        <p className="text-sm text-stone-400 mb-8">
          요청하신 병풍이 존재하지 않거나 삭제되었습니다
        </p>

        <Link
          href="/archive"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-600 hover:border-stone-300 transition-all duration-300 hover:bg-stone-800 text-sm text-stone-200"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          아카이브로 돌아가기
        </Link>
      </motion.div>
    </main>
  )
}
