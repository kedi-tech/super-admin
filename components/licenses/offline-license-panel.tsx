"use client"

import { useState, useTransition } from "react"
import { generateOfflineLicenseFileAction } from "@/actions/licenses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { License } from "@/types"
import { Download, RefreshCw } from "lucide-react"

export function OfflineLicensePanel({ license }: { license: License }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()

  const hasFile = !!license.offlineLicensePayload

  function generate() {
    startTransition(async () => {
      const result = await generateOfflineLicenseFileAction(license.id)
      if (result.error) setError(result.error)
    })
  }

  function download() {
    if (!license.offlineLicensePayload || !license.offlineLicenseSignature) return
    const blob = new Blob(
      [JSON.stringify({ payload: license.offlineLicensePayload, signature: license.offlineLicenseSignature }, null, 2)],
      { type: "application/json" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${license.key}.lic`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-none max-w-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Offline License File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-500">
          Generate a signed offline license file (.lic) for this customer. The desktop POS verifies
          it using KediTech&#39;s public key.
        </p>

        {hasFile ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3">
              <pre className="text-xs text-zinc-600 dark:text-zinc-300 overflow-auto max-h-48">
                {JSON.stringify(license.offlineLicensePayload, null, 2)}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={download} variant="outline" size="sm" className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download .lic file
              </Button>
              <Button onClick={generate} disabled={isPending} variant="ghost" size="sm" className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={generate} disabled={isPending} size="sm">
            {isPending ? "Generating…" : "Generate Offline License File"}
          </Button>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  )
}
