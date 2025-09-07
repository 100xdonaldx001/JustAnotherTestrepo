/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

const game = {
  relationships: [],
  log: [],
  spouse: null,
  money: 0,
  happiness: 70,
  looks: 50,
  mentalHealth: 70,
  maritalStatus: 'single'
};
const addLog = jest.fn((text, category = 'general') => {
  game.log.unshift({ text, category });
});
const applyAndSave = fn => fn();
const rand = jest.fn((min, max) => min);
const clamp = v => v;
const combineChance = (...vals) =>
  Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);

await jest.unstable_mockModule('../scripts/utils.js', () => ({
  rand,
  clamp,
  combineChance
}));
await jest.unstable_mockModule('../scripts/state.js', () => ({
  game,
  addLog,
  applyAndSave,
  saveGame: jest.fn(),
  unlockAchievement: jest.fn()
}));

const { tickRelationships, tickSpouse, renderLove } = await import('../scripts/activities/love.js');

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

test('divorce splits money and removes spouse', () => {
  game.spouse = { name: 'Pat Doe', happiness: 80 };
  game.money = 1000;
  game.happiness = 70;
  game.log = [];
  addLog.mockClear();

  const container = document.createElement('div');
  renderLove(container);
  const btn = [...container.querySelectorAll('button')].find(b => b.textContent === 'Divorce');
  btn.click();

  expect(game.spouse).toBeNull();
  expect(game.money).toBe(500);
  expect(game.happiness).toBe(40);
  expect(addLog).toHaveBeenCalledWith('You divorced Pat Doe and split your money.', 'relationship');
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

test('find partner chance averages stats', () => {
  const container = document.createElement('div');
  game.relationships = [];
  game.looks = 10;
  game.mentalHealth = 10;
  game.happiness = 10;
  rand.mockReturnValueOnce(30);
  renderLove(container);
  const findLow = [...container.querySelectorAll('button')].find(b => b.textContent === 'Find Partner');
  findLow.click();
  expect(game.relationships).toHaveLength(0);

  container.innerHTML = '';
  game.looks = 90;
  game.mentalHealth = 90;
  game.happiness = 90;
  rand.mockReturnValueOnce(30).mockReturnValueOnce(40);
  renderLove(container);
  const findHigh = [...container.querySelectorAll('button')].find(b => b.textContent === 'Find Partner');
  findHigh.click();
  expect(game.relationships).toHaveLength(1);
});
