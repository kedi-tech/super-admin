import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

export function SigningKeysTab() {
  const hasKey = !!process.env.LICENSE_PRIVATE_KEY

  return (
    <div className="space-y-4 max-w-lg">
      {!hasKey && (
        <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
            <strong>LICENSE_PRIVATE_KEY</strong> is not set. Offline license file generation will fail.
            Generate an RSA-2048 key pair and set the PEM-encoded private key in your .env file.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">RSA Key Pair</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-500">
          <p>
            Offline license files are signed with an RSA-2048 private key using RS256. The desktop POS embeds the
            corresponding public key to verify license authenticity.
          </p>
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 font-mono text-xs space-y-1">
            <p># Generate a key pair:</p>
            <p>openssl genrsa -out private.pem 2048</p>
            <p>openssl rsa -in private.pem -pubout -out public.pem</p>
            <p className="mt-2"># Then set in .env:</p>
            <p>LICENSE_PRIVATE_KEY=&quot;$(cat private.pem)&quot;</p>
          </div>
          <p>Private key status:{" "}
            <span className={hasKey ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
              {hasKey ? "Configured ✓" : "Not configured ✗"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
