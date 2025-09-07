import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

const PLANS = [
  { name: 'Basic Plan', premium: 200, coverage: 0.5 },
  { name: 'Premium Plan', premium: 500, coverage: 0.8 }
];

export function renderHealth(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  const mkBtn = plan => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = `${plan.name} ($${plan.premium}, ${Math.round(plan.coverage * 100)}% coverage)`;
    b.disabled = game.insurancePlan && game.insurancePlan.name === plan.name;
    b.addEventListener('click', () => {
      if (game.money < plan.premium) {
        applyAndSave(() => {
          addLog(`Insurance plan costs $${plan.premium}. Not enough money.`, 'health');
        });
        return;
      }
      if (rand(1, 100) > taskChances.health.planApproval) {
        applyAndSave(() => {
          addLog('The insurer denied your application.', 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= plan.premium;
        game.insurancePlan = plan;
        addLog(`You purchased ${plan.name}.`, 'health');
      });
    });
    return b;
  };

  for (const plan of PLANS) {
    wrap.appendChild(mkBtn(plan));
  }

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Insurance reduces hospitalization bills.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

