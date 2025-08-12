import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "performance"
    const department = searchParams.get("department") || "all"

    // Mock operational report data
    const reportData = {
      staff_performance: [
        { name: "Dr. Benali", patients: 145, efficiency: 92, department: "Cardiologie" },
        { name: "Dr. Khelil", patients: 132, efficiency: 88, department: "Pédiatrie" },
      ],
      department_metrics: [
        { name: "Urgences", occupancy: 85, avg_wait_time: 25, satisfaction: 78 },
        { name: "Cardiologie", occupancy: 72, avg_wait_time: 18, satisfaction: 92 },
      ],
      efficiency_metrics: {
        overall_efficiency: 90,
        patient_throughput: 234,
        resource_utilization: 78,
        cost_per_patient: 156,
      },
    }

    // Generate PDF content
    const pdfContent = `Rapport Opérationnel\n\nType: ${type}\nDépartement: ${department}\nEfficacité globale: ${reportData.efficiency_metrics.overall_efficiency}%`

    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=rapport-operationnel.pdf",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
