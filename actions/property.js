import { game, addLog } from '../state.js';

export function payMaintenanceCosts() {
  for (const prop of game.properties) {
    if (!prop.maintenanceCost) continue;
    game.money -= prop.maintenanceCost;
    addLog(
      `Paid $${prop.maintenanceCost.toLocaleString()} maintenance for ${prop.name}.`,
      'property'
    );
  }
}

