import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const ageRange = searchParams.get("ageRange")
  const gender = searchParams.get("gender")
  const bloodType = searchParams.get("bloodType")
  const hasAllergies = searchParams.get("hasAllergies")
  const hasChronicConditions = searchParams.get("hasChronicConditions")
  const consentStatus = searchParams.get("consentStatus")

  // Mock search implementation with relevance scoring
  const mockPatients = [
    {
      nin: "1234567890123456",
      full_name: "Ahmed Benali",
      date_of_birth: "1985-03-15",
      gender: "M",
      blood_type: "A+",
      allergies: ["Pénicilline"],
      chronic_conditions: ["Diabète Type 2"],
      consent_flags: {
        data_sharing: true,
        cross_hospital_access: true,
        research_participation: false,
      },
      primary_hospital_id: "HCA001",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
    },
    {
      nin: "2345678901234567",
      full_name: "Fatima Khelil",
      date_of_birth: "1992-07-22",
      gender: "F",
      blood_type: "O-",
      allergies: [],
      chronic_conditions: [],
      consent_flags: {
        data_sharing: true,
        cross_hospital_access: false,
        research_participation: true,
      },
      primary_hospital_id: "HCA001",
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-18T16:45:00Z",
    },
    {
      nin: "3456789012345678",
      full_name: "Mohamed Saidi",
      date_of_birth: "1978-11-08",
      gender: "M",
      blood_type: "B+",
      allergies: ["Aspirine", "Iode"],
      chronic_conditions: ["Hypertension"],
      consent_flags: {
        data_sharing: false,
        cross_hospital_access: true,
        research_participation: false,
      },
      primary_hospital_id: "HCA001",
      created_at: "2024-01-05T11:20:00Z",
      updated_at: "2024-01-22T13:10:00Z",
    },
  ]

  // Filter and score results
  let results = mockPatients.filter((patient) => {
    // Text search
    const searchFields = [patient.full_name, patient.nin, patient.blood_type || ""].join(" ").toLowerCase()

    const matchesQuery = !query || searchFields.includes(query.toLowerCase())

    // Age range filter
    if (ageRange && matchesQuery) {
      const age = calculateAge(patient.date_of_birth)
      const [minAge, maxAge] = ageRange.includes("+")
        ? [Number.parseInt(ageRange.replace("+", "")), 150]
        : ageRange.split("-").map(Number)

      if (age < minAge || age > maxAge) return false
    }

    // Other filters
    if (gender && patient.gender !== gender) return false
    if (bloodType && patient.blood_type !== bloodType) return false
    if (hasAllergies === "true" && patient.allergies.length === 0) return false
    if (hasAllergies === "false" && patient.allergies.length > 0) return false
    if (hasChronicConditions === "true" && patient.chronic_conditions.length === 0) return false
    if (hasChronicConditions === "false" && patient.chronic_conditions.length > 0) return false

    // Consent status filter
    if (consentStatus) {
      const consentCount = Object.values(patient.consent_flags).filter(Boolean).length
      const totalConsents = Object.keys(patient.consent_flags).length

      if (consentStatus === "complete" && consentCount !== totalConsents) return false
      if (consentStatus === "partial" && (consentCount === 0 || consentCount === totalConsents)) return false
      if (consentStatus === "none" && consentCount > 0) return false
    }

    return matchesQuery
  })

  // Add relevance scoring
  results = results.map((patient) => {
    let relevanceScore = 0
    const matchedFields: string[] = []

    if (query) {
      const queryLower = query.toLowerCase()

      if (patient.full_name.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.8
        matchedFields.push("name")
      }

      if (patient.nin.includes(query)) {
        relevanceScore += 0.9
        matchedFields.push("nin")
      }

      if (patient.blood_type?.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.6
        matchedFields.push("blood_type")
      }
    }

    return {
      ...patient,
      relevanceScore: Math.min(relevanceScore, 1),
      matchedFields,
    }
  })

  // Sort by relevance
  results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))

  return NextResponse.json({
    patients: results,
    total: results.length,
    query,
    filters: {
      ageRange,
      gender,
      bloodType,
      hasAllergies,
      hasChronicConditions,
      consentStatus,
    },
  })
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export const GET = withAuth(handler, ["view_patients"])
