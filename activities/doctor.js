import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

const INSURANCE_PLANS = [
  { level: 1, cost: 100, discount: 0.2, name: 'Basic Insurance' },
  { level: 2, cost: 250, discount: 0.4, name: 'Premium Insurance' }
];

function doctorCost(base) {
  const plan = INSURANCE_PLANS.find(p => p.level === game.insuranceLevel);
  return plan ? Math.ceil(base * (1 - plan.discount)) : base;
}

export function renderDoctor(container) {
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

  for (const plan of INSURANCE_PLANS) {
    wrap.appendChild(
      mk(
        `${plan.name} ($${plan.cost})`,
        () => {
          if (game.money < plan.cost) {
            applyAndSave(() => {
              addLog(`Insurance costs $${plan.cost}. Not enough money.`, 'health');
            });
            return;
          }
          applyAndSave(() => {
            game.money -= plan.cost;
            game.insuranceLevel = plan.level;
            addLog(`You purchased ${plan.name}.`, 'health');
          });
        },
        game.insuranceLevel >= plan.level
      )
    );
  }

  const checkupCost = doctorCost(60);
  wrap.appendChild(
    mk(`Routine Check-Up ($${checkupCost})`, () => {
      const cost = doctorCost(60);
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Doctor visit costs $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.health = clamp(game.health + rand(2, 6));
        addLog('Routine check-up made you feel better. (+Health)', 'health');
      });
    })
  );

  const illnessCost = doctorCost(120);
  wrap.appendChild(
    mk(
      `Treat Illness ($${illnessCost})`,
      () => {
        const cost = doctorCost(120);
        if (game.money < cost) {
          applyAndSave(() => {
            addLog(`Doctor visit costs $${cost}. Not enough money.`, 'health');
          });
          return;
        }
        applyAndSave(() => {
          game.money -= cost;
          game.sick = false;
          game.health = clamp(game.health + rand(6, 12));
          addLog('The doctor treated your illness. (+Health)', 'health');
        });
      },
      !game.sick
    )
  );

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Doctor visits improve health but cost money.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

