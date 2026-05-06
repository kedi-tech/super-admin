import { getRecentPayments } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

export async function RecentPayments() {
  const payments = await getRecentPayments()

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Recent Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {payments.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-400 text-center">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {p.customer.businessName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {p.type.replace("_", " ")} · {formatDate(p.paidAt ?? p.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {formatCurrency(p.amount, p.currency)}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
