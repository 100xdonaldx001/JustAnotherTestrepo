import { game } from './state.js';

const rewardMods = { easy: 1.2, normal: 1, hard: 0.8 };
const penaltyMods = { easy: 0.8, normal: 1, hard: 1.2 };
const chanceMods = {
  easy: { good: 1.2, bad: 0.8 },
  normal: { good: 1, bad: 1 },
  hard: { good: 0.8, bad: 1.2 }
};

export function scaleReward(value) {
  const mods = value >= 0 ? rewardMods : penaltyMods;
  const mod = mods[game.difficulty] || 1;
  return Math.round(value * mod);
}

export function scaleProbability(base, type = 'neutral') {
  const diff = game.difficulty;
  const mod = chanceMods[diff]?.[type] ?? 1;
  return Math.round(Math.min(100, base * mod));
}
