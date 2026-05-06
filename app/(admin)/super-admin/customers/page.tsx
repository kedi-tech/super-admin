export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Plus } from "lucide-react"
import { getCustomers } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import { CustomerTableClient } from "@/components/customers/customer-table-client"

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} total customers`}
        action={
          <Link href="/super-admin/customers/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Customer
            </Button>
          </Link>
        }
      />
      <CustomerTableClient customers={customers} />
    </div>
  )
}
