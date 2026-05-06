"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { getSubscriptions, setSubscriptionStatusAction } from "@/actions/subscriptions"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/format"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"

type Sub = Awaited<ReturnType<typeof getSubscriptions>>[0]

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => { getSubscriptions().then(setSubs) }, [isPending])

  const columns: ColumnDef<Sub>[] = [
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <Link href={`/super-admin/customers/${row.original.customerId}`} className="font-medium hover:underline text-sm">
          {row.original.customer.businessName}
        </Link>
      ),
    },
    {
      accessorKey: "package",
      header: "Package",
      cell: ({ row }) => <span className="text-sm text-zinc-600 dark:text-zinc-300">{row.original.package?.name ?? "—"}</span>,
    },
    {
      accessorKey: "billingCycle",
      header: "Billing",
      cell: ({ row }) => <span className="text-xs text-zinc-500">{row.original.billingCycle}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-semibold text-sm">{formatCurrency(row.original.amount, row.original.currency)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "startDate",
      header: "Start",
      cell: ({ row }) => <span className="text-xs text-zinc-400">{formatDate(row.original.startDate)}</span>,
    },
    {
      accessorKey: "renewalDate",
      header: "Renewal",
      cell: ({ row }) => <span className="text-xs text-zinc-400">{formatDate(row.original.renewalDate)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const s = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-7 h-7")}>
              <MoreHorizontal className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {s.status !== "ACTIVE" && (
                <DropdownMenuItem onClick={() => startTransition(() => setSubscriptionStatusAction(s.id, "ACTIVE"))}>Activate</DropdownMenuItem>
              )}
              {s.status !== "CANCELLED" && (
                <DropdownMenuItem className="text-red-500" onClick={() => startTransition(() => setSubscriptionStatusAction(s.id, "CANCELLED"))}>Cancel</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader title="Subscriptions" description={`${subs.length} subscriptions`} />
      <DataTable columns={columns} data={subs} />
    </div>
  )
}
