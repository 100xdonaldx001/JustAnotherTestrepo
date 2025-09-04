import { jest } from '@jest/globals';

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

