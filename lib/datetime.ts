/** D1/SQLite datetime('now') 등 타임존 없는 UTC 문자열을 Date로 파싱 */
export function parseUtcDate(dateString: string): Date | null {
  const trimmed = dateString.trim()
  if (!trimmed) return null

  if (/[zZ]$/.test(trimmed) || /[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    const date = new Date(trimmed)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const normalized = trimmed.includes("T")
    ? trimmed
    : trimmed.replace(" ", "T")
  const date = new Date(`${normalized}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

/** 한국 시간(Asia/Seoul)으로 날짜·시간 표시 */
export function formatKoreaDateTime(dateString?: string | null): string | null {
  if (!dateString) return null

  const date = parseUtcDate(dateString)
  if (!date) return dateString

  return date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}
