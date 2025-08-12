"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface LazyLoadOptions {
  pageSize?: number
  initialLoad?: boolean
  threshold?: number
}

interface LazyLoadResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  total: number
}

export function useLazyLoad<T>(
  fetcher: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  options: LazyLoadOptions = {},
): LazyLoadResult<T> {
  const { pageSize = 20, initialLoad = true, threshold = 0.8 } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadData = useCallback(
    async (pageNum: number, append = false) => {
      if (loading) return

      setLoading(true)
      setError(null)

      try {
        const result = await fetcher(pageNum, pageSize)

        setData((prev) => (append ? [...prev, ...result.data] : result.data))
        setTotal(result.total)
        setHasMore(
          result.data.length === pageSize &&
            (append ? data.length + result.data.length : result.data.length) < result.total,
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement")
      } finally {
        setLoading(false)
      }
    },
    [fetcher, pageSize, loading, data.length],
  )

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      loadData(nextPage, true)
    }
  }, [hasMore, loading, page, loadData])

  const refresh = useCallback(() => {
    setPage(0)
    setData([])
    setHasMore(true)
    loadData(0, false)
  }, [loadData])

  useEffect(() => {
    if (initialLoad) {
      loadData(0, false)
    }
  }, [initialLoad, loadData])

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    total,
  }
}

// Intersection Observer hook for infinite scrolling
export function useIntersectionObserver(callback: () => void, options: IntersectionObserverInit = {}) {
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback()
        }
      },
      { threshold: 0.1, ...options },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [element, callback, options])

  return setElement
}

// Virtual scrolling for large lists
export function useVirtualScrolling<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(visibleStart + Math.ceil(containerHeight / itemHeight) + 1, items.length)

  const visibleItems = items.slice(visibleStart, visibleEnd)
  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    },
  }
}
