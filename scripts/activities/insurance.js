import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderInsurance(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Buy Disaster Insurance ($200)';
  btn.disabled = game.disasterInsurance;
  btn.addEventListener('click', () => {
    if (game.money < 200) {
      applyAndSave(() => {
        addLog('Disaster insurance costs $200. Not enough money.', 'finance');
      });
      return;
    }
    if (rand(1, 100) > taskChances.insurance.purchaseSuccess) {
      applyAndSave(() => {
        addLog('The insurer denied your application.', 'finance');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= 200;
      game.disasterInsurance = true;
      addLog('You purchased disaster insurance.', 'finance');
    });
  });
  wrap.appendChild(btn);

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Disaster insurance reduces earthquake and flood damage.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

