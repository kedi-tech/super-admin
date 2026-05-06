"use client"

import { useActionState, useState } from "react"
import { createPackageAction } from "@/actions/products"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import type { Product } from "@/types"

const init = { error: undefined as string | undefined }

export function CreatePackageSheet({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(createPackageAction, init)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
        <Plus className="w-3.5 h-3.5" />New Package
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Create Package</SheetTitle>
        </SheetHeader>
        <form action={action} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Product *</Label>
            <select name="productId" required className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              <option value="">Select product…</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Package Name *</Label>
            <Input name="name" required placeholder="Starter Monthly" />
          </div>
          <div className="space-y-1.5">
            <Label>Billing Cycle *</Label>
            <select name="billingCycle" required className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm">
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="LIFETIME">Lifetime</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price (GNF) *</Label>
              <Input name="price" type="number" min={0} required placeholder="500000" />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input name="currency" defaultValue="GNF" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Devices</Label>
              <Input name="maxDevices" type="number" defaultValue={1} min={1} />
            </div>
            <div className="space-y-1.5">
              <Label>Branches</Label>
              <Input name="maxBranches" type="number" defaultValue={1} min={1} />
            </div>
            <div className="space-y-1.5">
              <Label>Users</Label>
              <Input name="maxUsers" type="number" defaultValue={5} min={1} />
            </div>
          </div>
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating…" : "Create Package"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
