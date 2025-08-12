import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/auth/middleware"
import { ROLE_PERMISSIONS } from "@/lib/auth/types"

// Static user for demo - replace with actual database calls in production
const STATIC_USER = {
  id: "1",
  username: "ilyes",
  email: "ilyes@hca.dz",
  full_name: "Ilyes",
  role: "admin" as const,
  department: "Administration",
  hospital_id: "hospital-1",
  hospital_name: "Hôpital Central d'Alger",
  hospital_code: "HCA001",
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, hospitalCode } = await request.json()

    if (!username || !password || !hospitalCode) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (username !== "ilyes" || password !== "123" || hospitalCode !== "HCA001") {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Create auth user object
    const authUser = {
      id: STATIC_USER.id,
      username: STATIC_USER.username,
      email: STATIC_USER.email,
      full_name: STATIC_USER.full_name,
      role: STATIC_USER.role,
      department: STATIC_USER.department,
      hospital_id: STATIC_USER.hospital_id,
      hospital_name: STATIC_USER.hospital_name,
      hospital_code: STATIC_USER.hospital_code,
      permissions: ROLE_PERMISSIONS[STATIC_USER.role] || [],
    }

    // Generate JWT token
    const token = generateToken(authUser)

    // Create session response
    const session = {
      user: authUser,
      token,
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
