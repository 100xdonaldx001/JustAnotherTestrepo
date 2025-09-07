import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderHiking(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Hit the trails to improve your health.';
  container.appendChild(head);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Go Hiking';
  btn.addEventListener('click', () => {
    applyAndSave(() => {
      if (rand(1, 100) <= taskChances.hiking.injury) {
        const loss = rand(1, 5);
        game.health = clamp(game.health - loss);
        addLog(`You were injured while hiking. -${loss} Health.`, 'health');
      } else {
        const gain = rand(2, 5);
        game.health = clamp(game.health + gain);
        addLog(`You went hiking. +${gain} Health.`, 'health');
      }
    });
  });

  container.appendChild(btn);
}

