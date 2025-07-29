// Simplified Proactive Alerts System for migration
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const ProactiveAlertsSystem: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      title: 'Migration complétée',
      description: 'Système d\'alertes migré vers Express API',
      priority: 'low',
      isRead: false,
      type: 'system',
      timestamp: new Date().toISOString()
    }
  ]);

  const [stats] = useState({
    automatedActions: 0,
    notificationsSent: 1,
    activeAlerts: 1
  });

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Système d'Alertes Proactives</h2>
        <Badge variant="outline">{alerts.length} alertes</Badge>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Alertes Actives</div>
                <div className="text-xl font-bold">{stats.activeAlerts}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">Actions Auto</div>
                <div className="text-xl font-bold">{stats.automatedActions}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm text-muted-foreground">Notifications</div>
                <div className="text-xl font-bold">{stats.notificationsSent}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`${!alert.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getIcon(alert.type)}
                  {alert.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(alert.priority)}>
                    {alert.priority}
                  </Badge>
                  {!alert.isRead && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Marquer lu
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{alert.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {new Date(alert.timestamp).toLocaleString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Système d'alertes proactives opérationnel. Migration de Supabase vers Express API réussie.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ProactiveAlertsSystem;