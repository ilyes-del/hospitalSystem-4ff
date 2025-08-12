export interface SyncOperation {
  id: string
  type: "patient" | "appointment" | "visit" | "referral"
  operation: "create" | "update" | "delete"
  data: any
  hospital_id: string
  timestamp: string
  status: "pending" | "syncing" | "completed" | "failed"
  retry_count: number
  error_message?: string
}

export interface SyncStatus {
  last_sync: string
  pending_operations: number
  failed_operations: number
  is_online: boolean
  sync_in_progress: boolean
}

export class SyncService {
  private syncQueue: SyncOperation[] = []
  private isOnline = true
  private syncInProgress = false
  private maxRetries = 3

  constructor() {
    this.initializeSync()
  }

  private initializeSync() {
    // Check online status
    this.checkOnlineStatus()

    // Start periodic sync
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.processSyncQueue()
      }
    }, 30000) // Sync every 30 seconds

    // Listen for online/offline events
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true
        this.processSyncQueue()
      })

      window.addEventListener("offline", () => {
        this.isOnline = false
      })
    }
  }

  private async checkOnlineStatus(): Promise<boolean> {
    try {
      const response = await fetch("/api/sync/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      this.isOnline = response.ok
      return this.isOnline
    } catch (error) {
      this.isOnline = false
      return false
    }
  }

  // Add operation to sync queue
  async queueOperation(operation: Omit<SyncOperation, "id" | "status" | "retry_count" | "timestamp">): Promise<void> {
    const syncOp: SyncOperation = {
      ...operation,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      retry_count: 0,
      timestamp: new Date().toISOString(),
    }

    this.syncQueue.push(syncOp)

    // Store in localStorage for persistence
    this.persistSyncQueue()

    // Try immediate sync if online
    if (this.isOnline && !this.syncInProgress) {
      this.processSyncQueue()
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || this.syncQueue.length === 0) {
      return
    }

    this.syncInProgress = true

    try {
      const pendingOps = this.syncQueue.filter((op) => op.status === "pending" || op.status === "failed")

      for (const operation of pendingOps) {
        await this.syncOperation(operation)
      }
    } finally {
      this.syncInProgress = false
      this.persistSyncQueue()
    }
  }

  private async syncOperation(operation: SyncOperation): Promise<void> {
    try {
      operation.status = "syncing"

      const response = await fetch("/api/sync/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hospital_auth_token")}`,
        },
        body: JSON.stringify(operation),
      })

      if (response.ok) {
        operation.status = "completed"
        // Remove completed operations from queue
        this.syncQueue = this.syncQueue.filter((op) => op.id !== operation.id)
      } else {
        throw new Error(`Sync failed: ${response.statusText}`)
      }
    } catch (error) {
      operation.retry_count++
      operation.error_message = error instanceof Error ? error.message : "Unknown error"

      if (operation.retry_count >= this.maxRetries) {
        operation.status = "failed"
      } else {
        operation.status = "pending"
      }
    }
  }

  private persistSyncQueue(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("sync_queue", JSON.stringify(this.syncQueue))
    }
  }

  private loadSyncQueue(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sync_queue")
      if (stored) {
        this.syncQueue = JSON.parse(stored)
      }
    }
  }

  // Get sync status
  getSyncStatus(): SyncStatus {
    return {
      last_sync: localStorage.getItem("last_sync") || "Never",
      pending_operations: this.syncQueue.filter((op) => op.status === "pending").length,
      failed_operations: this.syncQueue.filter((op) => op.status === "failed").length,
      is_online: this.isOnline,
      sync_in_progress: this.syncInProgress,
    }
  }

  // Manual sync trigger
  async forcSync(): Promise<void> {
    await this.checkOnlineStatus()
    if (this.isOnline) {
      await this.processSyncQueue()
    }
  }

  // Conflict resolution
  private resolveConflict(localData: any, remoteData: any, operation: SyncOperation): any {
    // Last-write-wins with hospital priority for clinical notes
    if (operation.type === "visit" && localData.clinical_notes) {
      // Hospital data takes priority for clinical notes
      return { ...remoteData, clinical_notes: localData.clinical_notes }
    }

    // For other data, use timestamp-based resolution
    const localTimestamp = new Date(localData.updated_at || localData.created_at)
    const remoteTimestamp = new Date(remoteData.updated_at || remoteData.created_at)

    return localTimestamp > remoteTimestamp ? localData : remoteData
  }
}

// Singleton instance
export const syncService = new SyncService()
