import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, Clock, CheckCircle } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnlineTime(new Date());
      setShowNotification(true);
      
      // Garder la notification visible en mode hors ligne
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatLastOnlineTime = () => {
    if (!lastOnlineTime) return '';
    
    const now = new Date();
    const diff = now.getTime() - lastOnlineTime.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'il y a moins d\'une minute';
    if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  };

  if (!showNotification && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-500">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="px-3 py-2 shadow-lg bg-background border"
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Reconnecté</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Mode hors ligne</span>
                {lastOnlineTime && (
                  <span className="text-xs opacity-80 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Dernière connexion {formatLastOnlineTime()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </Badge>
    </div>
  );
}