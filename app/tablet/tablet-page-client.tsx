"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { TABLET_CONTENT_CLASS } from "./tablet-classes"

function TabletPageLoading() {
  return (
    <main className="min-h-[100dvh]">
      <header className="border-b border-neutral-200 shrink-0">
        <div className="px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-900 tracking-wide"
          >
            병풍연화
          </Link>
          <p className="text-[10px] sm:text-xs text-neutral-500 tracking-[0.2em] uppercase text-right leading-snug">
            관람객 사진 촬영
          </p>
        </div>
      </header>
      <div className={TABLET_CONTENT_CLASS}>
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-500">
          화면 준비 중…
        </div>
      </div>
    </main>
  )
}

const TabletExperience = dynamic(
  () =>
    import("./tablet-experience").then((mod) => mod.TabletExperience),
  {
    ssr: false,
    loading: () => <TabletPageLoading />,
  },
)

export function TabletPageClient() {
  return <TabletExperience />
}
