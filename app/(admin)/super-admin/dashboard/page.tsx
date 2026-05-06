export const dynamic = 'force-dynamic'

import {
  BarChart3,
  Building2,
  CreditCard,
  FileKey2,
  HardDrive,
  LifeBuoy,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { PageHeader } from "@/components/shared/page-header"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { SubscriptionDonut } from "@/components/dashboard/subscription-donut"
import { RecentPayments } from "@/components/dashboard/recent-payments"
import { RecentTickets } from "@/components/dashboard/recent-tickets"
import { getDashboardStats } from "@/actions/dashboard"
import { formatCurrency } from "@/lib/format"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="KediTech ecosystem overview" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Building2}
          accent="blue"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          title="Expired"
          value={stats.expiredSubscriptions}
          icon={ShieldAlert}
          accent="amber"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={CreditCard}
          accent="emerald"
        />
        <StatCard
          title="MRR"
          value={formatCurrency(stats.mrr)}
          icon={BarChart3}
          accent="purple"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Active Licenses" value={stats.activeLicenses} icon={FileKey2} />
        <StatCard title="Active Devices" value={stats.activeDevices} icon={HardDrive} />
        <StatCard title="Open Tickets" value={stats.openTickets} icon={LifeBuoy} accent="amber" />
        <StatCard title="Failed Validations (7d)" value={stats.failedValidations} accent="red" icon={ShieldAlert} />
        <StatCard title="Pending Renewals" value={stats.pendingRenewals} icon={Users} accent="amber" />
      </div>

      {/* Customer type breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Cloud" value={stats.cloudCustomers} sub="customers" />
        <StatCard title="Hybrid" value={stats.hybridCustomers} sub="customers" />
        <StatCard title="Offline" value={stats.offlineCustomers} sub="customers" />
        <StatCard title="E-Commerce" value={stats.ecommerceCustomers} sub="customers" />
        <StatCard title="Commerce Suite" value={stats.commerceSuiteCustomers} sub="customers" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <SubscriptionDonut
            data={[
              { name: "Cloud", value: stats.cloudCustomers, color: "#3b82f6" },
              { name: "Hybrid", value: stats.hybridCustomers, color: "#8b5cf6" },
              { name: "Offline", value: stats.offlineCustomers, color: "#f59e0b" },
              { name: "E-Commerce", value: stats.ecommerceCustomers, color: "#10b981" },
              { name: "Commerce Suite", value: stats.commerceSuiteCustomers, color: "#ec4899" },
            ]}
          />
        </div>
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentPayments />
        <RecentTickets />
      </div>
    </div>
  )
}
