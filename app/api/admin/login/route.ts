export const runtime = "nodejs"

/** 관리자 비밀번호 검증. 성공 시 동일 비밀번호를 토큰으로 그대로 반환한다. */
export async function POST(request: Request) {
  const expected = process.env.ADMIN_SECRET
  if (!expected) {
    return Response.json(
      { error: "ADMIN_SECRET is not configured" },
      { status: 500 },
    )
  }

  let password = ""
  try {
    const body = (await request.json()) as { password?: string }
    password = body.password?.trim() ?? ""
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 })
  }

  if (password !== expected) {
    return Response.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 })
  }

  return Response.json({ ok: true, token: expected })
}
