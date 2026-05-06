export const dynamic = 'force-dynamic'

import { notFound } from "next/navigation"
import { getCustomer } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerOverviewTab } from "@/components/customers/customer-overview-tab"
import { CustomerLicensesTab } from "@/components/customers/customer-licenses-tab"
import { CustomerSubscriptionsTab } from "@/components/customers/customer-subscriptions-tab"
import { CustomerDevicesTab } from "@/components/customers/customer-devices-tab"
import { CustomerPaymentsTab } from "@/components/customers/customer-payments-tab"
import { CustomerTicketsTab } from "@/components/customers/customer-tickets-tab"
import { CustomerActions } from "@/components/customers/customer-actions"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params
  const customer = await getCustomer(id)
  if (!customer) notFound()

  return (
    <div className="space-y-5">
      <PageHeader
        title={customer.businessName}
        description={`${customer.contactName} · ${customer.country ?? "—"}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={customer.status} />
            <CustomerActions customer={customer} />
          </div>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="licenses">
            Licenses <span className="ml-1 text-zinc-400">({customer._count.licenses})</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            Subscriptions <span className="ml-1 text-zinc-400">({customer._count.subscriptions})</span>
          </TabsTrigger>
          <TabsTrigger value="devices">
            Devices <span className="ml-1 text-zinc-400">({customer._count.devices})</span>
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payments <span className="ml-1 text-zinc-400">({customer._count.payments})</span>
          </TabsTrigger>
          <TabsTrigger value="support">
            Tickets <span className="ml-1 text-zinc-400">({customer._count.tickets})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <CustomerOverviewTab customer={customer} />
        </TabsContent>
        <TabsContent value="licenses" className="mt-4">
          <CustomerLicensesTab licenses={customer.licenses} customerId={id} />
        </TabsContent>
        <TabsContent value="subscriptions" className="mt-4">
          <CustomerSubscriptionsTab subscriptions={customer.subscriptions} />
        </TabsContent>
        <TabsContent value="devices" className="mt-4">
          <CustomerDevicesTab devices={customer.devices} />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <CustomerPaymentsTab payments={customer.payments} />
        </TabsContent>
        <TabsContent value="support" className="mt-4">
          <CustomerTicketsTab tickets={customer.tickets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
