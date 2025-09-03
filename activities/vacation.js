import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

export function renderVacation(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Take a relaxing trip to boost your happiness.';
  container.appendChild(head);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Go on Vacation ($500)';
  btn.addEventListener('click', () => {
    const cost = 500;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('Vacation costs $500. Not enough money.');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      const gain = rand(8, 15);
      game.happiness = clamp(game.happiness + gain);
      addLog(`You went on a vacation. +${gain} Happiness.`);
    });
  });

  container.appendChild(btn);
}
