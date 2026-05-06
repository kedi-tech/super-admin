import Link from "next/link"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatRelative } from "@/lib/format"
import type { SupportTicket } from "@/types"

export function CustomerTicketsTab({ tickets }: { tickets: SupportTicket[] }) {
  if (tickets.length === 0) {
    return <p className="text-sm text-zinc-400 py-4">No support tickets.</p>
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {["Subject", "Priority", "Status", "Opened"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                <Link href={`/super-admin/support/${t.id}`} className="hover:underline">
                  {t.subject}
                </Link>
              </td>
              <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
              <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatRelative(t.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
