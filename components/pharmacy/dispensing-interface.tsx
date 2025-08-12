"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pill, Search, User, Plus, Minus, ShoppingCart } from "lucide-react"

interface PrescriptionItem {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  quantity_prescribed: number
  quantity_dispensed: number
  instructions: string
}

interface DispensingInterfaceProps {
  patientNin?: string
  prescriptionId?: string
}

// Mock prescription data
const mockPrescription: PrescriptionItem[] = [
  {
    id: "1",
    medication: "Paracétamol 500mg",
    dosage: "500mg",
    frequency: "3 fois par jour",
    duration: "7 jours",
    quantity_prescribed: 21,
    quantity_dispensed: 0,
    instructions: "Prendre après les repas",
  },
  {
    id: "2",
    medication: "Amoxicilline 250mg",
    dosage: "250mg",
    frequency: "2 fois par jour",
    duration: "10 jours",
    quantity_prescribed: 20,
    quantity_dispensed: 0,
    instructions: "Terminer tout le traitement",
  },
]

export function DispensingInterface({ patientNin, prescriptionId }: DispensingInterfaceProps) {
  const [prescription, setPrescription] = useState<PrescriptionItem[]>(mockPrescription)
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [notes, setNotes] = useState("")

  const updateQuantityDispensed = (itemId: string, quantity: number) => {
    setPrescription((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity_dispensed: Math.max(0, Math.min(quantity, item.quantity_prescribed)),
            }
          : item,
      ),
    )
  }

  const getTotalItems = () => {
    return prescription.reduce((total, item) => total + item.quantity_dispensed, 0)
  }

  const getCompletionStatus = (item: PrescriptionItem) => {
    const percentage = (item.quantity_dispensed / item.quantity_prescribed) * 100
    if (percentage === 0) return { label: "Non distribué", color: "bg-gray-100 text-gray-800" }
    if (percentage < 100) return { label: "Partiel", color: "bg-orange-100 text-orange-800" }
    return { label: "Complet", color: "bg-green-100 text-green-800" }
  }

  const handleDispense = () => {
    const itemsToDispense = prescription.filter((item) => item.quantity_dispensed > 0)
    if (itemsToDispense.length === 0) {
      alert("Aucun médicament sélectionné pour distribution")
      return
    }

    // Here you would typically call an API to record the dispensing
    console.log("Dispensing:", {
      patient: selectedPatient,
      items: itemsToDispense,
      notes,
      timestamp: new Date().toISOString(),
    })

    alert("Distribution enregistrée avec succès")
  }

  return (
    <div className="space-y-6">
      {/* Patient Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Recherche Patient</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="patient-search">NIN ou Nom du patient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="patient-search"
                  placeholder="Rechercher un patient..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="mt-6">Rechercher</Button>
          </div>

          {selectedPatient && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Ahmed Benali</p>
                  <p className="text-sm text-gray-600">NIN: 123456789012345678</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescription Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5" />
              <span>Ordonnance</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ShoppingCart className="h-4 w-4" />
              <span>{getTotalItems()} articles sélectionnés</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Médicament</TableHead>
                  <TableHead>Posologie</TableHead>
                  <TableHead>Prescrit</TableHead>
                  <TableHead>À distribuer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Instructions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.map((item) => {
                  const status = getCompletionStatus(item)
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.medication}</p>
                          <p className="text-sm text-gray-500">{item.dosage}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{item.frequency}</p>
                          <p className="text-gray-500">{item.duration}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.quantity_prescribed}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantityDispensed(item.id, item.quantity_dispensed - 1)}
                            disabled={item.quantity_dispensed === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity_dispensed}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantityDispensed(item.id, item.quantity_dispensed + 1)}
                            disabled={item.quantity_dispensed >= item.quantity_prescribed}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{item.instructions}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dispensing Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes de distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Notes additionnelles sur la distribution..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Annuler</Button>
        <Button onClick={handleDispense} disabled={getTotalItems() === 0}>
          Distribuer les médicaments
        </Button>
      </div>
    </div>
  )
}
