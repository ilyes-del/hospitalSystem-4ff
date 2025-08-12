"use client"

import { NextResponse } from "next/server"

export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMIT = "RATE_LIMIT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
}

export interface AppError {
  code: ErrorCode
  message: string
  details?: any
  statusCode: number
  timestamp: string
  requestId?: string
}

export class CustomError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: any
  public readonly timestamp: string

  constructor(code: ErrorCode, message: string, statusCode: number, details?: any) {
    super(message)
    this.name = "CustomError"
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

export class ErrorHandler {
  static createError(code: ErrorCode, message: string, statusCode: number, details?: any): CustomError {
    return new CustomError(code, message, statusCode, details)
  }

  static handleApiError(error: unknown, requestId?: string): NextResponse {
    let appError: AppError

    if (error instanceof CustomError) {
      appError = {
        code: error.code,
        message: error.message,
        details: error.details,
        statusCode: error.statusCode,
        timestamp: error.timestamp,
        requestId,
      }
    } else if (error instanceof Error) {
      appError = {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Une erreur interne s'est produite",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        requestId,
      }
    } else {
      appError = {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Une erreur inconnue s'est produite",
        statusCode: 500,
        timestamp: new Date().toISOString(),
        requestId,
      }
    }

    // Log error for monitoring
    this.logError(appError, error)

    return NextResponse.json(
      {
        error: {
          code: appError.code,
          message: appError.message,
          timestamp: appError.timestamp,
          requestId: appError.requestId,
          ...(process.env.NODE_ENV === "development" && { details: appError.details }),
        },
      },
      { status: appError.statusCode },
    )
  }

  static logError(appError: AppError, originalError?: unknown): void {
    const logEntry = {
      level: "error",
      timestamp: appError.timestamp,
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      details: appError.details,
      requestId: appError.requestId,
      stack: originalError instanceof Error ? originalError.stack : undefined,
    }

    // In production, send to logging service
    console.error("API Error:", logEntry)

    // Store critical errors for admin review
    if (appError.statusCode >= 500) {
      this.storeCriticalError(logEntry)
    }
  }

  private static async storeCriticalError(logEntry: any): Promise<void> {
    try {
      await fetch("/api/admin/critical-errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      })
    } catch (error) {
      console.error("Failed to store critical error:", error)
    }
  }
}

// Common error factories
export const ValidationError = (message: string, details?: any) =>
  ErrorHandler.createError(ErrorCode.VALIDATION_ERROR, message, 400, details)

export const AuthenticationError = (message = "Authentication required") =>
  ErrorHandler.createError(ErrorCode.AUTHENTICATION_ERROR, message, 401)

export const AuthorizationError = (message = "Insufficient permissions") =>
  ErrorHandler.createError(ErrorCode.AUTHORIZATION_ERROR, message, 403)

export const NotFoundError = (resource: string) =>
  ErrorHandler.createError(ErrorCode.NOT_FOUND, `${resource} not found`, 404)

export const ConflictError = (message: string, details?: any) =>
  ErrorHandler.createError(ErrorCode.CONFLICT, message, 409, details)

export const RateLimitError = (retryAfter?: number) =>
  ErrorHandler.createError(ErrorCode.RATE_LIMIT, "Too many requests", 429, retryAfter ? { retryAfter } : undefined)

export const DatabaseError = (message = "Database operation failed") =>
  ErrorHandler.createError(ErrorCode.DATABASE_ERROR, message, 500)

export const NetworkError = (message = "Network request failed") =>
  ErrorHandler.createError(ErrorCode.NETWORK_ERROR, message, 503)
