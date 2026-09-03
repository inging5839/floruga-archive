"use client"

import { ByeongpungDetail } from "@/components/byeongpung/detail-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ByeongpungDetailPage({ params }: PageProps) {
  return <ByeongpungDetail params={params} />
}
