# Phase 2 — Prisma Schema & Database ✅

## Models Created (13 total)
1. `AdminUser` — Internal AGS staff (email, role, 2FA, last login)
2. `AdminSession` — Active login sessions (tokenHash, IP, expiry)
3. `Customer` — Business customers (businessName, contact, status, country)
4. `Product` — AGS product catalog (5 slugs: CLOUD_POS, HYBRID_POS, OFFLINE_POS, ECOMMERCE, COMMERCE_SUITE)
5. `Package` — Pricing tiers per product (billing cycle, price in cents, limits)
6. `License` — License keys with type, status, limits, expiry, offline payload
7. `LicenseValidationLog` — Every validation ping from a POS client
8. `Subscription` — Billing records linking customer + package + license
9. `Payment` — Payment events (type, method, status, reference)
10. `Device` — Machine activations per license (fingerprint, OS, lastSeen)
11. `Installation` — Enterprise installations (branches, machines, support/maintenance)
12. `SupportTicket` — Customer support tickets with priority + status
13. `TicketNote` — Thread notes on tickets
14. `AuditLog` — All admin actions (actor, action, target, IP, payload)

## Key Decisions
- Prisma v7 requires `prisma.config.ts` (no `url` in schema datasource)
- Using `@prisma/adapter-pg` for Supabase PostgreSQL connection
- Amounts stored as integers (cents) — avoids float precision issues
- `AdminUser.passwordHash` excluded from `SafeAdminUser` type
- Offline license signed via RS256 JWT using `jose`

## Supporting Files
- `lib/prisma.ts` — Prisma client singleton with pg adapter
- `lib/license.ts` — License key generation + offline license signing/verification
- `lib/audit.ts` — Audit log writer (never throws)
- `lib/format.ts` — Date/currency/string formatters
- `types/index.ts` — Shared TypeScript types + relation types
- `prisma/seed.ts` — Seeds 5 products + default super admin (admin@ags.com / admin123!)
- `.env` — Template with DATABASE_URL, DIRECT_URL, JWT_SECRET placeholders
