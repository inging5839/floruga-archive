"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { getRelaysForMainPage } from "@/lib/data"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const { featured, others } = getRelaysForMainPage()
  const completedPanels = featured.panels.filter((p) => p.status === "complete").length

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-900 tracking-wide"
            >
              병풍연화
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-neutral-900 font-medium">
                병풍 전시관
              </Link>
              <Link href="/archive" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                전체보기
              </Link>
            </nav>
            <Link
              href="/archive"
              className="md:hidden text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              전체보기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Title */}
      <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-8 lg:pb-12">
        <div className="flex items-center justify-between gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[12vw] lg:text-[10vw] font-black text-neutral-900 leading-none tracking-tighter"
          >
            병풍연화 전시관
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative w-16 h-16 md:w-24 md:h-24 lg:w-60 lg:h-60 flex-shrink-0"
          >
            <Image
              src="/qr_v2.png"
              alt="QR Code"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 px-5"
        >
          <div>
            {/* <p className="text-xs text-neutral-500 tracking-widest uppercase mb-2">
              심청이 이야기
            </p> */}
            <h2 className="text-xl lg:text-2xl text-neutral-800 font-serif">
              심청전
            </h2>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <span>
              완성된 병풍 <span className="text-neutral-900 font-medium">{completedPanels}</span>개
            </span>
            <span>
              총 참여인원 <span className="text-neutral-900 font-medium">{featured.totalParticipants}</span>명
            </span>
          </div>
        </motion.div>
      </section>

      {/* Featured Byeongpung */}
      <section className="py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <ByeongpungViewer byeongpung={featured} />
        </motion.div>
      </section>

      {/* Past Relays */}
      {others.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="px-6 lg:px-12 py-12 lg:py-20">
            <h2 className="text-xs text-neutral-500 tracking-widest uppercase mb-10 lg:mb-14">
              Previous Works
            </h2>

            <div className="space-y-16 lg:space-y-24">
              {others.slice(0, 2).map((bp, sectionIdx) => (
                <motion.article
                  key={bp.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: Math.min(sectionIdx * 0.05, 0.3) }}
                >
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-400 font-mono mb-1">
                        #{String(bp.id).padStart(2, '0')}
                      </p>
                      <p className="text-xs text-neutral-500 tracking-widest uppercase">
                        {bp.theme}
                      </p>
                    </div>
                    <Link
                      href={`/byeongpung/${bp.id}`}
                      className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <ByeongpungViewer byeongpung={bp} />
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 lg:py-16 border-t border-neutral-200">
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/archive"
            className="group flex items-center gap-3 px-8 py-4 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-full transition-all duration-300"
          >
            <span className="text-sm tracking-wider uppercase">
              View All Archive
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center justify-between w-full pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">
              Floruga Archive
            </p>
            <p className="text-xs text-neutral-400">
              Team Floruga
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
