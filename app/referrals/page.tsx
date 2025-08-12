"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransferRequests } from "@/components/referrals/transfer-requests"
import { ReferralManagement } from "@/components/referrals/referral-management"
import { TransferHistory } from "@/components/referrals/transfer-history"
import { EmergencyTransfers } from "@/components/referrals/emergency-transfers"
import { useAuth } from "@/lib/auth/auth-context"

export default function ReferralsPage() {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState("requests")

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transferts et Référencements</h1>
        <p className="text-gray-600">Gestion des transferts de patients et référencements médicaux</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="referrals">Référencements</TabsTrigger>
          <TabsTrigger value="emergency">Urgences</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <TransferRequests />
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralManagement />
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyTransfers />
        </TabsContent>

        <TabsContent value="history">
          <TransferHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
