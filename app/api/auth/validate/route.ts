import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 })
    }

    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 })
    }

    // Return session data
    const session = {
      user,
      token,
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ error: "Erreur de validation" }, { status: 500 })
  }
}
