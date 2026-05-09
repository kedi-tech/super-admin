import { getRecentTickets } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatRelative } from "@/lib/format"

export async function RecentTickets() {
  const tickets = await getRecentTickets()

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Open Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tickets.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-400 text-center">No open tickets.</p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {tickets.map((t: (typeof tickets)[number]) => (
              <li key={t.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {t.subject}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {t.customer.businessName} · {formatRelative(t.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
