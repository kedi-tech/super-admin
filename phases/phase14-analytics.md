# Phase 14 — Analytics Module

## What was built

- `app/(admin)/super-admin/analytics/page.tsx` — Server component with `force-dynamic`
- `components/analytics/analytics-charts.tsx` — Client component with three Recharts charts:
  1. Area chart — monthly revenue trend (last 12 months)
  2. Horizontal bar chart — active customers by product type
  3. Donut chart — subscription status breakdown (ACTIVE/TRIAL/EXPIRED/CANCELLED)
- Stat cards: MRR, ARR (MRR × 12), Active Customers, Active Devices
- Recharts formatter type fix: `(v) => [Number(v).toLocaleString() + " GNF", "Revenue"]`
