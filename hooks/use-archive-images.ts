"use client"

import { useEffect, useState } from "react"
import {
  ARCHIVE_POLL_INTERVAL_MS,
  groupArchiveImages,
  type ArchiveImage,
} from "@/lib/byeongpung-source"
import type { Byeongpung } from "@/lib/data"

interface ArchiveResponse {
  images?: ArchiveImage[]
  error?: string
}

interface State {
  inProgress: Byeongpung | null
  completed: Byeongpung[]
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

const INITIAL_STATE: State = {
  inProgress: null,
  completed: [],
  loading: true,
  error: null,
  lastUpdated: null,
}

/**
 * D1의 archive_images를 주기적으로 폴링해서 병풍 단위로 묶어 반환.
 */
export function useArchiveImages(intervalMs: number = ARCHIVE_POLL_INTERVAL_MS) {
  const [state, setState] = useState<State>(INITIAL_STATE)

  useEffect(() => {
    let cancelled = false

    const fetchOnce = async () => {
      try {
        const res = await fetch("/api/archive-images", { cache: "no-store" })
        const body = (await res.json().catch(() => ({}))) as ArchiveResponse
        if (cancelled) return

        if (!res.ok) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: body.error ?? `${res.status} ${res.statusText}`,
          }))
          return
        }

        const grouped = groupArchiveImages(body.images ?? [])
        setState({
          inProgress: grouped.inProgress,
          completed: grouped.completed,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        })
      } catch (err) {
        if (cancelled) return
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "fetch error",
        }))
      }
    }

    fetchOnce()
    const id = window.setInterval(fetchOnce, intervalMs)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [intervalMs])

  return state
}
