import { NextResponse } from "next/server"

const mockAuditLogs = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    user: "ilyes",
    action: "LOGIN",
    resource: "System",
    details: "Connexion réussie depuis l'interface web",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info" as const,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    user: "dr.benali",
    action: "CREATE",
    resource: "Patient",
    details: "Création d'un nouveau dossier patient (NIN: 123456789)",
    ip_address: "192.168.1.101",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info" as const,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    user: "nurse.fatima",
    action: "UPDATE",
    resource: "Appointment",
    details: "Modification du statut de rendez-vous (ID: APT001)",
    ip_address: "192.168.1.102",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info" as const,
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    user: "system",
    action: "ERROR",
    resource: "Database",
    details: "Échec de connexion à la base de données nationale",
    ip_address: "127.0.0.1",
    user_agent: "System Process",
    severity: "error" as const,
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    user: "admin",
    action: "DELETE",
    resource: "User",
    details: "Suppression du compte utilisateur (ID: USR123)",
    ip_address: "192.168.1.103",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "warning" as const,
  },
]

export async function GET() {
  try {
    return NextResponse.json(mockAuditLogs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
