import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';

export { openWindow };

export function renderVolunteerShelter(container) {
  const wrap = document.createElement('div');

  const info = document.createElement('div');
  info.className = 'muted';
  info.textContent = 'Spend time helping out at the animal shelter.';
  wrap.appendChild(info);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = game.volunteeredShelter ? 'Volunteered' : 'Volunteer';
  btn.disabled = !!game.volunteeredShelter;
  btn.addEventListener('click', () => {
    applyAndSave(() => {
      game.volunteeredShelter = true;
      addLog('You volunteered at the animal shelter.', 'pet');
    });
    btn.disabled = true;
    btn.textContent = 'Volunteered';
  });
  wrap.appendChild(btn);

  container.appendChild(wrap);
}

