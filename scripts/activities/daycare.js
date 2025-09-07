import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

const WEEKLY_FEE_PER_CHILD = 200;

export function renderDaycare(container) {
  game.children = game.children || [];
  const wrap = document.createElement('div');

  const cost = WEEKLY_FEE_PER_CHILD * game.children.length;

  const btn = document.createElement('button');
  btn.className = 'btn block';
  btn.textContent = `Pay Daycare ($${cost}/week)`;
  btn.disabled = game.money < cost;

  btn.addEventListener('click', () => {
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('You cannot afford daycare.', 'family');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) > taskChances.daycare.reliable) {
        addLog('Daycare was unexpectedly closed.', 'job');
        return;
      }
      game.jobPerformance = clamp(game.jobPerformance + 5);
      addLog('Daycare helped you focus at work. (+Performance)', 'job');
    });
  });

  wrap.appendChild(btn);

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Reliable daycare boosts job performance.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

