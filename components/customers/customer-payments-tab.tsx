import { StatusBadge } from "@/components/shared/status-badge"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Payment } from "@/types"

export function CustomerPaymentsTab({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return <p className="text-sm text-zinc-400 py-4">No payments recorded.</p>
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {["Type", "Amount", "Method", "Reference", "Status", "Date"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {payments.map((p) => (
            <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3 text-xs text-zinc-500">{p.type.replace("_", " ")}</td>
              <td className="px-4 py-3 font-semibold text-zinc-800 dark:text-zinc-200">
                {formatCurrency(p.amount, p.currency)}
              </td>
              <td className="px-4 py-3 text-xs text-zinc-500">{p.method.replace("_", " ")}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">{p.reference || "—"}</td>
              <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(p.paidAt ?? p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
