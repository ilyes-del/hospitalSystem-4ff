import { type NextRequest, NextResponse } from "next/server"
import { JWTManager } from "@/lib/auth/enhanced-middleware"
import { AuditLogger } from "@/lib/auth/security"
import { ROLE_PERMISSIONS } from "@/lib/auth/types"

// Mock user lookup - replace with database query in production
const getUserById = async (userId: string) => {
  if (userId === "1") {
    return {
      id: "1",
      username: "ilyes",
      email: "ilyes@hca.dz",
      full_name: "Ilyes",
      role: "admin" as const,
      department: "Administration",
      hospital_id: "hospital-1",
      hospital_name: "Hôpital Central d'Alger",
      hospital_code: "HCA001",
      permissions: ROLE_PERMISSIONS.admin,
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token requis" }, { status: 400 })
    }

    // Verify refresh token
    const decoded = JWTManager.verifyRefreshToken(refreshToken)
    if (!decoded) {
      await AuditLogger.logAction(
        "REFRESH_FAILED",
        "anonymous",
        { reason: "Invalid refresh token", clientIP },
        clientIP,
      )
      return NextResponse.json({ error: "Refresh token invalide" }, { status: 401 })
    }

    // Get user data (in production, query database)
    const user = await getUserById(decoded.userId)
    if (!user) {
      await AuditLogger.logAction("REFRESH_FAILED", decoded.userId, { reason: "User not found", clientIP }, clientIP)
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 401 })
    }

    // Generate new access token
    const newAccessToken = JWTManager.generateAccessToken(user)

    await AuditLogger.logAction("TOKEN_REFRESHED", user.id, { clientIP }, clientIP)

    return NextResponse.json({
      accessToken: newAccessToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    await AuditLogger.logAction("REFRESH_ERROR", "anonymous", { error: error.message, clientIP }, clientIP)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
