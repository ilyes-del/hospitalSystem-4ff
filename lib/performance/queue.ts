"use client"

// Simple in-memory queue implementation
// In production, replace with Redis Queue, BullMQ, or similar
interface QueueJob {
  id: string
  type: string
  data: any
  priority: number
  attempts: number
  maxAttempts: number
  createdAt: Date
  processedAt?: Date
  completedAt?: Date
  failedAt?: Date
  error?: string
}

type JobProcessor<T = any> = (data: T) => Promise<any>

class SimpleQueue {
  private jobs: Map<string, QueueJob> = new Map()
  private processors: Map<string, JobProcessor> = new Map()
  private processing = false
  private readonly maxConcurrency = 3

  addJob(type: string, data: any, options: { priority?: number; maxAttempts?: number } = {}): string {
    const id = this.generateId()
    const job: QueueJob = {
      id,
      type,
      data,
      priority: options.priority || 0,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date(),
    }

    this.jobs.set(id, job)
    this.processJobs()
    return id
  }

  registerProcessor(type: string, processor: JobProcessor): void {
    this.processors.set(type, processor)
  }

  private generateId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private async processJobs(): Promise<void> {
    if (this.processing) return
    this.processing = true

    const pendingJobs = Array.from(this.jobs.values())
      .filter((job) => !job.processedAt && !job.completedAt && !job.failedAt)
      .sort((a, b) => b.priority - a.priority)

    const concurrentJobs = pendingJobs.slice(0, this.maxConcurrency)

    await Promise.all(concurrentJobs.map((job) => this.processJob(job)))

    this.processing = false

    // Continue processing if there are more jobs
    const remainingJobs = Array.from(this.jobs.values()).filter(
      (job) => !job.processedAt && !job.completedAt && !job.failedAt,
    )

    if (remainingJobs.length > 0) {
      setTimeout(() => this.processJobs(), 100)
    }
  }

  private async processJob(job: QueueJob): Promise<void> {
    const processor = this.processors.get(job.type)
    if (!processor) {
      job.failedAt = new Date()
      job.error = `No processor registered for job type: ${job.type}`
      return
    }

    job.processedAt = new Date()
    job.attempts++

    try {
      await processor(job.data)
      job.completedAt = new Date()
    } catch (error) {
      job.error = error instanceof Error ? error.message : "Unknown error"

      if (job.attempts >= job.maxAttempts) {
        job.failedAt = new Date()
      } else {
        // Retry with exponential backoff
        const delay = Math.pow(2, job.attempts) * 1000
        setTimeout(() => {
          job.processedAt = undefined
          this.processJobs()
        }, delay)
      }
    }
  }

  getJobStatus(id: string): QueueJob | null {
    return this.jobs.get(id) || null
  }

  getQueueStats(): { pending: number; processing: number; completed: number; failed: number } {
    const jobs = Array.from(this.jobs.values())
    return {
      pending: jobs.filter((job) => !job.processedAt && !job.completedAt && !job.failedAt).length,
      processing: jobs.filter((job) => job.processedAt && !job.completedAt && !job.failedAt).length,
      completed: jobs.filter((job) => job.completedAt).length,
      failed: jobs.filter((job) => job.failedAt).length,
    }
  }

  clearCompletedJobs(): void {
    for (const [id, job] of this.jobs.entries()) {
      if (job.completedAt || job.failedAt) {
        this.jobs.delete(id)
      }
    }
  }
}

export const queue = new SimpleQueue()

// Register common job processors
queue.registerProcessor("generate_report", async (data) => {
  // Simulate report generation
  await new Promise((resolve) => setTimeout(resolve, 5000))
  console.log("Report generated:", data)
})

queue.registerProcessor("send_email", async (data) => {
  // Simulate email sending
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log("Email sent:", data)
})

queue.registerProcessor("backup_data", async (data) => {
  // Simulate data backup
  await new Promise((resolve) => setTimeout(resolve, 10000))
  console.log("Data backed up:", data)
})

// Queue utilities
export class QueueManager {
  static addReportGenerationJob(reportType: string, parameters: any): string {
    return queue.addJob("generate_report", { reportType, parameters }, { priority: 1 })
  }

  static addEmailJob(to: string, subject: string, body: string): string {
    return queue.addJob("send_email", { to, subject, body }, { priority: 2 })
  }

  static addBackupJob(dataType: string): string {
    return queue.addJob("backup_data", { dataType }, { priority: 0 })
  }

  static getJobStatus(jobId: string): QueueJob | null {
    return queue.getJobStatus(jobId)
  }

  static getQueueStats() {
    return queue.getQueueStats()
  }
}
