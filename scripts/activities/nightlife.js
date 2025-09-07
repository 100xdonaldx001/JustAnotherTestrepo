import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderNightlife(container) {
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
    mk('Go Clubbing ($20)', () => {
      const cost = 20;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog('Not enough money to go clubbing.', 'leisure');
        });
        return;
      }
      if (rand(1, 100) > taskChances.nightlife.entry) {
        applyAndSave(() => {
          addLog('The bouncer refused you entry.', 'leisure');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.happiness = clamp(game.happiness + rand(4, 8));
        game.health = clamp(game.health - rand(0, 4));
        addLog('You danced the night away at the club.', 'leisure');
      });
    })
  );

  wrap.appendChild(
    mk('Bar Hopping ($15)', () => {
      const cost = 15;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog('Not enough money to go bar hopping.', 'leisure');
        });
        return;
      }
      if (rand(1, 100) > taskChances.nightlife.entry) {
        applyAndSave(() => {
          addLog('The bar was at capacity and turned you away.', 'leisure');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.happiness = clamp(game.happiness + rand(2, 6));
        game.health = clamp(game.health - rand(0, 3));
        addLog('You enjoyed a night of bar hopping.', 'leisure');
      });
    })
  );

  container.appendChild(wrap);
}

