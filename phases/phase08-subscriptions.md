# Phase 08 — Subscription Module

## What was built

- `actions/subscriptions.ts` — `getSubscriptions`, `getSubscription`, `createSubscriptionAction`, `renewSubscriptionAction`, `cancelSubscriptionAction`
- `app/(admin)/super-admin/subscriptions/page.tsx` — Client component (converted from Server Component to avoid serialization of column defs across the Server→Client boundary)
- Table shows: customer name, package, status badge, start/end dates, trial flag, auto-renew flag

## Key decisions

- Page is a Client Component using `useEffect` + `useState` for data fetching because TanStack Table column `cell` functions cannot be serialized from Server → Client components
- `export const dynamic = 'force-dynamic'` kept even as client component to prevent premature static generation
- Status badge uses `StatusBadge` shared component (ACTIVE=emerald, TRIAL=blue, EXPIRED=amber, CANCELLED=red, SUSPENDED=yellow)
