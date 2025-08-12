import { NextResponse } from "next/server"

const mockEmergencyTransfers = [
  {
    id: "ET001",
    patient_nin: "1111222233334",
    patient_name: "Youcef Mammeri",
    from_hospital: "Hôpital de Tizi Ouzou",
    to_hospital: "HCA001",
    condition: "Traumatisme crânien sévère",
    vital_signs: {
      blood_pressure: "90/60",
      heart_rate: 110,
      temperature: 36.8,
      oxygen_saturation: 92,
    },
    transport_method: "helicopter" as const,
    estimated_arrival: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 minutes from now
    contact_person: "Dr. Salim Boudiaf",
    contact_phone: "+213 555 123 456",
    status: "in_transit" as const,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "ET002",
    patient_nin: "5555666677778",
    patient_name: "Nadia Benaissa",
    from_hospital: "Hôpital de Blida",
    to_hospital: "HCA001",
    condition: "Infarctus du myocarde avec complications",
    vital_signs: {
      blood_pressure: "160/100",
      heart_rate: 95,
      temperature: 37.2,
      oxygen_saturation: 96,
    },
    transport_method: "ambulance" as const,
    estimated_arrival: new Date(Date.now() + 1000 * 60 * 20).toISOString(), // 20 minutes from now
    contact_person: "Dr. Rachid Hamidi",
    contact_phone: "+213 555 987 654",
    status: "in_transit" as const,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
]

export async function GET() {
  try {
    // Filter only active transfers (not completed)
    const activeTransfers = mockEmergencyTransfers.filter((transfer) => transfer.status !== "completed")
    return NextResponse.json(activeTransfers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch emergency transfers" }, { status: 500 })
  }
}
