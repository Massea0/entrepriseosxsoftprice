import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Bell, 
  BellOff, 
  Smartphone, 
  Monitor,
  RefreshCw,
  Database,
  CloudOff,
  Cloud,
  Settings,
  Battery,
  Signal,
  HardDrive,
  Zap,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  notificationsEnabled: boolean;
  backgroundSyncEnabled: boolean;
  serviceWorkerReady: boolean;
  updateAvailable: boolean;
}

interface SyncStatus {
  lastSync: string;
  pendingCount: number;
  isRunning: boolean;
  lastError?: string;
}

interface CacheInfo {
  [cacheName: string]: number;
}

interface DeviceInfo {
  platform: string;
  connection: string;
  battery?: number;
  storage?: {
    used: number;
    total: number;
  };
}

const PWAManager: React.FC = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    notificationsEnabled: false,
    backgroundSyncEnabled: false,
    serviceWorkerReady: false,
    updateAvailable: false
  });
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: '',
    pendingCount: 0,
    isRunning: false
  });
  
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({});
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: navigator.platform,
    connection: (navigator as unknown).connection?.effectiveType || 'unknown'
  });
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [serviceWorker, setServiceWorker] = useState<ServiceWorker | null>(null);
  const [showPWAModal, setShowPWAModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  // Initialisation PWA
  useEffect(() => {
    initializePWA();
    setupEventListeners();
    checkDeviceCapabilities();
    
    return () => {
      cleanupEventListeners();
    };
  }, []);

  // Initialiser PWA
  const initializePWA = async () => {
    try {
      console.log('🔧 Initialisation PWA...');
      
      // Vérifier support Service Worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        setServiceWorker(registration.active);
        setPwaState(prev => ({ ...prev, serviceWorkerReady: true }));
        
        // Écouter les mises à jour
        registration.addEventListener('updatefound', handleServiceWorkerUpdate);
      }
      
      // Vérifier si déjà installé
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as unknown).standalone === true;
      setPwaState(prev => ({ ...prev, isInstalled: isStandalone }));
      
      // Vérifier statut notifications
      if ('Notification' in window) {
        const permission = Notification.permission;
        setPwaState(prev => ({ 
          ...prev, 
          notificationsEnabled: permission === 'granted' 
        }));
      }
      
      // Charger info cache
      await updateCacheInfo();
      
      console.log('✅ PWA initialisée');
    } catch (error) {
      console.error('❌ Erreur initialisation PWA:', error);
    }
  };

  // Configuration des event listeners
  const setupEventListeners = () => {
    // Événement d'installation
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Statut réseau
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Messages du Service Worker
    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);
    
    // Visibilité de la page
    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  const cleanupEventListeners = () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.removeEventListener('online', handleOnlineStatus);
    window.removeEventListener('offline', handleOnlineStatus);
    navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  // Gestionnaire prompt d'installation
  const handleBeforeInstallPrompt = (e: unknown) => {
    console.log('💾 Prompt d\'installation disponible');
    e.preventDefault();
    setDeferredPrompt(e);
    setPwaState(prev => ({ ...prev, isInstallable: true }));
    
    // Afficher la modal après un délai
    setTimeout(() => {
      if (!pwaState.isInstalled) {
        setShowPWAModal(true);
      }
    }, 3000);
  };

  // Gestionnaire statut réseau
  const handleOnlineStatus = () => {
    const isOnline = navigator.onLine;
    setPwaState(prev => ({ ...prev, isOnline }));
    
    if (isOnline) {
      toast({
        title: "Connexion rétablie",
        description: "Synchronisation automatique en cours...",
        variant: "default"
      });
      triggerSync();
    } else {
      toast({
        title: "Mode hors ligne",
        description: "Vos données seront synchronisées à la reconnexion",
        variant: "default"
      });
    }
  };

  // Messages du Service Worker
  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'SYNC_COMPLETE':
        setSyncStatus(prev => ({
          ...prev,
          lastSync: data.timestamp,
          isRunning: false
        }));
        toast({
          title: "Synchronisation terminée",
          description: "Vos données sont à jour",
          variant: "default"
        });
        break;
        
      case 'UPDATE_AVAILABLE':
        setPwaState(prev => ({ ...prev, updateAvailable: true }));
        toast({
          title: "Mise à jour disponible",
          description: "Une nouvelle version est prête à être installée",
          variant: "default"
        });
        break;
        
      case 'CACHE_UPDATED':
        updateCacheInfo();
        break;
  }

  };

  // Mise à jour Service Worker
  const handleServiceWorkerUpdate = () => {
    console.log('🔄 Mise à jour Service Worker détectée');
    setPwaState(prev => ({ ...prev, updateAvailable: true }));
  };

  // Changement de visibilité
  const handleVisibilityChange = () => {
    if (!document.hidden && pwaState.isOnline) {
      // Page visible et en ligne, vérifier les mises à jour
      setTimeout(() => {
        triggerSync();
      }, 1000);
    }
  };

  // Installer l'application
  const installApp = async () => {
    if (!deferredPrompt) return;
    
    try {
      setIsLoading(true);
      
      // Afficher le prompt d'installation
      const result = await deferredPrompt.prompt();
      console.log('📱 Résultat installation:', result.outcome);
      
      if (result.outcome === 'accepted') {
        setPwaState(prev => ({ 
          ...prev, 
          isInstalled: true, 
          isInstallable: false 
        }));
        setShowPWAModal(false);
        
        toast({
          title: "Application installée !",
          description: "Enterprise OS est maintenant disponible sur votre écran d'accueil",
          variant: "default"
        });
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('❌ Erreur installation:', error);
      toast({
        title: "Erreur d'installation",
        description: "Impossible d'installer l'application",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Activer les notifications
  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Non supporté",
        description: "Les notifications ne sont pas supportées sur cet appareil",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setPwaState(prev => ({ ...prev, notificationsEnabled: true }));
        
        // Enregistrer pour les notifications push
        if (serviceWorker && 'PushManager' in window) {
          await registerForPushNotifications();
        }
        
        toast({
          title: "Notifications activées",
          description: "Vous recevrez des notifications pour les événements importants",
          variant: "default"
        });
      } else {
        toast({
          title: "Notifications refusées",
          description: "Vous pouvez les activer plus tard dans les paramètres",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('❌ Erreur notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enregistrer pour les notifications push
  const registerForPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Générer une clé VAPID (simulation)
      const vapidPublicKey = 'BF8Q-X5AkGj2tDZz1t5H2DQqQ5Z8-2-fJ9X8YvQl5ZbW4_J9R5rN3vF8tGhJ6Y2aS4D7qP0xM9l3K2nH1gV6cT8rE';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });
      
      console.log('📬 Enregistrement push:', subscription);
      
      // Envoyer la subscription au serveur (simulation)
      // await fetch('/api/push-subscription', {
      //   method: 'POST',
      //   body: JSON.stringify(subscription)
      // });
      
    } catch (error) {
      console.error('❌ Erreur enregistrement push:', error);
    }
  };

  // Déclencher synchronisation
  const triggerSync = useCallback(async () => {
    if (!serviceWorker || !pwaState.isOnline) return;
    
    try {
      setSyncStatus(prev => ({ ...prev, isRunning: true }));
      
      // Envoyer message au Service Worker
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        const { success, data } = event.data;
        setSyncStatus(prev => ({
          ...prev,
          isRunning: false,
          lastSync: new Date().toISOString(),
          lastError: success ? undefined : data?.error
        }));
      };
      
      serviceWorker.postMessage({ type: 'SYNC_NOW' }, [channel.port2]);
      
    } catch (error) {
      console.error('❌ Erreur synchronisation:', error);
      setSyncStatus(prev => ({
        ...prev,
        isRunning: false,
        lastError: error.message
      }));
    }
  }, [serviceWorker, pwaState.isOnline]);

  // Mettre à jour les informations de cache
  const updateCacheInfo = async () => {
    if (!serviceWorker) return;
    
    try {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        setCacheInfo(event.data);
      };
      
      serviceWorker.postMessage({ type: 'GET_CACHE_INFO' }, [channel.port2]);
    } catch (error) {
      console.error('❌ Erreur info cache:', error);
    }
  };

  // Vider le cache
  const clearCache = async () => {
    if (!serviceWorker) return;
    
    try {
      setIsLoading(true);
      
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data.success) {
          setCacheInfo({});
          toast({
            title: "Cache vidé",
            description: "Toutes les données mises en cache ont été supprimées",
            variant: "default"
          });
        }
      };
      
      serviceWorker.postMessage({ type: 'CLEAR_CACHE' }, [channel.port2]);
      
    } catch (error) {
      console.error('❌ Erreur vidage cache:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vider le cache",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Appliquer les mises à jour
  const applyUpdate = async () => {
    if (!serviceWorker) return;
    
    try {
      serviceWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
    }
  };

  // Vérifier les capacités de l'appareil
  const checkDeviceCapabilities = async () => {
    try {
      // Informations batterie
      if ('getBattery' in navigator) {
        const battery = await (navigator as unknown).getBattery();
        setDeviceInfo(prev => ({
          ...prev,
          battery: Math.round(battery.level * 100)
        }));
      }
      
      // Informations stockage
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setDeviceInfo(prev => ({
          ...prev,
          storage: {
            used: estimate.usage || 0,
            total: estimate.quota || 0
          }
        }));
      }
      
    } catch (error) {
      console.warn('Certaines informations appareil non disponibles');
    }
  };

  // Calculer la taille totale du cache
  const totalCacheSize = Object.values(cacheInfo).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-blue-500" />
            Gestionnaire PWA
          </h2>
          <p className="text-gray-600">Application Web Progressive • Installation • Notifications • Synchronisation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={pwaState.isOnline ? "default" : "destructive"}>
            {pwaState.isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {pwaState.isOnline ? 'En ligne' : 'Hors ligne'}
          </Badge>
          
          {pwaState.updateAvailable && (
            <Button onClick={applyUpdate} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Mettre à jour
            </Button>
          )}
        </div>
      </div>

      {/* Statut PWA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Installation</p>
                <p className="text-lg font-semibold">
                  {pwaState.isInstalled ? 'Installée' : 
                   pwaState.isInstallable ? 'Disponible' : 'Non disponible'}
                </p>
              </div>
              {pwaState.isInstalled ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : pwaState.isInstallable ? (
                <Download className="h-8 w-8 text-blue-500" />
              ) : (
                <Monitor className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Notifications</p>
                <p className="text-lg font-semibold">
                  {pwaState.notificationsEnabled ? 'Activées' : 'Désactivées'}
                </p>
              </div>
              {pwaState.notificationsEnabled ? (
                <Bell className="h-8 w-8 text-green-500" />
              ) : (
                <BellOff className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Service Worker</p>
                <p className="text-lg font-semibold">
                  {pwaState.serviceWorkerReady ? 'Actif' : 'Inactif'}
                </p>
              </div>
              {pwaState.serviceWorkerReady ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <X className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Installation et notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Installation & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pwaState.isInstallable && !pwaState.isInstalled && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Installer l'application</p>
                  <p className="text-sm text-gray-600">Accès rapide depuis l'écran d'accueil</p>
                </div>
                <Button onClick={installApp} disabled={isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
              </div>
            )}
            
            {pwaState.isInstalled && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Application installée avec succès !
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications push</p>
                <p className="text-sm text-gray-600">Recevoir des alertes importantes</p>
              </div>
              <Switch
                checked={pwaState.notificationsEnabled}
                onCheckedChange={enableNotifications}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Synchronisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Statut</p>
                <p className="text-sm text-gray-600">
                  {syncStatus.isRunning ? 'En cours...' : 
                   syncStatus.lastSync ? `Dernière: ${new Date(syncStatus.lastSync).toLocaleTimeString()}` :
                   'Jamais synchronisé'}
                </p>
              </div>
              {syncStatus.isRunning ? (
                <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
              ) : (
                <Button onClick={triggerSync} disabled={!pwaState.isOnline} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Synchroniser
                </Button>
              )}
            </div>
            
            {syncStatus.pendingCount > 0 && (
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{syncStatus.pendingCount} éléments en attente</span>
              </div>
            )}
            
            {syncStatus.lastError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{syncStatus.lastError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations avancées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cache et stockage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Cache & Stockage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Éléments en cache</span>
                <span>{totalCacheSize}</span>
              </div>
              
              {Object.entries(cacheInfo).map(([name, count]) => (
                <div key={name} className="flex justify-between text-xs text-gray-600">
                  <span>{name}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
            
            {deviceInfo.storage && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stockage utilisé</span>
                  <span>{(deviceInfo.storage.used / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                <Progress 
                  value={(deviceInfo.storage.used / deviceInfo.storage.total) * 100} 
                  className="h-2"
                />
              </div>
            )}
            
            <Button onClick={clearCache} variant="outline" size="sm" className="w-full">
              Vider le cache
            </Button>
          </CardContent>
        </Card>

        {/* Informations appareil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Informations Appareil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Plateforme</span>
              <span>{deviceInfo.platform}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Connexion</span>
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <span>{deviceInfo.connection}</span>
              </div>
            </div>
            
            {deviceInfo.battery !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span>Batterie</span>
                <div className="flex items-center gap-1">
                  <Battery className="h-3 w-3" />
                  <span>{deviceInfo.battery}%</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <span>Mode hors ligne</span>
              <Badge variant={pwaState.isOnline ? "outline" : "default"}>
                {pwaState.isOnline ? 'Désactivé' : 'Activé'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal d'installation PWA */}
      {showPWAModal && !pwaState.isInstalled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-500" />
                Installer Enterprise OS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Installez Enterprise OS sur votre appareil pour un accès rapide et une meilleure expérience.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>Démarrage plus rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudOff className="h-4 w-4 text-blue-500" />
                  <span>Fonctionne hors ligne</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-purple-500" />
                  <span>Notifications push</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={installApp} disabled={isLoading} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPWAModal(false)}
                  disabled={isLoading}
                >
                  Plus tard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PWAManager; 