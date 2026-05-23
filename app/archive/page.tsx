"use client"

import { ArchiveGallery } from "@/components/archive/archive-gallery"
import { SiteHeader } from "@/components/layout/site-header"
import { useArchiveImages } from "@/hooks/use-archive-images"

export default function ArchivePage() {
  const { completed, loading, error } = useArchiveImages()

  return (
    <main className="min-h-dvh min-h-screen bg-white">
      <SiteHeader />

      {/* Gallery */}
      <section className="px-6 lg:px-12 py-8 lg:py-12 expo-tland-section-md">
        {loading && completed.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-sm text-neutral-500">
            병풍 데이터를 불러오는 중…
          </div>
        ) : error && completed.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-sm text-neutral-500">
            {error}
          </div>
        ) : (
          <ArchiveGallery byeongpungs={completed} />
        )}
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
