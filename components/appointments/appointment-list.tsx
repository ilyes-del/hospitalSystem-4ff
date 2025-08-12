"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, User, Search, Plus, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react"
import type { AppointmentWithPatient } from "@/lib/types/database"

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  "no-show": "bg-orange-100 text-orange-800",
}

const priorityColors = {
  1: "bg-gray-100 text-gray-800",
  2: "bg-orange-100 text-orange-800",
  3: "bg-red-100 text-red-800",
}

const typeColors = {
  consultation: "bg-blue-100 text-blue-800",
  "follow-up": "bg-purple-100 text-purple-800",
  emergency: "bg-red-100 text-red-800",
}

interface AppointmentListProps {
  onEdit?: (appointment: AppointmentWithPatient) => void
  onDelete?: (appointmentId: string) => void
  onCreateNew?: () => void
}

export function AppointmentList({ onEdit, onDelete, onCreateNew }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hospital_auth_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des rendez-vous")
      }

      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (appointmentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hospital_auth_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      // Remove from local state
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId))
      onDelete?.(appointmentId)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression")
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.nin.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || appointment.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Chargement des rendez-vous...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAppointments} variant="outline">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Rendez-vous</CardTitle>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par patient, NIN ou service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="scheduled">Programmé</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
              <SelectItem value="no-show">Absent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les services</SelectItem>
              <SelectItem value="Cardiologie">Cardiologie</SelectItem>
              <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
              <SelectItem value="Urgences">Urgences</SelectItem>
              <SelectItem value="Orthopédie">Orthopédie</SelectItem>
              <SelectItem value="Neurologie">Neurologie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient?.full_name}</p>
                        <p className="text-sm text-gray-500">NIN: {appointment.patient?.nin}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{formatDate(appointment.scheduled_at)}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(appointment.scheduled_at)} ({appointment.duration_minutes}min)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{appointment.department}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[appointment.appointment_type || "consultation"]}>
                      {appointment.appointment_type === "consultation" && "Consultation"}
                      {appointment.appointment_type === "follow-up" && "Suivi"}
                      {appointment.appointment_type === "emergency" && "Urgence"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[appointment.status]}>
                      {appointment.status === "scheduled" && "Programmé"}
                      {appointment.status === "confirmed" && "Confirmé"}
                      {appointment.status === "in-progress" && "En cours"}
                      {appointment.status === "completed" && "Terminé"}
                      {appointment.status === "cancelled" && "Annulé"}
                      {appointment.status === "no-show" && "Absent"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[appointment.priority_level]}>
                      {appointment.priority_level === 1 && "Routine"}
                      {appointment.priority_level === 2 && "Urgent"}
                      {appointment.priority_level === 3 && "Urgence"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun rendez-vous trouvé</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
