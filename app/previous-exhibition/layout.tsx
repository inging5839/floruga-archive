import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "이전 전시 | 병풍연화",
  description: "2026년 6월 26일부터 28일까지 함께 완성한 병풍연화 전시 기록",
}

export default function PreviousExhibitionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
