import {
  insertImage,
  isAdminAuthorized,
  listAllImages,
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

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const images = await listAllImages()
    return Response.json({ images })
  } catch (error) {
    console.error("Admin list failed", error)
    return Response.json(
      {
        error: "목록을 불러오지 못했습니다.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get("file")
    const sceneId = (form.get("sceneId") as string | null)?.trim() || null
    const storyText = (form.get("storyText") as string | null)?.trim() || null

    if (!(file instanceof File)) {
      return Response.json({ error: "이미지 파일이 필요합니다." }, { status: 400 })
    }

    const contentType = file.type || "image/png"
    const ext = EXT_BY_MIME[contentType] ?? "png"
    const stem = sanitizeStem(file.name || "image")
    const ts = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+Z$/, "Z")
    const key = `admin_${stem}_${ts}.${ext}`

    const bytes = new Uint8Array(await file.arrayBuffer())
    const imageUrl = await uploadToR2({ key, body: bytes, contentType })

    await insertImage({
      imageUrl,
      filename: key,
      sceneId,
      storyText,
    })

    return Response.json({ ok: true, imageUrl, filename: key })
  } catch (error) {
    console.error("Admin upload failed", error)
    return Response.json(
      {
        error: "업로드에 실패했습니다.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
