"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/settings/user-management"
import { HospitalConfig } from "@/components/settings/hospital-config"
import { SystemSettings } from "@/components/settings/system-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { useAuth } from "@/lib/auth/auth-context"
import { PERMISSIONS } from "@/lib/auth/types"

export default function SettingsPage() {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState("hospital")

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez les paramètres de l'hôpital et du système</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hospital">Hôpital</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          {hasPermission(PERMISSIONS.MANAGE_USERS) && <TabsTrigger value="users">Utilisateurs</TabsTrigger>}
        </TabsList>

        <TabsContent value="hospital">
          <HospitalConfig />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        {hasPermission(PERMISSIONS.MANAGE_USERS) && (
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
