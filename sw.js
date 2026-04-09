// Enhanced Service Worker for ScaleMarts - iOS Safari Compatible
// Version 1.0.10 - Silent Operation with Blue-Green-Orange Theme

// Database configuration (retained as se-preneurs-alliance)
const firebaseConfig = {
  apiKey: "AIzaSyAqHYLv3k_KWpBfeSliEh1oo0hOh2tF5qg",
  authDomain: "gentlejobs.com",
  databaseURL: "https://gentlejobs-default-rtdb.firebaseio.com",
  projectId: "gentlejobs",
  storageBucket: "gentlejobs.firebasestorage.app",
  messagingSenderId: "789005399519",
  appId: "1:789005399519:web:eb3b51b790646a939bc06a",
  measurementId: "G-PH8WSHZQ0C",
};

let messaging;
let isFirebaseAvailable = false;

(async function initFirebase() {
  try {
    // Import scripts sequentially for better iOS Safari compatibility
    await importScripts(
      "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
    );
    await importScripts(
      "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
    );

    if (typeof firebase !== "undefined" && firebase.messaging) {
      firebase.initializeApp(firebaseConfig);
      messaging = firebase.messaging();
      isFirebaseAvailable = true;
    }
  } catch (error) {
    isFirebaseAvailable = false;
  }
})();

// Cache configuration - iOS Safari optimized
const CACHE_NAME = "scalemarts-v1.0.10";
const STATIC_CACHE = "scalemarts-static-v1.0.10";
const DYNAMIC_CACHE = "scalemarts-dynamic-v1.0.10";

// Reduced critical assets for iOS Safari - USING ONLY LOGO FILES
const CRITICAL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/logo-512x512.png",
  "/icons/logo.png",
];

// Essential pages only
const ESSENTIAL_PAGES = ["/about", "/contact-us", "/login", "/register"];

// iOS Safari compatible install event
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        // Add critical assets with silent error handling
        return Promise.allSettled(
          CRITICAL_ASSETS.map((url) =>
            cache.add(url).catch(() => Promise.resolve())
          )
        );
      })
      .then(() => {
        // Skip waiting for immediate activation
        return self.skipWaiting();
      })
      .catch(() => Promise.resolve())
  );
});

// Activate event - iOS Safari compatible
self.addEventListener("activate", function (event) {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== CACHE_NAME
            ) {
              return caches.delete(cacheName).catch(() => Promise.resolve());
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim().catch(() => Promise.resolve()),
    ]).catch(() => Promise.resolve())
  );
});

if (isFirebaseAvailable) {
  try {
    messaging.onBackgroundMessage((payload) => {
      try {
        const { title, body, icon } = payload.notification || {};
        const notificationTitle = title || "ScaleMarts";
        const notificationOptions = {
          body: body || "You have a new message",
          icon: icon || "/icons/logo-512x512.png",
          badge: "/badge-72x72.png",
          vibrate: [200, 100, 200],
          tag: "scalemarts-notification",
          // Enhanced notification styling with ScaleMarts theme colors
          image: payload.data?.image || null,
          requireInteraction: true,
          actions: [
            {
              action: "open",
              title: "🚀 Open App",
              icon: "/icons/logo-512x512.png",
            },
            {
              action: "close",
              title: "✕ Close",
            },
          ],
          data: {
            ...payload.data,
            themeColor: "#1e6ba8", // Blue theme color for supported browsers
            backgroundColor: "#76c043",
          },
        };

        return self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
      } catch (error) {
        return Promise.resolve();
      }
    });
  } catch (error) {}
}

// Simplified bypass logic for iOS Safari
function shouldBypassRequest(request) {
  try {
    const url = new URL(request.url);

    // Always bypass these
    if (
      !url.protocol.startsWith("http") ||
      url.protocol === "blob:" ||
      url.protocol.includes("extension") ||
      request.method !== "GET"
    ) {
      return true;
    }

    const bypassDomains = [
      "firebasestorage.googleapis.com",
      "identitytoolkit.googleapis.com",
      "securetoken.googleapis.com",
      "firebase.googleapis.com",
      "www.gstatic.com",
      "fonts.googleapis.com",
      "fonts.gstatic.com",
    ];

    return bypassDomains.some((domain) => url.hostname.includes(domain));
  } catch (error) {
    return true; // Bypass on error
  }
}

