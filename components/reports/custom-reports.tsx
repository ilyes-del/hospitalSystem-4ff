"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { Plus, Play, Save, FileText } from "lucide-react"

interface CustomReport {
  id: string
  name: string
  description: string
  query: string
  fields: string[]
  filters: Record<string, any>
  created_at: string
}

export function CustomReports() {
  const [reports, setReports] = useState<CustomReport[]>([])
  const [isBuilding, setIsBuilding] = useState(false)
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const { toast } = useToast()

  const availableFields = [
    { id: "patient_name", label: "Nom du patient", table: "patients" },
    { id: "patient_nin", label: "NIN", table: "patients" },
    { id: "patient_age", label: "Âge", table: "patients" },
    { id: "appointment_date", label: "Date RDV", table: "appointments" },
    { id: "department", label: "Département", table: "appointments" },
    { id: "doctor_name", label: "Médecin", table: "users" },
    { id: "diagnosis", label: "Diagnostic", table: "visits" },
    { id: "medication", label: "Médicament", table: "prescriptions" },
    { id: "stock_quantity", label: "Quantité stock", table: "inventory" },
    { id: "transaction_date", label: "Date transaction", table: "stock_transactions" },
  ]

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, fieldId])
    } else {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId))
    }
  }

  const generateReport = async () => {
    if (!reportName || selectedFields.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom et sélectionner au moins un champ.",
        variant: "destructive",
      })
      return
    }

    try {
      const reportData = {
        name: reportName,
        description: reportDescription,
        fields: selectedFields,
        dateRange,
      }

      const response = await fetch("/api/reports/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${reportName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Rapport généré",
          description: "Le rapport personnalisé a été téléchargé avec succès.",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport personnalisé.",
        variant: "destructive",
      })
    }
  }

  const saveReport = async () => {
    if (!reportName || selectedFields.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom et sélectionner au moins un champ.",
        variant: "destructive",
      })
      return
    }

    const newReport: CustomReport = {
      id: `CR${Date.now()}`,
      name: reportName,
      description: reportDescription,
      query: `SELECT ${selectedFields.join(", ")} FROM ...`,
      fields: selectedFields,
      filters: { dateRange },
      created_at: new Date().toISOString(),
    }

    setReports([...reports, newReport])

    toast({
      title: "Rapport sauvegardé",
      description: "Le modèle de rapport a été sauvegardé avec succès.",
    })

    // Reset form
    setReportName("")
    setReportDescription("")
    setSelectedFields([])
    setDateRange(undefined)
    setIsBuilding(false)
  }

  const runSavedReport = async (report: CustomReport) => {
    try {
      const response = await fetch(`/api/reports/custom/${report.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${report.name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Rapport généré",
          description: `Le rapport "${report.name}" a été téléchargé avec succès.`,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exécuter le rapport sauvegardé.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rapports personnalisés</h2>
        <Button onClick={() => setIsBuilding(!isBuilding)}>
          <Plus className="mr-2 h-4 w-4" />
          {isBuilding ? "Annuler" : "Nouveau rapport"}
        </Button>
      </div>

      {isBuilding && (
        <Card>
          <CardHeader>
            <CardTitle>Créateur de rapport</CardTitle>
            <CardDescription>
              Configurez votre rapport personnalisé en sélectionnant les champs et filtres
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">Nom du rapport</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Ex: Rapport mensuel des consultations"
                />
              </div>
              <div className="space-y-2">
                <Label>Période</Label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportDescription">Description</Label>
              <Textarea
                id="reportDescription"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Description du rapport..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Champs à inclure</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {field.label}
                      <span className="text-xs text-gray-500 ml-1">({field.table})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={saveReport}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder le modèle
              </Button>
              <Button onClick={generateReport}>
                <Play className="mr-2 h-4 w-4" />
                Générer le rapport
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rapports sauvegardés</CardTitle>
          <CardDescription>Modèles de rapports que vous avez créés</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun rapport personnalisé sauvegardé</p>
              <p className="text-sm">Créez votre premier rapport personnalisé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                    <p className="text-xs text-gray-400">
                      {report.fields.length} champ(s) • Créé le{" "}
                      {new Date(report.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => runSavedReport(report)}>
                    <Play className="mr-2 h-4 w-4" />
                    Exécuter
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
