import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status =
  | "ACTIVE" | "SUSPENDED" | "INACTIVE" | "REVOKED" | "EXPIRED"
  | "CANCELLED" | "PENDING" | "OPEN" | "IN_PROGRESS" | "RESOLVED"
  | "CLOSED" | "DEACTIVATED" | "BLOCKED" | "VERIFIED" | "FAILED"
  | "REFUNDED" | "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  | string

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  VERIFIED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  SUSPENDED: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  OPEN: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  EXPIRED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  INACTIVE: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  CLOSED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  DEACTIVATED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  CANCELLED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  REVOKED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  BLOCKED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  FAILED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  REFUNDED: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  LOW: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  HIGH: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  URGENT: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
}

interface StatusBadgeProps {
  status: Status
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200"
  const displayLabel = label ?? status.replace(/_/g, " ")

  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium px-2 py-0.5 border", style)}
    >
      {displayLabel}
    </Badge>
  )
}
