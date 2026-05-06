"use client"

import { setLicenseStatusAction, resetLicenseActivationsAction } from "@/actions/licenses"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { License } from "@/types"
import { ChevronDown } from "lucide-react"

export function LicenseActions({ license }: { license: License }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}>
        Actions <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {license.status !== "ACTIVE" && (
          <DropdownMenuItem onClick={() => setLicenseStatusAction(license.id, "ACTIVE")}>Activate</DropdownMenuItem>
        )}
        {license.status !== "SUSPENDED" && (
          <DropdownMenuItem onClick={() => setLicenseStatusAction(license.id, "SUSPENDED")}>Suspend</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => resetLicenseActivationsAction(license.id)}>
          Reset All Activations
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500"
          onClick={() => setLicenseStatusAction(license.id, "REVOKED")}
        >
          Revoke License
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
