import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

// GET /api/dashboard/stats - Get dashboard statistics
export const GET = withAuth(async (req) => {
  try {
    const user = req.user!

    // In a real implementation, these would be actual database queries
    // For now, return mock data that simulates real statistics
    const stats = {
      total_patients: 1247,
      todays_appointments: 23,
      pending_appointments: 8,
      low_stock_items: 5,
      critical_stock_items: 2,
      recent_activities: [
        {
          id: "1",
          type: "appointment",
          description: "Nouveau RDV - Ahmed Benali",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          type: "patient",
          description: "Patient enregistré - Fatima Khelifi",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      ],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
})
