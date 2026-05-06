import {
  BarChart3,
  Building2,
  CreditCard,
  FileKey2,
  HardDrive,
  LayoutDashboard,
  LifeBuoy,
  Package,
  ScrollText,
  Settings,
  ShoppingBag,
  Users,
  Wrench,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Customers",
    items: [
      { label: "Customers", href: "/super-admin/customers", icon: Building2 },
      { label: "Subscriptions", href: "/super-admin/subscriptions", icon: ScrollText },
      { label: "Payments", href: "/super-admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "Licensing",
    items: [
      { label: "Licenses", href: "/super-admin/licenses", icon: FileKey2 },
      { label: "Devices", href: "/super-admin/devices", icon: HardDrive },
      { label: "Installations", href: "/super-admin/installations", icon: Wrench },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Support Tickets", href: "/super-admin/support", icon: LifeBuoy },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", href: "/super-admin/products", icon: ShoppingBag },
      { label: "Packages", href: "/super-admin/packages", icon: Package },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Audit Logs", href: "/super-admin/logs", icon: Users },
      { label: "Settings", href: "/super-admin/settings", icon: Settings },
    ],
  },
]
