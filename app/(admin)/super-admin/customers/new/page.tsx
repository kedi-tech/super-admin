"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { createCustomerAction } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const init = { error: undefined as string | undefined }

export default function NewCustomerPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState(createCustomerAction, init)

  useEffect(() => {
    if ((state as { customerId?: string }).customerId) {
      router.push(`/super-admin/customers/${(state as { customerId?: string }).customerId}`)
    }
  }, [state, router])

  return (
    <div className="max-w-2xl">
      <PageHeader title="New Customer" description="Add a new KediTech customer" />
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardContent className="pt-5">
          <form action={action} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Business Name *</Label>
                <Input name="businessName" required placeholder="Acme Trading Co." />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Name *</Label>
                <Input name="contactName" required placeholder="John Doe" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="contact@acme.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input name="phone" placeholder="+224 600 000 000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>WhatsApp</Label>
                <Input name="whatsapp" placeholder="+224 600 000 000" />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input name="country" placeholder="Guinea" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input name="address" placeholder="Street, City" />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea name="notes" placeholder="Internal notes…" rows={3} />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create Customer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
