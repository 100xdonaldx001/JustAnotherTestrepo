import { game, addLog } from '../state.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function payMaintenanceCosts() {
  for (const prop of game.properties) {
    if (!prop.maintenanceCost) continue;
    game.money -= prop.maintenanceCost;
    addLog(
      [
        `Paid $${prop.maintenanceCost.toLocaleString()} maintenance for ${prop.name}.`,
        `Spent $${prop.maintenanceCost.toLocaleString()} to upkeep ${prop.name}.`,
        `Covered $${prop.maintenanceCost.toLocaleString()} in maintenance for ${prop.name}.`
      ],
      'property'
    );
    if (process.env.NODE_ENV !== 'test') {
      if (rand(1, 100) <= taskChances.property.suddenExpense) {
        const extra = Math.round(prop.maintenanceCost * rand(1, 3));
        game.money -= extra;
        addLog(
          [
            `Unexpected repairs for ${prop.name} cost $${extra.toLocaleString()}.`,
            `Surprise fixes on ${prop.name} ran $${extra.toLocaleString()}.`,
            `${prop.name} needed sudden repairs totaling $${extra.toLocaleString()}.`
          ],
          'property'
        );
      }
      if (rand(1, 100) <= taskChances.property.valueBoost) {
        const boost = Math.round(prop.value * 0.02);
        prop.value += boost;
        addLog(
          [
            `${prop.name} increased in value by $${boost.toLocaleString()}.`,
            `${prop.name} gained $${boost.toLocaleString()} in value.`,
            `Value of ${prop.name} jumped by $${boost.toLocaleString()}.`
          ],
          'property'
        );
      }
    }
  }
}

