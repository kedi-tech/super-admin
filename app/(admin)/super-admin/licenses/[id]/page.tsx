export const dynamic = 'force-dynamic'

import { notFound } from "next/navigation"
import Link from "next/link"
import { getLicense } from "@/actions/licenses"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LicenseActions } from "@/components/licenses/license-actions"
import { LicenseDevicesTab } from "@/components/licenses/license-devices-tab"
import { LicenseValidationLogsTab } from "@/components/licenses/license-validation-logs-tab"
import { OfflineLicensePanel } from "@/components/licenses/offline-license-panel"
import { formatDate, formatLicenseType } from "@/lib/format"
import { Copy } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function LicenseDetailPage({ params }: Props) {
  const { id } = await params
  const license = await getLicense(id)
  if (!license) notFound()

  const isOffline = license.type.startsWith("OFFLINE")

  return (
    <div className="space-y-5">
      <PageHeader
        title="License Detail"
        description={license.customer.businessName}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={license.status} />
            <LicenseActions license={license} />
          </div>
        }
      />

      {/* Key display */}
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-zinc-500 mb-1">License Key</p>
              <p className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-widest">
                {license.key}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-xs text-zinc-500">Type</p>
                <p className="font-medium mt-0.5">{formatLicenseType(license.type)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Max Devices</p>
                <p className="font-medium mt-0.5">{license.maxDevices}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Expires</p>
                <p className="font-medium mt-0.5">{formatDate(license.expiresAt)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Customer</p>
                <Link
                  href={`/super-admin/customers/${license.customerId}`}
                  className="font-medium mt-0.5 block hover:underline truncate max-w-[140px]"
                >
                  {license.customer.businessName}
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="devices">
            Devices <span className="ml-1 text-zinc-400">({license.devices.length})</span>
          </TabsTrigger>
          <TabsTrigger value="logs">
            Validation Logs <span className="ml-1 text-zinc-400">({license.validationLogs.length})</span>
          </TabsTrigger>
          {isOffline && <TabsTrigger value="offline">Offline File</TabsTrigger>}
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-none max-w-md">
            <CardContent className="pt-5 space-y-3">
              {[
                ["License Key", license.key],
                ["Type", formatLicenseType(license.type)],
                ["Status", license.status],
                ["Max Devices", license.maxDevices],
                ["Max Branches", license.maxBranches],
                ["Max Users", license.maxUsers],
                ["Expires At", formatDate(license.expiresAt)],
                ["Grace Period", `${license.gracePeriodDays} days`],
                ["Created", formatDate(license.createdAt)],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-sm">
                  <span className="text-zinc-500">{label}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right">{String(value)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-4">
          <LicenseDevicesTab devices={license.devices} licenseId={id} />
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <LicenseValidationLogsTab logs={license.validationLogs} />
        </TabsContent>

        {isOffline && (
          <TabsContent value="offline" className="mt-4">
            <OfflineLicensePanel license={license} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
