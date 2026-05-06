import type {
  AdminRole,
  AdminUser,
  AuditLog,
  BillingCycle,
  Customer,
  CustomerStatus,
  Device,
  DeviceStatus,
  Installation,
  License,
  LicenseStatus,
  LicenseType,
  Package,
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  Product,
  ProductSlug,
  Subscription,
  SubscriptionStatus,
  SupportStatus,
  SupportTicket,
  TicketNote,
  TicketPriority,
  TicketStatus,
} from "@prisma/client"

export type {
  AdminRole,
  AdminUser,
  AuditLog,
  BillingCycle,
  Customer,
  CustomerStatus,
  Device,
  DeviceStatus,
  Installation,
  License,
  LicenseStatus,
  LicenseType,
  Package,
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  Product,
  ProductSlug,
  Subscription,
  SubscriptionStatus,
  SupportStatus,
  SupportTicket,
  TicketNote,
  TicketPriority,
  TicketStatus,
}

export type SafeAdminUser = Omit<AdminUser, "passwordHash" | "twoFactorSecret">

export type LicenseWithRelations = License & {
  customer: Customer
  package: Package | null
}

export type SubscriptionWithRelations = Subscription & {
  customer: Customer
  package: Package | null
  license: License | null
}

export type PaymentWithRelations = Payment & {
  customer: Customer
  subscription: Subscription | null
}

export type DeviceWithRelations = Device & {
  license: License
  customer: Customer
}

export type TicketWithRelations = SupportTicket & {
  customer: Customer
  assignee: SafeAdminUser | null
  notes: TicketNote[]
}

export type CustomerWithCounts = Customer & {
  _count: {
    licenses: number
    subscriptions: number
    devices: number
    payments: number
    tickets: number
  }
}

export interface DashboardStats {
  totalCustomers: number
  activeSubscriptions: number
  expiredSubscriptions: number
  totalRevenue: number
  mrr: number
  activeLicenses: number
  activeDevices: number
  openTickets: number
  failedValidations: number
  pendingRenewals: number
  cloudCustomers: number
  hybridCustomers: number
  offlineCustomers: number
  ecommerceCustomers: number
  commerceSuiteCustomers: number
}

export interface SessionPayload {
  adminId: string
  email: string
  role: AdminRole
  name: string
}
