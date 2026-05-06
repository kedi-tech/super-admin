"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/format"
import { setCustomerStatusAction } from "@/actions/customers"
import type { CustomerWithCounts } from "@/types"
import { MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
  customers: CustomerWithCounts[]
}

export function CustomerTableClient({ customers }: Props) {
  const columns: ColumnDef<CustomerWithCounts>[] = [
    {
      accessorKey: "businessName",
      header: "Business",
      cell: ({ row }) => (
        <div>
          <Link
            href={`/super-admin/customers/${row.original.id}`}
            className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            {row.original.businessName}
          </Link>
          <p className="text-xs text-zinc-400 mt-0.5">{row.original.contactName}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="text-xs text-zinc-500 space-y-0.5">
          <p>{row.original.email || "—"}</p>
          <p>{row.original.phone || ""}</p>
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => <span className="text-sm">{row.original.country || "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "counts",
      header: "Licenses / Subs",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-500">
          {row.original._count.licenses} / {row.original._count.subscriptions}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <span className="text-sm text-zinc-400">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-1">
            <Link href={`/super-admin/customers/${c.id}`}>
              <Button variant="ghost" size="icon" className="w-7 h-7">
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-7 h-7")}>
                <MoreHorizontal className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-sm">
                {c.status !== "ACTIVE" && (
                  <DropdownMenuItem onClick={() => setCustomerStatusAction(c.id, "ACTIVE")}>
                    Activate
                  </DropdownMenuItem>
                )}
                {c.status !== "SUSPENDED" && (
                  <DropdownMenuItem onClick={() => setCustomerStatusAction(c.id, "SUSPENDED")}>
                    Suspend
                  </DropdownMenuItem>
                )}
                {c.status !== "INACTIVE" && (
                  <DropdownMenuItem
                    onClick={() => setCustomerStatusAction(c.id, "INACTIVE")}
                    className="text-red-500"
                  >
                    Deactivate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={customers} />
}
