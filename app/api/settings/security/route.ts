import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Mock security settings
    const settings = {
      password_min_length: 8,
      password_require_uppercase: true,
      password_require_numbers: true,
      password_require_symbols: false,
      session_timeout: 30,
      max_login_attempts: 5,
      lockout_duration: 15,
      two_factor_enabled: false,
      audit_log_retention: 90,
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const settings = await request.json()

    // Mock security settings update
    return NextResponse.json({
      message: "Paramètres de sécurité mis à jour avec succès",
      settings,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
