import { game, applyAndSave, addLog, saveGame } from './state.js';

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

if (!Array.isArray(game.portfolio)) {
  game.portfolio = [];
}

/**
 * Adds or updates an investment holding.
 * @param {string} name - Asset name.
 * @param {number} shares - Number of shares.
 * @param {number} price - Price per share.
 * @returns {void}
 */
export function addInvestment(name, shares, price) {
  const existing = game.portfolio.find(p => p.name === name);
  if (existing) {
    const totalShares = existing.shares + shares;
    const totalCost = existing.shares * existing.price + shares * price;
    existing.shares = totalShares;
    existing.price = Math.round(totalCost / totalShares);
  } else {
    game.portfolio.push({ name, shares, price });
  }
  addLog(`Invested in ${name}.`, 'investment');
  saveGame();
}

/**
 * Renders the Investments window.
 * @param {HTMLElement} c - Container element.
 * @returns {void}
 */
export function renderInvestment(c) {
  c.innerHTML = '';
  if (!game.portfolio.length) {
    const p = document.createElement('p');
    p.textContent = 'You have no investments.';
    c.appendChild(p);
    return;
  }
  const list = document.createElement('ul');
  for (const inv of game.portfolio) {
    const li = document.createElement('li');
    li.textContent = `${inv.name}: ${inv.shares} @ $${inv.price.toLocaleString()}`;
    list.appendChild(li);
  }
  c.appendChild(list);
}

