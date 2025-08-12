"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Autocomplete } from "@/components/ui/autocomplete"
import { Search, Filter, X, Calendar, User } from "lucide-react"
import type { Patient } from "@/lib/types/database"

interface PatientSearchResult extends Patient {
  relevanceScore?: number
  matchedFields?: string[]
}

interface EnhancedPatientSearchProps {
  onPatientSelect?: (patient: Patient) => void
  onCreateNew?: () => void
  placeholder?: string
  showCreateButton?: boolean
}

export function EnhancedPatientSearch({
  onPatientSelect,
  onCreateNew,
  placeholder = "Rechercher un patient par nom, NIN, téléphone...",
  showCreateButton = true,
}: EnhancedPatientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: "",
    gender: "",
    bloodType: "",
    hasAllergies: "",
    hasChronicConditions: "",
    consentStatus: "",
  })

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, filters])

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      })

      const response = await fetch(`/api/patients/search?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hospital_auth_token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.patients || [])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const ageRangeOptions = [
    { value: "0-18", label: "0-18 ans", description: "Pédiatrie" },
    { value: "19-35", label: "19-35 ans", description: "Jeune adulte" },
    { value: "36-55", label: "36-55 ans", description: "Adulte" },
    { value: "56-75", label: "56-75 ans", description: "Senior" },
    { value: "75+", label: "75+ ans", description: "Gériatrie" },
  ]

  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ]

  const clearFilters = () => {
    setFilters({
      ageRange: "",
      gender: "",
      bloodType: "",
      hasAllergies: "",
      hasChronicConditions: "",
      consentStatus: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

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

  const highlightMatch = (text: string, matchedFields: string[] = []) => {
    if (!searchQuery || !matchedFields.length) return text

    const regex = new RegExp(`(${searchQuery})`, "gi")
    return text.replace(regex, "<mark class='bg-yellow-200'>$1</mark>")
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={activeFiltersCount > 0 ? "text-blue-600" : ""}
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filtres Avancés</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Effacer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Autocomplete
                options={ageRangeOptions}
                value={filters.ageRange}
                onValueChange={(value) => setFilters({ ...filters, ageRange: value })}
                placeholder="Tranche d'âge"
                clearable
              />
              <Autocomplete
                options={[
                  { value: "M", label: "Masculin" },
                  { value: "F", label: "Féminin" },
                ]}
                value={filters.gender}
                onValueChange={(value) => setFilters({ ...filters, gender: value })}
                placeholder="Genre"
                clearable
              />
              <Autocomplete
                options={bloodTypeOptions}
                value={filters.bloodType}
                onValueChange={(value) => setFilters({ ...filters, bloodType: value })}
                placeholder="Groupe sanguin"
                clearable
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Autocomplete
                options={[
                  { value: "true", label: "Avec allergies" },
                  { value: "false", label: "Sans allergies" },
                ]}
                value={filters.hasAllergies}
                onValueChange={(value) => setFilters({ ...filters, hasAllergies: value })}
                placeholder="Allergies"
                clearable
              />
              <Autocomplete
                options={[
                  { value: "true", label: "Avec conditions chroniques" },
                  { value: "false", label: "Sans conditions chroniques" },
                ]}
                value={filters.hasChronicConditions}
                onValueChange={(value) => setFilters({ ...filters, hasChronicConditions: value })}
                placeholder="Conditions chroniques"
                clearable
              />
              <Autocomplete
                options={[
                  { value: "complete", label: "Consentement complet" },
                  { value: "partial", label: "Consentement partiel" },
                  { value: "none", label: "Aucun consentement" },
                ]}
                value={filters.consentStatus}
                onValueChange={(value) => setFilters({ ...filters, consentStatus: value })}
                placeholder="Statut consentement"
                clearable
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Résultats de recherche ({searchResults.length})</CardTitle>
              {showCreateButton && (
                <Button variant="outline" size="sm" onClick={onCreateNew}>
                  <User className="h-4 w-4 mr-1" />
                  Nouveau Patient
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">Recherche en cours...</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">Aucun patient trouvé pour "{searchQuery}"</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((patient) => (
                  <div
                    key={patient.nin}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onPatientSelect?.(patient)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className="font-medium"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(patient.full_name, patient.matchedFields),
                            }}
                          />
                          <Badge variant="outline" className="text-xs">
                            {calculateAge(patient.date_of_birth)} ans
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {patient.gender === "M" ? "M" : "F"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            NIN: {patient.nin}
                          </span>
                          {patient.blood_type && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {patient.blood_type}
                            </span>
                          )}
                        </div>
                        {(patient.allergies?.length > 0 || patient.chronic_conditions?.length > 0) && (
                          <div className="flex gap-2 mt-2">
                            {patient.allergies?.length > 0 && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                {patient.allergies.length} allergie(s)
                              </Badge>
                            )}
                            {patient.chronic_conditions?.length > 0 && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                {patient.chronic_conditions.length} condition(s)
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {patient.relevanceScore && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(patient.relevanceScore * 100)}% match
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
