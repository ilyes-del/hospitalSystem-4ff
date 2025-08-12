import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Mock internal referrals data
    const referrals = [
      {
        id: "REF001",
        patient_nin: "1234567890123",
        patient_name: "Ahmed Benali",
        from_department: "Médecine générale",
        to_department: "Cardiologie",
        referring_doctor: "Dr. Saidi",
        target_doctor: "Dr. Khelil",
        reason: "Suspicion d'arythmie cardiaque",
        priority: "normal",
        status: "pending",
        created_at: "2024-01-15T10:30:00Z",
      },
    ]

    return NextResponse.json(referrals)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const referralData = await request.json()

    // Mock referral creation
    const newReferral = {
      id: `REF${Date.now()}`,
      ...referralData,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(newReferral, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
