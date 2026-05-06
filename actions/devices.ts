"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { writeAuditLog } from "@/lib/audit"
import { getSession } from "@/lib/auth"
import type { DeviceStatus } from "@/types"

export async function getDevices() {
  try {
    return await prisma.device.findMany({
      orderBy: { activatedAt: "desc" },
      include: { customer: true, license: true },
    })
  } catch {
    return []
  }
}

export async function setDeviceStatusAction(id: string, status: DeviceStatus) {
  const session = await getSession()
  try {
    await prisma.device.update({
      where: { id },
      data: { status, deactivatedAt: status !== "ACTIVE" ? new Date() : null, deactivatedBy: session?.adminId },
    })
    await writeAuditLog({ adminUserId: session?.adminId, action: `DEVICE_${status}`, targetType: "Device", targetId: id })
    revalidatePath("/super-admin/devices")
  } catch { /* ignore */ }
}
