import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

export const VISIT_COST = 50;

export function visitParent(type) {
  const parent = game.parents[type];
  if (!parent || parent.health <= 0) {
    applyAndSave(() => {
      addLog(`Your ${type} has passed away.`, 'family');
    });
    return;
  }
  if (game.money < VISIT_COST) {
    applyAndSave(() => {
      addLog(`Visiting your ${type} costs $${VISIT_COST}. Not enough money.`, 'family');
    });
    return;
  }
  applyAndSave(() => {
    game.money -= VISIT_COST;
    game.happiness = clamp(game.happiness + rand(1, 3));
    parent.health = clamp(parent.health + rand(2, 5));
    addLog(`You visited your ${type}. (+Happiness)`, 'family');
  });
}

export function tickParents() {
  for (const key of ['mother', 'father']) {
    const p = game.parents[key];
    if (p.health <= 0) continue;
    p.age += 1;
    p.health = clamp(p.health - rand(1, 5));
    if (p.health <= 0) {
      const inheritance = rand(5000, 20000);
      game.money += inheritance;
      addLog(
        `Your ${key} passed away and left you $${inheritance.toLocaleString()}. (+Money)`,
        'family'
      );
    }
  }
}

