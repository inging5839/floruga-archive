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
  thumbnailImage?: string
}

// 새로 업로드된 이미지 URL들 (심청전 시리즈)
export const panelImages = {
  panel1: "/images/sample_result-1.png",
  panel2: "/images/sample_result-2.png",
  panel3: "/images/sample_result-3.png",
  panel4: "/images/sample_result-4.png",
  panel5: "/images/sample_result-5.png",
  panel6: "/images/sample_result-6.png",
}

// 현재 진행 중인 병풍 데이터 (첫 번째 릴레이 병풍 - 심청전 테마) - 6폭 모두 완성
export const currentByeongpung: Byeongpung = {
  id: 1,
  title: "방금 제작된 따끈따끈한 병풍",
  theme: "심청전 - 효녀 심청의 이야기",
  totalParticipants: 5,
  panels: [
    {
      id: 1,
      title: "제1폭",
      story: "가난한 심 봉사와 어린 심청. 어머니를 일찍 여의고 눈 먼 아버지를 정성껏 모시는 효녀 심청의 고단한 삶이 시작됩니다.",
      image: panelImages.panel1,
      status: 'complete',
      author: "전시 기획자",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "제2폭",
      story: "아버지의 눈을 뜨게 하기 위해 공양미 삼백 석에 몸을 팔기로 한 심청. 인당수로 향하는 배 위에서 거친 파도가 그녀를 기다립니다.",
      image: panelImages.panel2,
      status: 'complete',
      author: "관람객 A",
      createdAt: "2024-01-16"
    },
    {
      id: 3,
      title: "제3폭",
      story: "인당수에 몸을 던진 심청. 용궁에 이른 그녀는 용왕님 앞에 나아가 자신의 효심을 이야기합니다.",
      image: panelImages.panel3,
      status: 'complete',
      author: "관람객 B",
      createdAt: "2024-01-17"
    },
    {
      id: 4,
      title: "제4폭",
      story: "심청의 지극한 효성에 감동한 용왕은 그녀를 연꽃 속에 넣어 인간 세상으로 돌려보내기로 합니다.",
      image: panelImages.panel4,
      status: 'complete',
      author: "관람객 C",
      createdAt: "2024-01-18"
    },
    {
      id: 5,
      title: "제5폭",
      story: "연꽃 속에서 다시 태어난 심청은 임금님의 왕비가 됩니다. 아버지를 찾기 위해 맹인 잔치를 열게 됩니다.",
      image: panelImages.panel5,
      status: 'complete',
      author: "관람객 D",
      createdAt: "2024-01-19"
    },
    {
      id: 6,
      title: "제6폭",
      story: "마침내 부녀가 상봉하고, 심 봉사는 딸을 본 기쁨에 눈을 뜨게 됩니다. 효녀 심청의 이야기는 해피엔딩으로 막을 내립니다.",
      image: panelImages.panel6,
      status: 'complete',
      author: "AI 자동 생성",
      createdAt: "2024-01-20"
    }
  ]
}

