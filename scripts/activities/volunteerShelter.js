import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

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
    if (rand(1, 100) > taskChances.volunteerShelter.accepted) {
      applyAndSave(() => {
        addLog('The shelter had enough volunteers today.', 'pet');
      });
      return;
    }
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

