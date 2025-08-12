"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Search, Plus, Edit, Eye, Calendar, Shield, Loader2, AlertTriangle } from "lucide-react"
import type { Patient } from "@/lib/types/database"

interface PatientListProps {
  onEdit?: (patient: Patient) => void
  onView?: (patient: Patient) => void
  onCreateNew?: () => void
}

export function PatientList({ onEdit, onView, onCreateNew }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [consentFilter, setConsentFilter] = useState<string>("all")

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/patients", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hospital_auth_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des patients")
      }

      const data = await response.json()
      setPatients(data.patients || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nin.includes(searchTerm) ||
      patient.blood_type?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGender = genderFilter === "all" || patient.gender === genderFilter

    const matchesConsent =
      consentFilter === "all" ||
      (consentFilter === "data_sharing" && patient.consent_flags.data_sharing) ||
      (consentFilter === "cross_hospital" && patient.consent_flags.cross_hospital_access)

    return matchesSearch && matchesGender && matchesConsent
  })

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
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const getConsentStatus = (patient: Patient) => {
    const consentCount = Object.values(patient.consent_flags).filter(Boolean).length
    const totalConsents = Object.keys(patient.consent_flags).length

    if (consentCount === 0) return { label: "Aucun", color: "bg-red-100 text-red-800" }
    if (consentCount === totalConsents) return { label: "Complet", color: "bg-green-100 text-green-800" }
    return { label: "Partiel", color: "bg-orange-100 text-orange-800" }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Chargement des patients...</span>
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
            <Button onClick={fetchPatients} variant="outline">
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
          <CardTitle className="text-xl font-semibold">Patients</CardTitle>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Patient
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, NIN ou groupe sanguin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous genres</SelectItem>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={consentFilter} onValueChange={setConsentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Consentement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous consentements</SelectItem>
              <SelectItem value="data_sharing">Partage de données</SelectItem>
              <SelectItem value="cross_hospital">Accès inter-hôpitaux</SelectItem>
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
                <TableHead>NIN</TableHead>
                <TableHead>Âge/Genre</TableHead>
                <TableHead>Groupe Sanguin</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Consentements</TableHead>
                <TableHead>Dernière MAJ</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => {
                const age = calculateAge(patient.date_of_birth)
                const consentStatus = getConsentStatus(patient)

                return (
                  <TableRow key={patient.nin}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{patient.full_name}</p>
                          <p className="text-sm text-gray-500">Né(e) le {formatDate(patient.date_of_birth)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{patient.nin}</code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{age} ans</p>
                        <p className="text-sm text-gray-500">{patient.gender === "M" ? "Masculin" : "Féminin"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {patient.blood_type || "Non défini"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {patient.allergies && patient.allergies.length > 0 && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            {patient.allergies.length} allergie(s)
                          </Badge>
                        )}
                        {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            {patient.chronic_conditions.length} condition(s)
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <Badge className={consentStatus.color}>{consentStatus.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(patient.updated_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onView?.(patient)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEdit?.(patient)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun patient trouvé</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
