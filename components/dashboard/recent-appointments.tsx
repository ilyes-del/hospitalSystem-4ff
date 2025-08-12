"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"

interface Appointment {
  id: string
  patient_name: string
  time: string
  department: string
  status: "scheduled" | "confirmed" | "in-progress" | "completed"
  priority: "routine" | "urgent" | "emergency"
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patient_name: "Ahmed Benali",
    time: "09:00",
    department: "Cardiologie",
    status: "confirmed",
    priority: "routine",
  },
  {
    id: "2",
    patient_name: "Fatima Khelifi",
    time: "09:30",
    department: "Pédiatrie",
    status: "in-progress",
    priority: "urgent",
  },
  {
    id: "3",
    patient_name: "Mohamed Saidi",
    time: "10:00",
    department: "Orthopédie",
    status: "scheduled",
    priority: "routine",
  },
  {
    id: "4",
    patient_name: "Aicha Boumediene",
    time: "10:30",
    department: "Urgences",
    status: "scheduled",
    priority: "emergency",
  },
]

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  routine: "bg-gray-100 text-gray-800",
  urgent: "bg-orange-100 text-orange-800",
  emergency: "bg-red-100 text-red-800",
}

export function RecentAppointments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Rendez-vous du jour</CardTitle>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center h-10 w-10 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{appointment.time}</span>
                    <span>•</span>
                    <span>{appointment.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={priorityColors[appointment.priority]}>
                  {appointment.priority === "routine" && "Routine"}
                  {appointment.priority === "urgent" && "Urgent"}
                  {appointment.priority === "emergency" && "Urgence"}
                </Badge>
                <Badge className={statusColors[appointment.status]}>
                  {appointment.status === "scheduled" && "Programmé"}
                  {appointment.status === "confirmed" && "Confirmé"}
                  {appointment.status === "in-progress" && "En cours"}
                  {appointment.status === "completed" && "Terminé"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
