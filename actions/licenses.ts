"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { writeAuditLog } from "@/lib/audit"
import { getSession } from "@/lib/auth"
import { generateLicenseKey, signOfflineLicense, type OfflineLicensePayload } from "@/lib/license"
import type { LicenseStatus, LicenseType } from "@/types"

export async function getLicenses() {
  try {
    return await prisma.license.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, package: true },
    })
  } catch {
    return []
  }
}

export async function getLicense(id: string) {
  try {
    return await prisma.license.findUnique({
      where: { id },
      include: {
        customer: true,
        package: true,
        devices: { orderBy: { activatedAt: "desc" } },
        validationLogs: { orderBy: { validatedAt: "desc" }, take: 50 },
        subscription: true,
      },
    })
  } catch {
    return null
  }
}

const generateSchema = z.object({
  customerId: z.string().min(1),
  packageId: z.string().optional(),
  type: z.string().min(1),
  maxDevices: z.coerce.number().min(1),
  maxBranches: z.coerce.number().min(1),
  maxUsers: z.coerce.number().min(1),
  expiresAt: z.string().optional(),
  gracePeriodDays: z.coerce.number().min(0).default(7),
})

export async function generateLicenseAction(_prev: { error?: string }, formData: FormData) {
  const session = await getSession()
  const parsed = generateSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }

  const { customerId, packageId, type, maxDevices, maxBranches, maxUsers, expiresAt, gracePeriodDays } = parsed.data
  const key = generateLicenseKey()

  try {
    const license = await prisma.license.create({
      data: {
        key,
        customerId,
        packageId: packageId || null,
        type: type as LicenseType,
        maxDevices,
        maxBranches,
        maxUsers,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        gracePeriodDays,
        createdBy: session?.adminId,
      },
    })

    await writeAuditLog({
      adminUserId: session?.adminId,
      action: "LICENSE_GENERATE",
      targetType: "License",
      targetId: license.id,
      payload: { key, type, customerId },
    })

    revalidatePath("/super-admin/licenses")
    return { error: undefined, licenseId: license.id, key }
  } catch {
    return { error: "Failed to generate license." }
  }
}

export async function setLicenseStatusAction(id: string, status: LicenseStatus) {
  const session = await getSession()
  try {
    await prisma.license.update({ where: { id }, data: { status } })
    await writeAuditLog({
      adminUserId: session?.adminId,
      action: `LICENSE_${status}`,
      targetType: "License",
      targetId: id,
    })
    revalidatePath("/super-admin/licenses")
    revalidatePath(`/super-admin/licenses/${id}`)
  } catch {
    // ignore
  }
}

export async function resetLicenseActivationsAction(id: string) {
  const session = await getSession()
  try {
    await prisma.device.updateMany({
      where: { licenseId: id },
      data: { status: "DEACTIVATED", deactivatedAt: new Date(), deactivatedBy: session?.adminId },
    })
    await writeAuditLog({
      adminUserId: session?.adminId,
      action: "LICENSE_RESET_ACTIVATIONS",
      targetType: "License",
      targetId: id,
    })
    revalidatePath(`/super-admin/licenses/${id}`)
  } catch {
    // ignore
  }
}

export async function deactivateDeviceAction(deviceId: string, licenseId: string) {
  const session = await getSession()
  try {
    await prisma.device.update({
      where: { id: deviceId },
      data: { status: "DEACTIVATED", deactivatedAt: new Date(), deactivatedBy: session?.adminId },
    })
    await writeAuditLog({ adminUserId: session?.adminId, action: "DEVICE_DEACTIVATED", targetType: "Device", targetId: deviceId })
    revalidatePath(`/super-admin/licenses/${licenseId}`)
  } catch { /* ignore */ }
}

export async function generateOfflineLicenseFileAction(licenseId: string) {
  const session = await getSession()
  try {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { customer: true },
    })
    if (!license) return { error: "License not found." }
    if (!license.type.startsWith("OFFLINE")) return { error: "Only OFFLINE licenses can have offline files." }

    const privateKeyPem = process.env.LICENSE_PRIVATE_KEY
    if (!privateKeyPem) return { error: "LICENSE_PRIVATE_KEY not configured." }

    const payload: OfflineLicensePayload = {
      licenseKey: license.key,
      customerId: license.customerId,
      businessName: license.customer.businessName,
      productType: license.type,
      issuedAt: new Date().toISOString(),
      expiresAt: license.expiresAt?.toISOString() ?? null,
      maxDevices: license.maxDevices,
      maxBranches: license.maxBranches,
      maxUsers: license.maxUsers,
      gracePeriodDays: license.gracePeriodDays,
      offlineGraceRules: { validateEveryDays: 30, maxOfflineDays: 30 },
    }

    const signature = await signOfflineLicense(payload, privateKeyPem)

    await prisma.license.update({
      where: { id: licenseId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { offlineLicensePayload: payload as any, offlineLicenseSignature: signature },
    })

    await writeAuditLog({
      adminUserId: session?.adminId,
      action: "LICENSE_OFFLINE_FILE_GENERATED",
      targetType: "License",
      targetId: licenseId,
    })

    revalidatePath(`/super-admin/licenses/${licenseId}`)
    return { error: undefined, signature, payload }
  } catch (e) {
    return { error: "Failed to generate offline license file." }
  }
}
