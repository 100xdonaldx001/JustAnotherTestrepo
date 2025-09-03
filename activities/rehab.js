import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

export function renderRehab(container) {
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
    mk('Therapy Session ($200)', () => {
      const cost = 200;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Therapy session costs $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.health = clamp(game.health + rand(1, 3));
        game.addiction = clamp(game.addiction - rand(2, 5));
        addLog('Therapy session helped you recover. (+Health, -Addiction)', 'health');
      });
    })
  );

  wrap.appendChild(
    mk('Detox Program ($500)', () => {
      const cost = 500;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Detox program costs $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.health = clamp(game.health + rand(4, 8));
        game.addiction = clamp(game.addiction - rand(5, 15));
        addLog('You completed a detox program. (+Health, -Addiction)', 'health');
      });
    })
  );

  wrap.appendChild(
    mk('Intensive Rehab ($1000)', () => {
      const cost = 1000;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Intensive rehab costs $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.health = clamp(game.health + rand(8, 15));
        game.addiction = clamp(game.addiction - rand(15, 30));
        addLog('Intensive rehab significantly reduced your addiction. (+Health, -Addiction)', 'health');
      });
    })
  );

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Rehab helps reduce addiction but costs money.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

