"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Clock, Phone, Ambulance } from "lucide-react"

interface EmergencyTransfer {
  id: string
  patient_nin: string
  patient_name: string
  from_hospital: string
  to_hospital: string
  condition: string
  vital_signs: {
    blood_pressure: string
    heart_rate: number
    temperature: number
    oxygen_saturation: number
  }
  transport_method: "ambulance" | "helicopter" | "ground"
  estimated_arrival: string
  contact_person: string
  contact_phone: string
  status: "initiated" | "in_transit" | "arrived" | "completed"
  created_at: string
}

export function EmergencyTransfers() {
  const [transfers, setTransfers] = useState<EmergencyTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEmergencyTransfers()
    const interval = setInterval(fetchEmergencyTransfers, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchEmergencyTransfers = async () => {
    try {
      const response = await fetch("/api/referrals/emergency")
      if (response.ok) {
        const data = await response.json()
        setTransfers(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les transferts d'urgence.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initiated":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "arrived":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTransportIcon = (method: string) => {
    switch (method) {
      case "ambulance":
        return <Ambulance className="h-4 w-4" />
      case "helicopter":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Ambulance className="h-4 w-4" />
    }
  }

  const getVitalSignsStatus = (vitals: EmergencyTransfer["vital_signs"]) => {
    const { heart_rate, temperature, oxygen_saturation } = vitals

    if (heart_rate > 100 || temperature > 38.5 || oxygen_saturation < 95) {
      return "critical"
    } else if (heart_rate > 90 || temperature > 37.5 || oxygen_saturation < 98) {
      return "warning"
    }
    return "stable"
  }

  const getVitalSignsColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "stable":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des transferts d'urgence...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transferts d'urgence</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Mise à jour automatique toutes les 30 secondes</span>
        </div>
      </div>

      {transfers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun transfert d'urgence en cours</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => {
            const vitalStatus = getVitalSignsStatus(transfer.vital_signs)
            return (
              <Card key={transfer.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      <div>
                        <CardTitle className="text-lg text-red-700">{transfer.patient_name}</CardTitle>
                        <CardDescription>NIN: {transfer.patient_nin}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(transfer.status)}>{transfer.status}</Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {getTransportIcon(transfer.transport_method)}
                        <span>{transfer.transport_method}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transfer Info */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Informations du transfert</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>De:</strong> {transfer.from_hospital}
                        </div>
                        <div>
                          <strong>Vers:</strong> {transfer.to_hospital}
                        </div>
                        <div>
                          <strong>Condition:</strong> {transfer.condition}
                        </div>
                        <div>
                          <strong>Arrivée estimée:</strong>{" "}
                          {new Date(transfer.estimated_arrival).toLocaleString("fr-FR")}
                        </div>
                      </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Signes vitaux</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tension artérielle:</span>
                          <span className={getVitalSignsColor(vitalStatus)}>{transfer.vital_signs.blood_pressure}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fréquence cardiaque:</span>
                          <span className={getVitalSignsColor(vitalStatus)}>{transfer.vital_signs.heart_rate} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Température:</span>
                          <span className={getVitalSignsColor(vitalStatus)}>{transfer.vital_signs.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturation O2:</span>
                          <span className={getVitalSignsColor(vitalStatus)}>
                            {transfer.vital_signs.oxygen_saturation}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Contact</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Personne de contact:</strong>
                          <br />
                          {transfer.contact_person}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${transfer.contact_phone}`}>{transfer.contact_phone}</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t text-xs text-gray-500">
                    Initié le: {new Date(transfer.created_at).toLocaleString("fr-FR")}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