// Main fetch event - iOS Safari optimized
self.addEventListener("fetch", function (event) {
  const request = event.request;

  // Bypass check
  if (shouldBypassRequest(request)) {
    return;
  }

  // Only handle requests from your own origin
  try {
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
      return;
    }

    event.respondWith(handleRequest(request));
  } catch (error) {
    // Let request go through normally on error
    return;
  }
});

// Generate ScaleMarts-themed offline page HTML
function generateOfflinePage(message = "Content not available offline") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ScaleMarts - Offline</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1e6ba8 0%, #76c043 50%, #f7941d 100%);
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            max-width: 400px;
        }
        h1 {
            font-size: 1.8rem;
            margin-bottom: 16px;
            font-weight: 700;
        }
        p {
            font-size: 1.1rem;
            margin-bottom: 24px;
            opacity: 0.9;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .logo {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🛒</div>
        <h1>ScaleMarts</h1>
        <p>${message}</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
    </div>
</body>
</html>`;
}

// Simplified request handler for iOS Safari with ScaleMarts-themed responses
async function handleRequest(request) {
  try {
    const url = new URL(request.url);

    // Try network first, then cache (iOS Safari prefers this)
    try {
      const response = await fetch(request);

      if (response.ok) {
        // Cache successful responses
        try {
          const cache = await caches.open(DYNAMIC_CACHE);
          await cache.put(request, response.clone());
        } catch (cacheError) {
          // Caching failed silently
        }
      }

      return response;
    } catch (networkError) {
      // Network failed, try cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If it's a navigation request, return themed offline page
      if (request.mode === "navigate") {
        const indexResponse =
          (await caches.match("/")) || (await caches.match("/index.html"));
        if (indexResponse) {
          return indexResponse;
        }

        // Return ScaleMarts-themed offline page
        return new Response(
          generateOfflinePage(
            "You're currently offline. Please check your connection and try again."
          ),
          {
            status: 200,
            headers: {
              "Content-Type": "text/html",
              "Cache-Control": "no-cache",
            },
          }
        );
      }

      // Return a themed error for other requests
      return new Response(
        generateOfflinePage("Content not available offline"),
        {
          status: 503,
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        }
      );
    }
  } catch (error) {
    return new Response(
      generateOfflinePage("Service temporarily unavailable"),
      {
        status: 503,
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}

// Notification click handler - iOS Safari compatible with enhanced UX
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const data = event.notification.data || {};
  const urlToOpen = data.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Try to focus existing client
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }

        // Open new window if no existing client
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .catch(() => Promise.resolve())
  );
});

// Handle push notifications - iOS Safari compatible with ScaleMarts theme
self.addEventListener("push", function (event) {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.body || "New update from ScaleMarts",
      icon: "/icons/logo-512x512.png",
      badge: "/badge-72x72.png",
      tag: "scalemarts-notification",
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      data: {
        url: data.url || "/",
        themeColor: "#1e6ba8",
        backgroundColor: "#76c043",
      },
      actions: [
        {
          action: "open",
          title: "🚀 Open App",
          icon: "/icons/logo-512x512.png",
        },
        {
          action: "close",
          title: "✕ Dismiss",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "ScaleMarts", options)
    );
  } catch (error) {
    // Push notification handling failed silently
  }
});

// Handle messages from main thread
self.addEventListener("message", function (event) {
  try {
    if (event.data && event.data.action === "SKIP_WAITING") {
      self.skipWaiting();
    }

    if (event.data && event.data.action === "UPDATE_SW") {
      self.registration.update();
    }

    // Handle theme updates from main thread
    if (event.data && event.data.action === "UPDATE_THEME") {
      // Store theme preference for offline pages
      // This could be expanded to customize offline page themes
    }
  } catch (error) {
    // Handle message errors silently
  }
});

// Background sync - simplified for iOS Safari
self.addEventListener("sync", function (event) {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Simple background sync
      caches
        .open(DYNAMIC_CACHE)
        .then((cache) => {
          return Promise.allSettled(
            ESSENTIAL_PAGES.map((page) =>
              fetch(page)
                .then((response) => {
                  if (response.ok) {
                    return cache.put(page, response);
                  }
                })
                .catch(() => Promise.resolve())
            )
          );
        })
        .catch(() => Promise.resolve())
    );
  }
});