import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { prisma } from "./prisma"
import type { SessionPayload } from "@/types"
import { createHash } from "crypto"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-dev-secret-change-in-prod"
)

const COOKIE_NAME = "keditech_admin_session"
const SESSION_DURATION_HOURS = 24

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(secret)

  // Store hashed token in DB for session invalidation
  const tokenHash = createHash("sha256").update(token).digest("hex")
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

  await prisma.adminSession.create({
    data: {
      adminUserId: payload.adminId,
      tokenHash,
      expiresAt,
    },
  })

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, secret)

    // Check session is not revoked in DB
    const tokenHash = createHash("sha256").update(token).digest("hex")
    const session = await prisma.adminSession.findUnique({ where: { tokenHash } })
    if (!session || session.expiresAt < new Date()) return null

    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_HOURS * 60 * 60,
    path: "/",
  })
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (token) {
      const tokenHash = createHash("sha256").update(token).digest("hex")
      await prisma.adminSession.deleteMany({ where: { tokenHash } })
    }
    cookieStore.delete(COOKIE_NAME)
  } catch {
    // ignore
  }
}
