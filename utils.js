export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
