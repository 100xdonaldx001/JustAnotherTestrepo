import { jest } from '@jest/globals';

const game = { relationships: [], log: [] };
const addLog = jest.fn((text, category = 'general') => {
  game.log.unshift({ text, category });
});
const applyAndSave = fn => fn();

await jest.unstable_mockModule('../state.js', () => ({
  game,
  addLog,
  applyAndSave
}));

const { tickRelationships } = await import('../activities/love.js');

describe('tickRelationships', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    Math.random = () => 0;
    game.relationships = [
      { name: 'Alex Smith', happiness: 5 },
      { name: 'Jamie Doe', happiness: 2 }
    ];
    game.log = [];
    addLog.mockClear();
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  test('removes unhappy partners and logs breakup', () => {
    tickRelationships();
    expect(game.relationships).toHaveLength(0);
    expect(addLog).toHaveBeenCalledTimes(2);
    expect(game.log).toEqual([
      { text: 'Alex Smith left you.', category: 'relationship' },
      { text: 'Jamie Doe left you.', category: 'relationship' }
    ]);
  });
});

