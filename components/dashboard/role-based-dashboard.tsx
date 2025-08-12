"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { AdminDashboard } from "./admin-dashboard"
import { EnhancedDoctorDashboard } from "./enhanced-doctor-dashboard"
import { NurseDashboard } from "./nurse-dashboard"
import { PharmacistDashboard } from "./pharmacist-dashboard"
import { ReceptionistDashboard } from "./receptionist-dashboard"

export function RoleBasedDashboard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "doctor":
      return <EnhancedDoctorDashboard />
    case "nurse":
      return <NurseDashboard />
    case "pharmacist":
      return <PharmacistDashboard />
    case "receptionist":
      return <ReceptionistDashboard />
    default:
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-muted-foreground">Rôle non reconnu</h2>
          <p className="text-sm text-muted-foreground mt-2">Veuillez contacter l'administrateur système.</p>
        </div>
      )
  }
}
