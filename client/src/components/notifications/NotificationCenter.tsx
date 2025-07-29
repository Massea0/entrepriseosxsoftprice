import React, { useState } from 'react'
import { Bell, Check, CheckCheck, Settings, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useNotifications, type Notification } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export function NotificationCenter() {
  const { 
    notifications, 
    preferences, 
    unreadCount, 
    loading,
    markAsRead,
    markAllAsRead,
    updatePreferences 
  } = useNotifications()
  
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read_at
    return notification.type === filter
  })

  // Icônes par type de notification
  const getTypeIcon = (type: string) => {
    const icons = {
      project: '📋',
      task: '✅', 
      support: '🎫',
      workflow: '⚡',
      system: '⚙️'
    }
    return icons[type as keyof typeof icons] || '📬'
  }

  // Couleurs par priorité
  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-blue-600 bg-blue-50 border-blue-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      urgent: 'text-red-600 bg-red-50 border-red-200'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id)
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  const handlePreferenceToggle = (key: string, value: boolean) => {
    updatePreferences({ [key]: value })
  }

  const handleTypeToggle = (type: string, enabled: boolean) => {
    if (!preferences) return
    
    const types = enabled 
      ? [...preferences.types_enabled, type]
      : preferences.types_enabled.filter(t => t !== type)
    
    updatePreferences({ types_enabled: types })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-96 max-h-[80vh] p-0"
        sideOffset={8}
      >
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8"
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Tout marquer
                </Button>
              )}
              <Badge variant="secondary">
                {unreadCount} non {unreadCount > 1 ? 'lues' : 'lue'}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-2">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="m-0">
            {/* Filtres */}
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4" />
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="h-7"
                >
                  Toutes
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                  className="h-7"
                >
                  Non lues
                </Button>
                <Button
                  variant={filter === 'project' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('project')}
                  className="h-7"
                >
                  Projets
                </Button>
              </div>
            </div>

            {/* Liste des notifications */}
            <ScrollArea className="h-96">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Aucune notification</p>
                  <p className="text-sm">Vous êtes à jour !</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read_at ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                            {!notification.read_at && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </span>
                          </div>
                        </div>
                        {!notification.read_at && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            <ScrollArea className="h-96">
              <div className="p-4 space-y-6">
                {/* Préférences générales */}
                <div>
                  <h4 className="font-medium mb-3">Préférences générales</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <Switch
                        id="email-notifications"
                        checked={preferences?.email_enabled ?? true}
                        onCheckedChange={(checked) => handlePreferenceToggle('email_enabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Notifications push</Label>
                      <Switch
                        id="push-notifications"
                        checked={preferences?.push_enabled ?? true}
                        onCheckedChange={(checked) => handlePreferenceToggle('push_enabled', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Types de notifications */}
                <div>
                  <h4 className="font-medium mb-3">Types de notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'project', label: 'Projets', icon: '📋' },
                      { key: 'task', label: 'Tâches', icon: '✅' },
                      { key: 'support', label: 'Support', icon: '🎫' },
                      { key: 'workflow', label: 'Workflows', icon: '⚡' },
                      { key: 'system', label: 'Système', icon: '⚙️' }
                    ].map((type) => (
                      <div key={type.key} className="flex items-center justify-between">
                        <Label htmlFor={`type-${type.key}`} className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </Label>
                        <Switch
                          id={`type-${type.key}`}
                          checked={preferences?.types_enabled?.includes(type.key) ?? true}
                          onCheckedChange={(checked) => handleTypeToggle(type.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  💡 Les notifications vous aident à rester informé des activités importantes dans votre espace de travail.
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}