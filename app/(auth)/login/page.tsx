"use client"

import { useActionState } from "react"
import { loginAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState = { error: undefined, success: false }

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm space-y-8 px-6">
        {/* Logo / Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 mb-2">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">KediTech Super Admin</h1>
          <p className="text-sm text-zinc-400">Internal operations platform</p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300 text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@keditech.com"
              autoComplete="email"
              required
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300 text-sm">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-medium"
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-600">
          KediTech Internal — Restricted Access
        </p>
      </div>
    </div>
  )
}
