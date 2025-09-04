import { jest } from '@jest/globals';
import { faker } from '../nameGenerator.js';

const storage = {};
global.window = { addEventListener: jest.fn() };
global.localStorage = {
  setItem: (k, v) => { storage[k] = String(v); },
  getItem: k => (k in storage ? storage[k] : null),
  removeItem: k => { delete storage[k]; }
};

jest.unstable_mockModule('../windowManager.js', () => ({
  refreshOpenWindows: jest.fn()
}));

jest.unstable_mockModule('../endscreen.js', () => ({
  showEndScreen: jest.fn(),
  hideEndScreen: jest.fn()
}));

jest.unstable_mockModule('../realestate.js', () => {
  const brokers = [];
  return {
    brokers,
    initBrokers: jest.fn(() => {
      brokers.push({ id: 1 });
      return Promise.resolve();
    })
  };
});

const { newLife, game } = await import('../state.js');
const realestate = await import('../realestate.js');
const { brokers, initBrokers } = realestate;

describe('newLife', () => {
  test('resets game and uses faker output', async () => {
    game.age = 40;
    game.money = 5000;
    game.achievements = [{ id: 'old', text: 'old achievement' }];
    brokers.length = 0;

    const mockCity = 'Testville';
    const mockCountry = 'Testland';
    faker.location.city = jest.fn(() => mockCity);
    faker.location.country = jest.fn(() => mockCountry);

    newLife('Male', 'Testy McTestface');

    await initBrokers.mock.results[0].value;

    expect(game.age).toBe(0);
    expect(game.money).toBe(0);
    expect(game.gender).toBe('Male');
    expect(game.name).toBe('Testy McTestface');
    expect(game.city).toBe(mockCity);
    expect(game.country).toBe(mockCountry);
    expect(game.achievements).toEqual([]);
    expect(brokers.length).toBeGreaterThan(0);
    expect(initBrokers).toHaveBeenCalled();
  });
});

