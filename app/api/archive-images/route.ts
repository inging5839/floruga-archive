export const runtime = "nodejs"

type ArchiveImagePayload = {
  imageUrl?: string
  filename?: string
  sceneId?: string | number
  actionName?: string
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
        INSERT INTO archive_images (image_url, filename, scene_id, action_name)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(image_url) DO UPDATE SET
          filename = excluded.filename,
          scene_id = excluded.scene_id,
          action_name = excluded.action_name
      `,
      [
        imageUrl,
        payload.filename?.trim() || null,
        payload.sceneId == null ? null : String(payload.sceneId),
        payload.actionName?.trim() || null,
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

export async function GET() {
  try {
    const result = await queryD1(`
      SELECT id, image_url AS imageUrl, filename, scene_id AS sceneId,
             action_name AS actionName, created_at AS createdAt
      FROM archive_images
      ORDER BY created_at ASC, id ASC
      LIMIT 500
    `)

    const rows = result.result?.[0]?.results ?? result.result?.results ?? []

    return Response.json({ images: rows })
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
