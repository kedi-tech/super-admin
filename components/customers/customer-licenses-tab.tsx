import Link from "next/link"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate, formatLicenseType } from "@/lib/format"
import type { License, Package } from "@/types"

type LicenseWithPackage = License & { package: Package | null }

export function CustomerLicensesTab({
  licenses,
  customerId,
}: {
  licenses: LicenseWithPackage[]
  customerId: string
}) {
  if (licenses.length === 0) {
    return <p className="text-sm text-zinc-400 py-4">No licenses yet.</p>
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {["License Key", "Type", "Status", "Devices", "Expires", "Created"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {licenses.map((l) => (
            <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3">
                <Link
                  href={`/super-admin/licenses/${l.id}`}
                  className="font-mono text-xs text-zinc-700 dark:text-zinc-300 hover:underline"
                >
                  {l.key}
                </Link>
              </td>
              <td className="px-4 py-3 text-xs text-zinc-500">{formatLicenseType(l.type)}</td>
              <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
              <td className="px-4 py-3 text-xs text-zinc-500">{l.maxDevices}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(l.expiresAt)}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(l.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
