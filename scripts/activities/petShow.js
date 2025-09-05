import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';
import { rand, clamp } from '../utils.js';

export { openWindow };

export function renderPetShow(container) {
  const wrap = document.createElement('div');
  const eligible = (game.pets || []).filter(p => p.alive && p.talent >= 50);
  if (!eligible.length) {
    wrap.textContent = 'You have no trained pets ready to compete.';
    container.appendChild(wrap);
    return;
  }
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Trained Pets';
  wrap.appendChild(head);
  for (const pet of eligible) {
    const row = document.createElement('div');
    row.className = 'pet';
    row.textContent = `${pet.breed} ${pet.type} • Talent ${pet.talent}`;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Compete';
    btn.addEventListener('click', () => {
      applyAndSave(() => {
        const prize = rand(200, 500);
        game.money += prize;
        pet.happiness = clamp(pet.happiness + rand(5, 15));
        game.happiness = clamp(game.happiness + rand(2, 5));
        addLog(`Your ${pet.breed} ${pet.type} won $${prize} at the pet show!`, 'pet');
      });
    });
    row.appendChild(btn);
    wrap.appendChild(row);
  }
  container.appendChild(wrap);
}

