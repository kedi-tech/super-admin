export const dynamic = 'force-dynamic'

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { getDashboardStats } from "@/actions/dashboard"
import { formatCurrency } from "@/lib/format"
import { BarChart3, TrendingDown, TrendingUp, Users } from "lucide-react"

export default async function AnalyticsPage() {
  const stats = await getDashboardStats()
  const arr = stats.mrr * 12

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Revenue, growth, and churn metrics" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="MRR" value={formatCurrency(stats.mrr)} icon={BarChart3} accent="purple" />
        <StatCard title="ARR" value={formatCurrency(arr)} icon={TrendingUp} accent="emerald" />
        <StatCard title="Active Customers" value={stats.totalCustomers} icon={Users} accent="blue" />
        <StatCard title="Active Devices" value={stats.activeDevices} icon={TrendingDown} accent="amber" />
      </div>

      <AnalyticsCharts stats={stats} />
    </div>
  )
}
