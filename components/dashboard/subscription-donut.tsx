"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DonutData {
  name: string
  value: number
  color: string
}

export function SubscriptionDonut({ data }: { data: DonutData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Customers by Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="space-y-1.5 mt-2">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-zinc-500 dark:text-zinc-400">{d.name}</span>
              </span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {d.value}{" "}
                <span className="text-zinc-400">({total ? Math.round((d.value / total) * 100) : 0}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
