import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  sub?: string
  icon?: LucideIcon
  trend?: { value: number; label: string }
  accent?: "default" | "emerald" | "amber" | "red" | "blue" | "purple"
}

const accentMap = {
  default: "text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
  emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
  amber: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
  red: "text-red-500 bg-red-50 dark:bg-red-950/40",
  blue: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
  purple: "text-purple-500 bg-purple-50 dark:bg-purple-950/40",
}

export function StatCard({ title, value, sub, icon: Icon, accent = "default" }: StatCardProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
              {value}
            </p>
            {sub && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>
            )}
          </div>
          {Icon && (
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", accentMap[accent])}>
              <Icon className="w-4.5 h-4.5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
