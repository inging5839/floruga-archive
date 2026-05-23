import type { Byeongpung, Panel } from "./data"

/** 한 병풍을 채우는 관람객 업로드 이미지 수 (2~5폭) */
export const IMAGES_PER_BYEONGPUNG = 4

/** 첫·마지막 폭에 들어갈 사전 준비 이미지 (Vercel env로 덮어쓰기 가능) */
export const FIRST_PANEL_IMAGE =
  process.env.NEXT_PUBLIC_BYEONGPUNG_FIRST_IMAGE ??
  "/images/sample_result-1.png"
export const LAST_PANEL_IMAGE =
  process.env.NEXT_PUBLIC_BYEONGPUNG_LAST_IMAGE ??
  "/images/sample_result-6.png"

export const ARCHIVE_POLL_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_ARCHIVE_POLL_INTERVAL_MS ?? "6000",
)

export interface ArchiveImage {
  id: number
  imageUrl: string
  filename?: string | null
  sceneId?: string | null
  actionName?: string | null
  createdAt: string
}

/**
 * D1 archive_images 행들을 도착 순서대로 4개씩 묶어 병풍으로 변환한다.
 * 첫 폭(`제1폭`)과 마지막 폭(`제6폭`)은 사전 준비 이미지로 채운다.
 */
export function groupArchiveImages(rows: ArchiveImage[]): {
  inProgress: Byeongpung | null
  completed: Byeongpung[]
} {
  const ordered = [...rows].sort((a, b) => {
    const t = a.createdAt.localeCompare(b.createdAt)
    return t !== 0 ? t : a.id - b.id
  })

  const groups: ArchiveImage[][] = []
  for (let i = 0; i < ordered.length; i += IMAGES_PER_BYEONGPUNG) {
    groups.push(ordered.slice(i, i + IMAGES_PER_BYEONGPUNG))
  }

  const completed: Byeongpung[] = []
  let inProgress: Byeongpung | null = null

  groups.forEach((group, idx) => {
    const byeongpung = buildByeongpung(group, idx + 1)
    if (group.length >= IMAGES_PER_BYEONGPUNG) {
      completed.push(byeongpung)
    } else {
      inProgress = byeongpung
    }
  })

  // 모든 그룹이 완성됐다면 새 빈 병풍을 다음 슬롯으로 보여준다
  if (!inProgress) {
    inProgress = buildByeongpung([], groups.length + 1)
  }

  return { inProgress, completed: completed.reverse() }
}

function buildByeongpung(group: ArchiveImage[], sequence: number): Byeongpung {
  const middle: Panel[] = Array.from({ length: IMAGES_PER_BYEONGPUNG }).map(
    (_, i) => {
      const row = group[i]
      return {
        id: i + 2,
        title: `제${i + 2}폭`,
        story: null,
        image: row?.imageUrl ?? null,
        status: row ? "complete" : "waiting",
        author: row?.sceneId ? `Scene ${row.sceneId}` : undefined,
        createdAt: row?.createdAt,
      }
    },
  )

  const panels: Panel[] = [
    {
      id: 1,
      title: "제1폭",
      story: null,
      image: FIRST_PANEL_IMAGE,
      status: "complete",
    },
    ...middle,
    {
      id: 6,
      title: "제6폭",
      story: null,
      image: LAST_PANEL_IMAGE,
      status: "complete",
    },
  ]

  const isComplete = group.length >= IMAGES_PER_BYEONGPUNG
  const latest = group[group.length - 1]
  const thumbnailImage =
    [...group].reverse().find((row) => row.imageUrl)?.imageUrl ?? null

  return {
    id: sequence,
    title: `${sequence}번째 병풍`,
    theme: `${IMAGES_PER_BYEONGPUNG}명의 관람객이 함께 만든 병풍`,
    totalParticipants: group.length,
    completedAt: isComplete ? latest?.createdAt : undefined,
    thumbnailImage,
    panels,
  }
}
