import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"
import { PERMISSIONS } from "@/lib/auth/types"

// GET /api/patients - List patients
export const GET = withAuth(async (req) => {
  try {
    const user = req.user!
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")
    const gender = searchParams.get("gender")

    // Check permissions
    if (!user.permissions.includes(PERMISSIONS.VIEW_PATIENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Mock data - replace with actual database query
    const mockPatients = [
      {
        nin: "123456789012345678",
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
      },
    ]

    return NextResponse.json({
      patients: mockPatients,
      pagination: {
        page,
        limit,
        total: mockPatients.length,
        pages: Math.ceil(mockPatients.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
})

// POST /api/patients - Create patient
export const POST = withAuth(async (req) => {
  try {
    const user = req.user!
    const patientData = await req.json()

    // Check permissions
    if (!user.permissions.includes(PERMISSIONS.CREATE_PATIENTS)) {
      return NextResponse.json({ error: "Permission refusée" }, { status: 403 })
    }

    // Validate required fields
    const { nin, full_name, date_of_birth, gender } = patientData

    if (!nin || !full_name || !date_of_birth || !gender) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    // Validate NIN format
    if (!/^\d{18}$/.test(nin)) {
      return NextResponse.json({ error: "Format NIN invalide" }, { status: 400 })
    }

    // Mock creation - replace with actual database insert
    const newPatient = {
      ...patientData,
      primary_hospital_id: user.hospital_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // In real implementation, encrypt sensitive data
      phone_encrypted: patientData.phone ? "encrypted_phone" : null,
      address_encrypted: patientData.address ? "encrypted_address" : null,
      emergency_contact_encrypted: patientData.emergency_contact ? "encrypted_emergency" : null,
    }

    console.log("Creating patient:", newPatient)

    // Log audit event
    console.log(`Patient created by ${user.username}: NIN ${nin}`)

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
})
