// 병풍 패널 데이터 타입
export interface Panel {
  id: number
  title: string
  story: string | null
  image: string | null
  status: 'complete' | 'in-progress' | 'waiting'
  author?: string
  createdAt?: string
  /** 이 패널을 채운 D1 archive_images 행 id (관리자 편집용). 빈 폭이면 null */
  rowId?: number | null
  /** sceneId (관리자 편집/표시용) */
  sceneId?: string | null
  /** I-1·wait·E*-1 처럼 여러 병풍이 공유하는 고정 폭 여부 (관리자 경고용) */
  isShared?: boolean
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
