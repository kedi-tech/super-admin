"use client"

import { useEffect, useState, useTransition } from "react"
import { getProducts, toggleProductActiveAction } from "@/actions/products"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/components/shared/status-badge"

type Product = Awaited<ReturnType<typeof getProducts>>[0]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => { getProducts().then(setProducts) }, [isPending])

  return (
    <div>
      <PageHeader title="Products" description="KediTech product catalog" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="border-zinc-200 dark:border-zinc-800 shadow-none">
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{p.slug}</p>
                </div>
                <Switch
                  checked={p.isActive}
                  onCheckedChange={(v) => startTransition(() => toggleProductActiveAction(p.id, v))}
                />
              </div>
              {p.description && <p className="text-sm text-zinc-500">{p.description}</p>}
              <p className="text-xs text-zinc-400">{p.packages.length} packages</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
