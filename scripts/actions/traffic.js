import { game } from '../state.js';
import { rand, clamp } from '../utils.js';
import { logTraffic } from '../renderers/log.js';
import { taskChances } from '../taskChances.js';

export function checkForAccident() {
  if (rand(1, 100) > taskChances.traffic.accident) {
    if (rand(1, 100) <= taskChances.traffic.findCash) {
      const found = rand(5, 50);
      game.money += found;
      logTraffic(`You found $${found.toLocaleString()} while commuting.`);
      return { found };
    }
    return null;
  }
  if (rand(1, 100) <= taskChances.traffic.injuryOutcome) {
    const injury = rand(5, 15);
    game.health = clamp(game.health - injury);
    logTraffic(`You were injured in a car accident. -${injury} Health.`);
    return { injury };
  }
  const fine = rand(100, 500);
  game.money = Math.max(0, game.money - fine);
  logTraffic(`You were fined $${fine.toLocaleString()} for a traffic violation.`);
  return { fine };
}