// 아카이브 병풍들 - 첫 번째만 완성, 나머지는 진행 중 또는 대기 상태
export const archiveByeongpungs: Byeongpung[] = [
  // 첫 번째 릴레이 병풍 - 완성됨
  {
    id: 1,
    title: "첫 번째 이야기",
    theme: "심청전 - 효녀의 여정",
    totalParticipants: 4,
    completedAt: "2024-01-20",
    thumbnailImage: panelImages.panel5,
    panels: [
      { id: 1, title: "제1폭", story: "가난한 심 봉사와 어린 심청의 시작", image: panelImages.panel1, status: 'complete' as const },
      { id: 2, title: "제2폭", story: "인당수로 향하는 심청", image: panelImages.panel2, status: 'complete' as const },
      { id: 3, title: "제3폭", story: "용궁에서의 만남", image: panelImages.panel3, status: 'complete' as const },
      { id: 4, title: "제4폭", story: "용왕의 축복", image: panelImages.panel4, status: 'complete' as const },
      { id: 5, title: "제5폭", story: "왕비가 된 심청", image: panelImages.panel5, status: 'complete' as const },
      { id: 6, title: "제6폭", story: "부녀의 감동 재회", image: panelImages.panel6, status: 'complete' as const },
    ]
  },
  // 두 번째 릴레이 병풍 - 진행 중 (3폭까지 완성)
  {
    id: 2,
    title: "두 번째 이야기",
    theme: "심청전 - 용왕과 사랑에 빠진 심청",
    totalParticipants: 3,
    thumbnailImage: panelImages.panel5,
    panels: [
      { id: 1, title: "제1폭", story: "가난한 심 봉사와 어린 심청의 시작", image: panelImages.panel1, status: 'complete' as const },
      { id: 2, title: "제2폭", story: "인당수로 향하는 심청", image: panelImages.panel2, status: 'complete' as const },
      { id: 3, title: "제3폭", story: "용궁에서의 만남", image: panelImages.panel3, status: 'complete' as const },
      { id: 4, title: "제4폭", story: "용왕의 축복", image: panelImages.panel4, status: 'complete' as const },
      { id: 5, title: "제5폭", story: "왕비가 된 심청", image: panelImages.panel5, status: 'complete' as const },
      { id: 6, title: "제6폭", story: "부녀의 감동 재회", image: panelImages.panel6, status: 'complete' as const },
    ]
  },
  // 세 번째 릴레이 병풍 - 대기 중
  {
    id: 3,
    title: "세 번째 이야기",
    theme: "심청전 - 꽃충이가 된 심청",
    totalParticipants: 0,
    thumbnailImage: null,
    panels: [
      { id: 1, title: "제1폭", story: "가난한 심 봉사와 어린 심청의 시작", image: panelImages.panel1, status: 'complete' as const },
      { id: 2, title: "제2폭", story: "인당수로 향하는 심청", image: panelImages.panel2, status: 'complete' as const },
      { id: 3, title: "제3폭", story: "용궁에서의 만남", image: panelImages.panel3, status: 'complete' as const },
      { id: 4, title: "제4폭", story: "용왕의 축복", image: panelImages.panel4, status: 'complete' as const },
      { id: 5, title: "제5폭", story: "왕비가 된 심청", image: panelImages.panel5, status: 'complete' as const },
      { id: 6, title: "제6폭", story: "부녀의 감동 재회", image: panelImages.panel6, status: 'complete' as const },
    ]
  },
  // 네 번째 릴레이 병풍 - 대기 중
  {
    id: 4,
    title: "네 번째 이야기",
    theme: "심청전 - 배고픈 심청",
    totalParticipants: 0,
    thumbnailImage: null,
    panels: [
      { id: 1, title: "제1폭", story: "가난한 심 봉사와 어린 심청의 시작", image: panelImages.panel1, status: 'complete' as const },
      { id: 2, title: "제2폭", story: "인당수로 향하는 심청", image: panelImages.panel2, status: 'complete' as const },
      { id: 3, title: "제3폭", story: "용궁에서의 만남", image: panelImages.panel3, status: 'complete' as const },
      { id: 4, title: "제4폭", story: "용왕의 축복", image: panelImages.panel4, status: 'complete' as const },
      { id: 5, title: "제5폭", story: "왕비가 된 심청", image: panelImages.panel5, status: 'complete' as const },
      { id: 6, title: "제6폭", story: "부녀의 감동 재회", image: panelImages.panel6, status: 'complete' as const },
    ]
  },
  // 다섯 번째 릴레이 병풍 - 대기 중
  {
    id: 5,
    title: "다섯 번째 이야기",
    theme: "심청전 - 장미꽃을 찾은 심청",
    totalParticipants: 0,
    thumbnailImage: null,
    panels: [
      { id: 1, title: "제1폭", story: "가난한 심 봉사와 어린 심청의 시작", image: panelImages.panel1, status: 'complete' as const },
      { id: 2, title: "제2폭", story: "인당수로 향하는 심청", image: panelImages.panel2, status: 'complete' as const },
      { id: 3, title: "제3폭", story: "용궁에서의 만남", image: panelImages.panel3, status: 'complete' as const },
      { id: 4, title: "제4폭", story: "용왕의 축복", image: panelImages.panel4, status: 'complete' as const },
      { id: 5, title: "제5폭", story: "왕비가 된 심청", image: panelImages.panel5, status: 'complete' as const },
      { id: 6, title: "제6폭", story: "부녀의 감동 재회", image: panelImages.panel6, status: 'complete' as const },
    ]
  },
  // 여섯 번째 릴레이 병풍 - 대기 중
  {
    id: 6,
    title: "여섯 번째 이야기",
    theme: "심청전 - 용왕이된 심청",
    totalParticipants: 0,
    thumbnailImage: null,
    panels: [
      { id: 1, title: "제1폭", story: "가난한 심 봉사와 어린 심청의 시작", image: panelImages.panel1, status: 'complete' as const },
      { id: 2, title: "제2폭", story: "인당수로 향하는 심청", image: panelImages.panel2, status: 'complete' as const },
      { id: 3, title: "제3폭", story: "용궁에서의 만남", image: panelImages.panel3, status: 'complete' as const },
      { id: 4, title: "제4폭", story: "용왕의 축복", image: panelImages.panel4, status: 'complete' as const },
      { id: 5, title: "제5폭", story: "왕비가 된 심청", image: panelImages.panel5, status: 'complete' as const },
      { id: 6, title: "제6폭", story: "부녀의 감동 재회", image: panelImages.panel6, status: 'complete' as const },
    ]
  }
]

/** 아카이브 id 1번을 상세 데이터(currentByeongpung)와 합친 목록 */
export function mergeArchiveWithCurrent(): Byeongpung[] {
  return archiveByeongpungs.map((bp) =>
    bp.id === 1
      ? {
          ...bp,
          title: currentByeongpung.title,
          theme: currentByeongpung.theme,
          totalParticipants: currentByeongpung.totalParticipants,
          panels: currentByeongpung.panels,
          thumbnailImage:
            currentByeongpung.panels.find((p) => p.image)?.image ?? bp.thumbnailImage,
        }
      : bp
  )
}

function relayActivityScore(bp: Byeongpung): number {
  const complete = bp.panels.filter((p) => p.status === "complete").length
  const inProgress = bp.panels.some((p) => p.status === "in-progress")
  return (inProgress ? 1000 : 0) + complete * 10 + bp.id / 1000
}

/**
 * 메인 페이지: 활동량이 가장 높은 릴레이를 featured로,
 * 나머지는 id 내림차순(최근 번호가 위쪽)으로 정렬
 */
export function getRelaysForMainPage(): { featured: Byeongpung; others: Byeongpung[] } {
  const merged = mergeArchiveWithCurrent()
  const sorted = [...merged].sort((a, b) => b.id - a.id)
  const featured = sorted[0]
  const others = sorted.slice(1)
  return { featured, others }
}
