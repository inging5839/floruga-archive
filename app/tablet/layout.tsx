import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "관람 체험 — 태블릿 | 병풍연화",
  description:
    "태블릿에서 얼굴을 촬영하고, 병풍에 반영될 페이스 스왑 강도를 조절해 보는 전시 체험 화면입니다.",
}

export default function TabletLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-[100dvh] bg-white text-neutral-900">
      {children}
    </div>
  )
}
