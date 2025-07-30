import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Smartphone
} from 'lucide-react';

interface PWAStatusProps {
  className?: string;
}

export default function PWAStatus({ className }: PWAStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Vérifier le statut en ligne/hors ligne
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier si l'app est installée
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Service Worker pour les mises à jour
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
    
    setIsUpdating(false);
    setUpdateAvailable(false);
  };

  const getOnlineStatus = () => ({
    icon: isOnline ? Wifi : WifiOff,
    text: isOnline ? 'En ligne' : 'Hors ligne',
    variant: (isOnline ? 'default' : 'destructive') as "default" | "destructive" | "outline" | "secondary"
  });

  const getInstallStatus = () => ({
    icon: isInstalled ? CheckCircle : Smartphone,
    text: isInstalled ? 'Installée' : 'Web',
    variant: (isInstalled ? 'default' : 'secondary') as "default" | "destructive" | "outline" | "secondary"
  });

  const status = getOnlineStatus();
  const install = getInstallStatus();

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Statut de l'Application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <status.icon className="h-4 w-4" />
            <span className="text-sm">Connexion</span>
          </div>
          <Badge variant={status.variant} className="text-xs">
            {status.text}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <install.icon className="h-4 w-4" />
            <span className="text-sm">Installation</span>
          </div>
          <Badge variant={install.variant} className="text-xs">
            {install.text}
          </Badge>
        </div>

        {updateAvailable && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Mise à jour disponible</span>
              </div>
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="h-7 px-3 text-xs"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 " />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-1" />
                    Mettre à jour
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {!isOnline && (
          <div className="pt-2 border-t">
            <CardDescription className="text-xs">
              <Clock className="h-3 w-3 inline mr-1" />
              Mode hors ligne activé. Vos données sont synchronisées localement.
            </CardDescription>
          </div>
        )}
      </CardContent>
    </Card>
  );
}