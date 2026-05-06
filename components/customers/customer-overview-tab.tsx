import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/format"
import type { Customer } from "@/types"

export function CustomerOverviewTab({ customer }: { customer: Customer }) {
  const fields = [
    { label: "Business Name", value: customer.businessName },
    { label: "Contact Name", value: customer.contactName },
    { label: "Email", value: customer.email || "—" },
    { label: "Phone", value: customer.phone || "—" },
    { label: "WhatsApp", value: customer.whatsapp || "—" },
    { label: "Country", value: customer.country || "—" },
    { label: "Address", value: customer.address || "—" },
    { label: "Created", value: formatDate(customer.createdAt) },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="flex justify-between text-sm">
              <span className="text-zinc-500">{f.label}</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium text-right max-w-[60%] truncate">
                {f.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {customer.notes && (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{customer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
