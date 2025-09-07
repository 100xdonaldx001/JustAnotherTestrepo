import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

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

  function mkSection(title, key, label) {
    const head = document.createElement('div');
    head.className = 'muted';
    head.style.margin = '8px 0 4px';
    head.textContent = title;
    wrap.appendChild(head);

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
          if (rand(1, 100) <= taskChances.rehab.therapySuccess) {
            game.health = clamp(game.health + rand(1, 3));
            game[key] = clamp(game[key] - rand(2, 5));
            addLog(`Therapy session helped you recover. (+Health, -${label})`, 'health');
          } else {
            addLog('The therapy session had no effect.', 'health');
          }
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
          game[key] = clamp(game[key] - rand(5, 15));
          addLog(`You completed a detox program. (+Health, -${label})`, 'health');
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
          game[key] = clamp(game[key] - rand(15, 30));
          addLog(
            `Intensive rehab significantly reduced your addiction. (+Health, -${label})`,
            'health'
          );
        });
      })
    );
  }

  mkSection('Alcohol Rehab', 'alcoholAddiction', 'Alcohol Addiction');
  mkSection('Drug Rehab', 'drugAddiction', 'Drug Addiction');

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Rehab helps reduce addiction but costs money.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

