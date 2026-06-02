import type { Byeongpung, Panel } from "./data"

/** 한 병풍을 채우는 관람객 업로드 이미지 수 (2~5폭) */
export const IMAGES_PER_BYEONGPUNG = 4

/**
 * 첫·마지막 폭 fallback. 기본값은 null → D1에 이미지가 없으면 빈 폭(제작 중)으로 표시.
 * 샘플 이미지는 더 이상 사용하지 않고 D1에서만 이미지를 가져온다.
 * (필요 시 환경 변수로 정적 이미지를 지정할 수 있음)
 */
export const FIRST_PANEL_IMAGE: string | null =
  process.env.NEXT_PUBLIC_BYEONGPUNG_FIRST_IMAGE ?? null
export const LAST_PANEL_IMAGE: string | null =
  process.env.NEXT_PUBLIC_BYEONGPUNG_LAST_IMAGE ?? null

/** D1 archive_images에서 제1폭으로 쓸 고정 레코드 */
export const FIRST_PANEL_D1_ID = Number(
  process.env.NEXT_PUBLIC_BYEONGPUNG_FIRST_PANEL_D1_ID ?? "10",
)
export const FIRST_PANEL_FILENAME =
  process.env.NEXT_PUBLIC_BYEONGPUNG_FIRST_PANEL_FILENAME ?? "I-1.png"

/** D1 archive_images — 제작 중(빈 폭) 플레이스홀더 */
export const WAIT_PANEL_D1_ID = Number(
  process.env.NEXT_PUBLIC_BYEONGPUNG_WAIT_PANEL_D1_ID ?? "7",
)
export const WAIT_PANEL_FILENAME =
  process.env.NEXT_PUBLIC_BYEONGPUNG_WAIT_PANEL_FILENAME ?? "WAIT.png"

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

/**
 * "E1-1.png" 또는 "E1-1_<timestamp>.png" → 기준 파일명 "E1-1.png" 반환.
 * E 결말 이미지가 아니면 null.
 */
function eBaseFilename(filename?: string | null): string | null {
  const name = filename?.trim() ?? ""
  const m = name.match(/^(E\d+-1)(?:_.*)?\.png$/i)
  return m ? `${m[1]}.png` : null
}

function isEPanelRecord(row: ArchiveImage): boolean {
  return eBaseFilename(row.filename) !== null
}

/** D1 rows에서 E 기준 파일명 → imageUrl 맵 구성 (rows ASC 정렬 → 최신값 유지) */
function buildEImageMap(rows: ArchiveImage[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const row of rows) {
    const base = eBaseFilename(row.filename)
    if (base) {
      map.set(base, row.imageUrl)
    }
  }
  return map
}

/** group[3].sceneId 기반으로 제6폭 imageUrl 결정 (없으면 null) */
function resolveLastPanelImage(
  group: ArchiveImage[],
  eImageMap: Map<string, string>,
): string | null {
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
  createdAt: string
}

/** "I-1.png" 또는 "I-1_<timestamp>.png" 모두 제1폭으로 인식 */
const FIRST_PANEL_STEM = FIRST_PANEL_FILENAME.replace(/\.[^.]+$/, "")

function matchesFirstPanelFilename(filename?: string | null): boolean {
  const name = filename?.trim()
  if (!name) return false
  if (name === FIRST_PANEL_FILENAME) return true
  const stem = name.replace(/\.[^.]+$/, "")
  return stem === FIRST_PANEL_STEM || stem.startsWith(`${FIRST_PANEL_STEM}_`)
}

function isFirstPanelRecord(row: ArchiveImage): boolean {
  if (row.id === FIRST_PANEL_D1_ID) return true
  return matchesFirstPanelFilename(row.filename)
}

function isWaitPanelRecord(row: ArchiveImage): boolean {
  if (row.id === WAIT_PANEL_D1_ID) return true
  return row.filename?.trim() === WAIT_PANEL_FILENAME
}

