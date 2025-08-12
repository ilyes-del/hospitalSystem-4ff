import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { PERMISSIONS } from "@/lib/auth/types"

// GET /api/appointments/[id] - Get single appointment
export const GET = withAuth(async (req, { params }: { params: { id: string } }) => {
  try {
    const user = req.user!
    const appointmentId = params.id

    if (!user.permissions.includes(PERMISSIONS.VIEW_APPOINTMENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Mock data - replace with actual database query
    const mockAppointment = {
      id: appointmentId,
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
    }

    return NextResponse.json(mockAppointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
})

// PUT /api/appointments/[id] - Update appointment
export const PUT = withAuth(async (req, { params }: { params: { id: string } }) => {
  try {
    const user = req.user!
    const appointmentId = params.id
    const updateData = await req.json()

    if (!user.permissions.includes(PERMISSIONS.EDIT_APPOINTMENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Mock update - replace with actual database update
    const updatedAppointment = {
      id: appointmentId,
      ...updateData,
      updated_at: new Date().toISOString(),
    }

    console.log("Updating appointment:", updatedAppointment)

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
})

// DELETE /api/appointments/[id] - Delete appointment
export const DELETE = withAuth(async (req, { params }: { params: { id: string } }) => {
  try {
    const user = req.user!
    const appointmentId = params.id

    if (!user.permissions.includes(PERMISSIONS.CANCEL_APPOINTMENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Mock deletion - replace with actual database delete
    console.log("Deleting appointment:", appointmentId)

    return NextResponse.json({ message: "Rendez-vous supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
})
