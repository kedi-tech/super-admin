"use client"

import { useEffect, useState, useTransition } from "react"
import { getDevices, setDeviceStatusAction } from "@/actions/devices"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { formatDate, formatRelative } from "@/lib/format"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"

type Device = Awaited<ReturnType<typeof getDevices>>[0]

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => { getDevices().then(setDevices) }, [isPending])

  const columns: ColumnDef<Device>[] = [
    {
      accessorKey: "machineName",
      header: "Machine",
      cell: ({ row }) => <span className="font-medium text-sm">{row.original.machineName ?? "Unknown"}</span>,
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
      accessorKey: "os",
      header: "OS",
      cell: ({ row }) => <span className="text-xs text-zinc-500">{row.original.os ?? "—"}</span>,
    },
    {
      accessorKey: "fingerprint",
      header: "Fingerprint",
      cell: ({ row }) => <span className="font-mono text-xs text-zinc-400 truncate max-w-[100px] block">{row.original.fingerprint}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "activatedAt",
      header: "Activated",
      cell: ({ row }) => <span className="text-xs text-zinc-400">{formatDate(row.original.activatedAt)}</span>,
    },
    {
      accessorKey: "lastSeenAt",
      header: "Last Seen",
      cell: ({ row }) => <span className="text-xs text-zinc-400">{formatRelative(row.original.lastSeenAt)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const d = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "w-7 h-7")}>
              <MoreHorizontal className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {d.status !== "DEACTIVATED" && (
                <DropdownMenuItem onClick={() => startTransition(() => setDeviceStatusAction(d.id, "DEACTIVATED"))}>
                  Deactivate
                </DropdownMenuItem>
              )}
              {d.status !== "ACTIVE" && (
                <DropdownMenuItem onClick={() => startTransition(() => setDeviceStatusAction(d.id, "ACTIVE"))}>
                  Reactivate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => startTransition(() => setDeviceStatusAction(d.id, "BLOCKED"))}
              >
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader title="Devices" description={`${devices.length} activated devices`} />
      <DataTable columns={columns} data={devices} />
    </div>
  )
}
