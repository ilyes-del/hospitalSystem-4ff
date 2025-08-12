"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Calendar, Phone, MapPin, Heart, AlertTriangle, Shield, FileText, Activity, Edit } from "lucide-react"
import type { Patient, VisitWithDetails, AppointmentWithPatient } from "@/lib/types/database"

interface PatientProfileProps {
  patient?: Patient
  isOpen: boolean
  onClose: () => void
  onEdit?: (patient: Patient) => void
}

// Mock data for visits and appointments
const mockVisits: VisitWithDetails[] = [
  {
    id: "visit-1",
    patient_nin: "123456789012345678",
    hospital_id: "hospital-1",
    department: "Cardiologie",
    arrival_time: "2024-01-15T09:00:00Z",
    triage_level: 2,
    chief_complaint: "Douleur thoracique",
    vital_signs: {
      temperature: 37.2,
      blood_pressure: "140/90",
      heart_rate: 85,
      respiratory_rate: 18,
      oxygen_saturation: 98,
    },
    diagnosis_codes: ["I20.9"],
    treatment_notes: "Angine de poitrine stable. Traitement médicamenteux ajusté.",
    prescriptions: [
      {
        medication: "Aspirine 75mg",
        dosage: "75mg",
        frequency: "1 fois par jour",
        duration: "30 jours",
      },
    ],
    discharge_time: "2024-01-15T11:30:00Z",
    status: "discharged",
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2024-01-15T11:30:00Z",
  },
]

const mockAppointments: AppointmentWithPatient[] = [
  {
    id: "apt-1",
    patient_nin: "123456789012345678",
    hospital_id: "hospital-1",
    department: "Cardiologie",
    scheduled_at: "2024-01-25T10:00:00Z",
    duration_minutes: 30,
    status: "confirmed",
    priority_level: 1,
    appointment_type: "follow-up",
    notes: "Suivi post-consultation",
    created_by: "user-1",
    created_at: "2024-01-16T00:00:00Z",
    updated_at: "2024-01-16T00:00:00Z",
  },
]

export function PatientProfile({ patient, isOpen, onClose, onEdit }: PatientProfileProps) {
  const [visits] = useState<VisitWithDetails[]>(mockVisits)
  const [appointments] = useState<AppointmentWithPatient[]>(mockAppointments)

  if (!patient) return null

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR")
  }

  const getConsentStatus = (patient: Patient) => {
    const consentCount = Object.values(patient.consent_flags).filter(Boolean).length
    const totalConsents = Object.keys(patient.consent_flags).length
    return `${consentCount}/${totalConsents}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{patient.full_name}</DialogTitle>
              <DialogDescription>NIN: {patient.nin}</DialogDescription>
            </div>
            <Button variant="outline" onClick={() => onEdit?.(patient)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="visits">Visites</TabsTrigger>
            <TabsTrigger value="appointments">RDV</TabsTrigger>
            <TabsTrigger value="consent">Consentements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Âge</p>
                        <p className="font-medium">{calculateAge(patient.date_of_birth)} ans</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Genre</p>
                        <p className="font-medium">{patient.gender === "M" ? "Masculin" : "Féminin"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Groupe sanguin</p>
                        <p className="font-medium">{patient.blood_type || "Non défini"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">Chiffré</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">Chiffrée</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Enregistré le</p>
                        <p className="font-medium">{formatDate(patient.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Allergies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <div className="space-y-2">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune allergie connue</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-orange-500" />
                    <span>Conditions chroniques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                    <div className="space-y-2">
                      {patient.chronic_conditions.map((condition, index) => (
                        <Badge key={index} className="bg-orange-100 text-orange-800">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune condition chronique</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Historique des visites</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visits.length > 0 ? (
                  <div className="space-y-4">
                    {visits.map((visit) => (
                      <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{visit.department}</h4>
                            <p className="text-sm text-gray-500">{formatDateTime(visit.arrival_time)}</p>
                          </div>
                          <Badge
                            className={
                              visit.status === "discharged"
                                ? "bg-green-100 text-green-800"
                                : visit.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {visit.status === "discharged" && "Sortie"}
                            {visit.status === "active" && "Active"}
                            {visit.status === "transferred" && "Transférée"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Motif de consultation</p>
                            <p className="font-medium">{visit.chief_complaint}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Niveau de triage</p>
                            <p className="font-medium">Niveau {visit.triage_level}</p>
                          </div>
                        </div>

                        {visit.vital_signs && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium mb-2">Signes vitaux</p>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <span>Temp: {visit.vital_signs.temperature}°C</span>
                              <span>TA: {visit.vital_signs.blood_pressure}</span>
                              <span>FC: {visit.vital_signs.heart_rate} bpm</span>
                            </div>
                          </div>
                        )}

                        {visit.treatment_notes && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">Notes de traitement</p>
                            <p className="text-sm">{visit.treatment_notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune visite enregistrée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Rendez-vous</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Heure</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{formatDateTime(appointment.scheduled_at)}</TableCell>
                            <TableCell>{appointment.department}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {appointment.appointment_type === "consultation" && "Consultation"}
                                {appointment.appointment_type === "follow-up" && "Suivi"}
                                {appointment.appointment_type === "emergency" && "Urgence"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "scheduled"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }
                              >
                                {appointment.status === "confirmed" && "Confirmé"}
                                {appointment.status === "scheduled" && "Programmé"}
                                {appointment.status === "completed" && "Terminé"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{appointment.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun rendez-vous programmé</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Gestion des consentements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Partage de données médicales</span>
                    <Badge
                      className={
                        patient.consent_flags.data_sharing ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {patient.consent_flags.data_sharing ? "Autorisé" : "Refusé"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Accès inter-hôpitaux</span>
                    <Badge
                      className={
                        patient.consent_flags.cross_hospital_access
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {patient.consent_flags.cross_hospital_access ? "Autorisé" : "Refusé"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Participation à la recherche</span>
                    <Badge
                      className={
                        patient.consent_flags.research_participation
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {patient.consent_flags.research_participation ? "Autorisé" : "Refusé"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Contact d'urgence</span>
                    <Badge
                      className={
                        patient.consent_flags.emergency_contact
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {patient.consent_flags.emergency_contact ? "Autorisé" : "Refusé"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Communications marketing</span>
                    <Badge
                      className={
                        patient.consent_flags.marketing_communications
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {patient.consent_flags.marketing_communications ? "Autorisé" : "Refusé"}
                    </Badge>
                  </div>

                  <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Statut global des consentements</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">{getConsentStatus(patient)} consentements accordés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
