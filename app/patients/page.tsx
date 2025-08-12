"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { PatientList } from "@/components/patients/patient-list"
import { PatientForm } from "@/components/patients/patient-form"
import { PatientProfile } from "@/components/patients/patient-profile"
import { PERMISSIONS } from "@/lib/auth/types"
import type { Patient } from "@/lib/types/database"

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleCreateNew = () => {
    setSelectedPatient(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsFormOpen(true)
  }

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsProfileOpen(true)
  }

  const handleSave = async (patientData: any) => {
    try {
      if (patientData.nin && selectedPatient?.nin) {
        // Update existing patient
        console.log("Updating patient:", patientData)
      } else {
        // Create new patient
        console.log("Creating patient:", patientData)
      }
      // Refresh the list after save
    } catch (error) {
      console.error("Error saving patient:", error)
    }
  }

  const handleEditFromProfile = (patient: Patient) => {
    setIsProfileOpen(false)
    setSelectedPatient(patient)
    setIsFormOpen(true)
  }

  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_PATIENTS}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Patients</h1>
            <p className="text-gray-600">Gérez les dossiers patients avec intégration NIN</p>
          </div>
        </div>

        <PatientList onEdit={handleEdit} onView={handleView} onCreateNew={handleCreateNew} />

        <PatientForm
          patient={selectedPatient}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />

        <PatientProfile
          patient={selectedPatient}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onEdit={handleEditFromProfile}
        />
      </div>
    </ProtectedRoute>
  )
}
