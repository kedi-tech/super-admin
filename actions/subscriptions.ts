"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { writeAuditLog } from "@/lib/audit"
import { getSession } from "@/lib/auth"
import type { SubscriptionStatus } from "@/types"

export async function getSubscriptions() {
  try {
    return await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, package: true, license: true },
    })
  } catch {
    return []
  }
}

const subSchema = z.object({
  customerId: z.string().min(1),
  packageId: z.string().optional(),
  billingCycle: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]),
  amount: z.coerce.number().min(0),
  currency: z.string().default("GNF"),
  startDate: z.string(),
  renewalDate: z.string().optional(),
  gracePeriodDays: z.coerce.number().default(7),
  autoRenew: z.coerce.boolean().default(false),
})

export async function createSubscriptionAction(_prev: { error?: string }, formData: FormData) {
  const parsed = subSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }
  const session = await getSession()

  try {
    const sub = await prisma.subscription.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        renewalDate: parsed.data.renewalDate ? new Date(parsed.data.renewalDate) : null,
        amount: parsed.data.amount * 100, // convert to cents
        status: "ACTIVE",
      },
    })
    await writeAuditLog({ adminUserId: session?.adminId, action: "SUBSCRIPTION_CREATE", targetType: "Subscription", targetId: sub.id })
    revalidatePath("/super-admin/subscriptions")
    return { error: undefined }
  } catch {
    return { error: "Failed to create subscription." }
  }
}

export async function setSubscriptionStatusAction(id: string, status: SubscriptionStatus) {
  const session = await getSession()
  try {
    await prisma.subscription.update({ where: { id }, data: { status } })
    await writeAuditLog({ adminUserId: session?.adminId, action: `SUBSCRIPTION_${status}`, targetType: "Subscription", targetId: id })
    revalidatePath("/super-admin/subscriptions")
  } catch { /* ignore */ }
}
