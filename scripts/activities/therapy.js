import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderTherapy(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Attend therapy sessions to improve your mental health.';
  container.appendChild(head);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Therapy Session ($100)';
  btn.addEventListener('click', () => {
    const cost = 100;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog(`Therapy costs $${cost}. Not enough money.`, 'health');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) <= taskChances.therapy.sessionSuccess) {
        const gain = rand(4, 8);
        game.mentalHealth = clamp(game.mentalHealth + gain);
        addLog(`Therapy helped clear your mind. +${gain} Mental Health.`, 'health');
      } else {
        addLog('The therapy session was unproductive.', 'health');
      }
    });
  });

  container.appendChild(btn);
}

