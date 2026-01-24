// --- 1. INCREMENT THIS VERSION NUMBER EVERY TIME YOU UPDATE CODE ---
const CACHE_NAME = "siyonu-app-v2.4"; 

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/studio.html",
  "/daily-verse.html",
  "/download-app.html",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600;700&display=swap"
];

// --- 2. INSTALL EVENT (Force Immediate Install) ---
self.addEventListener("install", (event) => {
  // This forces the waiting service worker to become the active service worker
  self.skipWaiting(); 

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// --- 3. ACTIVATE EVENT (Clean up old versions) ---
self.addEventListener("activate", (event) => {
  // This allows the active service worker to set itself as the controller for all clients
  event.waitUntil(self.clients.claim());

  // Remove old caches that don't match the current CACHE_NAME
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// --- 4. FETCH EVENT (Network First, Fallback to Cache) ---
// This strategy ensures users get fresh content if online, but still works offline.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
