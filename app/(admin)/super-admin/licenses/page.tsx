export const dynamic = 'force-dynamic'

import { getLicenses } from "@/actions/licenses"
import { getCustomers } from "@/actions/customers"
import { PageHeader } from "@/components/shared/page-header"
import { LicenseTableClient } from "@/components/licenses/license-table-client"
import { GenerateLicenseSheet } from "@/components/licenses/generate-license-sheet"

export default async function LicensesPage() {
  const [licenses, customers] = await Promise.all([getLicenses(), getCustomers()])

  return (
    <div>
      <PageHeader
        title="Licenses"
        description={`${licenses.length} licenses`}
        action={<GenerateLicenseSheet customers={customers} />}
      />
      <LicenseTableClient licenses={licenses} />
    </div>
  )
}
