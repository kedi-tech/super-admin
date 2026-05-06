# Phase 15 — Audit Logs Module

## What was built

- `app/(admin)/super-admin/logs/page.tsx` — Server component with `force-dynamic`
- Fetches last 200 audit log entries ordered by `createdAt DESC`
- Table shows: admin name (or "System"), action (monospace badge), target type, target ID (truncated), IP address, timestamp
- AuditLog entries are written by all write actions (customer create/update/status, license generate/status/reset, device deactivate, payment verify/refund, ticket status, ticket note)
