# Implementation Plan — AGS Super Admin

## Overview

Build a complete internal AGS Super Admin platform on top of the existing bare Next.js 16.2.4 + TypeScript + Tailwind v4 app. The goal is a premium enterprise SaaS control center that AGS staff use to manage the entire POS ecosystem (Cloud, Hybrid, Offline, E-Commerce, Commerce Suite customers).

---

## Phase 1 — Dependency Installation & Project Setup

Install all required packages:

| Package | Purpose |
|---|---|
| `shadcn/ui` (CLI) | Component library (Button, Dialog, Table, Form, etc.) |
| `@prisma/client` + `prisma` | ORM for Supabase PostgreSQL |
| `react-hook-form` | Form state management |
| `zod` + `@hookform/resolvers` | Schema validation |
| `motion` (Framer Motion) | Animations |
| `next-intl` | Internationalization |
| `recharts` | Analytics charts |
| `@tanstack/react-table` | Powerful data tables |
| `next-themes` | Dark/light mode |
| `jose` | JWT signing/verification (for auth + license signing) |
| `uuid` | License key generation |
| `lucide-react` | Icons (used by shadcn) |
| `date-fns` | Date formatting |
| `clsx` + `tailwind-merge` | Class utilities |

Initialize shadcn/ui with the New York style and zinc base color.

---

## Phase 2 — Database Schema (Prisma + Supabase PostgreSQL)

### Models to create:

#### `AdminUser`
Internal AGS staff accounts.
```
id, email, name, passwordHash, role (SUPER_ADMIN | ADMIN | SUPPORT | BILLING), 
twoFactorEnabled, twoFactorSecret, lastLoginAt, lastLoginIp, 
isActive, createdAt, updatedAt
```

#### `Customer`
Each customer is a business that bought an AGS product.
```
id, businessName, contactName, phone, whatsapp, email, 
country, address, status (ACTIVE | SUSPENDED | INACTIVE), 
notes, createdAt, updatedAt
```

#### `Product`
AGS product catalog.
```
id, name, slug (CLOUD_POS | HYBRID_POS | OFFLINE_POS | ECOMMERCE | COMMERCE_SUITE),
description, isActive, createdAt
```

#### `Package`
Pricing tiers per product.
```
id, productId, name, billingCycle (MONTHLY | YEARLY | LIFETIME),
price, currency, maxDevices, maxBranches, maxUsers,
features (JSON), isActive, createdAt
```

#### `License`
A license key tied to a customer + package.
```
id, key (unique, formatted: XXXX-XXXX-XXXX-XXXX), customerId, packageId,
type (CLOUD_SUBSCRIPTION | CLOUD_LIFETIME | HYBRID_SUBSCRIPTION | HYBRID_LIFETIME | 
      OFFLINE_SUBSCRIPTION | OFFLINE_LIFETIME | ECOMMERCE_SUBSCRIPTION | ECOMMERCE_LIFETIME |
      COMMERCE_SUITE_SUBSCRIPTION | COMMERCE_SUITE_LIFETIME),
status (ACTIVE | SUSPENDED | REVOKED | EXPIRED),
maxDevices, maxBranches, maxUsers,
expiresAt, gracePeriodDays,
offlineLicenseFile (JSON, nullable — for OFFLINE_* types),
offlineLicenseSignature (string, nullable),
createdAt, updatedAt, createdBy (adminUserId)
```

#### `Subscription`
Billing record linking customer to a package over time.
```
id, customerId, packageId, licenseId,
status (ACTIVE | EXPIRED | CANCELLED | SUSPENDED | PENDING),
startDate, endDate, renewalDate,
billingCycle, amount, currency,
gracePeriodDays, autoRenew,
cancelledAt, cancelReason,
createdAt, updatedAt
```

#### `Payment`
Every payment event.
```
id, customerId, subscriptionId (nullable), licenseId (nullable),
type (SUBSCRIPTION | INSTALLATION | SUPPORT | ONE_TIME),
amount, currency, method (CASH | BANK_TRANSFER | MOBILE_MONEY | CARD | OTHER),
reference, status (PENDING | VERIFIED | FAILED | REFUNDED),
invoiceNumber, notes, paidAt, verifiedBy (adminUserId nullable),
createdAt, updatedAt
```

#### `Device`
Machine activations per license.
```
id, licenseId, customerId,
fingerprint (unique per license), machineName, os, osVersion,
ipAddress, status (ACTIVE | DEACTIVATED | BLOCKED),
activatedAt, lastSeenAt,
deactivatedAt, deactivatedBy (adminUserId nullable),
createdAt
```

