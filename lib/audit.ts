import { prisma } from "./prisma"

interface AuditOptions {
  adminUserId?: string
  action: string
  targetType?: string
  targetId?: string
  payload?: object
  ipAddress?: string
}

export async function writeAuditLog(opts: AuditOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        adminUserId: opts.adminUserId,
        action: opts.action,
        targetType: opts.targetType,
        targetId: opts.targetId,
        payload: opts.payload,
        ipAddress: opts.ipAddress,
      },
    })
  } catch {
    // Audit logging should never crash the main flow
    console.error("[audit] Failed to write audit log:", opts.action)
  }
}
