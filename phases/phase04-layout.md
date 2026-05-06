# Phase 4 — App Shell Layout ✅

## Files Created
- `components/layout/nav-items.ts` — Nav sections config (6 sections, 14 items)
- `components/layout/sidebar.tsx` — Dark sidebar (logo, nav, user footer with logout)
- `components/layout/header.tsx` — Top bar with page title + theme toggle
- `components/layout/theme-toggle.tsx` — Sun/Moon toggle using next-themes
- `app/(admin)/layout.tsx` — Protected admin layout (reads session, renders sidebar+header)
- `app/(auth)/layout.tsx` — Minimal auth layout
- `app/layout.tsx` — Root layout with ThemeProvider + TooltipProvider
- `app/page.tsx` — Redirects / → /super-admin/dashboard

## Shared Components Created
- `components/shared/page-header.tsx` — Page title + optional action button
- `components/shared/status-badge.tsx` — Color-coded status badges (ACTIVE, SUSPENDED, REVOKED, etc.)
- `components/shared/data-table.tsx` — TanStack Table wrapper with sorting + pagination
- `components/shared/stat-card.tsx` — Dashboard stat card with icon + accent color

## Design Notes
- Sidebar: zinc-950 background, zinc-800 active item, scrollable nav
- Header: 56px, shows current page label + theme toggle
- Theme: dark default, class-based (next-themes)
- Layout: fixed sidebar (256px) + flex-1 content area with scroll
