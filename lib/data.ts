// 병풍 패널 데이터 타입
export interface Panel {
  id: number
  title: string
  story: string | null
  image: string | null
  status: 'complete' | 'in-progress' | 'waiting'
  author?: string
  createdAt?: string
}

export interface Byeongpung {
  id: number
  title: string
  theme: string
  panels: Panel[]
  completedAt?: string
  totalParticipants: number
  thumbnailImage?: string | null
}