/** I-1, WAIT, E*-1 처럼 고정·플레이스홀더 row인지 여부 */
function isFixedPanelRecord(row: ArchiveImage): boolean {
  return (
    isFirstPanelRecord(row) || isWaitPanelRecord(row) || isEPanelRecord(row)
  )
}

function resolveFirstPanelImage(rows: ArchiveImage[]): string | null {
  // rows는 created_at ASC 정렬 → 가장 최근 Intro(I-1) 이미지를 제1폭으로 사용
  const matches = rows.filter(isFirstPanelRecord)
  const latest = matches[matches.length - 1]
  return latest?.imageUrl ?? FIRST_PANEL_IMAGE
}

function resolveWaitPanelImage(rows: ArchiveImage[]): string | null {
  const match =
    rows.find((row) => row.id === WAIT_PANEL_D1_ID) ??
    rows.find((row) => row.filename?.trim() === WAIT_PANEL_FILENAME)
  return match?.imageUrl ?? null
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
  const waitPanelImage = resolveWaitPanelImage(rows)
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
    const byeongpung = buildByeongpung(
      group,
      idx + 1,
      firstPanelImage,
      waitPanelImage,
      eImageMap,
    )
    if (group.length >= IMAGES_PER_BYEONGPUNG) {
      completed.push(byeongpung)
    } else {
      inProgress = byeongpung
    }
  })

  // 모든 그룹이 완성됐다면 새 빈 병풍을 다음 슬롯으로 보여준다
  if (!inProgress) {
    inProgress = buildByeongpung(
      [],
      groups.length + 1,
      firstPanelImage,
      waitPanelImage,
      eImageMap,
    )
  }

  return { inProgress, completed: completed.reverse() }
}

function buildByeongpung(
  group: ArchiveImage[],
  sequence: number,
  firstPanelImage: string | null,
  waitPanelImage: string | null,
  eImageMap: Map<string, string>,
): Byeongpung {
  const middle: Panel[] = Array.from({ length: IMAGES_PER_BYEONGPUNG }).map(
    (_, i) => {
      const row = group[i]
      return {
        id: i + 2,
        title: `제${i + 2}폭`,
        story: null,
        image: row?.imageUrl ?? waitPanelImage,
        status: row ? "complete" : "waiting",
        author: row?.sceneId ? `Scene ${row.sceneId}` : undefined,
        createdAt: row?.createdAt,
      }
    },
  )

  const isComplete = group.length >= IMAGES_PER_BYEONGPUNG

  // 제6폭: 2~5폭이 모두 채워진 경우에만 E 이미지 표시
  const lastPanel: Panel = isComplete
    ? {
        id: 6,
        title: "제6폭",
        story: null,
        image: resolveLastPanelImage(group, eImageMap),
        status: "complete",
      }
    : {
        id: 6,
        title: "제6폭",
        story: null,
        image: waitPanelImage,
        status: "waiting",
      }

  const panels: Panel[] = [
    {
      id: 1,
      title: "제1폭",
      story: null,
      // Intro(I-1) 이미지가 없으면 WAIT.png로 대체 (없을 때만 "제작 중" 텍스트)
      image: firstPanelImage ?? waitPanelImage,
      status: firstPanelImage ? "complete" : "waiting",
    },
    ...middle,
    lastPanel,
  ]
  const latest = group[group.length - 1]
  const thumbnailImage =
    [...group].reverse().find((row) => row.imageUrl)?.imageUrl ?? null

  return {
    id: sequence,
    title: `${sequence}번째 병풍`,
    theme: `${IMAGES_PER_BYEONGPUNG}명의 관람객이 함께 만든`,
    // 참여 인원/이미지 수는 인트로(제1폭)·결말(제6폭) 제외: 관람객 업로드(제2~5폭)만 집계
    totalParticipants: group.length,
    completedAt: isComplete ? latest?.createdAt : undefined,
    thumbnailImage,
    panels,
  }
}
