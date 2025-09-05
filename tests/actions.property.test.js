import { jest } from '@jest/globals';
let game;
let addLog;
let payMaintenanceCosts;

beforeEach(async () => {
  jest.resetModules();
  game = {
    money: 1000,
    properties: [
      { name: 'House', maintenanceCost: 50 },
      { name: 'Villa', maintenanceCost: 100 }
    ]
  };
  addLog = jest.fn();
  await jest.unstable_mockModule('../scripts/state.js', () => ({
    game,
    addLog
  }));
  ({ payMaintenanceCosts } = await import('../scripts/actions/property.js'));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('payMaintenanceCosts', () => {
  test('deducts maintenance for each property', () => {
    payMaintenanceCosts();
    expect(game.money).toBe(850);
    expect(addLog).toHaveBeenCalledTimes(2);
  });
});