#### `Installation`
Enterprise/offline installation tracking.
```
id, customerId, licenseId,
installedAt, installedBy (adminUserId),
branches (int), machines (int),
supportStatus (ACTIVE | EXPIRED | NONE),
maintenanceStatus (ACTIVE | EXPIRED | NONE),
nextMaintenanceDate, notes,
createdAt, updatedAt
```

#### `SupportTicket`
Internal support tickets.
```
id, customerId, subject, description,
status (OPEN | IN_PROGRESS | RESOLVED | CLOSED),
priority (LOW | MEDIUM | HIGH | URGENT),
assignedTo (adminUserId nullable),
resolvedAt, closedAt,
createdAt, updatedAt
```

#### `TicketNote`
Internal notes + replies on a ticket.
```
id, ticketId, authorId (adminUserId), body, isInternal,
createdAt
```

#### `LicenseValidationLog`
Every time a POS validates its license (cloud pings).
```
id, licenseId, deviceId (nullable),
ipAddress, success, failureReason,
validatedAt
```

#### `AuditLog`
Tracks all admin actions.
```
id, adminUserId, action (string), targetType, targetId,
payload (JSON — before/after), ipAddress, createdAt
```

#### `AdminSession`
Active login sessions for session management.
```
id, adminUserId, token (hashed), ipAddress, userAgent,
expiresAt, createdAt
```

---

## Phase 3 — Authentication System

- **Login page** (`/login`) — email + password form with shadcn/ui
- **Middleware** — protect all `/super-admin/*` routes, redirect to `/login` if no valid session
- **Session** — server-side sessions using `jose` JWT stored in httpOnly cookies
- **Role guard** — higher-privileged routes (settings, license generation) check admin role
- **2FA** — optional TOTP (store secret in `AdminUser.twoFactorSecret`), verify on login
- **Audit** — every login writes to `AuditLog` and `AdminSession`
- **Logout** — deletes session cookie, marks `AdminSession` as expired

---

## Phase 4 — App Shell (Layout & Navigation)

File: `app/(admin)/layout.tsx`

- **Sidebar** — fixed left sidebar with logo, nav sections, user avatar at bottom
- **Nav sections:**
  - Overview: Dashboard, Analytics
  - Customers: Customers, Subscriptions, Payments
  - Licensing: Licenses, Devices, Installations
  - Support: Support Tickets
  - Catalog: Products, Packages
  - System: Audit Logs, Settings
- **Header** — breadcrumb + global search + notifications bell + theme toggle + user menu
- **Theme** — `next-themes` ThemeProvider wrapping everything, toggle dark/light
- **Responsive** — collapsible sidebar on mobile

---

## Phase 5 — Dashboard Page

Route: `/super-admin/dashboard`

### Stat Cards (top row)
| Card | Value |
|---|---|
| Total Customers | count |
| Active Subscriptions | count |
| Expired Subscriptions | count |
| Total Revenue | sum of verified payments |
| MRR | sum of active monthly subscriptions |
| Active Licenses | count |
| Active Devices | count |
| Open Support Tickets | count |
| Failed License Validations (7d) | count |
| Pending Renewals | count |

### Charts
- **Revenue over time** — area chart (12 months), Recharts
- **Subscriptions by type** — donut chart (Cloud / Hybrid / Offline / E-Commerce)
- **New customers per month** — bar chart
- **Customer breakdown** — stat cards: Cloud, Hybrid, Offline, E-Commerce, Commerce Suite

### Tables
- Recent payments (last 10)
- Recent support tickets (last 5, open)

---

## Phase 6 — Customer Module

### `/super-admin/customers` — List page
- TanStack Table with columns: Business Name, Contact, Country, Status, Subscriptions, Created
- Filters: status, country, product type
- Search by name/email/phone
- Pagination (server-side)
- Actions: View, Suspend, Activate, Delete
- "New Customer" button → slide-over form

### `/super-admin/customers/[id]` — Detail page
- Header: business name, status badge, quick actions (suspend/activate/edit)
- Tab layout:
  - **Overview** — customer info card + edit form
  - **Licenses** — table of licenses with status badges
  - **Subscriptions** — active + history
  - **Devices** — activated machines
  - **Branches** — branch list (from installations)
  - **Payments** — payment history
  - **Support** — ticket history
  - **Notes** — internal notes

---

## Phase 7 — License Module

