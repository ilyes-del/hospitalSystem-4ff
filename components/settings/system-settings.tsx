"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2 } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    language: "fr",
    timezone: "Africa/Algiers",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    autoBackup: true,
    backupFrequency: "daily",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    appointmentReminders: true,
    stockAlerts: true,
    lowStockThreshold: 10,
    sessionTimeout: 30,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings/system", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Paramètres sauvegardés",
          description: "Les paramètres système ont été mis à jour avec succès.",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
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
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>Configuration générale du système</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Algiers">Alger (GMT+1)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Format de date</Label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Format d'heure</Label>
              <Select
                value={settings.timeFormat}
                onValueChange={(value) => setSettings({ ...settings, timeFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 heures</SelectItem>
                  <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configuration des notifications système</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications email</Label>
              <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications SMS</Label>
              <p className="text-sm text-gray-500">Recevoir les notifications par SMS</p>
            </div>
            <Switch
              checked={settings.notifications.sms}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, sms: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rappels de rendez-vous</Label>
              <p className="text-sm text-gray-500">Envoyer des rappels automatiques</p>
            </div>
            <Switch
              checked={settings.appointmentReminders}
              onCheckedChange={(checked) => setSettings({ ...settings, appointmentReminders: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des stocks</CardTitle>
          <CardDescription>Paramètres pour la gestion des stocks et alertes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertes de stock</Label>
              <p className="text-sm text-gray-500">Activer les alertes de stock faible</p>
            </div>
            <Switch
              checked={settings.stockAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, stockAlerts: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Seuil de stock faible</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number.parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sauvegarde automatique</CardTitle>
          <CardDescription>Configuration des sauvegardes automatiques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sauvegarde automatique</Label>
              <p className="text-sm text-gray-500">Activer les sauvegardes automatiques</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
            />
          </div>

          {settings.autoBackup && (
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Toutes les heures</SelectItem>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
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
