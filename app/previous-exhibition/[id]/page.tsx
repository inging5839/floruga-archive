"use client"

import { ByeongpungDetail } from "@/components/byeongpung/detail-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PreviousExhibitionDetailPage({ params }: PageProps) {
  return (
    <ByeongpungDetail
      params={params}
      collection="previous"
      detailBasePath="/previous-exhibition"
      backHref="/previous-exhibition"
      backLabel="이전 전시로 돌아가기"
    />
  )
}
