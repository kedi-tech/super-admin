export const dynamic = 'force-dynamic'

import { getPackages } from "@/actions/products"
import { getProducts } from "@/actions/products"
import { PageHeader } from "@/components/shared/page-header"
import { formatCurrency } from "@/lib/format"
import { StatusBadge } from "@/components/shared/status-badge"
import { CreatePackageSheet } from "@/components/packages/create-package-sheet"
import { PackageActions } from "@/components/packages/package-actions"

export default async function PackagesPage() {
  const [packages, products] = await Promise.all([getPackages(), getProducts()])

  return (
    <div>
      <PageHeader
        title="Packages"
        description={`${packages.length} pricing packages`}
        action={<CreatePackageSheet products={products} />}
      />
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              {["Package", "Product", "Billing", "Price", "Devices", "Branches", "Users", "Status", ""].map((h, i) => (
                <th key={i} className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {packages.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-zinc-400">No packages yet.</td></tr>
            ) : packages.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{p.name}</td>
                <td className="px-4 py-3 text-xs text-zinc-500">{p.product.name}</td>
                <td className="px-4 py-3 text-xs text-zinc-500">{p.billingCycle}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(p.price, p.currency)}</td>
                <td className="px-4 py-3 text-zinc-500">{p.maxDevices}</td>
                <td className="px-4 py-3 text-zinc-500">{p.maxBranches}</td>
                <td className="px-4 py-3 text-zinc-500">{p.maxUsers}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.isActive ? "ACTIVE" : "INACTIVE"} />
                </td>
                <td className="px-4 py-3">
                  <PackageActions pkg={p} products={products} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
