import { jest } from '@jest/globals';

const mockFaker = {
  person: {
    firstName: () => 'Test',
    lastName: () => 'User'
  },
  location: {
    city: () => 'Townsville',
    country: () => 'Neverland'
  }
};

jest.unstable_mockModule('../scripts/utils/faker.js', () => ({
  getFaker: jest.fn(async () => mockFaker)
}));
jest.unstable_mockModule('../scripts/realestate.js', () => ({
  initBrokers: () => {}
}));

global.document = { getElementById: () => null };
global.window = { addEventListener: () => {} };

const { game, addLog } = await import('../scripts/state.js');
const { getFaker } = await import('../scripts/utils/faker.js');

describe('addLog', () => {
  test('appends log entries', () => {
    const initial = game.log.length;
    addLog('hello');
    expect(game.log.length).toBe(initial + 1);
  });
});

test('getFaker was called', () => {
  expect(getFaker).toHaveBeenCalled();
});

