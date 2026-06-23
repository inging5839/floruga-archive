import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"

/**
 * 관리자 페이지(/manager5839) 전용 서버 헬퍼.
 * D1(archive_images)와 R2(wiggler 버킷)에 대한 읽기/쓰기/삭제를 한곳에서 관리한다.
 * 모든 함수는 서버 라우트(route.ts)에서만 호출해야 한다.
 */

export function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/** 관리자 비밀키 검증 (Authorization: Bearer <ADMIN_SECRET>) */
export function isAdminAuthorized(request: Request): boolean {
  const expected = process.env.ADMIN_SECRET
  if (!expected) return false
  const header = request.headers.get("authorization")
  return header === `Bearer ${expected}`
}

/* ──────────────────────────── D1 ──────────────────────────── */

function getD1Url(): string {
  const accountId = getRequiredEnv("CLOUDFLARE_ACCOUNT_ID")
  const databaseId = getRequiredEnv("CLOUDFLARE_D1_DATABASE_ID")
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`
}

export async function queryD1(
  sql: string,
  params: Array<string | number | null> = [],
) {
  const response = await fetch(getD1Url(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getRequiredEnv("CLOUDFLARE_D1_API_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  })

  const result = await response.json()
  const queryResult = Array.isArray(result.result)
    ? result.result[0]
    : result.result

  if (
    !response.ok ||
    result.success === false ||
    queryResult?.success === false
  ) {
    throw new Error(JSON.stringify(result))
  }

  return result
}

export interface AdminImageRow {
  id: number
  imageUrl: string
  filename: string | null
  sceneId: string | null
  storyText: string | null
  createdAt: string
}

export async function listAllImages(): Promise<AdminImageRow[]> {
  const result = await queryD1(`
    SELECT id, image_url AS imageUrl, filename, scene_id AS sceneId,
           story_text AS storyText, created_at AS createdAt
    FROM archive_images
    ORDER BY created_at DESC, id DESC
    LIMIT 1000
  `)
  return result.result?.[0]?.results ?? result.result?.results ?? []
}

export async function getImageById(
  id: number,
): Promise<AdminImageRow | null> {
  const result = await queryD1(
    `
      SELECT id, image_url AS imageUrl, filename, scene_id AS sceneId,
             story_text AS storyText, created_at AS createdAt
      FROM archive_images
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  )
  const rows: AdminImageRow[] =
    result.result?.[0]?.results ?? result.result?.results ?? []
  return rows[0] ?? null
}

export async function insertImage(args: {
  imageUrl: string
  filename: string | null
  sceneId: string | null
  storyText: string | null
}) {
  await queryD1(
    `
      INSERT INTO archive_images (image_url, filename, scene_id, story_text)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(image_url) DO UPDATE SET
        filename = excluded.filename,
        scene_id = excluded.scene_id,
        story_text = excluded.story_text
    `,
    [args.imageUrl, args.filename, args.sceneId, args.storyText],
  )
}

export async function deleteImageRow(id: number) {
  await queryD1(`DELETE FROM archive_images WHERE id = ?`, [id])
}

export async function updateImageRow(
  id: number,
  fields: {
    imageUrl?: string
    filename?: string | null
    sceneId?: string | null
    storyText?: string | null
  },
) {
  const sets: string[] = []
  const params: Array<string | number | null> = []

  if (fields.imageUrl !== undefined) {
    sets.push("image_url = ?")
    params.push(fields.imageUrl)
  }
  if (fields.filename !== undefined) {
    sets.push("filename = ?")
    params.push(fields.filename)
  }
  if (fields.sceneId !== undefined) {
    sets.push("scene_id = ?")
    params.push(fields.sceneId)
  }
  if (fields.storyText !== undefined) {
    sets.push("story_text = ?")
    params.push(fields.storyText)
  }

  if (sets.length === 0) return
  params.push(id)
  await queryD1(
    `UPDATE archive_images SET ${sets.join(", ")} WHERE id = ?`,
    params,
  )
}

/* ──────────────────────────── R2 ──────────────────────────── */

let cachedClient: S3Client | null = null

function getR2Client(): S3Client {
  if (cachedClient) return cachedClient
  cachedClient = new S3Client({
    region: "auto",
    endpoint: getRequiredEnv("R2_ENDPOINT_URL"),
    credentials: {
      accessKeyId: getRequiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getRequiredEnv("R2_SECRET_ACCESS_KEY"),
    },
    // Cloudflare R2는 최신 SDK 기본 체크섬(aws-chunked/x-amz-checksum-*)을
    // 처리하지 못해 업로드가 멈춘다. 필요할 때만 체크섬을 보내도록 강제.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  })
  return cachedClient
}

export function getR2PublicPrefix(): string {
  return getRequiredEnv("R2_PUBLIC_URL_PREFIX").replace(/\/+$/, "")
}

/** 공개 URL에서 R2 오브젝트 키를 추출. prefix가 다르면 마지막 경로를 키로 사용. */
export function r2KeyFromPublicUrl(imageUrl: string): string | null {
  const prefix = getR2PublicPrefix()
  const trimmed = imageUrl.trim()
  if (trimmed.startsWith(prefix)) {
    return decodeURIComponent(trimmed.slice(prefix.length).replace(/^\/+/, ""))
  }
  try {
    const url = new URL(trimmed)
    return decodeURIComponent(url.pathname.replace(/^\/+/, ""))
  } catch {
    return null
  }
}

export async function uploadToR2(args: {
  key: string
  body: Uint8Array
  contentType: string
}): Promise<string> {
  const bucket = getRequiredEnv("R2_BUCKET_NAME")
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: args.key,
      Body: args.body,
      ContentType: args.contentType,
    }),
  )
  return `${getR2PublicPrefix()}/${args.key}`
}

export async function deleteFromR2(key: string) {
  const bucket = getRequiredEnv("R2_BUCKET_NAME")
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key }),
  )
}
