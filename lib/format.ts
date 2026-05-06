import { format, formatDistanceToNow } from "date-fns"

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return format(new Date(date), "MMM d, yyyy")
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return format(new Date(date), "MMM d, yyyy HH:mm")
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatCurrency(
  amount: number,
  currency = "GNF"
): string {
  // Amount stored in cents
  const value = amount / 100
  if (currency === "GNF") {
    return new Intl.NumberFormat("fr-GN", {
      style: "currency",
      currency: "GNF",
      maximumFractionDigits: 0,
    }).format(value)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value)
}

export function formatLicenseType(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function truncate(str: string, maxLength = 32): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + "…"
}
