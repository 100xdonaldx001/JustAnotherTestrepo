import { game, addLog, saveGame } from '../state.js';
import { clamp, rand } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';

export function renderSalonAndSpa(container) {
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
    mk('Haircut ($40)', () => {
      const cost = 40;
      if (game.money < cost) {
        addLog(`Haircut costs $${cost}. Not enough money.`);
        saveGame();
        return;
      }
      game.money -= cost;
      game.happiness = clamp(game.happiness + rand(1, 4));
      game.looks = clamp(game.looks + rand(1, 3));
      addLog('You got a fresh haircut. (+Happiness, +Looks)');
      refreshOpenWindows();
      saveGame();
    })
  );

  wrap.appendChild(
    mk('Massage ($80)', () => {
      const cost = 80;
      if (game.money < cost) {
        addLog(`Massage costs $${cost}. Not enough money.`);
        saveGame();
        return;
      }
      game.money -= cost;
      game.health = clamp(game.health + rand(2, 6));
      game.happiness = clamp(game.happiness + rand(2, 5));
      addLog('The massage relaxed you. (+Health, +Happiness)');
      refreshOpenWindows();
      saveGame();
    })
  );

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Self-care improves health, looks, and happiness but costs money.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

