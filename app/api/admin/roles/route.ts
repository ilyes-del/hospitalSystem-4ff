import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"
import { PERMISSIONS } from "@/lib/auth/types"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Mock roles data
    const roles = [
      {
        id: "admin",
        name: "Administrateur",
        description: "Accès complet au système",
        permissions: Object.values(PERMISSIONS),
        user_count: 3,
      },
      {
        id: "doctor",
        name: "Médecin",
        description: "Accès aux patients et consultations",
        permissions: [PERMISSIONS.VIEW_PATIENTS, PERMISSIONS.MANAGE_APPOINTMENTS, PERMISSIONS.VIEW_MEDICAL_RECORDS],
        user_count: 45,
      },
      {
        id: "nurse",
        name: "Infirmier",
        description: "Accès aux soins et suivi patients",
        permissions: [PERMISSIONS.VIEW_PATIENTS, PERMISSIONS.VIEW_APPOINTMENTS],
        user_count: 78,
      },
    ]

    return NextResponse.json(roles)
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

    const roleData = await request.json()

    // Mock role creation
    const newRole = {
      id: `role_${Date.now()}`,
      ...roleData,
      created_at: new Date().toISOString(),
      user_count: 0,
    }

    return NextResponse.json(newRole, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
