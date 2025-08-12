import { type NextRequest, NextResponse } from "next/server"
import { JWTManager } from "@/lib/auth/enhanced-middleware"
import { RateLimiter, InputValidator, AuditLogger } from "@/lib/auth/security"
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
  // In production, this would be a hashed password
  passwordHash: "hashed_password_here",
}

export async function POST(request: NextRequest) {
  const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  try {
    // Rate limiting
    if (RateLimiter.isRateLimited(clientIP)) {
      const remainingTime = RateLimiter.getRemainingTime(clientIP)
      await AuditLogger.logAction("LOGIN_RATE_LIMITED", "anonymous", { clientIP }, clientIP)
      return NextResponse.json(
        {
          error: "Trop de tentatives de connexion. Réessayez plus tard.",
          retryAfter: Math.ceil(remainingTime / 1000),
        },
        { status: 429 },
      )
    }

    const body = await request.json()
    const sanitizedInput = InputValidator.sanitizeInput(body)
    const { username, password, hospitalCode } = sanitizedInput

    // Input validation
    if (!username || !password || !hospitalCode) {
      await AuditLogger.logAction("LOGIN_FAILED", "anonymous", { reason: "Missing fields", clientIP }, clientIP)
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Validate input formats
    if (typeof username !== "string" || typeof password !== "string" || typeof hospitalCode !== "string") {
      await AuditLogger.logAction("LOGIN_FAILED", "anonymous", { reason: "Invalid input types", clientIP }, clientIP)
      return NextResponse.json({ error: "Format des données invalide" }, { status: 400 })
    }

    // Check credentials (in production, query database with hashed password comparison)
    if (username !== STATIC_USER.username || password !== "123" || hospitalCode !== STATIC_USER.hospital_code) {
      await AuditLogger.logAction(
        "LOGIN_FAILED",
        "anonymous",
        { username, hospitalCode, reason: "Invalid credentials", clientIP },
        clientIP,
      )
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

    // Generate JWT token pair
    const { accessToken, refreshToken } = JWTManager.generateTokenPair(authUser)

    // Reset rate limiting on successful login
    RateLimiter.reset(clientIP)

    // Log successful login
    await AuditLogger.logAction("LOGIN_SUCCESS", authUser.id, { clientIP }, clientIP)

    // Create session response
    const session = {
      user: authUser,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes for access token
      refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days for refresh token
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Login error:", error)
    await AuditLogger.logAction("LOGIN_ERROR", "anonymous", { error: error.message, clientIP }, clientIP)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
