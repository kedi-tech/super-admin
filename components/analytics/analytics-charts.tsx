"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRevenueChartData } from "@/actions/dashboard"
import type { DashboardStats } from "@/types"

export function AnalyticsCharts({ stats }: { stats: DashboardStats }) {
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([])

  useEffect(() => {
    getRevenueChartData().then(setRevenueData)
  }, [])

  const productData = [
    { name: "Cloud POS", value: stats.cloudCustomers, color: "#3b82f6" },
    { name: "Hybrid POS", value: stats.hybridCustomers, color: "#8b5cf6" },
    { name: "Offline POS", value: stats.offlineCustomers, color: "#f59e0b" },
    { name: "E-Commerce", value: stats.ecommerceCustomers, color: "#10b981" },
    { name: "Commerce Suite", value: stats.commerceSuiteCustomers, color: "#ec4899" },
  ]

  const subscriptionData = [
    { name: "Active", value: stats.activeSubscriptions, color: "#10b981" },
    { name: "Expired", value: stats.expiredSubscriptions, color: "#6b7280" },
    { name: "Pending Renewal", value: stats.pendingRenewals, color: "#f59e0b" },
  ]

  return (
    <div className="space-y-4">
      {/* Revenue chart */}
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Revenue — Last 12 Months</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="anaRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,120,0.12)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v) => [Number(v).toLocaleString() + " GNF", "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#anaRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product breakdown */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Customers by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,120,0.12)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {productData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription status */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Subscription Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={subscriptionData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {subscriptionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2 flex-1">
              {subscriptionData.map((d) => (
                <li key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-zinc-500">{d.name}</span>
                  </span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{d.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
