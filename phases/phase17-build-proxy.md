# Phase 17 — Build Fix & proxy.ts Migration

## What was done

### Build errors fixed across all phases

- `force-dynamic` export added to all 15 server-rendered pages to prevent Prisma connection attempts during static generation
- `subscriptions/page.tsx` and `payments/page.tsx` and `devices/page.tsx` converted from Server Components to Client Components (`useEffect` + `useState`) — TanStack Table column `cell` functions containing JSX/closures cannot be serialized from Server → Client component boundary
- Recharts `ValueFormatter` type fixed: `(v) => [Number(v).toLocaleString() + " GNF", "Revenue"]`
- Prisma JSON assignment typed `as any` for `offlineLicensePayload` (JSON column)
- Inline `"use server"` inside `"use client"` component removed; server action moved to `actions/licenses.ts`
- All `asChild` prop usages replaced with `buttonVariants({...})` as `className` — `@base-ui/react` triggers do not support `asChild`

### middleware.ts → proxy.ts

- Renamed per Next.js 16 breaking change: `middleware` file convention deprecated, renamed to `proxy`
- Function renamed from `export async function middleware` → `export async function proxy`
- Old `middleware.ts` deleted

### Final build result

```
▲ Next.js 16.2.4 (Turbopack)
✓ Compiled successfully in 6.0s
✓ TypeScript check passed
✓ 10 dynamic routes + proxy compiled
```
