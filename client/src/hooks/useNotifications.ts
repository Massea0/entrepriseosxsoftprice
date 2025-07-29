import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data?: unknown
  read_at?: string
  priority: string
  entity_type?: string
  entity_id?: string
  action_url?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  id: string
  user_id: string
  email_enabled: boolean
  push_enabled: boolean
  sms_enabled: boolean
  phone_number?: string
  types_enabled: string[]
  quiet_hours_start?: string
  quiet_hours_end?: string
  timezone: string
  created_at: string
  updated_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/notifications?user_id=${user.id}&limit=50`)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch notifications: ${errorText}`)
      }
      
      const data = await response.json()
      setNotifications(Array.isArray(data) ? data : [])
      setUnreadCount((Array.isArray(data) ? data : []).filter((n: any) => !n.read_at).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
      // Don't show toast for initial load, only on refresh
      if (!loading) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les notifications"
        })
      }
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  // Charger les préférences
  const loadPreferences = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/notification-preferences?user_id=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      } else {
        console.error('Failed to load preferences:', response.status)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }, [user])

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) throw new Error('Failed to mark as read')

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue"
      })
    }
  }, [toast])

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id })
      })

      if (!response.ok) throw new Error('Failed to mark all as read')

      const result = await response.json()

      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      )
      setUnreadCount(0)

      toast({
        title: "✅ Notifications marquées comme lues",
        description: `${result.count || 'Toutes les'} notifications mises à jour`
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues"
      })
    }
  }, [toast, user])

  // Créer une nouvelle notification
  const createNotification = useCallback(async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notification,
          user_id: user.id
        })
      })

      if (!response.ok) throw new Error('Failed to create notification')

      const data = await response.json()

      // Ajouter à la liste locale
      setNotifications(prev => [data, ...prev])
      setUnreadCount(prev => prev + 1)

      // Envoyer email si activé
      if (preferences?.email_enabled) {
        await fetch('/api/notifications/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            actionUrl: notification.action_url,
            priority: notification.priority
          })
        })
      }

      // Envoyer SMS si activé
      if (preferences?.sms_enabled && preferences?.phone_number) {
        await fetch('/api/notifications/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            message: notification.message,
            type: notification.type,
            priority: notification.priority
          })
        })
      }

      return data
    } catch (error) {
      console.error('Error creating notification:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la notification"
      })
    }
  }, [user, preferences, toast])

  // Mettre à jour les préférences
  const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>) => {
    if (!user) return

    try {
      const response = await fetch('/api/notification-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...updates
        })
      })

      if (!response.ok) throw new Error('Failed to update preferences')

      const data = await response.json()
      setPreferences(data)
      toast({
        title: "✅ Préférences mises à jour",
        description: "Vos préférences de notification ont été sauvegardées"
      })
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences"
      })
    }
  }, [user, toast])

  // Configurer le polling pour les mises à jour temps réel
  useEffect(() => {
    if (!user) return

    // Polling périodique pour vérifier les nouvelles notifications
    const interval = setInterval(() => {
      loadNotifications()
    }, 30000) // Vérifier toutes les 30 secondes

    return () => {
      clearInterval(interval)
    }
  }, [user, loadNotifications])

  // Charger les données initiales
  useEffect(() => {
    if (user) {
      loadNotifications()
      loadPreferences()
    }
  }, [user, loadNotifications, loadPreferences])

  return {
    notifications,
    preferences,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
    updatePreferences,
    reload: loadNotifications
  }
}