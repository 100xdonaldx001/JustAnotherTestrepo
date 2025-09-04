import { jest } from '@jest/globals';

const storage = {};
global.window = { addEventListener: jest.fn() };
global.localStorage = {
  setItem: (k, v) => {
    storage[k] = String(v);
  },
  getItem: k => (k in storage ? storage[k] : null),
  removeItem: k => {
    delete storage[k];
  }
};

jest.unstable_mockModule('../windowManager.js', () => ({
  refreshOpenWindows: jest.fn(),
  openWindow: jest.fn(),
  closeWindow: jest.fn(),
  closeAllWindows: jest.fn()
}));

jest.unstable_mockModule('../endscreen.js', () => ({
  showEndScreen: jest.fn(),
  hideEndScreen: jest.fn()
}));

jest.unstable_mockModule('../realestate.js', () => ({
  initBrokers: jest.fn(() => Promise.resolve())
}));

const { continueAsChild, game, lifeState } = await import('../state.js');

describe('continueAsChild', () => {
  test('starts new life as existing child', () => {
    game.children = [{ name: 'Junior', age: 7, happiness: 80 }];
    game.year = 1995;
    continueAsChild(0);
    expect(game.name).toBe('Junior');
    expect(game.age).toBe(7);
    expect(game.year).toBe(1995);
    expect(lifeState.state).toBe('alive');
  });
});
