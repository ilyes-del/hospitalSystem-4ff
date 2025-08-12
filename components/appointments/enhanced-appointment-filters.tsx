"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Autocomplete } from "@/components/ui/autocomplete"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Filter, X, Calendar, Clock, User, Building } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface AppointmentFilters {
  dateRange?: DateRange
  timeSlot: string
  department: string
  doctor: string
  status: string
  priority: string
  appointmentType: string
}

interface EnhancedAppointmentFiltersProps {
  filters: AppointmentFilters
  onFiltersChange: (filters: AppointmentFilters) => void
  onClearFilters: () => void
}

export function EnhancedAppointmentFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: EnhancedAppointmentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const timeSlotOptions = [
    { value: "morning", label: "Matin (8h-12h)", description: "08:00 - 12:00" },
    { value: "afternoon", label: "Après-midi (12h-17h)", description: "12:00 - 17:00" },
    { value: "evening", label: "Soir (17h-20h)", description: "17:00 - 20:00" },
  ]

  const departmentOptions = [
    { value: "Cardiologie", label: "Cardiologie", description: "Maladies cardiovasculaires" },
    { value: "Pédiatrie", label: "Pédiatrie", description: "Médecine des enfants" },
    { value: "Urgences", label: "Urgences", description: "Soins d'urgence" },
    { value: "Orthopédie", label: "Orthopédie", description: "Os et articulations" },
    { value: "Neurologie", label: "Neurologie", description: "Système nerveux" },
    { value: "Dermatologie", label: "Dermatologie", description: "Maladies de la peau" },
    { value: "Gynécologie", label: "Gynécologie", description: "Santé féminine" },
    { value: "Ophtalmologie", label: "Ophtalmologie", description: "Maladies des yeux" },
  ]

  const doctorOptions = [
    { value: "dr-amara", label: "Dr. Amara", description: "Cardiologue" },
    { value: "dr-bouali", label: "Dr. Bouali", description: "Pédiatre" },
    { value: "dr-khelil", label: "Dr. Khelil", description: "Urgentiste" },
    { value: "dr-meziane", label: "Dr. Meziane", description: "Orthopédiste" },
    { value: "dr-saidi", label: "Dr. Saidi", description: "Neurologue" },
  ]

  const statusOptions = [
    { value: "scheduled", label: "Programmé", description: "En attente" },
    { value: "confirmed", label: "Confirmé", description: "Patient confirmé" },
    { value: "in-progress", label: "En cours", description: "Consultation en cours" },
    { value: "completed", label: "Terminé", description: "Consultation terminée" },
    { value: "cancelled", label: "Annulé", description: "Rendez-vous annulé" },
    { value: "no-show", label: "Absent", description: "Patient absent" },
  ]

  const priorityOptions = [
    { value: "1", label: "Routine", description: "Priorité normale" },
    { value: "2", label: "Urgent", description: "Priorité élevée" },
    { value: "3", label: "Urgence", description: "Priorité critique" },
  ]

  const appointmentTypeOptions = [
    { value: "consultation", label: "Consultation", description: "Première consultation" },
    { value: "follow-up", label: "Suivi", description: "Consultation de suivi" },
    { value: "emergency", label: "Urgence", description: "Consultation d'urgence" },
  ]

  const updateFilter = (key: keyof AppointmentFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "dateRange") return value?.from || value?.to
    return value
  }).length

  const getFilterSummary = () => {
    const summary = []

    if (filters.dateRange?.from) {
      const fromDate = format(filters.dateRange.from, "dd/MM", { locale: fr })
      const toDate = filters.dateRange.to ? format(filters.dateRange.to, "dd/MM", { locale: fr }) : fromDate
      summary.push(`${fromDate}${filters.dateRange.to ? ` - ${toDate}` : ""}`)
    }

    if (filters.department) {
      const dept = departmentOptions.find((d) => d.value === filters.department)
      summary.push(dept?.label || filters.department)
    }

    if (filters.doctor) {
      const doc = doctorOptions.find((d) => d.value === filters.doctor)
      summary.push(doc?.label || filters.doctor)
    }

    if (filters.status) {
      const status = statusOptions.find((s) => s.value === filters.status)
      summary.push(status?.label || filters.status)
    }

    return summary
  }

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={activeFiltersCount > 0 ? "border-blue-500 text-blue-600" : ""}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Effacer tout
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {getFilterSummary().map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
        </div>
      )}

      {/* Detailed Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres Avancés
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Effacer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période
              </label>
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={(dateRange) => updateFilter("dateRange", dateRange)}
                placeholder="Sélectionner une période"
              />
            </div>

            {/* Time Slot and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Créneau horaire
                </label>
                <Autocomplete
                  options={timeSlotOptions}
                  value={filters.timeSlot}
                  onValueChange={(value) => updateFilter("timeSlot", value)}
                  placeholder="Tous les créneaux"
                  clearable
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Service
                </label>
                <Autocomplete
                  options={departmentOptions}
                  value={filters.department}
                  onValueChange={(value) => updateFilter("department", value)}
                  placeholder="Tous les services"
                  clearable
                />
              </div>
            </div>

            {/* Doctor and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Médecin
                </label>
                <Autocomplete
                  options={doctorOptions}
                  value={filters.doctor}
                  onValueChange={(value) => updateFilter("doctor", value)}
                  placeholder="Tous les médecins"
                  clearable
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Autocomplete
                  options={statusOptions}
                  value={filters.status}
                  onValueChange={(value) => updateFilter("status", value)}
                  placeholder="Tous les statuts"
                  clearable
                />
              </div>
            </div>

            {/* Priority and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priorité</label>
                <Autocomplete
                  options={priorityOptions}
                  value={filters.priority}
                  onValueChange={(value) => updateFilter("priority", value)}
                  placeholder="Toutes les priorités"
                  clearable
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de RDV</label>
                <Autocomplete
                  options={appointmentTypeOptions}
                  value={filters.appointmentType}
                  onValueChange={(value) => updateFilter("appointmentType", value)}
                  placeholder="Tous les types"
                  clearable
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
