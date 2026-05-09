"use client"

import { useActionState, useEffect, useState } from "react"
import { updatePackageAction } from "@/actions/products"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Pencil } from "lucide-react"
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

const init = { error: undefined as string | undefined, savedAt: 0 }

export function EditPackageSheet({ pkg, products }: { pkg: PackageData; products: Product[] }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(updatePackageAction, init)

  useEffect(() => {
    if (state.savedAt > 0) setOpen(false)
  }, [state.savedAt])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 px-2 gap-1")}>
        <Pencil className="w-3 h-3" />Edit
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Edit Package</SheetTitle>
        </SheetHeader>
        <form action={action} className="mt-6 space-y-4">
          <input type="hidden" name="id" value={pkg.id} />
          <div className="space-y-1.5">
            <Label>Product *</Label>
            <select name="productId" required defaultValue={pkg.productId}
              className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Package Name *</Label>
            <Input name="name" required defaultValue={pkg.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Billing Cycle *</Label>
            <select name="billingCycle" required defaultValue={pkg.billingCycle}
              className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="LIFETIME">Lifetime</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price (GNF) *</Label>
              <Input name="price" type="number" min={0} required defaultValue={pkg.price / 100} />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input name="currency" defaultValue={pkg.currency} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Devices</Label>
              <Input name="maxDevices" type="number" min={1} defaultValue={pkg.maxDevices} />
            </div>
            <div className="space-y-1.5">
              <Label>Branches</Label>
              <Input name="maxBranches" type="number" min={1} defaultValue={pkg.maxBranches} />
            </div>
            <div className="space-y-1.5">
              <Label>Users</Label>
              <Input name="maxUsers" type="number" min={1} defaultValue={pkg.maxUsers} />
            </div>
          </div>
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
