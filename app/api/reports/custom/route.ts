import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { name, fields, dateRange } = await request.json()

    // Mock CSV generation based on selected fields
    const headers = fields
      .map((field: string) => {
        const fieldMap: Record<string, string> = {
          patient_name: "Nom Patient",
          patient_nin: "NIN",
          appointment_date: "Date RDV",
          department: "Département",
          doctor_name: "Médecin",
        }
        return fieldMap[field] || field
      })
      .join(",")

    const mockData = [
      ["Ahmed Benali", "1234567890123", "2024-01-15", "Cardiologie", "Dr. Khelil"],
      ["Fatima Saidi", "9876543210987", "2024-01-16", "Pédiatrie", "Dr. Cherif"],
    ]

    const csvContent = [headers, ...mockData.map((row) => row.join(","))].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${name.toLowerCase().replace(/\s+/g, "-")}.csv`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
