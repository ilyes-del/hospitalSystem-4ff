"use client"

// Simple in-memory cache implementation
// In production, replace with Redis or similar
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set(key: string, data: any, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { data, expires })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new MemoryCache()

// Auto-cleanup every 10 minutes
setInterval(() => cache.cleanup(), 10 * 60 * 1000)

// Cache utilities
export class CacheManager {
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|")
    return `${prefix}:${sortedParams}`
  }

  static async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = cache.get(key)
    if (cached) return cached

    const data = await fetcher()
    cache.set(key, data, ttl)
    return data
  }

  static invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"))
    for (const key of cache["cache"].keys()) {
      if (regex.test(key)) {
        cache.delete(key)
      }
    }
  }
}

// Specific cache keys and TTLs
export const CACHE_KEYS = {
  DASHBOARD_STATS: "dashboard:stats",
  PATIENT_LIST: "patients:list",
  APPOINTMENT_LIST: "appointments:list",
  DOCTOR_SCHEDULE: "doctors:schedule",
  INVENTORY_ITEMS: "inventory:items",
  REPORTS_DATA: "reports:data",
} as const

export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const
