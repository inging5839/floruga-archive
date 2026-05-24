"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

function getLinkClass(pathname: string, href: string) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
  return isActive
    ? "text-sm text-neutral-900 font-medium"
    : "text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-neutral-200">
      <div className="px-6 lg:px-12 py-4 expo-tland-header-inner">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-sm font-medium text-neutral-900 tracking-wide">
            병풍연화
          </Link>

          <nav className="hidden md:flex items-center gap-8 expo-tland-tight-nav">
            <Link href="/" className={getLinkClass(pathname, "/")}>
              병풍 전시관
            </Link>
            <Link href="/archive" className={getLinkClass(pathname, "/archive")}>
              모든 병풍 한 눈에 보기
            </Link>
            <Link href="/experience" className={getLinkClass(pathname, "/experience")}>
              체험 안내
            </Link>
            <Link href="/about" className={getLinkClass(pathname, "/about")}>
              프로젝트 소개
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-3 flex-wrap justify-end">
            <Link href="/archive" className={getLinkClass(pathname, "/archive")}>
              전체보기
            </Link>
            <Link href="/about" className={getLinkClass(pathname, "/about")}>
              프로젝트 소개
            </Link>
            <Link href="/experience" className={getLinkClass(pathname, "/experience")}>
              작품 체험
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
