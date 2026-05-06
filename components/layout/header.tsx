"use client"

import { usePathname } from "next/navigation"
import { navSections } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const pathname = usePathname()

  // Find current page label
  const currentItem = navSections
    .flatMap((s) => s.items)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/super-admin/dashboard" && pathname.startsWith(item.href))
    )

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {currentItem?.label ?? "Super Admin"}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
