import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/enhanced-middleware"

// Mock critical error storage - replace with database in production
const criticalErrors: any[] = []

async function handler(request: NextRequest) {
  if (request.method === "POST") {
    try {
      const errorEntry = await request.json()

      // Add additional metadata
      const enhancedError = {
        ...errorEntry,
        id: crypto.randomUUID(),
        receivedAt: new Date().toISOString(),
        resolved: false,
      }

      criticalErrors.push(enhancedError)

      // In production, you might want to:
      // 1. Store in database
      // 2. Send alerts to administrators
      // 3. Integrate with monitoring services (Sentry, DataDog, etc.)

      return NextResponse.json({ success: true, id: enhancedError.id })
    } catch (error) {
      console.error("Failed to store critical error:", error)
      return NextResponse.json({ error: "Failed to store error" }, { status: 500 })
    }
  }

  if (request.method === "GET") {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const resolved = searchParams.get("resolved")

    let filteredErrors = criticalErrors
    if (resolved !== null) {
      filteredErrors = criticalErrors.filter((error) => error.resolved === (resolved === "true"))
    }

    const paginatedErrors = filteredErrors
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
      .slice(offset, offset + limit)

    return NextResponse.json({
      errors: paginatedErrors,
      total: filteredErrors.length,
      limit,
      offset,
    })
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export const GET = withAuth(handler, ["view_audit_logs"])
export const POST = handler // Allow unauthenticated POST for error logging
