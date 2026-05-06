# Phase 3 — Authentication ✅

## Files Created
- `lib/auth.ts` — Session creation (JWT via jose), cookie management, DB session tracking
- `middleware.ts` — Route protection: redirects unauthenticated users to /login
- `actions/auth.ts` — `loginAction` (Server Action) + `logoutAction`
- `app/(auth)/login/page.tsx` — Dark login page with email/password form
- `app/(auth)/layout.tsx` — Minimal auth layout

## How It Works
1. User submits login form → `loginAction` server action runs
2. bcrypt verifies password against `AdminUser.passwordHash`
3. JWT signed with HS256 (jose) and stored in httpOnly cookie (`ags_admin_session`)
4. Token hash stored in `AdminSession` table (allows session revocation)
5. Middleware verifies JWT on every request; expired/invalid → redirect to /login
6. Logout deletes DB session + clears cookie

## Security Notes
- httpOnly cookie prevents XSS token theft
- JWT verified in middleware (edge-compatible with jose)
- DB session check allows instant revocation (token blacklist via hash)
- Login action writes to AuditLog on success
