/** @deprecated 태블릿은 LAN에서 GPU로 직연결합니다. app/tablet/page.tsx 참고 */
export const runtime = "nodejs"

type SendFacePayload = {
  image?: string
  strength?: number
  user_id?: string
  userId?: string
}

function getGpuUrl() {
  return (
    process.env.WIGGLER_GPU_URL?.trim() || "http://165.194.161.35:10001"
  ).replace(/\/$/, "")
}

function getGpuSecret() {
  return process.env.WIGGLER_GPU_SECRET?.trim() || process.env.ARCHIVE_INGEST_SECRET?.trim()
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SendFacePayload
    const image = payload.image?.trim()

    if (!image) {
      return Response.json({ error: "image is required" }, { status: 400 })
    }

    const strength =
      typeof payload.strength === "number" ? payload.strength : undefined
    const user_id = (payload.user_id ?? payload.userId)?.trim()

    const gpuSecret = getGpuSecret()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (gpuSecret) {
      headers.Authorization = `Bearer ${gpuSecret}`
    }

    const gpuRes = await fetch(`${getGpuUrl()}/sendFace`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        image,
        strength,
        user_id: user_id || undefined,
      }),
    })

    const gpuBody = (await gpuRes.json().catch(() => ({}))) as Record<
      string,
      unknown
    >

    if (!gpuRes.ok) {
      return Response.json(
        {
          error: "GPU server rejected the request",
          detail: gpuBody.detail ?? gpuBody.error ?? gpuRes.statusText,
        },
        { status: gpuRes.status },
      )
    }

    return Response.json(gpuBody)
  } catch (error) {
    console.error("Failed to forward face image to GPU", error)

    return Response.json(
      {
        error: "Failed to send face image to GPU server",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
