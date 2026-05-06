import { StatusBadge } from "@/components/shared/status-badge"
import { formatDate, formatRelative } from "@/lib/format"
import type { AdminRole } from "@/types"

interface AdminUserRow {
  id: string
  name: string
  email: string
  role: AdminRole
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
}

export function AdminUsersTab({ users }: { users: AdminUserRow[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {["Name", "Email", "Role", "Status", "Last Login", "Created"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{u.name}</td>
              <td className="px-4 py-3 text-xs text-zinc-500">{u.email}</td>
              <td className="px-4 py-3">
                <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-300">
                  {u.role.replace("_", " ")}
                </span>
              </td>
              <td className="px-4 py-3"><StatusBadge status={u.isActive ? "ACTIVE" : "INACTIVE"} /></td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatRelative(u.lastLoginAt)}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{formatDate(u.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
