import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderMeditationRetreat(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Spend time at a meditation retreat to restore your mind and body.';
  container.appendChild(head);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Attend Retreat ($300)';
  btn.addEventListener('click', () => {
    const cost = 300;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog(`Retreat costs $${cost}. Not enough money.`, 'health');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) > taskChances.meditationRetreat.peace) {
        addLog('The retreat failed to rejuvenate you.', 'health');
        return;
      }
      const happy = rand(6, 12);
      const health = rand(4, 8);
      game.happiness = clamp(game.happiness + happy);
      game.health = clamp(game.health + health);
      addLog(`You attended a meditation retreat. +${happy} Happiness, +${health} Health.`, 'health');
    });
  });

  container.appendChild(btn);
}

