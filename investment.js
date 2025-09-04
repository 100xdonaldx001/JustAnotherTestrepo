import { game, applyAndSave, addLog } from './state.js';

export const riskTiers = {
  low: {
    dividendRate: 0.02,
    volatility: 0.05
  },
  medium: {
    dividendRate: 0.05,
    volatility: 0.15
  },
  high: {
    dividendRate: 0.1,
    volatility: 0.3
  }
};

export function addInvestment(name, amount, risk = 'low') {
  applyAndSave(() => {
    game.portfolio.push({ name, amount, risk });
    addLog(`Invested $${amount.toLocaleString()} in ${name} (${risk} risk).`);
  });
}

export function updateInvestmentRisk(inv, risk) {
  applyAndSave(() => {
    inv.risk = risk;
  });
}

export function calculateDividend(inv) {
  const tier = riskTiers[inv.risk];
  if (!tier) return 0;
  const phase = game.economyPhase;
  const mod = phase === 'boom' ? 1.2 : phase === 'recession' ? 0.8 : 1;
  return inv.amount * tier.dividendRate * mod;
}

export function calculateVolatility(inv) {
  const tier = riskTiers[inv.risk];
  if (!tier) return 0;
  let change = inv.amount * (Math.random() * tier.volatility * 2 - tier.volatility);
  const phase = game.economyPhase;
  const mod = phase === 'boom' ? 1.1 : phase === 'recession' ? 1.3 : 1;
  change *= mod;
  return Math.round(change);
}

if (!Array.isArray(game.portfolio)) {
  game.portfolio = [];
}

