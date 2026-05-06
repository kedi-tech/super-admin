"use client"

import { setTicketStatusAction } from "@/actions/support"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { SupportTicket } from "@/types"
import { ChevronDown } from "lucide-react"

export function TicketActions({ ticket }: { ticket: SupportTicket }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}>
        Actions <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ticket.status !== "IN_PROGRESS" && (
          <DropdownMenuItem onClick={() => setTicketStatusAction(ticket.id, "IN_PROGRESS")}>Mark In Progress</DropdownMenuItem>
        )}
        {ticket.status !== "RESOLVED" && (
          <DropdownMenuItem onClick={() => setTicketStatusAction(ticket.id, "RESOLVED")}>Mark Resolved</DropdownMenuItem>
        )}
        {ticket.status !== "CLOSED" && (
          <DropdownMenuItem className="text-zinc-500" onClick={() => setTicketStatusAction(ticket.id, "CLOSED")}>Close Ticket</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
