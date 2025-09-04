import { jest } from '@jest/globals';
let game;
let mockAddLog;
let mockSaveGame;
let mockUnlockAchievement;
let mockApplyAndSave;
let buyProperty;
let sellProperty;
let rentProperty;
let tickRealEstate;
let renovateProperty;

beforeEach(async () => {
  jest.resetModules();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([])
    })
  );
  game = { money: 1000, properties: [] };
  mockAddLog = jest.fn();
  mockSaveGame = jest.fn();
  mockUnlockAchievement = jest.fn();
  mockApplyAndSave = fn => fn();
  const mockRand = jest.fn((min, max) => {
    if (min === 95 && max === 110) return 100;
    return min;
  });
  await jest.unstable_mockModule('../state.js', () => ({
    game,
    addLog: mockAddLog,
    saveGame: mockSaveGame,
    unlockAchievement: mockUnlockAchievement,
    applyAndSave: mockApplyAndSave
  }));
  await jest.unstable_mockModule('../utils.js', () => ({
    rand: mockRand,
    clamp: (val, min = 0, max = 100) => Math.min(Math.max(val, min), max)
  }));
  ({ buyProperty, sellProperty, rentProperty, tickRealEstate } = await import('../realestate.js'));
  ({ renovateProperty } = await import('../actions/renovateProperty.js'));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('real estate transactions', () => {
  test('buyProperty purchases listing and updates state', () => {
    const listing = { id: '1', name: 'Test House', value: 500, icon: { type: 'fa', icon: 'fa-house' } };
    const broker = { name: 'Test Broker', listings: [listing] };
    const result = buyProperty(broker, listing);
    expect(result).toBe(true);
    expect(game.money).toBe(500);
    expect(game.properties).toHaveLength(1);
    expect(game.properties[0]).toMatchObject({ name: 'Test House', value: 500, rented: false, maintenanceCost: 5 });
    expect(broker.listings).toHaveLength(0);
    expect(mockAddLog).toHaveBeenCalledWith('You bought Test House from Test Broker for $500.', 'property');
    expect(mockUnlockAchievement).toHaveBeenCalledWith('first-property', 'Bought your first property.');
  });

    test('sellProperty removes property and adds money', () => {
    const prop = { id: 1, name: 'Test House', value: 500, condition: 100, rented: false, rent: 0, tenant: null, icon: { type: 'fa', icon: 'fa-house' }, maintenanceCost: 5 };
    game.properties.push(prop);
    sellProperty(prop);
    expect(game.money).toBe(1500);
    expect(game.properties).toHaveLength(0);
    expect(mockAddLog).toHaveBeenCalledWith('You sold Test House for $500.', 'property');
  });

    test('rentProperty marks property rented and logs', () => {
    const prop = { id: 1, name: 'Test House', value: 1000, condition: 100, rented: false, rent: 0, tenant: null, icon: { type: 'fa', icon: 'fa-house' }, maintenanceCost: 10 };
    game.properties.push(prop);
    rentProperty(prop, 5);
    expect(game.money).toBe(1000);
    expect(prop.rented).toBe(true);
    expect(prop.rent).toBe(50);
    expect(typeof prop.tenant).toBe('string');
    expect(prop.tenant.length).toBeGreaterThan(0);
    expect(mockAddLog).toHaveBeenCalled();
    const message = mockAddLog.mock.calls[0][0];
    expect(message).toMatch(/You rented Test House to .* for \$50 per year\./);
    expect(mockAddLog.mock.calls[0][1]).toBe('property');
  });

  test('renovateProperty increases value after completion', () => {
    const prop = {
      id: 2,
      name: 'Fixer Upper',
      value: 1000,
      condition: 80,
      rented: false,
      rent: 0,
      tenant: null,
      icon: { type: 'fa', icon: 'fa-house' },
      renovation: null
    };
    game.properties.push(prop);
    renovateProperty(prop, 100, 1);
    expect(game.money).toBe(900);
    expect(prop.renovation).toEqual({ years: 1, cost: 100 });
    tickRealEstate();
    expect(prop.renovation).toBeNull();
    expect(prop.value).toBe(1150);
    expect(game.money).toBe(890);
    expect(mockAddLog).toHaveBeenCalledWith(
      'Renovation complete on Fixer Upper. Value increased by $150.',
      'property'
    );
  });
});

describe('loadHouseCategories', () => {
  test('returns empty array on fetch failure', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.unstable_mockModule('../state.js', () => ({
      game: {},
      addLog: jest.fn(),
      saveGame: jest.fn(),
      unlockAchievement: jest.fn()
    }));
    jest.unstable_mockModule('../utils.js', () => ({
      rand: jest.fn(),
      clamp: jest.fn()
    }));
    jest.unstable_mockModule('../nameGenerator.js', () => ({
      faker: { person: { firstName: jest.fn(), lastName: jest.fn() } }
    }));
    const { loadHouseCategories } = await import('../realestate.js');
    const result = await loadHouseCategories();
    expect(result).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
    global.fetch = originalFetch;
  });
});

