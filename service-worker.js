const CACHE_VERSION = 'v1';
const CACHE_NAME = `tiny-life-cache-${CACHE_VERSION}`;
const CORE_ASSETS = [
  '/index.html',
  '/base.css',
  '/components.css',
  '/variables.css',
  '/script.js',
  '/actions.js',
  '/state.js',
  '/windowManager.js',
  '/utils.js',
  '/storyNet.js',
  '/partials/dock.html',
  '/partials/window-template.html'
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
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
