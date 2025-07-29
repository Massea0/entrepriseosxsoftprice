// Service Worker avancé pour Enterprise OS
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `enterprise-os-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Assets essentiels à mettre en cache
const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/arcadis-logo.svg'
];

// Stratégies de cache par type de ressource
const CACHE_STRATEGIES = {
  'image': 'cache-first',
  'font': 'cache-first',
  'script': 'network-first',
  'style': 'network-first',
  'document': 'network-first',
  'api': 'network-first'
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache des assets essentiels');
        return cache.addAll(ESSENTIAL_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation terminée');
        return self.skipWaiting();
      })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('enterprise-os-') && cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[SW] Suppression du cache obsolète:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée');
        return self.clients.claim();
      })
  );
});

// Gestion des requêtes avec stratégies de cache intelligentes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip les requêtes non-HTTP(S)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Déterminer le type de ressource
  const resourceType = getResourceType(request);
  const strategy = CACHE_STRATEGIES[resourceType] || 'network-first';

  // API calls - Network first avec fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Appliquer la stratégie appropriée
  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(request));
      break;
    case 'network-first':
      event.respondWith(networkFirst(request));
      break;
    case 'cache-only':
      event.respondWith(cacheOnly(request));
      break;
    case 'network-only':
      event.respondWith(networkOnly(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

// Stratégie Cache First
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    // Mettre à jour en arrière-plan
    fetch(request).then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
    });
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return caches.match('/offline.html');
  }
}

// Stratégie Network First
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Si c'est une page HTML, retourner la page offline
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Gestion des requêtes API avec queue de synchronisation
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Si c'est une requête POST/PUT/DELETE, l'ajouter à la queue de sync
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      await queueFailedRequest(request);
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'La requête sera synchronisée une fois la connexion rétablie',
          queued: true 
        }),
        { 
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Pour les GET, essayer le cache
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'Aucune donnée en cache disponible' }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Queue pour les requêtes échouées
async function queueFailedRequest(request) {
  const queue = await getRequestQueue();
  const body = await request.text();
  
  queue.push({
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: body,
    timestamp: Date.now()
  });
  
  await saveRequestQueue(queue);
  
  // Déclencher la synchronisation en arrière-plan si disponible
  if ('sync' in self.registration) {
    await self.registration.sync.register('sync-requests');
  }
}

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(syncQueuedRequests());
  }
});

async function syncQueuedRequests() {
  const queue = await getRequestQueue();
  const failedRequests = [];
  
  for (const reqData of queue) {
    try {
      const response = await fetch(reqData.url, {
        method: reqData.method,
        headers: reqData.headers,
        body: reqData.body
      });
      
      if (!response.ok) {
        failedRequests.push(reqData);
      }
    } catch (error) {
      failedRequests.push(reqData);
    }
  }
  
  await saveRequestQueue(failedRequests);
  
  // Notifier le client du résultat de la synchronisation
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'sync-complete',
      synced: queue.length - failedRequests.length,
      failed: failedRequests.length
    });
  });
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'view', title: 'Voir' },
      { action: 'dismiss', title: 'Ignorer' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Enterprise OS', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Chercher si une fenêtre est déjà ouverte
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon ouvrir une nouvelle fenêtre
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Utilitaires
function getResourceType(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const accept = request.headers.get('accept') || '';
  
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) return 'image';
  if (pathname.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
  if (pathname.match(/\.(js|mjs)$/i)) return 'script';
  if (pathname.match(/\.(css)$/i)) return 'style';
  if (accept.includes('text/html')) return 'document';
  if (pathname.startsWith('/api/')) return 'api';
  
  return 'other';
}

async function getRequestQueue() {
  const cache = await caches.open('sync-queue');
  const response = await cache.match('queue');
  
  if (response) {
    return await response.json();
  }
  
  return [];
}

async function saveRequestQueue(queue) {
  const cache = await caches.open('sync-queue');
  const response = new Response(JSON.stringify(queue));
  await cache.put('queue', response);
}

// Message handler pour la communication avec l'app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

console.log('[SW] Service Worker Enterprise OS chargé - Version:', CACHE_VERSION); 