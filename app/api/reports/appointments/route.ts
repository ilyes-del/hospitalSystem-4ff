import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"

    // Mock appointment report data
    const reportData = {
      total_appointments: 1247,
      completed: 1089,
      cancelled: 98,
      no_show: 60,
      by_department: [
        { department: "Cardiologie", count: 245, completion_rate: 92 },
        { department: "Pédiatrie", count: 198, completion_rate: 88 },
        { department: "Urgences", count: 456, completion_rate: 85 },
        { department: "Chirurgie", count: 178, completion_rate: 95 },
      ],
      by_month: [
        { month: "Jan", appointments: 98, completed: 85 },
        { month: "Fév", appointments: 112, completed: 98 },
        { month: "Mar", appointments: 134, completed: 118 },
      ],
    }

    if (format === "pdf") {
      // Return PDF blob
      const pdfContent = `Rapport des Rendez-vous\n\nTotal: ${reportData.total_appointments}\nComplétés: ${reportData.completed}`
      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=rapport-rdv.pdf",
        },
      })
    }

    return NextResponse.json(reportData)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
