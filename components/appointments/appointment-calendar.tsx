"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react"
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns"
import { fr } from "date-fns/locale"
import type { AppointmentWithPatient } from "@/lib/types/database"

// Mock appointments data
const mockAppointments: AppointmentWithPatient[] = [
  {
    id: "1",
    patient_nin: "123456789012345678",
    hospital_id: "hospital-1",
    department: "Cardiologie",
    scheduled_at: "2024-01-15T09:00:00Z",
    duration_minutes: 30,
    status: "confirmed",
    priority_level: 1,
    appointment_type: "consultation",
    notes: "",
    created_by: "",
    created_at: "",
    updated_at: "",
    patient: {
      nin: "123456789012345678",
      full_name: "Ahmed Benali",
      date_of_birth: "1980-05-15",
      gender: "M",
      primary_hospital_id: "hospital-1",
      consent_flags: {},
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "2",
    patient_nin: "234567890123456789",
    hospital_id: "hospital-1",
    department: "Pédiatrie",
    scheduled_at: "2024-01-15T10:30:00Z",
    duration_minutes: 20,
    status: "in-progress",
    priority_level: 2,
    appointment_type: "follow-up",
    notes: "",
    created_by: "",
    created_at: "",
    updated_at: "",
    patient: {
      nin: "234567890123456789",
      full_name: "Fatima Khelifi",
      date_of_birth: "2015-03-20",
      gender: "F",
      primary_hospital_id: "hospital-1",
      consent_flags: {},
      created_at: "",
      updated_at: "",
    },
  },
]

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  "no-show": "bg-orange-100 text-orange-800 border-orange-200",
}

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

interface AppointmentCalendarProps {
  onAppointmentClick?: (appointment: AppointmentWithPatient) => void
  onTimeSlotClick?: (date: Date, time: string) => void
}

export function AppointmentCalendar({ onAppointmentClick, onTimeSlotClick }: AppointmentCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [appointments] = useState<AppointmentWithPatient[]>(mockAppointments)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getAppointmentsForDateTime = (date: Date, time: string) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.scheduled_at)
      const appointmentTime = format(appointmentDate, "HH:mm")
      return isSameDay(appointmentDate, date) && appointmentTime === time
    })
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => (direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1)))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Planning des rendez-vous
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              {format(weekStart, "d MMM", { locale: fr })} -{" "}
              {format(addDays(weekStart, 6), "d MMM yyyy", { locale: fr })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="p-2 text-sm font-medium text-gray-500">Heure</div>
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="p-2 text-center">
                  <div className="text-sm font-medium text-gray-900">{format(day, "EEE", { locale: fr })}</div>
                  <div className="text-lg font-semibold text-gray-700">{format(day, "d")}</div>
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 gap-1">
                  <div className="p-2 text-sm text-gray-500 font-medium border-r">{time}</div>
                  {weekDays.map((day) => {
                    const dayAppointments = getAppointmentsForDateTime(day, time)
                    return (
                      <div
                        key={`${day.toISOString()}-${time}`}
                        className="min-h-[60px] border border-gray-100 rounded p-1 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onTimeSlotClick?.(day, time)}
                      >
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              onAppointmentClick?.(appointment)
                            }}
                            className={`p-2 rounded text-xs border cursor-pointer hover:shadow-sm ${
                              statusColors[appointment.status]
                            }`}
                          >
                            <div className="flex items-center space-x-1 mb-1">
                              <User className="h-3 w-3" />
                              <span className="font-medium truncate">{appointment.patient?.full_name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.duration_minutes}min</span>
                            </div>
                            <div className="text-xs text-gray-600 truncate mt-1">{appointment.department}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Programmé</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Confirmé</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>En cours</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Terminé</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
