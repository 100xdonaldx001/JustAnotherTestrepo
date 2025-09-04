export const CACHE_VERSION = 'v1';

export function bumpCacheVersion(version = CACHE_VERSION) {
  const match = version.match(/(\d+)$/);
  const num = match ? parseInt(match[1], 10) : 0;
  return `v${num + 1}`;
}

export const CACHE_NAME = `tiny-life-cache-${CACHE_VERSION}`;
export const OFFLINE_URL = 'offline.html';
export const CORE_ASSETS = [
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
  'partials/window-template.html',
  OFFLINE_URL
];

export async function handleFetch(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      const whitelist = new Set(
        CORE_ASSETS.map(asset => new URL(asset, self.location).href)
      );
      whitelist.add(request.url);
      cache.keys().then(keys => {
        keys.forEach(key => {
          if (!whitelist.has(key.url)) {
            cache.delete(key);
          }
        });
      });
    }
    return networkResponse;
  } catch (_) {
    return cachedResponse || caches.match(OFFLINE_URL);
  }
}
