import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';

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
      applyAndSave(() => {
        addLog('Filing a lawsuit costs $5,000. Not enough money.', 'legal');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) <= taskChances.lawsuit.fileWin) {
        const award = 25000;
        game.money += award;
        game.happiness = clamp(game.happiness + 5);
        addLog(`You won the lawsuit and received $${award.toLocaleString()}.`, 'legal');
      } else {
        game.happiness = clamp(game.happiness - 5);
        addLog('You lost the lawsuit. The court dismissed your case.', 'legal');
      }
    });
  });
  wrap.appendChild(fileBtn);

  const defendBtn = document.createElement('button');
  defendBtn.className = 'btn block';
  defendBtn.textContent = 'Defend a Lawsuit ($3,000)';
  defendBtn.addEventListener('click', () => {
    const cost = 3000;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('Defending a lawsuit costs $3,000. Not enough money.', 'legal');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) <= taskChances.lawsuit.defendWin) {
        game.happiness = clamp(game.happiness + 2);
        addLog('You successfully defended the lawsuit.', 'legal');
      } else {
        const damages = 10000;
        game.money -= damages;
        game.happiness = clamp(game.happiness - 8);
        addLog(`You lost the lawsuit and paid $${damages.toLocaleString()} in damages.`, 'legal');
      }
    });
  });
  wrap.appendChild(defendBtn);

  container.appendChild(wrap);
}

