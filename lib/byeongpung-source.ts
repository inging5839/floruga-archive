import type { Byeongpung, Panel } from "./data"

/** 한 병풍을 채우는 관람객 업로드 이미지 수 (2~5폭) */
export const IMAGES_PER_BYEONGPUNG = 4

/** 첫·마지막 폭 fallback (D1 조회 실패 시) */
export const FIRST_PANEL_IMAGE =
  process.env.NEXT_PUBLIC_BYEONGPUNG_FIRST_IMAGE ??
  "/images/sample_result-1.png"
export const LAST_PANEL_IMAGE =
  process.env.NEXT_PUBLIC_BYEONGPUNG_LAST_IMAGE ??
  "/images/sample_result-6.png"

/** D1 archive_images에서 제1폭으로 쓸 고정 레코드 */
export const FIRST_PANEL_D1_ID = Number(
  process.env.NEXT_PUBLIC_BYEONGPUNG_FIRST_PANEL_D1_ID ?? "10",
)
export const FIRST_PANEL_FILENAME =
  process.env.NEXT_PUBLIC_BYEONGPUNG_FIRST_PANEL_FILENAME ?? "I-1.png"

/**
 * 제6폭: 5번째 칸(group[3])의 sceneId → E 이미지 파일명 매핑.
 * D1에서 해당 filename의 imageUrl을 찾아 사용한다.
 */
const LAST_PANEL_SCENE_TO_FILENAME: Record<string, string> = {
  "4-1A": "E1-1.png",
  "4-1B": "E2-1.png",
  "4-2A": "E3-1.png",
  "4-2B": "E4-1.png",
  "4-3A": "E5-1.png",
  "4-3B": "E6-1.png",
}

function isEPanelRecord(row: ArchiveImage): boolean {
  const filename = row.filename?.trim() ?? ""
  return /^E\d+-1\.png$/i.test(filename)
}

/** D1 rows에서 E 파일명 → imageUrl 맵 구성 */
function buildEImageMap(rows: ArchiveImage[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const row of rows) {
    const filename = row.filename?.trim()
    if (filename && isEPanelRecord(row)) {
      map.set(filename, row.imageUrl)
    }
  }
  return map
}

/** group[3].sceneId 기반으로 제6폭 imageUrl 결정 */
function resolveLastPanelImage(
  group: ArchiveImage[],
  eImageMap: Map<string, string>,
): string {
  const lastRow = group[IMAGES_PER_BYEONGPUNG - 1]
  const sceneId = lastRow?.sceneId?.trim()
  if (sceneId) {
    const eFilename = LAST_PANEL_SCENE_TO_FILENAME[sceneId]
    if (eFilename) {
      const url = eImageMap.get(eFilename)
      if (url) return url
    }
  }
  return LAST_PANEL_IMAGE
}

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

function isFirstPanelRecord(row: ArchiveImage): boolean {
  if (row.id === FIRST_PANEL_D1_ID) return true
  const filename = row.filename?.trim()
  return filename === FIRST_PANEL_FILENAME
}

/** I-1 또는 E*-1 처럼 고정 폭에 쓰이는 row인지 여부 */
function isFixedPanelRecord(row: ArchiveImage): boolean {
  return isFirstPanelRecord(row) || isEPanelRecord(row)
}

function resolveFirstPanelImage(rows: ArchiveImage[]): string {
  const match =
    rows.find((row) => row.id === FIRST_PANEL_D1_ID) ??
    rows.find((row) => row.filename?.trim() === FIRST_PANEL_FILENAME)
  return match?.imageUrl ?? FIRST_PANEL_IMAGE
}

/**
 * D1 archive_images 행들을 도착 순서대로 4개씩 묶어 병풍으로 변환한다.
 * 첫 폭(`제1폭`)은 D1 id=10 / I-1.png, 마지막 폭(`제6폭`)은 사전 준비 이미지.
 */
export function groupArchiveImages(rows: ArchiveImage[]): {
  inProgress: Byeongpung | null
  completed: Byeongpung[]
} {
  const firstPanelImage = resolveFirstPanelImage(rows)
  const eImageMap = buildEImageMap(rows)
  const participantRows = rows.filter((row) => !isFixedPanelRecord(row))

  const ordered = [...participantRows].sort((a, b) => {
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
    const byeongpung = buildByeongpung(group, idx + 1, firstPanelImage, eImageMap)
    if (group.length >= IMAGES_PER_BYEONGPUNG) {
      completed.push(byeongpung)
    } else {
      inProgress = byeongpung
    }
  })

  // 모든 그룹이 완성됐다면 새 빈 병풍을 다음 슬롯으로 보여준다
  if (!inProgress) {
    inProgress = buildByeongpung([], groups.length + 1, firstPanelImage, eImageMap)
  }

  return { inProgress, completed: completed.reverse() }
}

function buildByeongpung(
  group: ArchiveImage[],
  sequence: number,
  firstPanelImage: string,
  eImageMap: Map<string, string>,
): Byeongpung {
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
      image: firstPanelImage,
      status: "complete",
    },
    ...middle,
    {
      id: 6,
      title: "제6폭",
      story: null,
      image: resolveLastPanelImage(group, eImageMap),
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
