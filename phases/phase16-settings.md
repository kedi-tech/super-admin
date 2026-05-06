# Phase 16 — Settings Module

## What was built

- `app/(admin)/super-admin/settings/page.tsx` — Server component with `force-dynamic`; 3-tab layout
- `components/settings/admin-users-tab.tsx` — Lists admin users with role badges; invite form (create new AdminUser with bcrypt-hashed temp password)
- `components/settings/security-tab.tsx` — Static info panel about session security (JWT HS256, httpOnly cookie, DB-backed revocation)
- `components/settings/signing-keys-tab.tsx` — Shows RSA key pair generation instructions; checks `LICENSE_PRIVATE_KEY` env var to report key status

## Key decisions

- Admin invite creates user with temp password `TempPass123!`; real flow would email credentials
- Signing keys tab is informational only — key generation happens outside the app via `openssl genrsa`
- All three tabs are Client Components (`"use client"`) to support form interactions and state
