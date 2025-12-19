const CACHE_NAME = 'groove-v2-subscribed';
const CACHE_NAME_PUBLIC = 'groove-v2-public';

// Public resources (always cached - subscription and trial pages)
const publicResources = [
  '/subscription.html',
  '/index.html'
];

// Premium resources (cached only for subscribed users)
const premiumResources = [
  '/mobile-frontend.html',
  '/sample.html',
  '/Loop App1.png',
  '/Audio groove.mp3',
  '/icon-192.png',
  '/icon-512.png'
];

// Message handler to receive subscription status from pages
self.addEventListener('message', (event) => {
  if (event.data.type === 'CHECK_SUBSCRIPTION') {
    const isSubscribed = event.data.isSubscribed;
    
    if (isSubscribed) {
      // Enable offline caching for subscribed users
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(premiumResources).then(() => {
          console.log('✅ Premium content cached for offline use');
        });
      });
    } else {
      // Clear premium cache for non-subscribed users
      caches.delete(CACHE_NAME).then(() => {
        console.log('🚫 Premium cache cleared - subscription required for offline access');
      });
    }
  }
});

// Install service worker - only cache public resources initially
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_PUBLIC)
      .then((cache) => {
        console.log('📦 Public cache opened');
        return cache.addAll(publicResources);
      })
  );
  self.skipWaiting();
});

// Fetch strategy: Network first, then cache (only for subscribed users)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // For subscription page, always try network first (allow access online)
  if (url.pathname.includes('subscription.html') || url.pathname.includes('index.html')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // For premium content, check if it's cached (subscription check happens in pages)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache the fetched resource for subscribed users
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Network failed - try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // No cache and no network - return offline page
            return new Response(
              '<html><body><h1>🔒 Offline Access</h1><p>You need an active subscription to access this content offline.</p><p><a href="/subscription.html">Subscribe Now</a></p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
      })
  );
});

// Activate and cleanup old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, CACHE_NAME_PUBLIC];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
