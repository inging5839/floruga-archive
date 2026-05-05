"use client"

import { motion } from "framer-motion"
import { ArchiveGallery } from "@/components/archive/archive-gallery"
import { SiteHeader } from "@/components/layout/site-header"
import { archiveByeongpungs } from "@/lib/data"

export default function ArchivePage() {
  return (
    <main className="min-h-dvh min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Title */}
      {/* <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-8 lg:pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[12vw] lg:text-[10vw] font-black text-neutral-900 leading-none tracking-tighter"
        >
          병풍 갤러리
        </motion.h1>
      </section> */}

      {/* Categories */}
      {/* <section className="px-6 lg:px-12 pb-8 lg:pb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-neutral-500 tracking-widest uppercase">
            Categories
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="px-4 py-1.5 text-xs border border-neutral-900 bg-neutral-900 text-white rounded-full transition-colors">
              All
            </button>
            <button className="px-4 py-1.5 text-xs border border-neutral-300 text-neutral-700 rounded-full hover:border-neutral-900 transition-colors">
              Complete
            </button>
            <button className="px-4 py-1.5 text-xs border border-neutral-300 text-neutral-700 rounded-full hover:border-neutral-900 transition-colors">
              In Progress
            </button>
          </div>
        </div>
      </section> */}

      {/* Gallery */}
      <section className="px-6 lg:px-12 py-8 lg:py-12 expo-tland-section-md">
        <ArchiveGallery byeongpungs={archiveByeongpungs} />
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 lg:py-16 border-t border-neutral-200 expo-tland-section-md">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            병풍연화
          </p>
          <p className="text-xs text-neutral-500">
            팀 꽃충이
          </p>
        </div>
      </footer>
    </main>
  )
}
