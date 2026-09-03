"use client"

import { motion } from "framer-motion"
import { ArchiveGallery } from "@/components/archive/archive-gallery"
import { SiteHeader } from "@/components/layout/site-header"
import { useArchiveImages } from "@/hooks/use-archive-images"

export default function PreviousExhibitionPage() {
  const { inProgress, completed, loading, error } = useArchiveImages("previous")
  const byeongpungs =
    inProgress && inProgress.totalParticipants > 0
      ? [inProgress, ...completed]
      : completed

  return (
    <main className="min-h-dvh min-h-screen">
      <SiteHeader />

      <section className="px-6 lg:px-12 pt-12 lg:pt-16 pb-10 lg:pb-14 border-b border-stone-400/60 expo-tland-section-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <p className="mb-4 text-[11px] tracking-[0.22em] text-stone-500 uppercase">
              Previous Exhibition
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-100 leading-tight expo-tland-page-title">
              이전 전시
            </h1>
            <p className="mt-4 max-w-2xl text-sm lg:text-base leading-7 text-stone-400">
              지난 전시에서 관람객들이 함께 완성한 병풍을 모았습니다.
              카드를 선택해 여섯 폭의 이미지와 이어진 이야기를 감상해보세요.
            </p>
          </div>

          <div className="border-l border-stone-400/60 pl-5 lg:min-w-56">
            <p className="text-xs tracking-[0.12em] text-stone-500 uppercase">전시 기간</p>
            <p className="mt-2 text-lg md:text-xl font-medium tracking-wide text-stone-100">
              2026. 06. 26 — 06. 28
            </p>
          </div>
        </motion.div>
      </section>

      <section className="px-6 lg:px-12 py-10 lg:py-14 expo-tland-section-md">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-black text-stone-100">지난 전시의 병풍</h2>
          {!loading && !error && (
            <p className="text-xs text-stone-500">총 {byeongpungs.length}점</p>
          )}
        </div>

        {loading && byeongpungs.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-sm text-stone-400">
            이전 전시 기록을 불러오는 중…
          </div>
        ) : error && byeongpungs.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-sm text-stone-400">
            {error}
          </div>
        ) : (
          <ArchiveGallery
            byeongpungs={byeongpungs}
            detailBasePath="/previous-exhibition"
            allowIncomplete
            emptyTitle="이전 전시 기록이 없습니다"
            emptyDescription="저장된 전시 이미지를 찾을 수 없습니다"
          />
        )}
      </section>

      <footer className="px-6 lg:px-12 py-12 lg:py-16 border-t border-stone-400/60 expo-tland-section-md">
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500">병풍연화</p>
          <p className="text-xs text-stone-500">팀 꽃충이</p>
        </div>
      </footer>
    </main>
  )
}
