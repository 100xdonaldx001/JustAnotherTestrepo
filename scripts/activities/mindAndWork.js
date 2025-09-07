import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderMindAndWork(container) {
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
    mk('Meditate', () => {
      applyAndSave(() => {
        if (rand(1, 100) > taskChances.mindAndWork.meditationSuccess) {
          addLog('You were too distracted to meditate.', 'health');
          return;
        }
        const gain = rand(2, 5);
        game.happiness = clamp(game.happiness + gain);
        addLog(`You meditated. +${gain} Happiness.`, 'health');
      });
    })
  );

  wrap.appendChild(
    mk('Productivity Course ($100)', () => {
      const cost = 100;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Course costs $${cost}. Not enough money.`, 'education');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        const gain = rand(4, 8);
        game.smarts = clamp(game.smarts + gain);
        addLog(`You took a productivity course. +${gain} Smarts.`, 'education');
      });
    })
  );

  container.appendChild(wrap);
}

