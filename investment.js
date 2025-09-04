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
  return tier ? inv.amount * tier.dividendRate : 0;
}

export function calculateVolatility(inv) {
  const tier = riskTiers[inv.risk];
  if (!tier) return 0;
  const change = inv.amount * (Math.random() * tier.volatility * 2 - tier.volatility);
  return Math.round(change);
}

