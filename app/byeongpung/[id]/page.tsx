"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { archiveByeongpungs } from "@/lib/data"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ByeongpungDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const byeongpungId = parseInt(id, 10)
  const byeongpung = archiveByeongpungs.find(b => b.id === byeongpungId)

  if (!byeongpung) {
    notFound()
  }

  const currentIndex = archiveByeongpungs.findIndex(b => b.id === byeongpungId)
  const prevByeongpung = currentIndex > 0 ? archiveByeongpungs[currentIndex - 1] : null
  const nextByeongpung = currentIndex < archiveByeongpungs.length - 1 ? archiveByeongpungs[currentIndex + 1] : null

  const completedPanels = byeongpung.panels.filter(p => p.status === "complete").length

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/archive"
              className="group flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Archive</span>
            </Link>
            <span className="text-xs text-neutral-400 font-mono">
              #{String(byeongpung.id).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Title Section */}
      <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-8 lg:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs text-neutral-500 tracking-widest uppercase mb-4">
            {byeongpung.theme}
          </p>
          <h1 className="text-4xl lg:text-6xl font-black text-neutral-900 leading-none tracking-tight mb-6">
            {byeongpung.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500">
            {byeongpung.completedAt && (
              <span>
                <span className="text-neutral-400">Completed</span> {byeongpung.completedAt}
              </span>
            )}
            <span>
              <span className="text-neutral-900 font-medium">{completedPanels}</span> Panels
            </span>
            <span>
              <span className="text-neutral-900 font-medium">{byeongpung.totalParticipants}</span> Participants
            </span>
          </div>
        </motion.div>
      </section>

      {/* Byeongpung Viewer */}
      <section className="py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <ByeongpungViewer byeongpung={byeongpung} />
        </motion.div>
      </section>

      {/* Navigation */}
      <section className="px-6 lg:px-12 py-12 lg:py-16 border-t border-neutral-200">
        <div className="flex items-stretch justify-between gap-4">
          {prevByeongpung ? (
            <Link
              href={`/byeongpung/${prevByeongpung.id}`}
              className="group flex-1 flex items-center gap-4 p-6 border border-neutral-200 hover:border-neutral-900 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:-translate-x-1 transition-all" />
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Previous</p>
                <p className="text-sm font-medium text-neutral-900">
                  {prevByeongpung.theme}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextByeongpung ? (
            <Link
              href={`/byeongpung/${nextByeongpung.id}`}
              className="group flex-1 flex items-center justify-end gap-4 p-6 border border-neutral-200 hover:border-neutral-900 rounded-lg transition-colors text-right"
            >
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Next</p>
                <p className="text-sm font-medium text-neutral-900">
                  {nextByeongpung.theme}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 lg:py-16 border-t border-neutral-200">
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/archive"
            className="group flex items-center gap-3 px-8 py-4 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-full transition-all duration-300"
          >
            <span className="text-sm tracking-wider uppercase">
              Back to Archive
            </span>
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
