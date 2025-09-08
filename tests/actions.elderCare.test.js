import { jest } from '@jest/globals';

const addLog = jest.fn();
const game = { parents: {}, money: 0 };
const applyAndSave = (fn) => fn();

const rand = jest.fn((min, max) => {
  if (max === 5) return 5; // ensure parent dies
  return 5000;
});
const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);

await jest.unstable_mockModule('../scripts/state.js', () => ({
  game,
  addLog,
  applyAndSave
}));
await jest.unstable_mockModule('../scripts/utils.js', () => ({ rand, clamp }));

const { tickParents } = await import('../scripts/actions/elderCare.js');

describe('tickParents', () => {
  beforeEach(() => {
    addLog.mockClear();
    rand.mockClear();
    game.money = 0;
    game.parents = {};
  });

  test('handles missing parents gracefully', () => {
    expect(() => tickParents()).not.toThrow();
    expect(addLog).not.toHaveBeenCalled();
  });

  test('ages and handles parent death', () => {
    game.parents.mother = { age: 60, health: 1 };
    tickParents();
    expect(game.parents.mother.age).toBe(61);
    expect(game.money).toBe(5000);
    expect(addLog).toHaveBeenCalledWith(
      expect.stringContaining('mother passed away'),
      'family'
    );
  });
});

