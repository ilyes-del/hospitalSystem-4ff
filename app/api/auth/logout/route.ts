import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

export const POST = withAuth(async (req) => {
  try {
    // In a real implementation, you might:
    // 1. Add token to blacklist
    // 2. Log the logout event
    // 3. Update last_logout timestamp in database

    const user = req.user!

    // Log audit event
    console.log(`User ${user.username} logged out from hospital ${user.hospital_code}`)

    return NextResponse.json({ message: "Déconnexion réussie" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 })
  }
})
