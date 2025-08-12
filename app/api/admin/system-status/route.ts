import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate system status data
    const systemStatus = {
      server: {
        status: "healthy" as const,
        uptime: "15 jours, 3 heures",
        cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
        memory: Math.floor(Math.random() * 40) + 30, // 30-70%
        disk: Math.floor(Math.random() * 20) + 10, // 10-30%
      },
      database: {
        status: "healthy" as const,
        connections: Math.floor(Math.random() * 50) + 10,
        maxConnections: 100,
        responseTime: Math.floor(Math.random() * 50) + 10,
      },
      network: {
        status: "healthy" as const,
        latency: Math.floor(Math.random() * 20) + 5,
        bandwidth: Math.floor(Math.random() * 30) + 70,
      },
      services: [
        {
          name: "Service d'authentification",
          status: "running" as const,
          lastCheck: new Date().toLocaleString("fr-FR"),
        },
        {
          name: "Service de synchronisation",
          status: "running" as const,
          lastCheck: new Date().toLocaleString("fr-FR"),
        },
        {
          name: "Service de sauvegarde",
          status: "running" as const,
          lastCheck: new Date().toLocaleString("fr-FR"),
        },
        {
          name: "Service de notifications",
          status: "warning" as const,
          lastCheck: new Date().toLocaleString("fr-FR"),
        },
      ],
    }

    return NextResponse.json(systemStatus)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch system status" }, { status: 500 })
  }
}
