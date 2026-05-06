# Phase 09 — Payment Module

## What was built

- `actions/payments.ts` — `getPayments`, `verifyPaymentAction`, `refundPaymentAction`
- `app/(admin)/super-admin/payments/page.tsx` — Client component with inline action buttons
- Table shows: customer, amount+currency, method, gateway reference, status, date
- `verifyPaymentAction` transitions PENDING → PAID and writes AuditLog

## Key decisions

- Client component for the same TanStack Table serialization reason as subscriptions
- `formatCurrency(amount, currency)` used for display; supports GNF and other currencies
