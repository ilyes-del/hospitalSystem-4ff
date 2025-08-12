"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"

interface HospitalConfigData {
  name: string
  code: string
  address: string
  phone: string
  email: string
  director: string
  capacity: number
  type: string
  region: string
  departments: string[]
}

export function HospitalConfig() {
  const [config, setConfig] = useState<HospitalConfigData>({
    name: "Hôpital Central d'Alger",
    code: "HCA001",
    address: "123 Rue de la Santé, Alger",
    phone: "+213 21 123 456",
    email: "contact@hca.dz",
    director: "Dr. Ahmed Benali",
    capacity: 500,
    type: "public",
    region: "Alger",
    departments: ["Urgences", "Cardiologie", "Pédiatrie", "Chirurgie", "Radiologie"],
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings/hospital", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast({
          title: "Configuration sauvegardée",
          description: "Les paramètres de l'hôpital ont été mis à jour avec succès.",
        })
      } else {
        throw new Error("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>Configuration de base de l'établissement hospitalier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'hôpital</Label>
              <Input id="name" value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code hôpital</Label>
              <Input id="code" value={config.code} onChange={(e) => setConfig({ ...config, code: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={config.address}
              onChange={(e) => setConfig({ ...config, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="director">Directeur</Label>
              <Input
                id="director"
                value={config.director}
                onChange={(e) => setConfig({ ...config, director: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité (lits)</Label>
              <Input
                id="capacity"
                type="number"
                value={config.capacity}
                onChange={(e) => setConfig({ ...config, capacity: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type d'établissement</Label>
              <Select value={config.type} onValueChange={(value) => setConfig({ ...config, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                  <SelectItem value="military">Militaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services et départements</CardTitle>
          <CardDescription>Gestion des services médicaux disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Départements actifs</Label>
            <div className="flex flex-wrap gap-2">
              {config.departments.map((dept, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Sauvegarder
        </Button>
      </div>
    </div>
  )
}
