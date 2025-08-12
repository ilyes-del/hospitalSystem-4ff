"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List } from "lucide-react"
import { PERMISSIONS } from "@/lib/auth/types"
import type { AppointmentWithPatient } from "@/lib/types/database"

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

  const handleCreateNew = () => {
    setSelectedAppointment(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (appointment: AppointmentWithPatient) => {
    setSelectedAppointment(appointment)
    setIsFormOpen(true)
  }

  const handleDelete = async (appointmentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      try {
        // API call to delete appointment
        console.log("Deleting appointment:", appointmentId)
        // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting appointment:", error)
      }
    }
  }

  const handleSave = async (appointmentData: any) => {
    try {
      if (appointmentData.id) {
        // Update existing appointment
        console.log("Updating appointment:", appointmentData)
      } else {
        // Create new appointment
        console.log("Creating appointment:", appointmentData)
      }
      // Refresh the list after save
    } catch (error) {
      console.error("Error saving appointment:", error)
    }
  }

  const handleTimeSlotClick = (date: Date, time: string) => {
    // Pre-fill form with selected date/time
    setSelectedAppointment(undefined)
    setIsFormOpen(true)
  }

  const handleAppointmentClick = (appointment: AppointmentWithPatient) => {
    setSelectedAppointment(appointment)
    setIsFormOpen(true)
  }

  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_APPOINTMENTS}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
            <p className="text-gray-600">Planifiez et gérez les rendez-vous des patients</p>
          </div>
          <Button onClick={handleCreateNew}>Nouveau Rendez-vous</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>Liste</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Planning</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <AppointmentList onEdit={handleEdit} onDelete={handleDelete} onCreateNew={handleCreateNew} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <AppointmentCalendar onAppointmentClick={handleAppointmentClick} onTimeSlotClick={handleTimeSlotClick} />
          </TabsContent>
        </Tabs>

        <AppointmentForm
          appointment={selectedAppointment}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      </div>
    </ProtectedRoute>
  )
}
