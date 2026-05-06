# Phase 1 — Dependencies & Setup ✅

## Installed Packages

### Core
- `prisma` + `@prisma/client` — ORM
- `react-hook-form` + `@hookform/resolvers` — Form state
- `zod` — Schema validation
- `motion` — Animations (Framer Motion)
- `next-themes` — Dark/light mode
- `recharts` — Charts
- `@tanstack/react-table` — Data tables
- `jose` — JWT signing (auth + offline license signing)
- `uuid` + `@types/uuid` — License key generation
- `date-fns` — Date formatting
- `clsx` + `tailwind-merge` — Class utilities
- `lucide-react` — Icons

### shadcn/ui Components Added
button, card, badge, input, label, select, separator, sheet, dialog,
dropdown-menu, table, tabs, avatar, form, textarea, checkbox, tooltip,
popover, command, progress, skeleton, alert, switch, scroll-area,
navigation-menu, breadcrumb, collapsible, input-group

## Notes
- shadcn initialized with `-d` (defaults) flag — New York style, zinc base, Tailwind v4
- `components.json` written, `lib/utils.ts` created, `globals.css` updated
