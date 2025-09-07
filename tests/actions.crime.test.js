import { jest } from '@jest/globals';

const randMock = jest.fn();

const game = {
  money: 0,
  health: 80,
  happiness: 50,
  inJail: false,
  jailYears: 0,
  onParole: false,
  religion: 'none',
  faith: 0,
  smarts: 50,
  alcoholAddiction: 0
};
const addLog = jest.fn();
const saveGame = jest.fn();
const die = jest.fn();
const unlockAchievement = jest.fn();
const applyAndSave = fn => fn();

jest.unstable_mockModule('../scripts/state.js', () => ({
  game,
  addLog,
  die,
  saveGame,
  applyAndSave,
  unlockAchievement,
  distributeInheritance: jest.fn()
}));

jest.unstable_mockModule('../scripts/utils.js', () => ({
  rand: randMock,
  clamp: (v, a = 0, b = 100) => Math.max(a, Math.min(b, v)),
  combineChance: (...vals) =>
    Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}));

jest.unstable_mockModule('../scripts/realestate.js', () => ({
  tickRealEstate: jest.fn()
}));

const { crime } = await import('../scripts/actions.js');

describe('crime', () => {
  beforeEach(() => {
    Object.assign(game, {
      money: 0,
      health: 80,
      happiness: 50,
      inJail: false,
      jailYears: 0,
      onParole: false,
      religion: 'none',
      faith: 0
    });
    randMock.mockReset();
  });

  test('success path increases money and happiness', () => {
    randMock
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(40)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(2);

    crime();

    expect(game.money).toBe(100);
    expect(game.happiness).toBe(52);
    expect(game.inJail).toBe(false);
    expect(game.health).toBe(80);
  });

  test('failure can lead to jail', () => {
    randMock
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(3);

    crime();

    expect(game.inJail).toBe(true);
    expect(game.jailYears).toBe(3);
    expect(game.money).toBe(0);
    expect(game.health).toBe(80);
  });

  test('failure can cause injury', () => {
    randMock
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(80)
      .mockReturnValueOnce(5);

    crime();

    expect(game.inJail).toBe(false);
    expect(game.health).toBe(75);
    expect(game.money).toBe(0);
  });

  test('injury reducing health to zero does not kill', () => {
    game.health = 5;
    randMock
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(80)
      .mockReturnValueOnce(10);

    crime();

    expect(game.health).toBe(0);
    expect(die).not.toHaveBeenCalled();
  });
});

