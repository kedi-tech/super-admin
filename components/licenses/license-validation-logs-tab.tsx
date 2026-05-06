import { StatusBadge } from "@/components/shared/status-badge"
import { formatDateTime } from "@/lib/format"
import type { LicenseValidationLog } from "@prisma/client"

export function LicenseValidationLogsTab({ logs }: { logs: LicenseValidationLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-zinc-400 py-4">No validation logs yet.</p>
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {["Result", "IP Address", "Reason", "Validated At"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {logs.map((l) => (
            <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3">
                <StatusBadge status={l.success ? "ACTIVE" : "FAILED"} label={l.success ? "Success" : "Failed"} />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{l.ipAddress ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{l.failureReason ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDateTime(l.validatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
