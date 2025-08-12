"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
import { CalendarIcon, Shield, AlertTriangle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { Patient } from "@/lib/types/database"
import { NIN_PATTERN } from "@/lib/constants/hospital"

interface PatientFormProps {
  patient?: Patient
  isOpen: boolean
  onClose: () => void
  onSave: (patientData: any) => void
}

export function PatientForm({ patient, isOpen, onClose, onSave }: PatientFormProps) {
  const [formData, setFormData] = useState({
    nin: patient?.nin || "",
    full_name: patient?.full_name || "",
    date_of_birth: patient?.date_of_birth ? new Date(patient.date_of_birth) : undefined,
    gender: patient?.gender || "",
    phone: "", // Decrypted for editing
    address: "", // Decrypted for editing
    emergency_contact: "", // Decrypted for editing
    blood_type: patient?.blood_type || "",
    allergies: patient?.allergies?.join(", ") || "",
    chronic_conditions: patient?.chronic_conditions?.join(", ") || "",
    consent_flags: patient?.consent_flags || {
      data_sharing: false,
      cross_hospital_access: false,
      research_participation: false,
      emergency_contact: false,
      marketing_communications: false,
    },
  })

  const [ninError, setNinError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Validate NIN in real-time
    if (field === "nin") {
      validateNIN(value)
    }
  }

  const handleConsentChange = (consentType: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      consent_flags: {
        ...prev.consent_flags,
        [consentType]: checked,
      },
    }))
  }

  const validateNIN = (nin: string) => {
    if (!nin) {
      setNinError("")
      return false
    }

    if (!NIN_PATTERN.test(nin)) {
      setNinError("Le NIN doit contenir exactement 18 chiffres")
      return false
    }

    // Additional NIN validation logic could go here
    // (checksum validation, birth date consistency, etc.)

    setNinError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.nin || !formData.full_name || !formData.date_of_birth || !formData.gender) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Validate NIN
    if (!validateNIN(formData.nin)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Process form data
      const patientData = {
        ...formData,
        date_of_birth: formData.date_of_birth?.toISOString().split("T")[0],
        allergies: formData.allergies
          ? formData.allergies
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        chronic_conditions: formData.chronic_conditions
          ? formData.chronic_conditions
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
      }

      const url = patient ? `/api/patients/${patient.nin}` : "/api/patients"
      const method = patient ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hospital_auth_token")}`,
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la sauvegarde")
      }

      const savedPatient = await response.json()
      onSave(savedPatient)
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsSubmitting(false)
    }
  }

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{patient ? "Modifier le patient" : "Nouveau patient"}</DialogTitle>
          <DialogDescription>
            {patient ? "Modifiez les informations du patient" : "Enregistrez un nouveau patient dans le système"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations de base</h3>

            {/* NIN */}
            <div className="space-y-2">
              <Label htmlFor="nin">Numéro d'Identité Nationale (NIN) *</Label>
              <Input
                id="nin"
                value={formData.nin}
                onChange={(e) => handleInputChange("nin", e.target.value)}
                placeholder="18 chiffres"
                maxLength={18}
                className={ninError ? "border-red-500" : ""}
                disabled={!!patient} // NIN cannot be changed after creation
              />
              {ninError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{ninError}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Prénom et nom"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Genre *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label>Date de naissance *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date_of_birth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date_of_birth ? (
                        format(formData.date_of_birth, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date_of_birth}
                      onSelect={(date) => handleInputChange("date_of_birth", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Blood Type */}
              <div className="space-y-2">
                <Label htmlFor="blood_type">Groupe sanguin</Label>
                <Select value={formData.blood_type} onValueChange={(value) => handleInputChange("blood_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations de contact</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+213 XX XX XX XX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency">Contact d'urgence</Label>
                <Input
                  id="emergency"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
                  placeholder="+213 XX XX XX XX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Adresse complète"
                rows={2}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations médicales</h3>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="Séparer par des virgules (ex: Pénicilline, Fruits de mer)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Conditions chroniques</Label>
              <Input
                id="conditions"
                value={formData.chronic_conditions}
                onChange={(e) => handleInputChange("chronic_conditions", e.target.value)}
                placeholder="Séparer par des virgules (ex: Hypertension, Diabète)"
              />
            </div>
          </div>

          {/* Consent Management */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Gestion des consentements</h3>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="data_sharing"
                  checked={formData.consent_flags.data_sharing}
                  onCheckedChange={(checked) => handleConsentChange("data_sharing", checked as boolean)}
                />
                <Label htmlFor="data_sharing" className="text-sm">
                  Autoriser le partage de données médicales entre services
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cross_hospital"
                  checked={formData.consent_flags.cross_hospital_access}
                  onCheckedChange={(checked) => handleConsentChange("cross_hospital_access", checked as boolean)}
                />
                <Label htmlFor="cross_hospital" className="text-sm">
                  Autoriser l'accès aux données depuis d'autres hôpitaux
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="research"
                  checked={formData.consent_flags.research_participation}
                  onCheckedChange={(checked) => handleConsentChange("research_participation", checked as boolean)}
                />
                <Label htmlFor="research" className="text-sm">
                  Autoriser l'utilisation des données pour la recherche médicale
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency_consent"
                  checked={formData.consent_flags.emergency_contact}
                  onCheckedChange={(checked) => handleConsentChange("emergency_contact", checked as boolean)}
                />
                <Label htmlFor="emergency_consent" className="text-sm">
                  Autoriser le contact d'urgence en cas de besoin médical
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.consent_flags.marketing_communications}
                  onCheckedChange={(checked) => handleConsentChange("marketing_communications", checked as boolean)}
                />
                <Label htmlFor="marketing" className="text-sm">
                  Accepter les communications marketing et informatives
                </Label>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertTriangle className="h-4 w-4" />
              <span>{submitError}</span>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {patient ? "Modification..." : "Enregistrement..."}
                </>
              ) : patient ? (
                "Modifier"
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
