const CACHE_VERSION = 'v1';
const CACHE_NAME = `tiny-life-cache-${CACHE_VERSION}`;
const CORE_ASSETS = [
  'index.html',
  'base.css',
  'components.css',
  'variables.css',
  'script.js',
  'actions.js',
  'state.js',
  'windowManager.js',
  'utils.js',
  'storyNet.js',
  'partials/dock.html',
  'partials/window-template.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
              const whitelist = new Set(
                CORE_ASSETS.map(asset => new URL(asset, self.location).href)
              );
              whitelist.add(event.request.url);
              cache.keys().then(keys => {
                keys.forEach(key => {
                  if (!whitelist.has(key.url)) {
                    cache.delete(key);
                  }
                });
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    )
  );
});
