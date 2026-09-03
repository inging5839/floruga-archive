import {
  PREVIOUS_EXHIBITION_LAST_IMAGE_ID,
  parseArchiveCollection,
} from "@/lib/archive-collection"
import {
  WAIT_PANEL_D1_ID,
  WAIT_PANEL_FILENAME,
} from "@/lib/byeongpung-source"

export const runtime = "nodejs"

type ArchiveImagePayload = {
  imageUrl?: string
  filename?: string
  sceneId?: string | number
  storyText?: string
}

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function getD1Url() {
  const accountId = getRequiredEnv("CLOUDFLARE_ACCOUNT_ID")
  const databaseId = getRequiredEnv("CLOUDFLARE_D1_DATABASE_ID")

  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`
}

async function queryD1(sql: string, params: Array<string | number | null> = []) {
  const response = await fetch(getD1Url(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getRequiredEnv("CLOUDFLARE_D1_API_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  })

  const result = await response.json()
  const queryResult = Array.isArray(result.result) ? result.result[0] : result.result

  if (!response.ok || result.success === false || queryResult?.success === false) {
    throw new Error(JSON.stringify(result))
  }

  return result
}

function isAuthorized(request: Request) {
  const expectedSecret = getRequiredEnv("ARCHIVE_INGEST_SECRET")
  return request.headers.get("authorization") === `Bearer ${expectedSecret}`
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = (await request.json()) as ArchiveImagePayload
    const imageUrl = payload.imageUrl?.trim()

    if (!imageUrl) {
      return Response.json({ error: "imageUrl is required" }, { status: 400 })
    }

    await queryD1(
      `
        INSERT INTO archive_images (image_url, filename, scene_id, story_text)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(image_url) DO UPDATE SET
          filename = excluded.filename,
          scene_id = excluded.scene_id,
          story_text = excluded.story_text
      `,
      [
        imageUrl,
        payload.filename?.trim() || null,
        payload.sceneId == null ? null : String(payload.sceneId),
        payload.storyText?.trim() || null,
      ],
    )

    return Response.json({ ok: true, imageUrl })
  } catch (error) {
    console.error("Failed to save archive image", error)

    return Response.json(
      {
        error: "Failed to save archive image",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const collection = parseArchiveCollection(new URL(request.url).searchParams.get("collection"))
    const isPrevious = collection === "previous"

    // 이전 전시는 현재 확정한 마지막 행에서 고정한다.
    // WAIT·결말 폭은 새 전시 병풍을 조립하는 데도 필요한 공용 이미지다.
    const whereClause = isPrevious
      ? `
          WHERE id <= ?
        `
      : `
          WHERE (
            id > ?
            OR id = ?
            OR LOWER(filename) = LOWER(?)
            OR LOWER(filename) LIKE 'e%-1%.png'
          )
        `
    const params = isPrevious
      ? [PREVIOUS_EXHIBITION_LAST_IMAGE_ID]
      : [
          PREVIOUS_EXHIBITION_LAST_IMAGE_ID,
          WAIT_PANEL_D1_ID,
          WAIT_PANEL_FILENAME,
        ]

    const result = await queryD1(`
      SELECT id, image_url AS imageUrl, filename, scene_id AS sceneId,
             story_text AS storyText, created_at AS createdAt
      FROM archive_images
      ${whereClause}
      ORDER BY created_at ASC, id ASC
      LIMIT 2000
    `, params)

    const rows = result.result?.[0]?.results ?? result.result?.results ?? []

    return Response.json({ images: rows, collection })
  } catch (error) {
    console.error("Failed to fetch archive images", error)

    return Response.json(
      {
        error: "Failed to fetch archive images",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
