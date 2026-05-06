export const dynamic = 'force-dynamic'

import { getInstallations } from "@/actions/installations"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate } from "@/lib/format"
import Link from "next/link"

export default async function InstallationsPage() {
  const installations = await getInstallations()

  return (
    <div>
      <PageHeader title="Installations" description={`${installations.length} installations tracked`} />
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              {["Customer", "Branches", "Machines", "Support", "Maintenance", "Next Maintenance", "Installed", "By"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {installations.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-zinc-400">No installations yet.</td></tr>
            ) : installations.map((i) => (
              <tr key={i.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/super-admin/customers/${i.customerId}`} className="hover:underline">
                    {i.customer.businessName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-500">{i.branches}</td>
                <td className="px-4 py-3 text-zinc-500">{i.machines}</td>
                <td className="px-4 py-3"><StatusBadge status={i.supportStatus} /></td>
                <td className="px-4 py-3"><StatusBadge status={i.maintenanceStatus} /></td>
                <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(i.nextMaintenanceDate)}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(i.installedAt)}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{i.installer?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
