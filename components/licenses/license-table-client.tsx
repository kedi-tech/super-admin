"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDate, formatLicenseType } from "@/lib/format"
import { setLicenseStatusAction } from "@/actions/licenses"
import type { Customer, License, Package } from "@/types"
import { Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type LicenseRow = License & { customer: Customer; package: Package | null }

export function LicenseTableClient({ licenses }: { licenses: LicenseRow[] }) {
  const columns: ColumnDef<LicenseRow>[] = [
    {
      accessorKey: "key",
      header: "License Key",
      cell: ({ row }) => (
        <Link href={`/super-admin/licenses/${row.original.id}`} className="font-mono text-xs text-zinc-700 dark:text-zinc-300 hover:underline">
          {row.original.key}
        </Link>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <Link href={`/super-admin/customers/${row.original.customerId}`} className="text-sm hover:underline">
          {row.original.customer.businessName}
        </Link>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="text-xs text-zinc-500">{formatLicenseType(row.original.type)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "limits",
      header: "Devices / Branches",
      cell: ({ row }) => (
        <span className="text-xs text-zinc-500">{row.original.maxDevices} / {row.original.maxBranches}</span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => <span className="text-xs text-zinc-400">{formatDate(row.original.expiresAt)}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <span className="text-xs text-zinc-400">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const l = row.original
        return (
          <div className="flex items-center gap-1">
            <Link href={`/super-admin/licenses/${l.id}`}>
              <Button variant="ghost" size="icon" className="w-7 h-7">
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-7 h-7")}>
                <MoreHorizontal className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {l.status !== "ACTIVE" && (
                  <DropdownMenuItem onClick={() => setLicenseStatusAction(l.id, "ACTIVE")}>Activate</DropdownMenuItem>
                )}
                {l.status !== "SUSPENDED" && (
                  <DropdownMenuItem onClick={() => setLicenseStatusAction(l.id, "SUSPENDED")}>Suspend</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => setLicenseStatusAction(l.id, "REVOKED")}
                >
                  Revoke
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={licenses} />
}
