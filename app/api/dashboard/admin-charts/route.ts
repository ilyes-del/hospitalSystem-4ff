import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

async function handler(request: NextRequest) {
  // Mock chart data for admin dashboard
  const chartData = {
    appointments: [
      { day: "Lun", count: 45 },
      { day: "Mar", count: 52 },
      { day: "Mer", count: 38 },
      { day: "Jeu", count: 61 },
      { day: "Ven", count: 55 },
      { day: "Sam", count: 28 },
      { day: "Dim", count: 15 },
    ],
    revenue: [
      { month: "Août", amount: 980000 },
      { month: "Sept", amount: 1120000 },
      { month: "Oct", amount: 1050000 },
      { month: "Nov", amount: 1180000 },
      { month: "Déc", amount: 1250000 },
      { month: "Jan", amount: 1320000 },
    ],
    departments: [
      { name: "Urgences", value: 35 },
      { name: "Cardiologie", value: 25 },
      { name: "Pédiatrie", value: 20 },
      { name: "Chirurgie", value: 15 },
      { name: "Autres", value: 5 },
    ],
  }

  return NextResponse.json(chartData)
}

export const GET = withAuth(handler, ["admin"])
