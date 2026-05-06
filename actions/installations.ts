"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { writeAuditLog } from "@/lib/audit"
import { getSession } from "@/lib/auth"

export async function getInstallations() {
  try {
    return await prisma.installation.findMany({
      orderBy: { installedAt: "desc" },
      include: { customer: true, installer: true },
    })
  } catch {
    return []
  }
}

const installSchema = z.object({
  customerId: z.string().min(1),
  installedAt: z.string(),
  branches: z.coerce.number().min(1),
  machines: z.coerce.number().min(1),
  supportStatus: z.enum(["ACTIVE", "EXPIRED", "NONE"]).default("NONE"),
  maintenanceStatus: z.enum(["ACTIVE", "EXPIRED", "NONE"]).default("NONE"),
  nextMaintenanceDate: z.string().optional(),
  notes: z.string().optional(),
})

export async function createInstallationAction(_prev: { error?: string }, formData: FormData) {
  const parsed = installSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }
  const session = await getSession()

  try {
    const inst = await prisma.installation.create({
      data: {
        ...parsed.data,
        installedAt: new Date(parsed.data.installedAt),
        nextMaintenanceDate: parsed.data.nextMaintenanceDate ? new Date(parsed.data.nextMaintenanceDate) : null,
        installedBy: session?.adminId,
      },
    })
    await writeAuditLog({ adminUserId: session?.adminId, action: "INSTALLATION_CREATE", targetType: "Installation", targetId: inst.id })
    revalidatePath("/super-admin/installations")
    return { error: undefined }
  } catch {
    return { error: "Failed to create installation." }
  }
}
