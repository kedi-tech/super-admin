import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate, formatRelative } from "@/lib/format"
import type { Device } from "@/types"

export function CustomerDevicesTab({ devices }: { devices: Device[] }) {
  if (devices.length === 0) {
    return <p className="text-sm text-zinc-400 py-4">No activated devices.</p>
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {["Machine", "OS", "Fingerprint", "Status", "Activated", "Last Seen"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {devices.map((d) => (
            <tr key={d.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{d.machineName ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-zinc-500">{d.os ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400 max-w-[120px] truncate">{d.fingerprint}</td>
              <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(d.activatedAt)}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatRelative(d.lastSeenAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
