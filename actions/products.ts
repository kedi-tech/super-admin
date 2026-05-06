"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { writeAuditLog } from "@/lib/audit"

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: { packages: true },
      orderBy: { name: "asc" },
    })
  } catch {
    return []
  }
}

export async function getPackages() {
  try {
    return await prisma.package.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

const packageSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  billingCycle: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]),
  price: z.coerce.number().min(0),
  currency: z.string().default("GNF"),
  maxDevices: z.coerce.number().min(1),
  maxBranches: z.coerce.number().min(1),
  maxUsers: z.coerce.number().min(1),
})

export async function createPackageAction(_prev: { error?: string }, formData: FormData) {
  const parsed = packageSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }
  const session = await getSession()

  try {
    const pkg = await prisma.package.create({ data: { ...parsed.data, price: parsed.data.price * 100 } })
    await writeAuditLog({ adminUserId: session?.adminId, action: "PACKAGE_CREATE", targetType: "Package", targetId: pkg.id })
    revalidatePath("/super-admin/packages")
    return { error: undefined }
  } catch {
    return { error: "Failed to create package." }
  }
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.product.update({ where: { id }, data: { isActive } })
    revalidatePath("/super-admin/products")
  } catch { /* ignore */ }
}
