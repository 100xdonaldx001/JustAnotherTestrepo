import { jest } from '@jest/globals';

globalThis.window = { addEventListener: jest.fn() };
globalThis.document = {};

const rand = jest.fn((min, max) => min);

await jest.unstable_mockModule('../scripts/utils.js', () => ({
  rand,
  clamp: (n, min = 0, max = 100) => Math.min(max, Math.max(min, n)),
  combineChance: (...vals) =>
    Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}));

await jest.unstable_mockModule('../scripts/windowManager.js', () => ({
  openWindow: jest.fn(),
  closeWindow: jest.fn(),
  toggleWindow: jest.fn(),
  registerWindow: jest.fn(),
  restoreOpenWindows: jest.fn(),
  closeAllWindows: jest.fn(),
  getRegisteredWindows: jest.fn(),
  initWindowManager: jest.fn(),
  refreshOpenWindows: jest.fn()
}));

await jest.unstable_mockModule('../scripts/endscreen.js', () => ({
  showEndScreen: jest.fn(),
  hideEndScreen: jest.fn()
}));

await jest.unstable_mockModule('../scripts/jail.js', () => ({ tickJail: jest.fn() }));

await jest.unstable_mockModule('../scripts/activities/love.js', () => ({
  tickRelationships: jest.fn(),
  tickSpouse: jest.fn()
}));

await jest.unstable_mockModule('../scripts/realestate.js', () => ({
  tickRealEstate: jest.fn(),
  initBrokers: jest.fn()
}));

await jest.unstable_mockModule('../scripts/school.js', () => ({
  advanceSchool: jest.fn(),
  accrueStudentLoanInterest: jest.fn(),
  dropOut: jest.fn(),
  enrollCollege: jest.fn(),
  enrollUniversity: jest.fn(),
  reEnrollHighSchool: jest.fn(),
  getGed: jest.fn(),
  eduName: jest.fn()
}));

await jest.unstable_mockModule('../scripts/jobs.js', () => ({
  tickJob: jest.fn(),
  adjustJobPerformance: jest.fn()
}));

const { seeDoctor } = await import('../scripts/actions.js');
const { game } = await import('../scripts/state.js');

beforeEach(() => {
  rand.mockImplementation((min, max) => min);
});

describe('seeDoctor', () => {
  beforeEach(() => {
    game.money = 0;
    game.health = 50;
    game.happiness = 50;
    game.sick = false;
    game.inJail = false;
  });

  test('does nothing with insufficient funds', () => {
    game.money = 50;
    game.health = 40;
    game.happiness = 55;
    seeDoctor();
    expect(game.money).toBe(50);
    expect(game.health).toBe(40);
    expect(game.happiness).toBe(55);
  });

  test('deducts cost and heals when sick', () => {
    rand.mockReturnValueOnce(8);
    game.money = 200;
    game.health = 40;
    game.happiness = 55;
    game.sick = true;
    seeDoctor();
    expect(game.money).toBe(80);
    expect(game.health).toBe(48);
    expect(game.sick).toBe(false);
    expect(game.happiness).toBe(55);
  });

  test('charges for routine check-up and boosts health', () => {
    rand.mockReturnValueOnce(5);
    game.money = 100;
    game.health = 40;
    game.happiness = 55;
    seeDoctor();
    expect(game.money).toBe(40);
    expect(game.health).toBe(45);
    expect(game.happiness).toBe(55);
  });
});

