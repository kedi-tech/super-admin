"use client"

import { useEffect, useState, useTransition } from "react"
import { getPayments, verifyPaymentAction } from "@/actions/payments"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/format"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

type Payment = Awaited<ReturnType<typeof getPayments>>[0]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getPayments().then(setPayments)
  }, [isPending])

  const columns: ColumnDef<Payment>[] = [
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
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="text-xs text-zinc-500">{row.original.type.replace("_", " ")}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.amount, row.original.currency)}</span>,
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => <span className="text-xs text-zinc-500">{row.original.method.replace("_", " ")}</span>,
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => <span className="font-mono text-xs text-zinc-400">{row.original.reference ?? "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "paidAt",
      header: "Date",
      cell: ({ row }) => <span className="text-xs text-zinc-400">{formatDate(row.original.paidAt ?? row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const p = row.original
        if (p.status !== "PENDING") return null
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => startTransition(() => verifyPaymentAction(p.id))}
          >
            Verify
          </Button>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader title="Payments" description={`${payments.length} payments`} />
      <DataTable columns={columns} data={payments} />
    </div>
  )
}
