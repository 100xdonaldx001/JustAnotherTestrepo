import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

export function renderDoctor(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  const mk = (text, fn, disabled = false) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = text;
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  };

  wrap.appendChild(
    mk('Routine Check-Up ($60)', () => {
      const cost = 60;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Doctor visit costs $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.health = clamp(game.health + rand(2, 6));
        addLog('Routine check-up made you feel better. (+Health)', 'health');
      });
    })
  );

  wrap.appendChild(
    mk(
      'Treat Illness ($120)',
      () => {
        const cost = 120;
        if (game.money < cost) {
          applyAndSave(() => {
            addLog(`Doctor visit costs $${cost}. Not enough money.`, 'health');
          });
          return;
        }
        applyAndSave(() => {
          game.money -= cost;
          game.sick = false;
          game.health = clamp(game.health + rand(6, 12));
          addLog('The doctor treated your illness. (+Health)', 'health');
        });
      },
      !game.sick
    )
  );

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Doctor visits improve health but cost money.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

