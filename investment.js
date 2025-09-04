import { game, addLog, saveGame } from './state.js';

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

