"use client"

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
  component?: string
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO
  private logs: LogEntry[] = []
  private maxLogs = 1000

  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      requestId: this.generateRequestId(),
    }
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Send to external logging service in production
    this.sendToLoggingService(entry)
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    try {
      // In production, send to logging service like Elasticsearch, Splunk, etc.
      if (process.env.NODE_ENV === "production") {
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        })
      }
    } catch (error) {
      console.error("Failed to send log to service:", error)
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return

    const entry = this.createLogEntry(LogLevel.DEBUG, message, context)
    this.addLog(entry)
    console.debug(`[DEBUG] ${message}`, context)
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return

    const entry = this.createLogEntry(LogLevel.INFO, message, context)
    this.addLog(entry)
    console.info(`[INFO] ${message}`, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return

    const entry = this.createLogEntry(LogLevel.WARN, message, context)
    this.addLog(entry)
    console.warn(`[WARN] ${message}`, context)
  }

  error(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return

    const entry = this.createLogEntry(LogLevel.ERROR, message, context)
    this.addLog(entry)
    console.error(`[ERROR] ${message}`, context)
  }

  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs

    if (level !== undefined) {
      filteredLogs = this.logs.filter((log) => log.level >= level)
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }

    return filteredLogs
  }

  clearLogs(): void {
    this.logs = []
  }

  // Performance logging
  time(label: string): void {
    console.time(label)
    this.debug(`Timer started: ${label}`)
  }

  timeEnd(label: string): void {
    console.timeEnd(label)
    this.debug(`Timer ended: ${label}`)
  }

  // User action logging
  logUserAction(action: string, userId: string, details?: Record<string, any>): void {
    this.info(`User action: ${action}`, {
      userId,
      action,
      ...details,
    })
  }

  // API request logging
  logApiRequest(method: string, url: string, statusCode: number, duration: number, userId?: string): void {
    const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO
    const entry = this.createLogEntry(level, `${method} ${url} - ${statusCode}`, {
      method,
      url,
      statusCode,
      duration,
      userId,
    })
    this.addLog(entry)
  }
}

export const logger = new Logger()

// Set log level based on environment
if (process.env.NODE_ENV === "development") {
  logger.setLogLevel(LogLevel.DEBUG)
} else {
  logger.setLogLevel(LogLevel.INFO)
}
