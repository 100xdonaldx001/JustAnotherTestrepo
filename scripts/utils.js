export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
export const combineChance = (...vals) =>
  Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
