// Authentication middleware utilities

import { type NextRequest, NextResponse } from "next/server"
import type { AuthUser } from "./types"

// Simple token system for demo - replace with proper JWT in production
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser
}

export function verifyToken(token: string): AuthUser | null {
  try {
    // Simple base64 decode for demo purposes
    const decoded = JSON.parse(atob(token.split(".")[1] || ""))

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null
    }

    return decoded.user
  } catch (error) {
    return null
  }
}

export function generateToken(user: AuthUser): string {
  // Simple token generation for demo - replace with proper JWT in production
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({
      user,
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
    }),
  )
  const signature = btoa("demo-signature") // In production, use proper HMAC

  return `${header}.${payload}.${signature}`
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Add user to request
    const authenticatedReq = req as AuthenticatedRequest
    authenticatedReq.user = user

    return handler(authenticatedReq)
  }
}

export function requireRole(roles: string | string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const user = req.user!
      const allowedRoles = Array.isArray(roles) ? roles : [roles]

      if (!allowedRoles.includes(user.role)) {
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
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      return handler(req)
    })
  }
}
