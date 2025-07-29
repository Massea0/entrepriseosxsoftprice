// Service Worker Enterprise OS Genesis Framework PWA v2.0
// Cache intelligent, synchronisation offline, notifications push

const CACHE_NAME = 'enterprise-os-v2.0';
const OFFLINE_CACHE = 'enterprise-os-offline-v2.0';
const API_CACHE = 'enterprise-os-api-v2.0';
const STATIC_CACHE = 'enterprise-os-static-v2.0';

// Assets à mettre en cache pour le fonctionnement offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  // CSS et JS seront ajoutés dynamiquement
];

// Endpoints API à mettre en cache
const API_ENDPOINTS = [
  '/functions/v1/projects-api',
  '/functions/v1/tasks-api', 
  '/functions/v1/ai-business-analyzer',
  '/functions/v1/ai-predictive-analytics',
  '/functions/v1/ai-intelligent-alerts',
  '/functions/v1/ai-workflow-orchestrator'
];

// Configuration du cache intelligent
const CACHE_STRATEGIES = {
  // Stratégies par type de ressource
  static: 'cache-first',
  api: 'network-first', 
  images: 'cache-first',
  fonts: 'cache-first',
  documents: 'network-first'
};

// Durées de cache
const CACHE_DURATION = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 jours
  api: 5 * 60 * 1000, // 5 minutes
  images: 30 * 24 * 60 * 60 * 1000, // 30 jours
  fonts: 365 * 24 * 60 * 60 * 1000 // 1 an
};

