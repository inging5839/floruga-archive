"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function getLinkClass(pathname: string, href: string) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
  return isActive
    ? "text-sm text-stone-100 font-medium"
    : "text-sm text-stone-400 hover:text-stone-100 transition-colors"
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-stone-400/60">
      <div className="px-6 lg:px-12 py-4 expo-tland-header-inner">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-sm font-medium text-stone-100 tracking-wide">
            병풍연화
          </Link>

          <nav className="hidden md:flex items-center gap-8 expo-tland-tight-nav text-stone-400">
            <Link href="/recent" className={getLinkClass(pathname, "/recent")}>
              최근 제작된 병풍
            </Link>
            <span> | </span>
            <Link href="/archive" className={getLinkClass(pathname, "/archive")}>
              모든 병풍 한 눈에 보기
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-3 flex-wrap justify-end">
            <Link href="/recent" className={getLinkClass(pathname, "/recent")}>
              최근 병풍
            </Link>
            <Link href="/archive" className={getLinkClass(pathname, "/archive")}>
              전체보기
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
