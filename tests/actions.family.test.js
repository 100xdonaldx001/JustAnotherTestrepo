import { jest } from '@jest/globals';

const rand = jest.fn((min) => min);
const game = { relationships: [] };
const addLog = jest.fn();
const applyAndSave = (fn) => fn();

await jest.unstable_mockModule('../utils.js', () => ({
  rand,
  clamp: (v, a = 0, b = 100) => Math.max(a, Math.min(b, v))
}));

await jest.unstable_mockModule('../state.js', () => ({
  game,
  addLog,
  applyAndSave,
  saveGame: jest.fn(),
  unlockAchievement: jest.fn()
}));

const {
  spendTimeWithSpouse,
  argueWithSpouse
} = await import('../actions/family.js');

describe('spouse interactions', () => {
  beforeEach(() => {
    rand.mockImplementation((min) => min);
    addLog.mockClear();
    game.alive = true;
  });

  test('spending time increases happiness and logs', () => {
    game.relationships = [{ name: 'Pat', happiness: 50 }];
    spendTimeWithSpouse(0);
    expect(game.relationships[0].happiness).toBe(55);
    expect(addLog).toHaveBeenCalledWith(expect.any(Array), 'relationship');
  });

  test('arguing decreases happiness and removes at zero', () => {
    game.relationships = [{ name: 'Sam', happiness: 5 }];
    argueWithSpouse(0);
    expect(game.relationships).toHaveLength(0);
    expect(addLog).toHaveBeenNthCalledWith(1, expect.any(Array), 'relationship');
    expect(addLog).toHaveBeenNthCalledWith(2, 'Sam left you.', 'relationship');
  });
});

