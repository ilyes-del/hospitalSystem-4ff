import { type NextRequest, NextResponse } from "next/server"

const mockTransferRequests = [
  {
    id: "TR001",
    patient_nin: "1234567890123",
    patient_name: "Ahmed Benali",
    from_hospital: "HCA001",
    to_hospital: "HCA002",
    department: "cardiologie",
    priority: "high",
    status: "pending",
    reason: "Besoin d'une intervention cardiaque spécialisée",
    medical_summary: "Patient de 65 ans avec infarctus du myocarde, nécessite une angioplastie urgente",
    requested_by: "Dr. Fatima Khelil",
    requested_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "TR002",
    patient_nin: "9876543210987",
    patient_name: "Amina Cherif",
    from_hospital: "HCA001",
    to_hospital: "HCA003",
    department: "neurologie",
    priority: "urgent",
    status: "approved",
    reason: "AVC ischémique, besoin de thrombolyse",
    medical_summary: "Patiente de 58 ans, AVC ischémique dans les 3 heures, candidate à la thrombolyse",
    requested_by: "Dr. Mohamed Saidi",
    requested_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    approved_by: "Dr. Karim Boumediene",
    approved_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
]

export async function GET() {
  try {
    return NextResponse.json(mockTransferRequests)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transfer requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newRequest = {
      id: `TR${String(mockTransferRequests.length + 1).padStart(3, "0")}`,
      ...data,
      from_hospital: "HCA001",
      status: "pending",
      requested_by: "Dr. Current User",
      requested_at: new Date().toISOString(),
    }

    mockTransferRequests.push(newRequest)

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: "Transfer request created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transfer request" }, { status: 500 })
  }
}
