# Phase 10 — Device Module

## What was built

- `actions/devices.ts` — `getDevices`, `setDeviceStatusAction`
- `app/(admin)/super-admin/devices/page.tsx` — Client component
- Table shows: device ID, customer, hardware fingerprint, OS, app version, last seen, status
- Status can be toggled ACTIVE ↔ SUSPENDED from the table

## Key decisions

- Client component for TanStack Table serialization reason
- Device status changes write to AuditLog
