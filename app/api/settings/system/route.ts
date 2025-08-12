import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Mock system settings
    const settings = {
      language: "fr",
      timezone: "Africa/Algiers",
      date_format: "DD/MM/YYYY",
      notifications_enabled: true,
      email_notifications: true,
      sms_notifications: false,
      backup_frequency: "daily",
      session_timeout: 30,
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

    // Mock settings update
    return NextResponse.json({
      message: "Paramètres système mis à jour avec succès",
      settings,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
