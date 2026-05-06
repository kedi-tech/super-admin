# Phase 6 — Customer Module ✅

## Files Created
- `actions/customers.ts` — getCustomers, getCustomer, createCustomerAction, updateCustomerAction, setCustomerStatusAction
- `app/(admin)/super-admin/customers/page.tsx` — Customer list page (Server Component)
- `app/(admin)/super-admin/customers/new/page.tsx` — New customer form (Client Component)
- `app/(admin)/super-admin/customers/[id]/page.tsx` — Customer detail with tabbed layout
- `components/customers/customer-table-client.tsx` — TanStack Table with dropdown actions
- `components/customers/customer-actions.tsx` — Status action dropdown (activate/suspend/deactivate)
- `components/customers/customer-overview-tab.tsx` — Customer info card
- `components/customers/customer-licenses-tab.tsx` — Licenses table
- `components/customers/customer-subscriptions-tab.tsx` — Subscriptions table
- `components/customers/customer-devices-tab.tsx` — Devices table
- `components/customers/customer-payments-tab.tsx` — Payments table
- `components/customers/customer-tickets-tab.tsx` — Support tickets table

## Features
- TanStack Table with per-row actions (eye icon + dropdown)
- 6-tab detail page: Overview, Licenses, Subscriptions, Devices, Payments, Support
- Server Actions for create/update/status changes with audit logging
- revalidatePath to keep data fresh after mutations
