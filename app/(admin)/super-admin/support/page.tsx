export const dynamic = 'force-dynamic'

import Link from "next/link"
import { getTickets } from "@/actions/support"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatRelative } from "@/lib/format"

export default async function SupportPage() {
  const tickets = await getTickets()

  return (
    <div>
      <PageHeader title="Support Tickets" description={`${tickets.length} tickets`} />
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              {["Subject", "Customer", "Priority", "Status", "Assigned", "Notes", "Opened"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {tickets.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-400">No tickets.</td></tr>
            ) : tickets.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-3 font-medium max-w-[240px]">
                  <Link href={`/super-admin/support/${t.id}`} className="hover:underline truncate block">
                    {t.subject}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link href={`/super-admin/customers/${t.customerId}`} className="hover:underline text-zinc-600 dark:text-zinc-300">
                    {t.customer.businessName}
                  </Link>
                </td>
                <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-xs text-zinc-400">{t.assignee?.name ?? "Unassigned"}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{t.notes.length}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{formatRelative(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
