"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navSections } from "./nav-items"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { logoutAction } from "@/actions/auth"
import { LogOut, Shield } from "lucide-react"

interface SidebarProps {
  adminName: string
  adminRole: string
}

export function Sidebar({ adminName, adminRole }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col h-full w-64 bg-zinc-950 border-r border-zinc-800/60">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800/60">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 shrink-0">
          <Shield className="w-4 h-4 text-zinc-300" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">KediTech Super Admin</p>
          <p className="text-xs text-zinc-500">Internal Platform</p>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/super-admin/dashboard" && pathname.startsWith(item.href))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors",
                          active
                            ? "bg-zinc-800 text-white font-medium"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User footer */}
      <Separator className="bg-zinc-800/60" />
      <div className="px-3 py-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md">
          <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">{adminName}</p>
            <p className="text-[10px] text-zinc-500 truncate">{adminRole.replace("_", " ")}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-zinc-500 hover:text-zinc-200 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
