"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ByeongpungViewer } from "@/components/byeongpung/viewer"
import { SiteHeader } from "@/components/layout/site-header"
import { useArchiveImages } from "@/hooks/use-archive-images"
import { formatKoreaDateTime } from "@/lib/datetime"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ByeongpungDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const byeongpungId = parseInt(id, 10)
  const { completed, loading } = useArchiveImages()

  if (loading && completed.length === 0) {
    return (
      <main className="min-h-dvh min-h-screen">
        <SiteHeader />
        <div className="flex items-center justify-center py-32 text-sm text-stone-400">
          병풍 데이터를 불러오는 중…
        </div>
      </main>
    )
  }

  const byeongpung = completed.find((b) => b.id === byeongpungId)
  if (!byeongpung) {
    notFound()
  }

  const currentIndex = completed.findIndex((b) => b.id === byeongpungId)
  const prevByeongpung = currentIndex > 0 ? completed[currentIndex - 1] : null
  const nextByeongpung =
    currentIndex < completed.length - 1 ? completed[currentIndex + 1] : null

  const completedAtLabel = formatKoreaDateTime(byeongpung.completedAt)

  return (
    <main className="min-h-dvh min-h-screen">
      <SiteHeader />

      {/* Title Section */}
      <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-8 lg:pb-12 expo-tland-section-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs text-stone-500 tracking-widest uppercase mb-4">
            {byeongpung.theme}
          </p>
          <h1 className="text-4xl lg:text-6xl font-black text-stone-100 leading-none tracking-tight mb-6 expo-tland-page-title">
            {byeongpung.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            {completedAtLabel && (
              <span>
                <span className="text-stone-500">완성된 시간<br></br></span> {completedAtLabel}
              </span>
            )}
          </div>
        </motion.div>
      </section>

      {/* Byeongpung Viewer */}
      <section className="py-8 lg:py-12 expo-tland-section">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <ByeongpungViewer byeongpung={byeongpung} />
        </motion.div>
      </section>

      {/* Navigation */}
      <section className="px-6 lg:px-12 py-12 lg:py-16 border-t border-stone-400/60 expo-tland-section-md">
        <div className="flex items-stretch justify-between gap-4">
          {prevByeongpung ? (
            <Link
              href={`/byeongpung/${prevByeongpung.id}`}
              className="group flex-1 flex items-center gap-4 p-6 border border-stone-700 hover:border-stone-400 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-500 group-hover:text-stone-100 group-hover:-translate-x-1 transition-all" />
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">이전</p>
                <p className="text-sm font-medium text-stone-100">
                  {prevByeongpung.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextByeongpung ? (
            <Link
              href={`/byeongpung/${nextByeongpung.id}`}
              className="group flex-1 flex items-center justify-end gap-4 p-6 border border-stone-700 hover:border-stone-400 rounded-lg transition-colors text-right"
            >
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">다음</p>
                <p className="text-sm font-medium text-stone-100">
                  {nextByeongpung.title}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-stone-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 lg:py-16 border-t border-stone-400/60 expo-tland-section-md">
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/archive"
            className="group flex items-center gap-3 px-8 py-4 border border-stone-300 text-stone-100 hover:bg-stone-100 hover:text-stone-900 rounded-full transition-all duration-300"
          >
            <span className="text-sm tracking-wider uppercase">
              전체보기로 돌아가기
            </span>
          </Link>

          <div className="flex items-center justify-between w-full pt-8 border-t border-stone-400/50">
            <p className="text-xs text-stone-500">
              병풍연화
            </p>
            <p className="text-xs text-stone-500">
              팀 꽃충이
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
