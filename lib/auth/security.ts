"use client"

// Password security utilities
export class PasswordSecurity {
  private static readonly MIN_PASSWORD_LENGTH = 8
  private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push(`Le mot de passe doit contenir au moins ${this.MIN_PASSWORD_LENGTH} caractères`)
    }

    if (!this.PASSWORD_REGEX.test(password)) {
      errors.push(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static async hashPassword(password: string): Promise<string> {
    // Simple base64 encoding for demo - not secure for production
    return btoa(password)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // Simple base64 decoding for demo - not secure for production
    try {
      return atob(hashedPassword) === password
    } catch {
      return false
    }
  }
}

// Rate limiting utilities
export class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map()
  private static readonly MAX_ATTEMPTS = 5
  private static readonly WINDOW_MS = 15 * 60 * 1000 // 15 minutes

  static isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const attempt = this.attempts.get(identifier)

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.WINDOW_MS })
      return false
    }

    if (attempt.count >= this.MAX_ATTEMPTS) {
      return true
    }

    attempt.count++
    return false
  }

  static getRemainingTime(identifier: string): number {
    const attempt = this.attempts.get(identifier)
    if (!attempt) return 0
    return Math.max(0, attempt.resetTime - Date.now())
  }

  static reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

// Input validation and sanitization
export class InputValidator {
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, "")
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateNIN(nin: string): boolean {
    // Algerian NIN validation (16 digits)
    const ninRegex = /^\d{16}$/
    return ninRegex.test(nin)
  }

  static validatePhoneNumber(phone: string): boolean {
    // Algerian phone number validation
    const phoneRegex = /^(\+213|0)[5-7]\d{8}$/
    return phoneRegex.test(phone)
  }

  static sanitizeInput(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        sanitized[key] = this.sanitizeString(value)
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) => (typeof item === "string" ? this.sanitizeString(item) : item))
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }
}

// Audit logging
export class AuditLogger {
  static async logAction(action: string, userId: string, details: any, ipAddress?: string): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      ipAddress,
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "server",
    }

    // In production, send to audit log service
    console.log("AUDIT LOG:", logEntry)

    // Store in database or external logging service
    try {
      await fetch("/api/audit/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      })
    } catch (error) {
      console.error("Failed to log audit entry:", error)
    }
  }
}
