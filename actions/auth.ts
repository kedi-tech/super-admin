"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { z } from "zod"
import { writeAuditLog } from "@/lib/audit"
import { createSession, deleteSession, setSessionCookie } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export interface ActionResult {
  error?: string
  success?: boolean
}

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Invalid email or password." }
  }

  const { email, password } = parsed.data

  let user
  try {
    user = await prisma.adminUser.findUnique({ where: { email } })
  } catch {
    return { error: "Database connection error. Check your DATABASE_URL." }
  }

  if (!user || !user.isActive) {
    return { error: "Invalid credentials." }
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return { error: "Invalid credentials." }
  }

  const token = await createSession({
    adminId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })

  await setSessionCookie(token)

  await writeAuditLog({
    adminUserId: user.id,
    action: "AUTH_LOGIN",
    targetType: "AdminUser",
    targetId: user.id,
  })

  redirect("/super-admin/dashboard")
}

export async function logoutAction(): Promise<void> {
  await deleteSession()
  redirect("/login")
}
