import { rand, clamp } from '../utils.js';

describe('rand', () => {
  test('returns values within bounds', () => {
    for (let i = 0; i < 100; i++) {
      const value = rand(1, 3);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(3);
    }
  });
});

describe('clamp', () => {
  test('clamps numbers to provided range', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('uses default range of 0 to 100', () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(150)).toBe(100);
  });
});
