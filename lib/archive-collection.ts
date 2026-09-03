export const ARCHIVE_COLLECTIONS = ["current", "previous"] as const

export type ArchiveCollection = (typeof ARCHIVE_COLLECTIONS)[number]

/**
 * 2026. 06. 26—06. 28 전시 기록으로 확정한 마지막 D1 행.
 * 전시 뒤 복구·보완 등록된 이미지도 빠지지 않도록 날짜 대신 행 경계로 고정한다.
 */
export const PREVIOUS_EXHIBITION_LAST_IMAGE_ID = 9480

export function parseArchiveCollection(value: string | null): ArchiveCollection {
  return value === "previous" ? "previous" : "current"
}
