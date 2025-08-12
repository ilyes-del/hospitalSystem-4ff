import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import type { AuthUser } from "./types"
import { RateLimiter, AuditLogger } from "./security"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret-change-in-production"

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export class JWTManager {
  static generateTokenPair(user: AuthUser): TokenPair {
    const accessToken = jwt.sign(
      {
        user,
        type: "access",
      },
      JWT_SECRET,
      { expiresIn: "15m" }, // Short-lived access token
    )

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: "refresh",
      },
      REFRESH_SECRET,
      { expiresIn: "7d" }, // Long-lived refresh token
    )

    return { accessToken, refreshToken }
  }

  static verifyAccessToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (decoded.type !== "access") return null
      return decoded.user
    } catch (error) {
      return null
    }
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as any
      if (decoded.type !== "refresh") return null
      return { userId: decoded.userId }
    } catch (error) {
      return null
    }
  }

  static generateAccessToken(user: AuthUser): string {
    return jwt.sign(
      {
        user,
        type: "access",
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    )
  }
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  requiredPermissions?: string[],
) {
  return async (req: NextRequest) => {
    const clientIP = req.ip || req.headers.get("x-forwarded-for") || "unknown"

    // Rate limiting
    if (RateLimiter.isRateLimited(clientIP)) {
      const remainingTime = RateLimiter.getRemainingTime(clientIP)
      return NextResponse.json(
        {
          error: "Trop de tentatives. Réessayez plus tard.",
          retryAfter: Math.ceil(remainingTime / 1000),
        },
        { status: 429 },
      )
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      await AuditLogger.logAction("AUTH_FAILED", "anonymous", { reason: "No token provided" }, clientIP)
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = JWTManager.verifyAccessToken(token)
    if (!user) {
      await AuditLogger.logAction("AUTH_FAILED", "anonymous", { reason: "Invalid token" }, clientIP)
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some((permission) => user.permissions.includes(permission))
      if (!hasPermission) {
        await AuditLogger.logAction(
          "ACCESS_DENIED",
          user.id,
          { requiredPermissions, userPermissions: user.permissions },
          clientIP,
        )
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }

    // Add user to request
    const authenticatedReq = req as AuthenticatedRequest
    authenticatedReq.user = user

    // Log successful authentication
    await AuditLogger.logAction("AUTH_SUCCESS", user.id, { endpoint: req.url }, clientIP)

    return handler(authenticatedReq)
  }
}

export function requireRole(roles: string | string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const user = req.user!
      const allowedRoles = Array.isArray(roles) ? roles : [roles]

      if (!allowedRoles.includes(user.role)) {
        const clientIP = req.ip || req.headers.get("x-forwarded-for") || "unknown"
        await AuditLogger.logAction(
          "ROLE_ACCESS_DENIED",
          user.id,
          { requiredRoles: allowedRoles, userRole: user.role },
          clientIP,
        )
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      return handler(req)
    })
  }
}

export function requirePermission(permission: string) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const user = req.user!

      if (!user.permissions.includes(permission)) {
        const clientIP = req.ip || req.headers.get("x-forwarded-for") || "unknown"
        await AuditLogger.logAction(
          "PERMISSION_DENIED",
          user.id,
          { requiredPermission: permission, userPermissions: user.permissions },
          clientIP,
        )
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      return handler(req)
    })
  }
}
