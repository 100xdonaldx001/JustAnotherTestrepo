import {
  AGE_JOB_MIN,
  GYM_COST,
  PROMOTION_THRESHOLDS,
  JOB_STRESS_CHANCE,
  JOB_PROMOTION_CHANCE
} from '../constants.js';

describe('game constants', () => {
  test('exports expected values', () => {
    expect(AGE_JOB_MIN).toBe(16);
    expect(GYM_COST).toBe(20);
    expect(PROMOTION_THRESHOLDS.entry).toBe(3);
    expect(PROMOTION_THRESHOLDS.mid).toBe(5);
    expect(JOB_STRESS_CHANCE).toBe(20);
    expect(JOB_PROMOTION_CHANCE).toBe(5);
  });
});
