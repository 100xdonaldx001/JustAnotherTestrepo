import { game } from '../state.js';
import { rand, clamp } from '../utils.js';
import { logTraffic } from '../renderers/log.js';

export function checkForAccident() {
  if (rand(1, 100) > 10) {
    return null;
  }
  if (rand(0, 1) === 0) {
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

