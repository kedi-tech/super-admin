"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { writeAuditLog } from "@/lib/audit"
import { getSession } from "@/lib/auth"

export async function getPayments() {
  try {
    return await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, subscription: true },
    })
  } catch {
    return []
  }
}

const paymentSchema = z.object({
  customerId: z.string().min(1),
  type: z.enum(["SUBSCRIPTION", "INSTALLATION", "SUPPORT", "ONE_TIME"]),
  amount: z.coerce.number().min(0),
  currency: z.string().default("GNF"),
  method: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CARD", "OTHER"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
  paidAt: z.string().optional(),
})

export async function createPaymentAction(_prev: { error?: string }, formData: FormData) {
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }
  const session = await getSession()

  try {
    const payment = await prisma.payment.create({
      data: {
        ...parsed.data,
        amount: parsed.data.amount * 100,
        paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : null,
        status: "PENDING",
      },
    })
    await writeAuditLog({ adminUserId: session?.adminId, action: "PAYMENT_CREATE", targetType: "Payment", targetId: payment.id })
    revalidatePath("/super-admin/payments")
    return { error: undefined }
  } catch {
    return { error: "Failed to record payment." }
  }
}

export async function verifyPaymentAction(id: string) {
  const session = await getSession()
  try {
    await prisma.payment.update({
      where: { id },
      data: { status: "VERIFIED", verifiedBy: session?.adminId, paidAt: new Date() },
    })
    await writeAuditLog({ adminUserId: session?.adminId, action: "PAYMENT_VERIFY", targetType: "Payment", targetId: id })
    revalidatePath("/super-admin/payments")
  } catch { /* ignore */ }
}
