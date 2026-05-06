# Phase 7 — License Module ✅

## Files Created
- `actions/licenses.ts` — getLicenses, getLicense, generateLicenseAction, setLicenseStatusAction, resetLicenseActivationsAction, generateOfflineLicenseFileAction
- `app/(admin)/super-admin/licenses/page.tsx` — License list page
- `app/(admin)/super-admin/licenses/[id]/page.tsx` — License detail with 3-4 tabs
- `components/licenses/license-table-client.tsx` — TanStack table with actions
- `components/licenses/generate-license-sheet.tsx` — Slide-out sheet with generation form
- `components/licenses/license-actions.tsx` — Actions dropdown (activate/suspend/revoke/reset)
- `components/licenses/license-devices-tab.tsx` — Activated devices with deactivate action
- `components/licenses/license-validation-logs-tab.tsx` — API validation log table
- `components/licenses/offline-license-panel.tsx` — Offline .lic file generation + download

## Key Features
- License key format: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX (crypto.randomUUID based)
- Offline license: RS256 JWT signed with private key (jose), stored in DB
- Download .lic file as JSON blob in browser
- `LICENSE_PRIVATE_KEY` env var required for offline file generation
- Validation logs show success/fail per IP + reason
- Reset Activations deactivates all devices for that license
