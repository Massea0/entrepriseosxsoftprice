import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  Bell, 
  Send, 
  Zap, 
  TestTube,
  Settings,
  Mail,
  Users,
  Sparkles
} from 'lucide-react'
import { createDemoNotifications } from '@/utils/notificationIntegrations'
import { useNotifications } from '@/hooks/useNotifications'

export function NotificationDemo() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { createNotification, preferences, updatePreferences } = useNotifications()

  const handleCreateDemo = async () => {
    if (!user) return

    try {
      toast({
        title: "🚀 Création des notifications de test...",
        description: "Création de 5 notifications d'exemple"
      })

      await createDemoNotifications(user.id)

      toast({
        title: "✅ Notifications créées !",
        description: "5 notifications de démonstration ont été créées. Vérifiez l'icône de cloche.",
        duration: 5000
      })
    } catch (error) {
      console.error('Error creating demo notifications:', error)
      toast({
        variant: "destructive",
        title: "❌ Erreur",
        description: "Impossible de créer les notifications de test"
      })
    }
  }

  const handleTestEmail = async () => {
    if (!user) return

    try {
      await createNotification({
        type: 'system',
        title: '📧 Test Email',
        message: 'Ceci est un test d\'envoi d\'email automatique du système de notifications.',
        priority: 'medium'
      })

      toast({
        title: "📧 Test d'email envoyé",
        description: "Un email de test devrait arriver dans quelques instants si activé"
      })
    } catch (error) {
      console.error('Error sending test email:', error)
      toast({
        variant: "destructive",
        title: "❌ Erreur",
        description: "Impossible d'envoyer l'email de test"
      })
    }
  }

  const toggleEmailNotifications = async () => {
    const newValue = !preferences?.email_enabled
    await updatePreferences({ email_enabled: newValue })
    
    toast({
      title: newValue ? "📧 Emails activés" : "📧 Emails désactivés",
      description: `Les notifications par email sont maintenant ${newValue ? 'activées' : 'désactivées'}`
    })
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-500" />
          Centre de Test Notifications
        </h2>
        <p className="text-muted-foreground mt-1">
          Testez le système de notifications en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Test Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-green-500" />
              Notifications Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Créer des notifications d'exemple pour tester l'interface
            </p>
            <Button onClick={handleCreateDemo} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Créer 5 notifications test
            </Button>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Test Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tester l'envoi d'emails automatiques
            </p>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={preferences?.email_enabled ? "default" : "secondary"}>
                {preferences?.email_enabled ? "Emails activés" : "Emails désactivés"}
              </Badge>
            </div>
            <div className="space-y-2">
              <Button onClick={toggleEmailNotifications} variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                {preferences?.email_enabled ? "Désactiver" : "Activer"} emails
              </Button>
              <Button 
                onClick={handleTestEmail} 
                className="w-full"
                disabled={!preferences?.email_enabled}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer email test
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Fonctionnalités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Temps réel</span>
                <Badge variant="default">✅ Actif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Emails</span>
                <Badge variant="default">✅ Configuré</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Types</span>
                <Badge variant="secondary">5 types</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Priorités</span>
                <Badge variant="secondary">4 niveaux</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">RLS</span>
                <Badge variant="default">🔒 Sécurisé</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guide d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            Guide d'Utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">🔔 Interface Utilisateur</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Cliquez sur l'icône 🔔 dans la navbar</li>
                <li>• Badge rouge indique le nombre non lu</li>
                <li>• Onglet "Notifications" pour voir la liste</li>
                <li>• Onglet "Paramètres" pour configuration</li>
                <li>• Marquer comme lu individuellement</li>
                <li>• "Tout marquer" pour marquer toutes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">⚡ Fonctionnalités Avancées</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Notifications temps réel via WebSocket</li>
                <li>• Envoi d'emails automatique avec Resend</li>
                <li>• Filtrage par type et statut</li>
                <li>• Préférences personnalisables</li>
                <li>• Templates prédéfinis pour intégrations</li>
                <li>• Système de priorités (low, medium, high, urgent)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}