### `/super-admin/licenses` — List page
- Columns: Key, Customer, Type, Status, Devices, Expires, Created
- Filters: type, status, expiry range
- Search by key or customer
- Actions: View, Revoke, Suspend, Renew
- "Generate License" button

### `/super-admin/licenses/[id]` — Detail page
- License key display with copy button
- Info: customer, type, limits (devices/branches/users), expiry, status
- Actions bar: Renew | Suspend | Revoke | Reset Activations | Download Offline File
- **Tabs:**
  - **Details** — all license fields + edit form
  - **Devices** — table of activated machines with deactivate actions
  - **Validation Logs** — chronological log of API validations (success/fail, IP, date)
  - **Offline License File** — show/download generated `.lic` JSON file

### Generate License flow
- Dialog/sheet form:
  - Select customer
  - Select package (auto-fills type, limits)
  - Set expiry date
  - Set custom limits (override package defaults)
  - Submit → generates key (`XXXX-XXXX-XXXX-XXXX` format using UUID + crypto)
  - Auto-creates linked Subscription record

### Offline License File generation
- For `OFFLINE_*` types only
- Builds JSON payload:
  ```json
  {
    "licenseKey": "...",
    "customerId": "...",
    "businessName": "...",
    "productType": "OFFLINE_POS",
    "issuedAt": "2026-05-06T...",
    "expiresAt": "2027-05-06T...",
    "maxDevices": 3,
    "maxBranches": 2,
    "maxUsers": 10,
    "gracePeriodDays": 7,
    "offlineGraceRules": { "validateEveryDays": 30, "maxOfflineDays": 30 }
  }
  ```
- Signs payload with private key using `jose` (RS256)
- Stores signature + payload on `License` record
- Allows download as `.lic` file

---

## Phase 8 — Subscription Module

### `/super-admin/subscriptions` — List page
- Columns: Customer, Package, Status, Billing Cycle, Amount, Start, Renewal Date, End
- Filters: status, billing cycle, product
- Quick actions: Renew, Cancel, Suspend
- "New Subscription" button

### Subscription detail (inline panel or nested route)
- Edit: status, renewal date, grace period, auto-renew toggle
- Payment history for this subscription
- Timeline of status changes

---

## Phase 9 — Payment Module

### `/super-admin/payments` — List page
- Columns: Customer, Type, Amount, Method, Status, Reference, Date
- Filters: type, method, status, date range
- Search by reference or customer
- "Record Payment" button → form with all fields
- "Verify" action for PENDING payments (sets status=VERIFIED, sets verifiedBy)
- Export to CSV button

---

## Phase 10 — Device Module

### `/super-admin/devices` — List page
- Columns: Machine Name, Customer, License Key, OS, Last Seen, Activated, Status
- Filters: status, OS
- Search by fingerprint or machine name
- Row actions: Deactivate | Reset Activation | Block

---

## Phase 11 — Installation Module

### `/super-admin/installations` — List page
- Columns: Customer, Installed By, Date, Branches, Machines, Support Status, Maintenance
- "New Installation" button
- Edit installation (notes, status fields, next maintenance date)

---

## Phase 12 — Support Module

### `/super-admin/support` — Ticket list
- Columns: ID, Customer, Subject, Priority, Status, Assigned To, Created
- Filters: status, priority, assigned to
- "New Ticket" button
- Color-coded priority badges

### Ticket detail (nested route or slide-over)
- Thread view of notes (internal vs customer-facing)
- Change status/priority/assignee
- Add internal note
- Audit trail of status changes

---

## Phase 13 — Products & Packages Module

### `/super-admin/products`
- List of AGS products (Cloud POS, Hybrid POS, Offline POS, E-Commerce, Commerce Suite)
- Toggle active/inactive

### `/super-admin/packages`
- List of pricing packages per product
- TanStack Table: Product, Name, Billing, Price, Max Devices, Max Branches, Max Users
- Create/Edit/Delete package (form with all limit fields)

---

## Phase 14 — Analytics Module

### `/super-admin/analytics`

Charts:
- **MRR trend** — monthly area chart (12 months)
- **ARR** — derived from MRR × 12
- **Subscription growth** — stacked bar (new vs churned per month)
- **Revenue by product** — pie chart
- **Churn rate** — line chart
- **Top countries** — horizontal bar
- **Top packages** — ranked list
- **Machine activations over time** — line chart
- **Sync statistics** — success/fail ratio gauge
- **Most active customers** — ranked table

KPI header: MRR | ARR | Churn Rate | Active Customers | Active Devices

