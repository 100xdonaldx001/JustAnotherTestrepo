import { jest } from '@jest/globals';

const originalWindow = globalThis.window;
globalThis.window = { addEventListener: () => {} };

afterAll(() => {
  globalThis.window = originalWindow;
});

await jest.unstable_mockModule('../scripts/endscreen.js', () => ({
  showEndScreen: () => {},
  hideEndScreen: () => {}
}));

await jest.unstable_mockModule('../scripts/windowManager.js', () => ({
  refreshOpenWindows: () => {},
  openWindow: () => {},
  closeWindow: () => {},
  closeAllWindows: () => {}
}));

await jest.unstable_mockModule('../scripts/realestate.js', () => ({
  initBrokers: () => {}
}));

const { storageAvailable } = await import('../scripts/state.js');

describe('storageAvailable', () => {
  const original = globalThis.localStorage;

  afterEach(() => {
    globalThis.localStorage = original;
  });

  test('returns false when setItem throws', () => {
    globalThis.localStorage = {
      setItem() {
        throw new Error('fail');
      },
      removeItem() {}
    };
    expect(storageAvailable()).toBe(false);
  });

  test('returns false when removeItem throws', () => {
    globalThis.localStorage = {
      setItem() {},
      removeItem() {
        throw new Error('fail');
      }
    };
    expect(storageAvailable()).toBe(false);
  });
});

