"use client"

import { setCustomerStatusAction } from "@/actions/customers"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Customer } from "@/types"
import { ChevronDown } from "lucide-react"

export function CustomerActions({ customer }: { customer: Customer }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}>
        Actions <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {customer.status !== "ACTIVE" && (
          <DropdownMenuItem onClick={() => setCustomerStatusAction(customer.id, "ACTIVE")}>
            Activate customer
          </DropdownMenuItem>
        )}
        {customer.status !== "SUSPENDED" && (
          <DropdownMenuItem onClick={() => setCustomerStatusAction(customer.id, "SUSPENDED")}>
            Suspend customer
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {customer.status !== "INACTIVE" && (
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => setCustomerStatusAction(customer.id, "INACTIVE")}
          >
            Deactivate customer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
