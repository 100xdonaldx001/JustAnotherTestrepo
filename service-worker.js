import { CACHE_NAME, CORE_ASSETS, handleFetch } from './service-worker-utils.js';

if (typeof self !== 'undefined') {
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
    event.respondWith(handleFetch(event.request));
  });
}
