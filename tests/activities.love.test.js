import { jest } from '@jest/globals';

const game = { relationships: [], log: [], spouse: null, maritalStatus: 'single' };
const addLog = jest.fn((text, category = 'general') => {
  game.log.unshift({ text, category });
});
const applyAndSave = fn => fn();

await jest.unstable_mockModule('../state.js', () => ({
  game,
  addLog,
  applyAndSave
}));

const { tickRelationships, tickSpouse } = await import('../activities/love.js');

describe('tickRelationships', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    Math.random = () => 0;
    game.relationships = [
      { name: 'Alex Smith', happiness: 5 },
      { name: 'Jamie Doe', happiness: 2 }
    ];
    game.spouse = null;
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

describe('tickSpouse', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    Math.random = () => 0;
    game.spouse = { name: 'Taylor Lee', happiness: 1 };
    game.log = [];
    addLog.mockClear();
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  test('removes unhappy spouse and logs divorce', () => {
    tickSpouse();
    expect(game.spouse).toBeNull();
    expect(addLog).toHaveBeenCalledWith('Taylor Lee divorced you.', 'relationship');
  });
});

