import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

const LICENSE_OPTIONS = [
  { type: "Driver's License", cost: 50 },
  { type: 'Fishing License', cost: 25 },
  { type: 'Hunting License', cost: 80 },
  { type: 'Pilot License', cost: 200 }
];

export function renderLicenses(container) {
  game.licenses = game.licenses || [];
  const wrap = document.createElement('div');

  for (const opt of LICENSE_OPTIONS) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = `${opt.type} - $${opt.cost.toLocaleString()}`;
    btn.disabled = game.money < opt.cost || game.licenses.includes(opt.type);
    btn.addEventListener('click', () => {
      if (game.money < opt.cost || game.licenses.includes(opt.type)) return;
      if (rand(1, 100) > taskChances.licenses.examPass) {
        applyAndSave(() => {
          game.money -= opt.cost;
          addLog(`You failed the ${opt.type} exam.`, 'life');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= opt.cost;
        game.licenses.push(opt.type);
        addLog(`You obtained a ${opt.type}.`, 'life');
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

