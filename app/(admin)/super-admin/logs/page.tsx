export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/page-header"
import { formatDateTime } from "@/lib/format"

async function getAuditLogs() {
  try {
    return await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { adminUser: { select: { name: true, email: true } } },
    })
  } catch {
    return []
  }
}

export default async function LogsPage() {
  const logs = await getAuditLogs()

  return (
    <div>
      <PageHeader title="Audit Logs" description={`Last ${logs.length} actions`} />
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              {["Admin", "Action", "Target", "Target ID", "IP", "When"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {logs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-400">No audit logs.</td></tr>
            ) : logs.map((log: (typeof logs)[number]) => (
              <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-2.5 text-xs text-zinc-600 dark:text-zinc-300">{log.adminUser?.name ?? "System"}</td>
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-zinc-400">{log.targetType ?? "—"}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-zinc-400 max-w-[100px] truncate">{log.targetId ?? "—"}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-zinc-400">{log.ipAddress ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs text-zinc-400">{formatDateTime(log.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
