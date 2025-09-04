import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

const INSURANCE_PLANS = [
  { level: 1, cost: 100, discount: 0.2, name: 'Basic Insurance' },
  { level: 2, cost: 250, discount: 0.4, name: 'Premium Insurance' }
];

const POSSIBLE_DISEASES = [
  { name: 'Diabetes', chronic: true },
  { name: 'Hypertension', chronic: true },
  { name: 'Asthma', chronic: true },
  { name: 'Infection', chronic: false },
  { name: 'Flu', chronic: false }
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

  const diagnoseCost = doctorCost(80);
  wrap.appendChild(
    mk(`Diagnose Disease ($${diagnoseCost})`, () => {
      const cost = doctorCost(80);
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Doctor visit costs $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        const available = POSSIBLE_DISEASES.filter(
          d => !game.diseases?.some(g => g.name === d.name)
        );
        if (available.length === 0) {
          addLog('No new diseases were found.', 'health');
          return;
        }
        const diag = available[rand(0, available.length - 1)];
        const severity = rand(1, 3);
        game.diseases = game.diseases || [];
        game.diseases.push({ name: diag.name, severity, chronic: diag.chronic });
        addLog(`You were diagnosed with ${diag.name}.`, 'health');
      });
    })
  );

  for (const dis of game.diseases || []) {
    if (dis.chronic) {
      const manageCost = doctorCost(100);
      wrap.appendChild(
        mk(`Manage ${dis.name} (S${dis.severity}) ($${manageCost})`, () => {
          const cost = doctorCost(100);
          if (game.money < cost) {
            applyAndSave(() => {
              addLog(`Doctor visit costs $${cost}. Not enough money.`, 'health');
            });
            return;
          }
          applyAndSave(() => {
            game.money -= cost;
            dis.severity = Math.max(1, dis.severity - rand(1, 2));
            addLog(`You managed your ${dis.name}. (-Severity)`, 'health');
          });
        })
      );
    } else {
      const treatCost = doctorCost(120);
      wrap.appendChild(
        mk(`Treat ${dis.name} (S${dis.severity}) ($${treatCost})`, () => {
          const cost = doctorCost(120);
          if (game.money < cost) {
            applyAndSave(() => {
              addLog(`Doctor visit costs $${cost}. Not enough money.`, 'health');
            });
            return;
          }
          applyAndSave(() => {
            game.money -= cost;
            dis.severity = clamp(dis.severity - rand(3, 6));
            if (dis.severity <= 0) {
              game.diseases = game.diseases.filter(d => d !== dis);
              game.health = clamp(game.health + rand(4, 8));
              addLog(`You recovered from ${dis.name}. (+Health)`, 'health');
            } else {
              addLog(`Treatment reduced severity of ${dis.name}.`, 'health');
            }
          });
        })
      );
    }
  }

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Doctor visits improve health but cost money.';
  wrap.appendChild(note);

  container.appendChild(wrap);
}

