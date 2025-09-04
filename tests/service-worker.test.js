import { jest } from '@jest/globals';
import { bumpCacheVersion, handleFetch, OFFLINE_URL } from '../service-worker-utils.js';

describe('service worker', () => {
  test('bumpCacheVersion increments numeric suffix', () => {
    expect(bumpCacheVersion('v1')).toBe('v2');
    expect(bumpCacheVersion('v9')).toBe('v10');
  });

  test('returns offline page when network fails and cache empty', async () => {
    const store = new Map();
    const mockCache = {
      match: jest.fn(req => Promise.resolve(store.get(req.url || req))),
      put: jest.fn((req, res) => {
        store.set(req.url || req, res);
        return Promise.resolve();
      }),
      keys: jest.fn(() => Promise.resolve([])),
      delete: jest.fn(() => Promise.resolve(true))
    };
    global.caches = {
      open: jest.fn(() => Promise.resolve(mockCache)),
      match: jest.fn(key => Promise.resolve(store.get(key)))
    };
    store.set(OFFLINE_URL, new Response('offline', { status: 200 }));
    global.fetch = jest.fn().mockRejectedValue(new Error('network fail'));
    const response = await handleFetch(new Request('https://example.com/data'));
    const text = await response.text();
    expect(text).toBe('offline');
  });
});
