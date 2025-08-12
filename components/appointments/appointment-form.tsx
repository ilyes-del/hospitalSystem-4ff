"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Search, User } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { AppointmentWithPatient } from "@/lib/types/database"
import { MEDICAL_DEPARTMENTS } from "@/lib/constants/hospital"

interface AppointmentFormProps {
  appointment?: AppointmentWithPatient
  isOpen: boolean
  onClose: () => void
  onSave: (appointmentData: any) => void
}

export function AppointmentForm({ appointment, isOpen, onClose, onSave }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patient_nin: appointment?.patient_nin || "",
    patient_name: appointment?.patient?.full_name || "",
    department: appointment?.department || "",
    appointment_type: appointment?.appointment_type || "consultation",
    scheduled_date: appointment?.scheduled_at ? new Date(appointment.scheduled_at) : undefined,
    scheduled_time: appointment?.scheduled_at ? format(new Date(appointment.scheduled_at), "HH:mm") : "09:00",
    duration_minutes: appointment?.duration_minutes || 30,
    priority_level: appointment?.priority_level || 1,
    notes: appointment?.notes || "",
  })

  const [isSearchingPatient, setIsSearchingPatient] = useState(false)
  const [patientSearchResults, setPatientSearchResults] = useState<any[]>([])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePatientSearch = async (nin: string) => {
    if (nin.length < 3) {
      setPatientSearchResults([])
      return
    }

    setIsSearchingPatient(true)
    try {
      // Mock patient search - in real app, this would be an API call
      const mockResults = [
        {
          nin: "123456789012345678",
          full_name: "Ahmed Benali",
          date_of_birth: "1980-05-15",
          gender: "M",
        },
        {
          nin: "234567890123456789",
          full_name: "Fatima Khelifi",
          date_of_birth: "2015-03-20",
          gender: "F",
        },
      ].filter((patient) => patient.nin.includes(nin) || patient.full_name.toLowerCase().includes(nin.toLowerCase()))

      setPatientSearchResults(mockResults)
    } catch (error) {
      console.error("Patient search error:", error)
    } finally {
      setIsSearchingPatient(false)
    }
  }

  const handlePatientSelect = (patient: any) => {
    setFormData((prev) => ({
      ...prev,
      patient_nin: patient.nin,
      patient_name: patient.full_name,
    }))
    setPatientSearchResults([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.patient_nin || !formData.department || !formData.scheduled_date) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Combine date and time
    const scheduledDateTime = new Date(formData.scheduled_date)
    const [hours, minutes] = formData.scheduled_time.split(":").map(Number)
    scheduledDateTime.setHours(hours, minutes)

    const appointmentData = {
      ...formData,
      scheduled_at: scheduledDateTime.toISOString(),
      id: appointment?.id,
    }

    onSave(appointmentData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{appointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Modifiez les informations du rendez-vous" : "Créez un nouveau rendez-vous pour un patient"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <div className="relative">
              <Input
                id="patient"
                placeholder="Rechercher par NIN ou nom..."
                value={formData.patient_name || formData.patient_nin}
                onChange={(e) => {
                  const value = e.target.value
                  handleInputChange("patient_nin", value)
                  handleInputChange("patient_name", value)
                  handlePatientSearch(value)
                }}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Patient Search Results */}
            {patientSearchResults.length > 0 && (
              <div className="border border-gray-200 rounded-md bg-white shadow-sm max-h-40 overflow-y-auto">
                {patientSearchResults.map((patient) => (
                  <button
                    key={patient.nin}
                    type="button"
                    onClick={() => handlePatientSelect(patient)}
                    className="w-full text-left p-3 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{patient.full_name}</p>
                      <p className="text-sm text-gray-500">NIN: {patient.nin}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Service *</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {MEDICAL_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.appointment_type}
                onValueChange={(value) => handleInputChange("appointment_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Suivi</SelectItem>
                  <SelectItem value="emergency">Urgence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.scheduled_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduled_date ? (
                      format(formData.scheduled_date, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.scheduled_date}
                    onSelect={(date) => handleInputChange("scheduled_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => handleInputChange("scheduled_time", e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (min)</Label>
              <Select
                value={formData.duration_minutes.toString()}
                onValueChange={(value) => handleInputChange("duration_minutes", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1h30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority_level.toString()}
              onValueChange={(value) => handleInputChange("priority_level", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Routine</SelectItem>
                <SelectItem value="2">Urgent</SelectItem>
                <SelectItem value="3">Urgence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes additionnelles..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{appointment ? "Modifier" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