console.log('🔧 Service Worker Enterprise OS v2.0 chargé');

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('📦 Installation Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache des assets statiques
      caches.open(STATIC_CACHE).then(cache => {
        console.log('💾 Mise en cache assets statiques...');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Créer cache offline
      caches.open(OFFLINE_CACHE).then(cache => {
        console.log('🔄 Initialisation cache offline...');
        return cache.put('/offline.html', new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Enterprise OS - Mode Hors Ligne</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: system-ui; padding: 2rem; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
              .container { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 1rem; backdrop-filter: blur(10px); }
              h1 { margin-bottom: 1rem; }
              p { opacity: 0.9; margin-bottom: 2rem; }
              .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
              .btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; display: inline-block; transition: all 0.3s; }
              .btn:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="offline-icon">📱</div>
              <h1>Mode Hors Ligne</h1>
              <p>Vous êtes actuellement hors ligne. Certaines fonctionnalités sont disponibles en mode dégradé.</p>
              <a href="/" class="btn" onclick="window.location.reload()">Réessayer la connexion</a>
            </div>
          </body>
          </html>
        `, { headers: { 'Content-Type': 'text/html' } }));
      })
    ]).then(() => {
      console.log('✅ Service Worker installé avec succès');
      // Forcer l'activation immédiate
      return self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Activation Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== OFFLINE_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== STATIC_CACHE) {
              console.log('🗑️ Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prendre le contrôle de tous les clients
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activé');
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) return;
  
  // Ignorer les requêtes de mise à jour du Service Worker
  if (url.pathname === '/sw.js') return;
  
  event.respondWith(handleRequest(request));
});

// Gestionnaire intelligent des requêtes
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Déterminer la stratégie de cache
    const strategy = determineStrategy(request);
    
    switch (strategy) {
      case 'cache-first':
        return await cacheFirstStrategy(request);
      case 'network-first':
        return await networkFirstStrategy(request);
      case 'stale-while-revalidate':
        return await staleWhileRevalidateStrategy(request);
      default:
        return await networkFirstStrategy(request);
    }
  } catch (error) {
    console.error('❌ Erreur handling request:', error);
    return await handleOfflineFallback(request);
  }
}

// Déterminer la stratégie de cache
function determineStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // API Supabase et functions
  if (pathname.startsWith('/functions/') || url.hostname.includes('supabase')) {
    return 'network-first';
  }
  
  // Assets statiques (CSS, JS, images)
  if (pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    return 'cache-first';
  }
  
  // Pages HTML
  if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
    return 'network-first';
  }
  
  return 'network-first';
}

// Stratégie Cache First (pour assets statiques)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Vérifier si le cache n'est pas expiré
    const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
    const now = new Date();
    const maxAge = CACHE_DURATION.static;
    
    if (now - cacheDate < maxAge) {
      console.log('📦 Cache hit:', request.url);
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Mettre à jour le cache
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('🔄 Cache mis à jour:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📦 Fallback cache pour:', request.url);
    return cachedResponse || new Response('Ressource non disponible', { status: 404 });
  }
}

// Stratégie Network First (pour API et pages)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Mettre en cache si c'est une API ou une page importante
      if (shouldCacheResponse(request, networkResponse)) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, networkResponse.clone());
        console.log('💾 API cached:', request.url);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔄 Network error, checking cache:', request.url);
    
    // Fallback vers le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Cache fallback:', request.url);
      return cachedResponse;
    }
    
    return await handleOfflineFallback(request);
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  // Mettre à jour en arrière-plan
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(STATIC_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => null);
  
  // Retourner immédiatement le cache ou attendre le réseau
  return cachedResponse || await fetchPromise || new Response('Non disponible', { status: 404 });
}

// Déterminer si une réponse doit être mise en cache
function shouldCacheResponse(request, response) {
  const url = new URL(request.url);
  
  // NE PAS cacher les requêtes POST, PUT, PATCH, DELETE
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return false;
  }
  
  // Cache les réponses API réussies (seulement GET)
  if (url.pathname.startsWith('/functions/') && response.ok && request.method === 'GET') {
    return true;
  }
  
  // Cache les pages principales
  if (response.headers.get('content-type')?.includes('text/html') && response.ok) {
    return true;
  }
  
  return false;
}

// Gestion du fallback offline
async function handleOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Pour les pages HTML, retourner la page offline
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlineCache = await caches.open(OFFLINE_CACHE);
    return await offlineCache.match('/offline.html');
  }
  
  // Pour les API, retourner des données en cache ou un message d'erreur
  if (url.pathname.startsWith('/functions/')) {
    return new Response(JSON.stringify({
      error: 'Mode hors ligne',
      message: 'Cette fonctionnalité nécessite une connexion Internet',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    });
  }
  
  // Pour les autres ressources
  return new Response('Ressource non disponible hors ligne', { status: 404 });
}

// Gestion des notifications push
self.addEventListener('push', event => {
  console.log('📬 Notification push reçue');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Enterprise OS', body: event.data.text() };
    }
  }
  
  const options = {
    title: data.title || 'Enterprise OS',
    body: data.body || 'Nouvelle notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.tag || 'enterprise-os',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ],
    data: data.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', event => {
  console.log('👆 Clic sur notification:', event.action);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'close') {
    return;
  }
  
  // Ouvrir l'application
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Si l'app est déjà ouverte, la focuser
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      
      // Sinon, ouvrir une nouvelle fenêtre
      const url = data.url || '/';
      return clients.openWindow(url);
    })
  );
});

// Synchronisation en arrière-plan
self.addEventListener('sync', event => {
  console.log('🔄 Synchronisation arrière-plan:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Synchronisation des données offline
async function syncOfflineData() {
  try {
    console.log('🔄 Synchronisation des données offline...');
    
    // Récupérer les données en attente depuis IndexedDB
    const pendingData = await getPendingOfflineData();
    
    if (pendingData.length === 0) {
      console.log('✅ Aucune donnée à synchroniser');
      return;
    }
    
    // Synchroniser chaque élément
    for (const item of pendingData) {
      try {
        await syncSingleItem(item);
        await removePendingItem(item.id);
        console.log('✅ Item synchronisé:', item.id);
      } catch (error) {
        console.error('❌ Erreur sync item:', item.id, error);
      }
    }
    
    // Notifier l'interface de la synchronisation
    await notifyClientsOfSync();
    
  } catch (error) {
    console.error('❌ Erreur synchronisation:', error);
  }
}

// Fonctions utilitaires pour IndexedDB (simulation)
async function getPendingOfflineData() {
  // TODO: Implémenter IndexedDB
  return [];
}

async function syncSingleItem(item) {
  // TODO: Synchroniser avec l'API
  const response = await fetch(item.endpoint, {
    method: item.method,
    headers: item.headers,
    body: item.body
  });
  return response;
}

async function removePendingItem(id) {
  // TODO: Supprimer de IndexedDB
  console.log('Suppression item:', id);
}

async function notifyClientsOfSync() {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      timestamp: new Date().toISOString()
    });
  });
}

// Gestion des messages des clients
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'SYNC_NOW':
      syncOfflineData();
      break;
  }
});

// Informations sur le cache
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    info[cacheName] = keys.length;
  }
  
  return info;
}

// Nettoyer tous les caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🗑️ Tous les caches supprimés');
}

console.log('✅ Service Worker Enterprise OS v2.0 prêt'); 