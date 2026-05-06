"use client"

import { useState, useTransition } from "react"
import { addTicketNoteAction } from "@/actions/support"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDateTime } from "@/lib/format"
import type { AdminUser, TicketNote } from "@/types"
import { cn } from "@/lib/utils"

type NoteWithAuthor = TicketNote & { author: Pick<AdminUser, "name" | "email"> }

export function TicketNoteThread({ notes, ticketId }: { notes: NoteWithAuthor[]; ticketId: string }) {
  const [body, setBody] = useState("")
  const [isPending, startTransition] = useTransition()

  function submit() {
    if (!body.trim()) return
    startTransition(async () => {
      await addTicketNoteAction(ticketId, body, true)
      setBody("")
    })
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Notes</h3>

      {notes.length === 0 && (
        <p className="text-sm text-zinc-400 py-2">No notes yet.</p>
      )}

      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className={cn(
              "rounded-lg px-4 py-3 text-sm border",
              note.isInternal
                ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">{note.author.name}</span>
              {note.isInternal && (
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">Internal</span>
              )}
              <span className="text-xs text-zinc-400 ml-auto">{formatDateTime(note.createdAt)}</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{note.body}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add an internal note…"
          rows={3}
        />
        <Button size="sm" onClick={submit} disabled={isPending || !body.trim()}>
          {isPending ? "Adding…" : "Add Note"}
        </Button>
      </div>
    </div>
  )
}
