"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientReports } from "@/components/reports/patient-reports"
import { AppointmentReports } from "@/components/reports/appointment-reports"
import { StockReports } from "@/components/reports/stock-reports"
import { OperationalReports } from "@/components/reports/operational-reports"
import { CustomReports } from "@/components/reports/custom-reports"
import { useAuth } from "@/lib/auth/auth-context"
import { PERMISSIONS } from "@/lib/auth/types"

export default function ReportsPage() {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState("patients")

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
        <p className="text-gray-600">Générez et consultez les rapports du système hospitalier</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="operational">Opérationnel</TabsTrigger>
          {hasPermission(PERMISSIONS.MANAGE_USERS) && <TabsTrigger value="custom">Personnalisé</TabsTrigger>}
        </TabsList>

        <TabsContent value="patients">
          <PatientReports />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentReports />
        </TabsContent>

        <TabsContent value="stock">
          <StockReports />
        </TabsContent>

        <TabsContent value="operational">
          <OperationalReports />
        </TabsContent>

        {hasPermission(PERMISSIONS.MANAGE_USERS) && (
          <TabsContent value="custom">
            <CustomReports />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
