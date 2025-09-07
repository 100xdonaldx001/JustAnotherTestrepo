import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderPrison(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  const mk = (text, fn) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = text;
    b.addEventListener('click', fn);
    return b;
  };

  wrap.appendChild(
    mk('Exercise in Yard', () => {
      applyAndSave(() => {
        if (!game.inJail) {
          addLog('You are not in jail.', 'crime');
          return;
        }
        if (rand(1, 100) > taskChances.prison.exercisePermit) {
          addLog('Guards denied your yard time.', 'crime');
          return;
        }
        const health = rand(1, 3);
        const happy = rand(0, 2);
        game.health = clamp(game.health + health);
        game.happiness = clamp(game.happiness + happy);
        addLog(
          `You exercised in the yard. +${health} Health${happy ? `, +${happy} Happiness` : ''}.`,
          'crime'
        );
      });
    })
  );

  wrap.appendChild(
    mk('Study in Cell', () => {
      applyAndSave(() => {
        if (!game.inJail) {
          addLog('You are not in jail.', 'crime');
          return;
        }
        const smarts = rand(1, 4);
        game.smarts = clamp(game.smarts + smarts);
        addLog(`You studied in your cell. +${smarts} Smarts.`, 'crime');
      });
    })
  );

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Limited options while incarcerated.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

