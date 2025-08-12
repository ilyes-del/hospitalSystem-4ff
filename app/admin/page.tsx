"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SystemMonitoring } from "@/components/admin/system-monitoring"
import { AuditLogs } from "@/components/admin/audit-logs"
import { RoleManagement } from "@/components/admin/role-management"
import { SystemAnalytics } from "@/components/admin/system-analytics"
import { DatabaseManagement } from "@/components/admin/database-management"
import { useAuth } from "@/lib/auth/auth-context"
import { PERMISSIONS } from "@/lib/auth/types"

export default function AdminPage() {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState("monitoring")

  // Check if user has admin permissions
  if (!hasPermission(PERMISSIONS.MANAGE_USERS)) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600">Gestion et surveillance du système hospitalier</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monitoring">Surveillance</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <SystemMonitoring />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <SystemAnalytics />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
