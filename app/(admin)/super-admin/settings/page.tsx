export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminUsersTab } from "@/components/settings/admin-users-tab"
import { SecurityTab } from "@/components/settings/security-tab"
import { SigningKeysTab } from "@/components/settings/signing-keys-tab"

async function getAdminUsers() {
  try {
    return await prisma.adminUser.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
    })
  } catch {
    return []
  }
}

export default async function SettingsPage() {
  const adminUsers = await getAdminUsers()

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" description="System configuration and admin management" />
      <Tabs defaultValue="admins">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900">
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="signing">Signing Keys</TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="mt-4">
          <AdminUsersTab users={adminUsers} />
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="signing" className="mt-4">
          <SigningKeysTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
