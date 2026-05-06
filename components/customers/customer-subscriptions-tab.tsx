import { StatusBadge } from "@/components/shared/status-badge"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Package, Subscription } from "@/types"

type SubWithPackage = Subscription & { package: Package | null }

export function CustomerSubscriptionsTab({ subscriptions }: { subscriptions: SubWithPackage[] }) {
  if (subscriptions.length === 0) {
    return <p className="text-sm text-zinc-400 py-4">No subscriptions yet.</p>
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {["Package", "Billing", "Amount", "Status", "Start", "Renewal"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {subscriptions.map((s) => (
            <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                {s.package?.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-xs text-zinc-500">{s.billingCycle}</td>
              <td className="px-4 py-3 text-sm font-medium">{formatCurrency(s.amount, s.currency)}</td>
              <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(s.startDate)}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(s.renewalDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
