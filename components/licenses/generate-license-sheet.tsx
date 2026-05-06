"use client"

import { useActionState, useState } from "react"
import { generateLicenseAction } from "@/actions/licenses"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import type { Customer } from "@/types"

const LICENSE_TYPES = [
  "CLOUD_SUBSCRIPTION", "CLOUD_LIFETIME",
  "HYBRID_SUBSCRIPTION", "HYBRID_LIFETIME",
  "OFFLINE_SUBSCRIPTION", "OFFLINE_LIFETIME",
  "ECOMMERCE_SUBSCRIPTION", "ECOMMERCE_LIFETIME",
  "COMMERCE_SUITE_SUBSCRIPTION", "COMMERCE_SUITE_LIFETIME",
]

const init = { error: undefined as string | undefined }

export function GenerateLicenseSheet({ customers }: { customers: Customer[] }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(generateLicenseAction, init)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
        <Plus className="w-3.5 h-3.5" />
        Generate License
      </SheetTrigger>
      <SheetContent className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Generate License Key</SheetTitle>
          <SheetDescription>Create a new license key for a customer.</SheetDescription>
        </SheetHeader>

        {(state as { key?: string }).key ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-center">
              <p className="text-xs text-emerald-600 font-medium mb-2">License Key Generated</p>
              <p className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300 tracking-widest">
                {(state as { key?: string }).key}
              </p>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <form action={action} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Customer *</Label>
              <select
                name="customerId"
                required
                className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm"
              >
                <option value="">Select customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.businessName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>License Type *</Label>
              <select
                name="type"
                required
                className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm"
              >
                <option value="">Select type…</option>
                {LICENSE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Max Devices</Label>
                <Input name="maxDevices" type="number" defaultValue={1} min={1} />
              </div>
              <div className="space-y-1.5">
                <Label>Max Branches</Label>
                <Input name="maxBranches" type="number" defaultValue={1} min={1} />
              </div>
              <div className="space-y-1.5">
                <Label>Max Users</Label>
                <Input name="maxUsers" type="number" defaultValue={5} min={1} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Expires At</Label>
                <Input name="expiresAt" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Grace Period (days)</Label>
                <Input name="gracePeriodDays" type="number" defaultValue={7} min={0} />
              </div>
            </div>

            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Generating…" : "Generate License"}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
