import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { PERMISSIONS } from "@/lib/auth/types"

// GET /api/patients/[nin] - Get patient by NIN
export const GET = withAuth(async (req, { params }: { params: { nin: string } }) => {
  try {
    const user = req.user!
    const nin = params.nin

    if (!user.permissions.includes(PERMISSIONS.VIEW_PATIENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Validate NIN format
    if (!/^\d{18}$/.test(nin)) {
      return NextResponse.json({ error: "Format NIN invalide" }, { status: 400 })
    }

    // Mock data - replace with actual database query
    const mockPatient = {
      nin,
      full_name: "Ahmed Benali",
      date_of_birth: "1980-05-15",
      gender: "M",
      blood_type: "O+",
      primary_hospital_id: user.hospital_id,
      consent_flags: {
        data_sharing: true,
        cross_hospital_access: true,
      },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    }

    // Log audit event for patient data access
    console.log(`Patient data accessed by ${user.username}: NIN ${nin}`)

    return NextResponse.json(mockPatient)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
})

// PUT /api/patients/[nin] - Update patient
export const PUT = withAuth(async (req, { params }: { params: { nin: string } }) => {
  try {
    const user = req.user!
    const nin = params.nin
    const updateData = await req.json()

    if (!user.permissions.includes(PERMISSIONS.EDIT_PATIENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Mock update - replace with actual database update
    const updatedPatient = {
      nin,
      ...updateData,
      updated_at: new Date().toISOString(),
    }

    console.log("Updating patient:", updatedPatient)

    // Log audit event
    console.log(`Patient updated by ${user.username}: NIN ${nin}`)

    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error("Error updating patient:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
})
