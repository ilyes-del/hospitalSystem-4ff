import { type NextRequest, NextResponse } from "next/server"
import { InputValidator, AuditLogger } from "@/lib/auth/security"
import crypto from "crypto"
import { PasswordSecurity } from "@/lib/auth/password-security" // Import PasswordSecurity

// Mock password reset token storage - replace with database in production
const resetTokens = new Map<string, { email: string; expires: number }>()

export async function POST(request: NextRequest) {
  const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  try {
    const { email } = await request.json()

    if (!email || !InputValidator.validateEmail(email)) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 })
    }

    // In production, check if email exists in database
    const userExists = email === "ilyes@hca.dz" // Mock check

    if (!userExists) {
      // Don't reveal if email exists or not for security
      await AuditLogger.logAction("PASSWORD_RESET_ATTEMPTED", "anonymous", { email, clientIP }, clientIP)
      return NextResponse.json({ message: "Si cette adresse email existe, un lien de réinitialisation a été envoyé." })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expires = Date.now() + 60 * 60 * 1000 // 1 hour

    // Store reset token (in production, store in database)
    resetTokens.set(resetToken, { email, expires })

    // In production, send email with reset link
    console.log(`Password reset link: /reset-password?token=${resetToken}`)

    await AuditLogger.logAction("PASSWORD_RESET_REQUESTED", "anonymous", { email, clientIP }, clientIP)

    return NextResponse.json({
      message: "Un lien de réinitialisation a été envoyé à votre adresse email.",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    await AuditLogger.logAction("PASSWORD_RESET_ERROR", "anonymous", { error: error.message, clientIP }, clientIP)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token et nouveau mot de passe requis" }, { status: 400 })
    }

    // Verify reset token
    const resetData = resetTokens.get(token)
    if (!resetData || resetData.expires < Date.now()) {
      await AuditLogger.logAction("PASSWORD_RESET_FAILED", "anonymous", { reason: "Invalid token", clientIP }, clientIP)
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 })
    }

    // Validate new password
    const passwordValidation = PasswordSecurity.validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.errors.join(", ") }, { status: 400 })
    }

    // In production, hash password and update in database
    const hashedPassword = await PasswordSecurity.hashPassword(newPassword)
    console.log(`New password hash for ${resetData.email}: ${hashedPassword}`)

    // Remove used token
    resetTokens.delete(token)

    await AuditLogger.logAction("PASSWORD_RESET_SUCCESS", "anonymous", { email: resetData.email, clientIP }, clientIP)

    return NextResponse.json({ message: "Mot de passe réinitialisé avec succès" })
  } catch (error) {
    console.error("Password reset confirmation error:", error)
    await AuditLogger.logAction("PASSWORD_RESET_ERROR", "anonymous", { error: error.message, clientIP }, clientIP)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
