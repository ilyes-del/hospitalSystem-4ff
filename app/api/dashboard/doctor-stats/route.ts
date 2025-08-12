import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

async function handler() {
  try {
    // Mock data for doctor dashboard
    const doctorData = {
      appointments: [
        {
          id: 1,
          time: "09:00",
          patient: "Ahmed Benali",
          nin: "1234567890123",
          type: "Consultation",
          status: "confirmed",
          duration: 30,
          room: "Salle 101",
        },
        {
          id: 2,
          time: "10:30",
          patient: "Fatima Khelil",
          nin: "2345678901234",
          type: "Suivi",
          status: "waiting",
          duration: 20,
          room: "Salle 102",
        },
        {
          id: 3,
          time: "14:00",
          patient: "Mohamed Saidi",
          nin: "3456789012345",
          type: "Urgence",
          status: "in-progress",
          duration: 45,
          room: "Urgences",
        },
        {
          id: 4,
          time: "15:30",
          patient: "Leila Boumediene",
          nin: "4567890123456",
          type: "Consultation",
          status: "confirmed",
          duration: 30,
          room: "Salle 103",
        },
      ],
      urgentCases: [
        {
          id: 1,
          patient: "Aicha Mansouri",
          condition: "Douleur thoracique",
          priority: "high",
          time: "08:45",
        },
        {
          id: 2,
          patient: "Omar Belkacem",
          condition: "Fièvre élevée",
          priority: "medium",
          time: "09:15",
        },
        {
          id: 3,
          patient: "Nadia Cherif",
          condition: "Difficulté respiratoire",
          priority: "high",
          time: "10:20",
        },
      ],
      stats: {
        todayPatients: 15,
        pendingNotes: 4,
        upcomingShifts: 2,
        completedToday: 11,
      },
      weeklyData: [
        { day: "Lun", patients: 15, consultations: 12 },
        { day: "Mar", patients: 12, consultations: 10 },
        { day: "Mer", patients: 18, consultations: 15 },
        { day: "Jeu", patients: 14, consultations: 11 },
        { day: "Ven", patients: 16, consultations: 13 },
        { day: "Sam", patients: 8, consultations: 6 },
        { day: "Dim", patients: 5, consultations: 4 },
      ],
    }

    return NextResponse.json(doctorData)
  } catch (error) {
    console.error("Error fetching doctor stats:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des statistiques du médecin" }, { status: 500 })
  }
}

export const GET = withAuth(handler)
