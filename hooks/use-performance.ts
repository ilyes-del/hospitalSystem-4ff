"use client"

import { useEffect, useState } from "react"
import { logger } from "@/lib/logging/logger"

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    logger.time(`${componentName}_render`)

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      logger.timeEnd(`${componentName}_render`)

      if (renderTime > 100) {
        logger.warn(`Slow render detected in ${componentName}`, {
          component: componentName,
          renderTime: `${renderTime.toFixed(2)}ms`,
        })
      }
    }
  }, [componentName])
}

// API performance monitoring
export function useApiPerformance() {
  const [metrics, setMetrics] = useState({
    averageResponseTime: 0,
    totalRequests: 0,
    errorRate: 0,
  })

  const trackApiCall = async (apiCall: () => Promise<any>, endpoint: string): Promise<any> => {
    const startTime = performance.now()

    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime

      logger.logApiRequest("GET", endpoint, 200, duration)

      setMetrics((prev) => ({
        averageResponseTime: (prev.averageResponseTime * prev.totalRequests + duration) / (prev.totalRequests + 1),
        totalRequests: prev.totalRequests + 1,
        errorRate: (prev.errorRate * prev.totalRequests) / (prev.totalRequests + 1),
      }))

      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime

      logger.logApiRequest("GET", endpoint, 500, duration)

      setMetrics((prev) => ({
        averageResponseTime: (prev.averageResponseTime * prev.totalRequests + duration) / (prev.totalRequests + 1),
        totalRequests: prev.totalRequests + 1,
        errorRate: (prev.errorRate * prev.totalRequests + 1) / (prev.totalRequests + 1),
      }))

      throw error
    }
  }

  return { metrics, trackApiCall }
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryUsage, setMemoryUsage] = useState(null)

  useEffect(() => {
    const updateMemoryUsage = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory
        setMemoryUsage({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        })

        // Warn if memory usage is high
        const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        if (usagePercentage > 80) {
          logger.warn("High memory usage detected", {
            usagePercentage: `${usagePercentage.toFixed(2)}%`,
            usedMB: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          })
        }
      }
    }

    updateMemoryUsage()
    const interval = setInterval(updateMemoryUsage, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return memoryUsage
}
