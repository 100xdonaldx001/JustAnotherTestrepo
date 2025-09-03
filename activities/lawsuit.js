import { game, addLog, saveGame } from '../state.js';
import { rand, clamp } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';

export function renderLawsuit(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Handle legal disputes by filing or defending a lawsuit.';
  wrap.appendChild(head);

  const fileBtn = document.createElement('button');
  fileBtn.className = 'btn block';
  fileBtn.textContent = 'File a Lawsuit ($5,000)';
  fileBtn.addEventListener('click', () => {
    const cost = 5000;
    if (game.money < cost) {
      addLog('Filing a lawsuit costs $5,000. Not enough money.');
      refreshOpenWindows();
      saveGame();
      return;
    }
    game.money -= cost;
    if (rand(0, 1) === 1) {
      const award = 25000;
      game.money += award;
      game.happiness = clamp(game.happiness + 5);
      addLog(`You won the lawsuit and received $${award.toLocaleString()}.`);
    } else {
      game.happiness = clamp(game.happiness - 5);
      addLog('You lost the lawsuit. The court dismissed your case.');
    }
    refreshOpenWindows();
    saveGame();
  });
  wrap.appendChild(fileBtn);

  const defendBtn = document.createElement('button');
  defendBtn.className = 'btn block';
  defendBtn.textContent = 'Defend a Lawsuit ($3,000)';
  defendBtn.addEventListener('click', () => {
    const cost = 3000;
    if (game.money < cost) {
      addLog('Defending a lawsuit costs $3,000. Not enough money.');
      refreshOpenWindows();
      saveGame();
      return;
    }
    game.money -= cost;
    if (rand(0, 1) === 1) {
      game.happiness = clamp(game.happiness + 2);
      addLog('You successfully defended the lawsuit.');
    } else {
      const damages = 10000;
      game.money -= damages;
      game.happiness = clamp(game.happiness - 8);
      addLog(`You lost the lawsuit and paid $${damages.toLocaleString()} in damages.`);
    }
    refreshOpenWindows();
    saveGame();
  });
  wrap.appendChild(defendBtn);

  container.appendChild(wrap);
}

