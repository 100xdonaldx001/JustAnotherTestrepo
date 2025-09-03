import { game, addLog, saveGame } from '../state.js';
import { clamp, rand } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';

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
      const gain = rand(2, 5);
      game.happiness = clamp(game.happiness + gain);
      addLog(`You meditated. +${gain} Happiness.`);
      refreshOpenWindows();
      saveGame();
    })
  );

  wrap.appendChild(
    mk('Productivity Course ($100)', () => {
      const cost = 100;
      if (game.money < cost) {
        addLog(`Course costs $${cost}. Not enough money.`);
        saveGame();
        return;
      }
      game.money -= cost;
      const gain = rand(4, 8);
      game.smarts = clamp(game.smarts + gain);
      addLog(`You took a productivity course. +${gain} Smarts.`);
      refreshOpenWindows();
      saveGame();
    })
  );

  container.appendChild(wrap);
}

