# Phase 12 — Support Module

## What was built

- `actions/support.ts` — `getTickets`, `getTicket`, `createTicketAction`, `updateTicketStatusAction`, `addTicketNoteAction`
- `app/(admin)/super-admin/support/page.tsx` — Server component list view with `force-dynamic`
- `app/(admin)/super-admin/support/[id]/page.tsx` — Server component detail with `force-dynamic`
- `components/support/ticket-note-thread.tsx` — Client component for note thread with reply form
- Notes display: amber background for internal notes, white for external
- Priority badges: LOW=zinc, MEDIUM=blue, HIGH=amber, CRITICAL=red
