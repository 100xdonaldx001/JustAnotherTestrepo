import { game, addLog, saveGame, applyAndSave } from '../state.js';

/**
 * Starts a renovation on a property, deducting cost and setting duration.
 * Tenant is removed and rent resets during renovation.
 * @param {object} prop - Property to renovate.
 * @param {number} cost - Renovation cost.
 * @param {number} years - Years the renovation will take.
 * @returns {void}
 */
export function renovateProperty(prop, cost, years) {
  const price = Math.round(cost);
  const duration = Math.max(1, Math.floor(years));
  if (prop.renovation) {
    addLog(`${prop.name} is already being renovated.`, 'property');
    saveGame();
    return;
  }
  if (game.money < price) {
    addLog(
      `Renovating ${prop.name} costs $${price.toLocaleString()}. Not enough money.`,
      'property'
    );
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.money -= price;
    prop.rented = false;
    prop.rent = 0;
    prop.tenant = null;
    prop.renovation = { years: duration, cost: price };
    addLog(
      `You started renovating ${prop.name}. (-$${price.toLocaleString()})`,
      'property'
    );
  });
}

