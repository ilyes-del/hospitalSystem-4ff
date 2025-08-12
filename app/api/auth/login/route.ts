import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/auth/middleware"
import { ROLE_PERMISSIONS } from "@/lib/auth/types"

// Static users for demo - one for each role
const STATIC_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@hca.dz",
    full_name: "Administrateur Système",
    role: "admin" as const,
    department: "Administration",
    hospital_id: "hospital-1",
    hospital_name: "Hôpital Central d'Alger",
    hospital_code: "HCA001",
  },
  {
    id: "2",
    username: "docteur",
    password: "doc123",
    email: "docteur@hca.dz",
    full_name: "Dr. Ahmed Benali",
    role: "doctor" as const,
    department: "Cardiologie",
    hospital_id: "hospital-1",
    hospital_name: "Hôpital Central d'Alger",
    hospital_code: "HCA001",
  },
  {
    id: "3",
    username: "infirmier",
    password: "nurse123",
    email: "infirmier@hca.dz",
    full_name: "Fatima Khelifi",
    role: "nurse" as const,
    department: "Urgences",
    hospital_id: "hospital-1",
    hospital_name: "Hôpital Central d'Alger",
    hospital_code: "HCA001",
  },
  {
    id: "4",
    username: "pharmacien",
    password: "pharm123",
    email: "pharmacien@hca.dz",
    full_name: "Mohamed Cherif",
    role: "pharmacist" as const,
    department: "Pharmacie",
    hospital_id: "hospital-1",
    hospital_name: "Hôpital Central d'Alger",
    hospital_code: "HCA001",
  },
  {
    id: "5",
    username: "receptionniste",
    password: "recep123",
    email: "receptionniste@hca.dz",
    full_name: "Amina Boudjemaa",
    role: "receptionist" as const,
    department: "Accueil",
    hospital_id: "hospital-1",
    hospital_name: "Hôpital Central d'Alger",
    hospital_code: "HCA001",
  },
  {
    id: "6",
    username: "ilyes",
    password: "123",
    email: "ilyes@hca.dz",
    full_name: "Ilyes",
    role: "admin" as const,
    department: "Administration",
    hospital_id: "hospital-1",
    hospital_name: "Hôpital Central d'Alger",
    hospital_code: "HCA001",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password, hospitalCode } = await request.json()

    if (!username || !password || !hospitalCode) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    const user = STATIC_USERS.find(
      (u) => u.username === username && u.password === password && u.hospital_code === hospitalCode,
    )

    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Create auth user object
    const authUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department,
      hospital_id: user.hospital_id,
      hospital_name: user.hospital_name,
      hospital_code: user.hospital_code,
      permissions: ROLE_PERMISSIONS[user.role] || [],
    }

    // Generate simple token (no encryption)
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