---

## Phase 15 — Audit Logs Module

### `/super-admin/logs`
- TanStack Table: Admin, Action, Target, IP, Date
- Filters: admin user, action type, date range
- Search
- Read-only — no actions
- Infinite scroll or pagination

---

## Phase 16 — Settings Module

### `/super-admin/settings`

Tabs:
- **Admin Users** — list of internal staff, create/edit/deactivate, role management
- **Roles & Permissions** — what each role can do
- **Security** — session timeout, 2FA enforcement, IP allowlist
- **License Config** — default grace periods, key format settings
- **Signing Keys** — manage RSA key pair for offline license signing (show public key, rotate private key)
- **Notifications** — renewal reminders, expiry alerts config

---

## File/Folder Structure

```
super-admin/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   └── (admin)/
│       ├── layout.tsx              # App shell (sidebar + header)
│       ├── super-admin/
│       │   ├── dashboard/page.tsx
│       │   ├── customers/
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── licenses/
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── subscriptions/page.tsx
│       │   ├── payments/page.tsx
│       │   ├── devices/page.tsx
│       │   ├── installations/page.tsx
│       │   ├── support/
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── products/page.tsx
│       │   ├── packages/page.tsx
│       │   ├── analytics/page.tsx
│       │   ├── logs/page.tsx
│       │   └── settings/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── NavItem.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   └── RevenueChart.tsx
│   ├── customers/
│   │   ├── CustomerTable.tsx
│   │   └── CustomerForm.tsx
│   ├── licenses/
│   │   ├── LicenseTable.tsx
│   │   ├── GenerateLicenseForm.tsx
│   │   └── OfflineLicensePanel.tsx
│   ├── ui/                         # shadcn/ui components
│   └── shared/
│       ├── DataTable.tsx           # Generic TanStack wrapper
│       ├── StatusBadge.tsx
│       ├── PageHeader.tsx
│       └── ConfirmDialog.tsx
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # Session helpers
│   ├── license.ts                  # Key generation + signing
│   ├── audit.ts                    # Audit log writer
│   └── utils.ts                    # clsx, cn, formatters
├── actions/                        # Next.js Server Actions
│   ├── customers.ts
│   ├── licenses.ts
│   ├── subscriptions.ts
│   ├── payments.ts
│   ├── devices.ts
│   ├── support.ts
│   └── auth.ts
├── types/
│   └── index.ts                    # Shared TS types
├── prisma/
│   └── schema.prisma
├── middleware.ts                    # Route protection
└── messages/
    └── en.json                     # next-intl strings
```

---

## Implementation Order

1. **Phase 1** — Install deps + init shadcn/ui
2. **Phase 2** — Write Prisma schema + migrate
3. **Phase 3** — Auth (login page, middleware, session)
4. **Phase 4** — App shell layout (sidebar, header, theme)
5. **Phase 5** — Dashboard
6. **Phase 6** — Customer module (list + detail)
7. **Phase 7** — License module (list + detail + generation + offline file)
8. **Phase 8** — Subscription module
9. **Phase 9** — Payment module
10. **Phase 10** — Device module
11. **Phase 11** — Installation module
12. **Phase 12** — Support module
13. **Phase 13** — Products & Packages
14. **Phase 14** — Analytics
15. **Phase 15** — Audit Logs
16. **Phase 16** — Settings

---

## Key Technical Decisions

- **Server Actions** — All form submissions use Next.js Server Actions (no separate API routes needed)
- **Server Components** — Data fetching happens in Server Components; Client Components only where interactivity is required
- **Optimistic UI** — Use `useOptimistic` for table row status changes (suspend/activate)
- **License key format** — `XXXX-XXXX-XXXX-XXXX` using crypto.randomUUID() segments
- **Offline license signing** — RS256 JWT using `jose`; public key embedded in desktop POS
- **Seed data** — Seed script creates default SuperAdmin user + 5 products + sample packages
- **Tailwind v4** — Use `@import "tailwindcss"` syntax (already in globals.css); no tailwind.config.js needed
- **shadcn/ui** — Use `npx shadcn@latest init` then `npx shadcn@latest add` for individual components

---

## Notes

- UI language: English (super-admin is for internal AGS staff)
- All monetary amounts stored as integers (cents) to avoid float issues
- All dates stored as UTC in DB; formatted client-side with `date-fns`
- Mock/seed data will be used initially since Supabase connection string is not yet configured — the schema and all UI will be production-ready, connecting just requires adding `DATABASE_URL` to `.env`
