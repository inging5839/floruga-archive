"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react"
import { formatKoreaDateTime } from "@/lib/datetime"
import { groupArchiveImages, type ArchiveImage } from "@/lib/byeongpung-source"
import type { Byeongpung, Panel } from "@/lib/data"

const TOKEN_KEY = "manager5839_token"

export function AdminClient() {
  const [token, setToken] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY)
    if (saved) setToken(saved)
    setAuthChecked(true)
  }, [])

  const handleAuthed = useCallback((newToken: string) => {
    sessionStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  if (!authChecked) return null
  if (!token) return <LoginGate onAuthed={handleAuthed} />
  return (
    <Dashboard token={token} onLogout={handleLogout} onAuthError={handleLogout} />
  )
}

function LoginGate({ onAuthed }: { onAuthed: (token: string) => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const body = (await res.json().catch(() => ({}))) as {
        token?: string
        error?: string
      }
      if (!res.ok || !body.token) throw new Error(body.error ?? "로그인 실패")
      onAuthed(body.token)
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-neutral-300 bg-white/70 backdrop-blur p-8 rounded-lg shadow-sm"
      >
        <h1 className="text-lg font-medium text-neutral-900 mb-1">병풍 관리자</h1>
        <p className="text-xs text-neutral-700 mb-6">
          관리자 비밀번호를 입력하세요.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoFocus
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 mb-3"
        />
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-md bg-neutral-900 text-white text-sm py-2 font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40"
        >
          {loading ? "확인 중…" : "입장"}
        </button>
      </form>
    </div>
  )
}

type AuthHeaders = (extra?: Record<string, string>) => Record<string, string>

function Dashboard({
  token,
  onLogout,
  onAuthError,
}: {
  token: string
  onLogout: () => void
  onAuthError: () => void
}) {
  const [rows, setRows] = useState<ArchiveImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const authHeaders = useCallback<AuthHeaders>(
    (extra = {}) => ({ Authorization: `Bearer ${token}`, ...extra }),
    [token],
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/images", {
        headers: authHeaders(),
        cache: "no-store",
      })
      if (res.status === 401) return onAuthError()
      const body = (await res.json().catch(() => ({}))) as {
        images?: ArchiveImage[]
        error?: string
      }
      if (!res.ok) throw new Error(body.error ?? "불러오기 실패")
      setRows(body.images ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "불러오기 실패")
    } finally {
      setLoading(false)
    }
  }, [authHeaders, onAuthError])

  useEffect(() => {
    load()
  }, [load])

  // 실제 아카이브와 동일한 그룹 구성. D1 정렬(DESC)을 ASC로 되돌려 묶는다.
  const { inProgress, completed, leftovers } = useMemo(() => {
    const ascending = [...rows].sort((a, b) => {
      const t = a.createdAt.localeCompare(b.createdAt)
      return t !== 0 ? t : a.id - b.id
    })
    const grouped = groupArchiveImages(ascending)
    const all: Byeongpung[] = []
    if (grouped.inProgress) all.push(grouped.inProgress)
    all.push(...grouped.completed)

    const surfaced = new Set<number>()
    for (const bp of all) {
      for (const p of bp.panels) {
        if (p.rowId != null) surfaced.add(p.rowId)
      }
    }
    const leftoverRows = ascending.filter((r) => !surfaced.has(r.id))
    return {
      inProgress: grouped.inProgress,
      completed: grouped.completed,
      leftovers: leftoverRows,
    }
  }, [rows])

  return (
    <div className="min-h-dvh px-5 sm:px-8 lg:px-12 py-8">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">병풍 패널 관리</h1>
          <p className="text-xs text-neutral-700 mt-1">
            실제 아카이브와 동일한 구성 · D1/R2 동기화 · 총 {rows.length}개 이미지
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="text-sm rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 transition-colors"
          >
            새로고침
          </button>
          <button
            onClick={onLogout}
            className="text-sm rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <UploadForm
        authHeaders={authHeaders}
        onUploaded={load}
        onAuthError={onAuthError}
      />

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-10 text-sm text-neutral-700">불러오는 중…</p>
      ) : (
        <div className="mt-8 space-y-10">
          {inProgress && (
            <ByeongpungBlock
              byeongpung={inProgress}
              labelOverride="제작 중인 병풍"
              authHeaders={authHeaders}
              onChanged={load}
              onAuthError={onAuthError}
            />
          )}

          {completed.map((bp) => (
            <ByeongpungBlock
              key={bp.id}
              byeongpung={bp}
              authHeaders={authHeaders}
              onChanged={load}
              onAuthError={onAuthError}
            />
          ))}

          {completed.length === 0 && !inProgress && (
            <p className="text-sm text-neutral-700">표시할 병풍이 없습니다.</p>
          )}

          {leftovers.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-neutral-800 mb-1">
                기타 / 미사용 이미지
              </h2>
              <p className="text-xs text-neutral-700 mb-4">
                현재 어떤 병풍 폭에도 노출되지 않는 이미지입니다. (지난 Intro·결말 사본 등)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {leftovers.map((row) => (
                  <LeftoverCell
                    key={row.id}
                    row={row}
                    authHeaders={authHeaders}
                    onChanged={load}
                    onAuthError={onAuthError}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function ByeongpungBlock({
  byeongpung,
  labelOverride,
  authHeaders,
  onChanged,
  onAuthError,
}: {
  byeongpung: Byeongpung
  labelOverride?: string
  authHeaders: AuthHeaders
  onChanged: () => void
  onAuthError: () => void
}) {
  const completedAt = formatKoreaDateTime(byeongpung.completedAt)
  return (
    <section className="border border-neutral-300 rounded-xl p-4 sm:p-5 bg-white/50">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 className="text-base font-semibold text-neutral-900">
          {labelOverride ?? `${byeongpung.id}번째 병풍`}
        </h2>
        <p className="text-xs text-neutral-700">
          참여 {byeongpung.totalParticipants}명
          {completedAt ? ` · ${completedAt} 완성` : " · 진행 중"}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {byeongpung.panels.map((panel) => (
          <PanelCell
            key={panel.id}
            panel={panel}
            authHeaders={authHeaders}
            onChanged={onChanged}
            onAuthError={onAuthError}
          />
        ))}
      </div>
    </section>
  )
}

function PanelCell({
  panel,
  authHeaders,
  onChanged,
  onAuthError,
}: {
  panel: Panel
  authHeaders: AuthHeaders
  onChanged: () => void
  onAuthError: () => void
}) {
  const hasRow = panel.rowId != null
  const filled = panel.status === "complete" && panel.image

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white flex flex-col">
      <div className="px-2 py-1.5 flex items-center justify-between bg-neutral-50 border-b border-neutral-200">
        <span className="text-[11px] font-medium text-neutral-700">
          {panel.title}
        </span>
        {panel.isShared && (
          <span
            title="여러 병풍이 공유하는 고정 폭"
            className="text-[10px] text-amber-700 bg-amber-100 rounded px-1"
          >
            공유
          </span>
        )}
      </div>

      <div className="relative aspect-[4/5] bg-neutral-100">
        {filled ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={panel.image as string}
            alt={panel.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-neutral-600">
            빈 폭
          </div>
        )}
      </div>

      <div className="p-2 flex flex-col gap-1 grow">
        {panel.sceneId && (
          <p className="text-[10px] text-neutral-700 truncate">
            scene: {panel.sceneId}
          </p>
        )}
        {hasRow ? (
          <p className="text-[10px] text-neutral-600">#{panel.rowId}</p>
        ) : (
          <p className="text-[10px] text-neutral-600">미등록</p>
        )}
      </div>

      {hasRow && (
        <PanelActions
          rowId={panel.rowId as number}
          panel={panel}
          authHeaders={authHeaders}
          onChanged={onChanged}
          onAuthError={onAuthError}
        />
      )}
    </div>
  )
}

function PanelActions({
  rowId,
  panel,
  authHeaders,
  onChanged,
  onAuthError,
}: {
  rowId: number
  panel: Panel
  authHeaders: AuthHeaders
  onChanged: () => void
  onAuthError: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [sceneId, setSceneId] = useState(panel.sceneId ?? "")
  const [storyText, setStoryText] = useState(panel.story ?? "")
  const replaceRef = useRef<HTMLInputElement>(null)

  const runPatch = useCallback(
    async (form: FormData) => {
      setBusy(true)
      try {
        const res = await fetch(`/api/admin/images/${rowId}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: form,
        })
        if (res.status === 401) return onAuthError()
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        if (!res.ok) throw new Error(body.error ?? "수정 실패")
        setEditing(false)
        onChanged()
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "수정 실패")
      } finally {
        setBusy(false)
      }
    },
    [authHeaders, onAuthError, onChanged, rowId],
  )

  const handleReplace = async (file: File) => {
    const form = new FormData()
    form.append("file", file)
    await runPatch(form)
    if (replaceRef.current) replaceRef.current.value = ""
  }

  const handleSaveMeta = async () => {
    const form = new FormData()
    form.append("sceneId", sceneId)
    form.append("storyText", storyText)
    await runPatch(form)
  }

  const handleDelete = async () => {
    const warn = panel.isShared
      ? "\n\n※ 공유 폭(여러 병풍에서 사용)입니다. 삭제 시 다른 병풍에도 영향이 있을 수 있습니다."
      : ""
    if (
      !window.confirm(
        `${panel.title} 이미지를 삭제할까요? (D1 + R2)${warn}`,
      )
    )
      return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/images/${rowId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      if (res.status === 401) return onAuthError()
      const body = (await res.json().catch(() => ({}))) as {
        error?: string
        r2Error?: string | null
      }
      if (!res.ok) throw new Error(body.error ?? "삭제 실패")
      if (body.r2Error)
        window.alert(`D1은 삭제됐으나 R2 삭제 실패:\n${body.r2Error}`)
      onChanged()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "삭제 실패")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="border-t border-neutral-200 p-2 flex flex-col gap-1.5">
      {editing ? (
        <div className="flex flex-col gap-1.5">
          <input
            value={sceneId}
            onChange={(e) => setSceneId(e.target.value)}
            placeholder="scene ID"
            className="border border-neutral-300 rounded px-2 py-1 text-[11px]"
          />
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="스토리"
            rows={2}
            className="border border-neutral-300 rounded px-2 py-1 text-[11px] resize-y"
          />
          <div className="flex gap-1">
            <button
              onClick={handleSaveMeta}
              disabled={busy}
              className="flex-1 rounded bg-neutral-900 text-white text-[11px] py-1 disabled:opacity-40"
            >
              저장
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={busy}
              className="flex-1 rounded border border-neutral-300 text-[11px] text-neutral-900 font-medium py-1"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setEditing(true)}
            disabled={busy}
            className="rounded border border-neutral-300 text-[11px] text-neutral-900 font-medium py-1 hover:bg-neutral-100 disabled:opacity-40"
          >
            수정
          </button>
          <button
            onClick={() => replaceRef.current?.click()}
            disabled={busy}
            className="rounded border border-neutral-300 text-[11px] text-neutral-900 font-medium py-1 hover:bg-neutral-100 disabled:opacity-40"
          >
            교체
          </button>
          <button
            onClick={handleDelete}
            disabled={busy}
            className="rounded bg-red-600 text-white text-[11px] py-1 hover:bg-red-700 disabled:opacity-40"
          >
            삭제
          </button>
        </div>
      )}
      <input
        ref={replaceRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleReplace(f)
        }}
      />
      {busy && <p className="text-[10px] text-neutral-600">처리 중…</p>}
    </div>
  )
}

function LeftoverCell({
  row,
  authHeaders,
  onChanged,
  onAuthError,
}: {
  row: ArchiveImage
  authHeaders: AuthHeaders
  onChanged: () => void
  onAuthError: () => void
}) {
  const [busy, setBusy] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`이미지를 삭제할까요? (D1 + R2)\n${row.filename ?? row.imageUrl}`))
      return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/images/${row.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      if (res.status === 401) return onAuthError()
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error ?? "삭제 실패")
      onChanged()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "삭제 실패")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white flex flex-col">
      <div className="relative aspect-[4/5] bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.imageUrl}
          alt={row.filename ?? `image-${row.id}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-2 grow">
        <p className="text-[10px] text-neutral-600">#{row.id}</p>
        <p className="text-[11px] text-neutral-700 break-all line-clamp-2">
          {row.filename ?? "(파일명 없음)"}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={busy}
        className="m-2 mt-0 rounded bg-red-600 text-white text-[11px] py-1.5 hover:bg-red-700 disabled:opacity-40"
      >
        {busy ? "삭제 중…" : "삭제"}
      </button>
    </div>
  )
}

function UploadForm({
  authHeaders,
  onUploaded,
  onAuthError,
}: {
  authHeaders: AuthHeaders
  onUploaded: () => void
  onAuthError: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [sceneId, setSceneId] = useState("")
  const [storyText, setStoryText] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setMessage("이미지 파일을 선택하세요.")
      return
    }
    setUploading(true)
    setMessage(null)
    try {
      const form = new FormData()
      form.append("file", file)
      if (sceneId.trim()) form.append("sceneId", sceneId.trim())
      if (storyText.trim()) form.append("storyText", storyText.trim())

      const res = await fetch("/api/admin/images", {
        method: "POST",
        headers: authHeaders(),
        body: form,
      })
      if (res.status === 401) return onAuthError()
      const body = (await res.json().catch(() => ({}))) as {
        error?: string
        filename?: string
      }
      if (!res.ok) throw new Error(body.error ?? "업로드 실패")

      setMessage(`업로드 완료: ${body.filename ?? ""}`)
      setSceneId("")
      setStoryText("")
      if (fileRef.current) fileRef.current.value = ""
      onUploaded()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "업로드 실패")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="border border-neutral-300 rounded-lg p-5 bg-white/60 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <div className="sm:col-span-3">
        <h2 className="text-sm font-semibold text-neutral-800">
          새 이미지 추가
        </h2>
        <p className="text-xs text-neutral-700 mt-0.5">
          업로드하면 R2에 저장되고 D1에 등록됩니다. 도착 순서대로 다음 병풍의 빈 폭(제2~5폭)을 채웁니다.
          제1폭은 <code>I-1.png</code>, 제6폭은 <code>E1-1.png</code>~<code>E6-1.png</code> 파일명으로 인식됩니다.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-600">이미지 파일</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:text-white file:px-3 file:py-1.5 file:text-xs"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-600">scene ID (선택)</label>
        <input
          value={sceneId}
          onChange={(e) => setSceneId(e.target.value)}
          placeholder="예: 1A, 2B, Intro"
          className="border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="rounded-md bg-emerald-700 text-white text-sm px-5 py-2 font-medium hover:bg-emerald-800 transition-colors disabled:opacity-40 h-[38px]"
      >
        {uploading ? "업로드 중…" : "추가"}
      </button>
      <div className="sm:col-span-3 flex flex-col gap-1">
        <label className="text-xs text-neutral-600">스토리 텍스트 (선택)</label>
        <textarea
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          rows={2}
          placeholder="패널 설명/스토리"
          className="border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-y"
        />
      </div>
      {message && (
        <p className="sm:col-span-3 text-xs text-neutral-600">{message}</p>
      )}
    </form>
  )
}
