"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { writeAuditLog } from "@/lib/audit"
import { getSession } from "@/lib/auth"

const customerSchema = z.object({
  businessName: z.string().min(1),
  contactName: z.string().min(1),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  country: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export async function getCustomers() {
  try {
    return await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { licenses: true, subscriptions: true, devices: true, payments: true, tickets: true },
        },
      },
    })
  } catch {
    return []
  }
}

export async function getCustomer(id: string) {
  try {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        licenses: { include: { package: true }, orderBy: { createdAt: "desc" } },
        subscriptions: { include: { package: true }, orderBy: { createdAt: "desc" } },
        devices: { orderBy: { activatedAt: "desc" } },
        payments: { orderBy: { createdAt: "desc" } },
        tickets: { orderBy: { createdAt: "desc" } },
        installations: { orderBy: { installedAt: "desc" } },
        _count: {
          select: { licenses: true, subscriptions: true, devices: true, payments: true, tickets: true },
        },
      },
    })
  } catch {
    return null
  }
}

export async function createCustomerAction(_prev: { error?: string }, formData: FormData) {
  const session = await getSession()
  const parsed = customerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }

  try {
    const customer = await prisma.customer.create({ data: parsed.data })
    await writeAuditLog({
      adminUserId: session?.adminId,
      action: "CUSTOMER_CREATE",
      targetType: "Customer",
      targetId: customer.id,
      payload: parsed.data,
    })
    revalidatePath("/super-admin/customers")
    return { error: undefined, customerId: customer.id }
  } catch {
    return { error: "Failed to create customer." }
  }
}

export async function updateCustomerAction(id: string, _prev: { error?: string }, formData: FormData) {
  const session = await getSession()
  const parsed = customerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }

  try {
    await prisma.customer.update({ where: { id }, data: parsed.data })
    await writeAuditLog({
      adminUserId: session?.adminId,
      action: "CUSTOMER_UPDATE",
      targetType: "Customer",
      targetId: id,
      payload: parsed.data,
    })
    revalidatePath(`/super-admin/customers/${id}`)
    return { error: undefined }
  } catch {
    return { error: "Failed to update customer." }
  }
}

export async function setCustomerStatusAction(id: string, status: "ACTIVE" | "SUSPENDED" | "INACTIVE") {
  const session = await getSession()
  try {
    await prisma.customer.update({ where: { id }, data: { status } })
    await writeAuditLog({
      adminUserId: session?.adminId,
      action: `CUSTOMER_${status}`,
      targetType: "Customer",
      targetId: id,
    })
    revalidatePath("/super-admin/customers")
    revalidatePath(`/super-admin/customers/${id}`)
  } catch {
    // ignore
  }
}
