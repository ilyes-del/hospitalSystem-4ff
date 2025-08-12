import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

async function handler(request: NextRequest) {
  // Mock admin statistics data
  const stats = {
    totalPatients: 2847,
    totalAppointments: 156,
    totalStaff: 45,
    systemHealth: 98,
    revenue: 1250000,
    alerts: 3,
  }

  return NextResponse.json(stats)
}

export const GET = withAuth(handler, ["admin"])
