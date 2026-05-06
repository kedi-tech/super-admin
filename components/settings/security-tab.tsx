import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function SecurityTab() {
  return (
    <div className="space-y-4 max-w-lg">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Session Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Session Duration</Label>
              <p className="text-xs text-zinc-400 mt-0.5">24 hours (configured in lib/auth.ts)</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enforce 2FA</Label>
              <p className="text-xs text-zinc-400 mt-0.5">Require TOTP for all admin users</p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">IP Allowlist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500">
            IP-based access restriction can be configured at the infrastructure level (reverse proxy, firewall).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
