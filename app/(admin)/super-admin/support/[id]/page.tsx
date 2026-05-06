export const dynamic = 'force-dynamic'

import { notFound } from "next/navigation"
import { getTicket } from "@/actions/support"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketNoteThread } from "@/components/support/ticket-note-thread"
import { TicketActions } from "@/components/support/ticket-actions"
import { formatDate } from "@/lib/format"
import Link from "next/link"

interface Props { params: Promise<{ id: string }> }

export default async function TicketDetailPage({ params }: Props) {
  const { id } = await params
  const ticket = await getTicket(id)
  if (!ticket) notFound()

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader
        title={ticket.subject}
        description={ticket.customer.businessName}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.priority} />
            <StatusBadge status={ticket.status} />
            <TicketActions ticket={ticket} />
          </div>
        }
      />

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardContent className="pt-5 space-y-3 text-sm">
          {ticket.description && (
            <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{ticket.description}</p>
          )}
          <div className="flex gap-6 text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span>Customer: <Link href={`/super-admin/customers/${ticket.customerId}`} className="text-zinc-600 dark:text-zinc-300 hover:underline">{ticket.customer.businessName}</Link></span>
            <span>Opened: {formatDate(ticket.createdAt)}</span>
            {ticket.assignee && <span>Assigned to: {ticket.assignee.name}</span>}
          </div>
        </CardContent>
      </Card>

      <TicketNoteThread notes={ticket.notes} ticketId={id} />
    </div>
  )
}
