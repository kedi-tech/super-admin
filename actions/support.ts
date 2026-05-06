"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { writeAuditLog } from "@/lib/audit"
import { getSession } from "@/lib/auth"
import type { TicketStatus, TicketPriority } from "@/types"

export async function getTickets() {
  try {
    return await prisma.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, assignee: true, notes: true },
    })
  } catch {
    return []
  }
}

export async function getTicket(id: string) {
  try {
    return await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        customer: true,
        assignee: true,
        notes: { include: { author: true }, orderBy: { createdAt: "asc" } },
      },
    })
  } catch {
    return null
  }
}

const ticketSchema = z.object({
  customerId: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
})

export async function createTicketAction(_prev: { error?: string }, formData: FormData) {
  const parsed = ticketSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid data." }
  const session = await getSession()

  try {
    const ticket = await prisma.supportTicket.create({ data: { ...parsed.data, status: "OPEN" } })
    await writeAuditLog({ adminUserId: session?.adminId, action: "TICKET_CREATE", targetType: "SupportTicket", targetId: ticket.id })
    revalidatePath("/super-admin/support")
    return { error: undefined, ticketId: ticket.id }
  } catch {
    return { error: "Failed to create ticket." }
  }
}

export async function setTicketStatusAction(id: string, status: TicketStatus) {
  const session = await getSession()
  try {
    await prisma.supportTicket.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : undefined,
        closedAt: status === "CLOSED" ? new Date() : undefined,
      },
    })
    await writeAuditLog({ adminUserId: session?.adminId, action: `TICKET_${status}`, targetType: "SupportTicket", targetId: id })
    revalidatePath("/super-admin/support")
    revalidatePath(`/super-admin/support/${id}`)
  } catch { /* ignore */ }
}

export async function addTicketNoteAction(ticketId: string, body: string, isInternal = true) {
  const session = await getSession()
  if (!session?.adminId) return
  try {
    await prisma.ticketNote.create({
      data: { ticketId, authorId: session.adminId, body, isInternal },
    })
    revalidatePath(`/super-admin/support/${ticketId}`)
  } catch { /* ignore */ }
}
