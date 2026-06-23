import {
  deleteFromR2,
  deleteImageRow,
  getImageById,
  isAdminAuthorized,
  r2KeyFromPublicUrl,
  updateImageRow,
  uploadToR2,
} from "@/lib/admin-store"

export const runtime = "nodejs"

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
}

function sanitizeStem(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9가-힣_-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 48) || "image"
  )
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isFinite(id)) {
    return Response.json({ error: "유효하지 않은 id" }, { status: 400 })
  }

  try {
    const row = await getImageById(id)
    if (!row) {
      return Response.json({ error: "존재하지 않는 레코드" }, { status: 404 })
    }

    const form = await request.formData()
    const file = form.get("file")
    const sceneIdRaw = form.get("sceneId")
    const storyTextRaw = form.get("storyText")

    const fields: {
      imageUrl?: string
      filename?: string | null
      sceneId?: string | null
      storyText?: string | null
    } = {}

    if (sceneIdRaw !== null) {
      const v = (sceneIdRaw as string).trim()
      fields.sceneId = v || null
    }
    if (storyTextRaw !== null) {
      const v = (storyTextRaw as string).trim()
      fields.storyText = v || null
    }

    // 이미지 교체: 새 파일 업로드 → image_url/filename 갱신 → 기존 R2 오브젝트 삭제
    let oldKeyToDelete: string | null = null
    if (file instanceof File) {
      const contentType = file.type || "image/png"
      const ext = EXT_BY_MIME[contentType] ?? "png"
      const stem = sanitizeStem(file.name || "image")
      const ts = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d+Z$/, "Z")
      const key = `admin_${stem}_${ts}.${ext}`
      const bytes = new Uint8Array(await file.arrayBuffer())
      const newUrl = await uploadToR2({ key, body: bytes, contentType })
      fields.imageUrl = newUrl
      fields.filename = key
      oldKeyToDelete = r2KeyFromPublicUrl(row.imageUrl)
    }

    await updateImageRow(id, fields)

    let r2Error: string | null = null
    if (oldKeyToDelete) {
      try {
        await deleteFromR2(oldKeyToDelete)
      } catch (error) {
        r2Error =
          error instanceof Error ? error.message : "old R2 delete failed"
        console.error(`기존 R2 삭제 실패 (id=${id})`, error)
      }
    }

    return Response.json({ ok: true, id, imageUrl: fields.imageUrl, r2Error })
  } catch (error) {
    console.error("Admin update failed", error)
    return Response.json(
      {
        error: "수정에 실패했습니다.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isFinite(id)) {
    return Response.json({ error: "유효하지 않은 id" }, { status: 400 })
  }

  try {
    const row = await getImageById(id)
    if (!row) {
      return Response.json({ error: "존재하지 않는 레코드" }, { status: 404 })
    }

    // 1) R2 오브젝트 삭제 (실패해도 D1 삭제는 진행)
    let r2Deleted = false
    let r2Error: string | null = null
    const key = r2KeyFromPublicUrl(row.imageUrl)
    if (key) {
      try {
        await deleteFromR2(key)
        r2Deleted = true
      } catch (error) {
        r2Error = error instanceof Error ? error.message : "R2 delete failed"
        console.error(`R2 삭제 실패 (id=${id}, key=${key})`, error)
      }
    }

    // 2) D1 레코드 삭제
    await deleteImageRow(id)

    return Response.json({ ok: true, id, r2Deleted, r2Key: key, r2Error })
  } catch (error) {
    console.error("Admin delete failed", error)
    return Response.json(
      {
        error: "삭제에 실패했습니다.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
