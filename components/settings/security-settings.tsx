"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2, Shield, Key, Eye } from "lucide-react"

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90,
    },
    loginSecurity: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
    auditLog: {
      enabled: true,
      retentionDays: 365,
      logLevel: "detailed",
    },
    dataEncryption: {
      encryptAtRest: true,
      encryptInTransit: true,
      keyRotationDays: 30,
    },
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Paramètres de sécurité sauvegardés",
          description: "Les paramètres de sécurité ont été mis à jour avec succès.",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de sécurité.",
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
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <CardTitle>Politique de mot de passe</CardTitle>
          </div>
          <CardDescription>Configuration des exigences de mot de passe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minLength">Longueur minimale</Label>
            <Input
              id="minLength"
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordPolicy: { ...settings.passwordPolicy, minLength: Number.parseInt(e.target.value) },
                })
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Majuscules requises</Label>
                <p className="text-sm text-gray-500">Au moins une lettre majuscule</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireUppercase}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireUppercase: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Minuscules requises</Label>
                <p className="text-sm text-gray-500">Au moins une lettre minuscule</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireLowercase}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireLowercase: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chiffres requis</Label>
                <p className="text-sm text-gray-500">Au moins un chiffre</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireNumbers}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireNumbers: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Caractères spéciaux requis</Label>
                <p className="text-sm text-gray-500">Au moins un caractère spécial</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireSpecialChars}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireSpecialChars: checked },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordExpiry">Expiration du mot de passe (jours)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              value={settings.passwordPolicy.passwordExpiry}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordPolicy: { ...settings.passwordPolicy, passwordExpiry: Number.parseInt(e.target.value) },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Sécurité de connexion</CardTitle>
          </div>
          <CardDescription>Paramètres de sécurité pour les connexions utilisateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.loginSecurity.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    loginSecurity: { ...settings.loginSecurity, maxLoginAttempts: Number.parseInt(e.target.value) },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Durée de verrouillage (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={settings.loginSecurity.lockoutDuration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    loginSecurity: { ...settings.loginSecurity, lockoutDuration: Number.parseInt(e.target.value) },
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-gray-500">Activer l'authentification à deux facteurs</p>
            </div>
            <Switch
              checked={settings.loginSecurity.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  loginSecurity: { ...settings.loginSecurity, twoFactorAuth: checked },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.loginSecurity.sessionTimeout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  loginSecurity: { ...settings.loginSecurity, sessionTimeout: Number.parseInt(e.target.value) },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <CardTitle>Journal d'audit</CardTitle>
          </div>
          <CardDescription>Configuration du système de journalisation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Journal d'audit activé</Label>
              <p className="text-sm text-gray-500">Enregistrer toutes les actions utilisateur</p>
            </div>
            <Switch
              checked={settings.auditLog.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  auditLog: { ...settings.auditLog, enabled: checked },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retentionDays">Durée de rétention (jours)</Label>
            <Input
              id="retentionDays"
              type="number"
              value={settings.auditLog.retentionDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  auditLog: { ...settings.auditLog, retentionDays: Number.parseInt(e.target.value) },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logLevel">Niveau de journalisation</Label>
            <Select
              value={settings.auditLog.logLevel}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  auditLog: { ...settings.auditLog, logLevel: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basique</SelectItem>
                <SelectItem value="detailed">Détaillé</SelectItem>
                <SelectItem value="verbose">Verbeux</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chiffrement des données</CardTitle>
          <CardDescription>Paramètres de chiffrement et sécurité des données</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chiffrement au repos</Label>
              <p className="text-sm text-gray-500">Chiffrer les données stockées</p>
            </div>
            <Switch
              checked={settings.dataEncryption.encryptAtRest}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataEncryption: { ...settings.dataEncryption, encryptAtRest: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chiffrement en transit</Label>
              <p className="text-sm text-gray-500">Chiffrer les données en transmission</p>
            </div>
            <Switch
              checked={settings.dataEncryption.encryptInTransit}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataEncryption: { ...settings.dataEncryption, encryptInTransit: checked },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyRotationDays">Rotation des clés (jours)</Label>
            <Input
              id="keyRotationDays"
              type="number"
              value={settings.dataEncryption.keyRotationDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dataEncryption: { ...settings.dataEncryption, keyRotationDays: Number.parseInt(e.target.value) },
                })
              }
            />
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
