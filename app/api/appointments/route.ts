import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { PERMISSIONS } from "@/lib/auth/types"

// GET /api/appointments - List appointments
export const GET = withAuth(async (req) => {
  try {
    const user = req.user!
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const department = searchParams.get("department")
    const date = searchParams.get("date")

    // Check permissions
    if (!user.permissions.includes(PERMISSIONS.VIEW_APPOINTMENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Mock data - replace with actual database query
    const mockAppointments = [
      {
        id: "1",
        patient_nin: "123456789012345678",
        hospital_id: user.hospital_id,
        department: "Cardiologie",
        scheduled_at: "2024-01-15T09:00:00Z",
        status: "confirmed",
        patient: {
          nin: "123456789012345678",
          full_name: "Ahmed Benali",
          date_of_birth: "1980-05-15",
          gender: "M",
        },
      },
    ]

    return NextResponse.json({
      appointments: mockAppointments,
      pagination: {
        page,
        limit,
        total: mockAppointments.length,
        pages: Math.ceil(mockAppointments.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
})

// POST /api/appointments - Create appointment
export const POST = withAuth(async (req) => {
  try {
    const user = req.user!
    const appointmentData = await req.json()

    // Check permissions
    if (!user.permissions.includes(PERMISSIONS.CREATE_APPOINTMENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Validate required fields
    const { patient_nin, department, scheduled_at, duration_minutes } = appointmentData

    if (!patient_nin || !department || !scheduled_at) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    // Mock creation - replace with actual database insert
    const newAppointment = {
      id: `apt_${Date.now()}`,
      ...appointmentData,
      hospital_id: user.hospital_id,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Creating appointment:", newAppointment)

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
})
