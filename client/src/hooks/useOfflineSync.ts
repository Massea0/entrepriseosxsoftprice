import { useState, useEffect, useCallback } from 'react';

interface QueueItem {
  id: string;
  url: string;
  method: string;
  data?: any;
  timestamp: number;
  retries: number;
}

interface OfflineSyncOptions {
  maxRetries?: number;
  retryDelay?: number;
  storageKey?: string;
}

export function useOfflineSync(options: OfflineSyncOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    storageKey = 'offline-sync-queue'
  } = options;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<QueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Charger la queue depuis localStorage au démarrage
  useEffect(() => {
    const savedQueue = localStorage.getItem(storageKey);
    if (savedQueue) {
      try {
        setSyncQueue(JSON.parse(savedQueue));
      } catch (error) {
        console.error('Erreur lors du chargement de la queue de sync:', error);
      }
    }
  }, [storageKey]);

  // Sauvegarder la queue dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(syncQueue));
  }, [syncQueue, storageKey]);

  // Gérer les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (syncQueue.length > 0) {
        syncOfflineRequests();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue]);

  // Ajouter une requête à la queue hors ligne
  const addToQueue = useCallback((url: string, method: string, data?: any) => {
    const queueItem: QueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      method: method.toUpperCase(),
      data,
      timestamp: Date.now(),
      retries: 0
    };

    setSyncQueue(prev => [...prev, queueItem]);
    return queueItem.id;
  }, []);

  // Supprimer un élément de la queue
  const removeFromQueue = useCallback((id: string) => {
    setSyncQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  // Synchroniser les requêtes hors ligne
  const syncOfflineRequests = useCallback(async () => {
    if (!isOnline || syncQueue.length === 0 || isSyncing) {
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    const itemsToSync = [...syncQueue];
    let completed = 0;

    for (const item of itemsToSync) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: item.data ? JSON.stringify(item.data) : undefined,
        });

        if (response.ok) {
          removeFromQueue(item.id);
          console.log(`✅ Synced offline request: ${item.method} ${item.url}`);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ Failed to sync request ${item.id}:`, error);
        
        // Incrémenter les tentatives
        if (item.retries < maxRetries) {
          setSyncQueue(prev => 
            prev.map(qItem => 
              qItem.id === item.id 
                ? { ...qItem, retries: qItem.retries + 1 }
                : qItem
            )
          );
          
          // Réessayer après un délai
          setTimeout(() => {
            if (isOnline) {
              syncOfflineRequests();
            }
          }, retryDelay * (item.retries + 1));
        } else {
          // Supprimer après le nombre max de tentatives
          removeFromQueue(item.id);
          console.error(`🚫 Giving up on request ${item.id} after ${maxRetries} retries`);
        }
      }

      completed++;
      setSyncProgress((completed / itemsToSync.length) * 100);
    }

    setIsSyncing(false);
    setSyncProgress(0);
  }, [isOnline, syncQueue, isSyncing, maxRetries, retryDelay, removeFromQueue]);

  // Fonction pour faire une requête avec support hors ligne
  const offlineRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    if (isOnline) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response;
      } catch (error) {
        // Si la requête échoue et qu'on est en ligne, ajouter à la queue
        if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
          const data = options.body ? JSON.parse(options.body as string) : undefined;
          addToQueue(url, options.method, data);
        }
        throw error;
      }
    } else {
      // Hors ligne, ajouter directement à la queue
      if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
        const data = options.body ? JSON.parse(options.body as string) : undefined;
        addToQueue(url, options.method, data);
        
        // Retourner une réponse simulée
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Queued for offline sync',
          offline: true 
        }), {
          status: 202,
          statusText: 'Accepted',
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        throw new Error('Cannot perform GET requests while offline');
      }
    }
  }, [isOnline, addToQueue]);

  // Vider la queue manuellement
  const clearQueue = useCallback(() => {
    setSyncQueue([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    isOnline,
    syncQueue,
    isSyncing,
    syncProgress,
    queueLength: syncQueue.length,
    addToQueue,
    removeFromQueue,
    syncOfflineRequests,
    offlineRequest,
    clearQueue
  };
}