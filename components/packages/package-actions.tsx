"use client"

import { useTransition } from "react"
import { togglePackageActiveAction, deletePackageAction } from "@/actions/products"
import { EditPackageSheet } from "./edit-package-sheet"
import type { Product } from "@/types"

type PackageData = {
  id: string
  productId: string
  name: string
  billingCycle: string
  price: number
  currency: string
  maxDevices: number
  maxBranches: number
  maxUsers: number
  isActive: boolean
}

export function PackageActions({ pkg, products }: { pkg: PackageData; products: Product[] }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-1">
      <EditPackageSheet pkg={pkg} products={products} />
      <button
        disabled={isPending}
        onClick={() => startTransition(() => togglePackageActiveAction(pkg.id, !pkg.isActive))}
        className="h-7 px-2 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
      >
        {pkg.isActive ? "Deactivate" : "Activate"}
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm(`Delete "${pkg.name}"? This cannot be undone.`)) return
          startTransition(async () => {
            const result = await deletePackageAction(pkg.id)
            if (result?.error) alert(result.error)
          })
        }}
        className="h-7 px-2 rounded-md text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  )
}
