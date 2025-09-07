import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand, combineChance } from '../utils.js';
import { taskChances } from '../taskChances.js';

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
              addLog(
                [
                  `Insurance costs $${plan.cost}. Not enough money.`,
                  `Can't afford the $${plan.cost} insurance.`,
                  `$${plan.cost} for insurance is out of reach.`
                ],
                'health'
              );
            });
            return;
          }
          applyAndSave(() => {
            game.money -= plan.cost;
            game.insuranceLevel = plan.level;
            addLog(
              [
                `You purchased ${plan.name}.`,
                `Picked up ${plan.name}.`,
                `Enrolled in ${plan.name}.`
              ],
              'health'
            );
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
          addLog(
            [
              `Doctor visit costs $${cost}. Not enough money.`,
              `$${cost} for the doctor is beyond your means.`,
              `You couldn't afford the $${cost} doctor visit.`
            ],
            'health'
          );
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        game.health = clamp(game.health + rand(2, 6));
        addLog(
          [
            'Routine check-up made you feel better. (+Health)',
            'A check-up boosted your health. (+Health)',
            'The routine check-up improved your well-being. (+Health)'
          ],
          'health'
        );
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
            addLog(
              [
                `Doctor visit costs $${cost}. Not enough money.`,
                `$${cost} for the doctor is beyond your means.`,
                `You couldn't afford the $${cost} doctor visit.`
              ],
              'health'
            );
          });
          return;
        }
        applyAndSave(() => {
          game.money -= cost;
          const chance = combineChance(
            taskChances.doctor.treatIllness,
            game.health,
            game.happiness
          );
          if (rand(1, 100) <= chance) {
            game.sick = false;
            game.health = clamp(game.health + rand(6, 12));
            addLog(
              [
                'The doctor treated your illness. (+Health)',
                'Treatment cured your illness. (+Health)',
                'Your illness was successfully treated. (+Health)'
              ],
              'health'
            );
          } else {
            addLog(
              [
                'The treatment was unsuccessful.',
                'The procedure failed to help.',
                'The doctor could not cure you.'
              ],
              'health'
            );
          }
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
          addLog(
            [
              `Doctor visit costs $${cost}. Not enough money.`,
              `$${cost} for the doctor is beyond your means.`,
              `You couldn't afford the $${cost} doctor visit.`
            ],
            'health'
          );
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        const available = POSSIBLE_DISEASES.filter(
          d => !game.diseases?.some(g => g.name === d.name)
        );
        if (available.length === 0) {
          addLog(
            [
              'No new diseases were found.',
              'Doctor found nothing new.',
              'No additional illnesses were detected.'
            ],
            'health'
          );
          return;
        }
        const chance = combineChance(
          taskChances.doctor.diagnoseDisease,
          game.smarts,
          game.health
        );
        if (rand(1, 100) > chance) {
          addLog(
            [
              'The doctor could not diagnose your condition.',
              'The doctor was stumped by your symptoms.',
              'No diagnosis could be made.'
            ],
            'health'
          );
          return;
        }
        const diag = available[rand(0, available.length - 1)];
        const severity = rand(1, 3);
        game.diseases = game.diseases || [];
        game.diseases.push({ name: diag.name, severity, chronic: diag.chronic });
        addLog(
          [
            `You were diagnosed with ${diag.name}.`,
            `${diag.name} was identified as the issue.`,
            `The doctor diagnosed you with ${diag.name}.`
          ],
          'health'
        );
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
            addLog(
              [
                `Doctor visit costs $${cost}. Not enough money.`,
                `$${cost} for the doctor is beyond your means.`,
                `You couldn't afford the $${cost} doctor visit.`
              ],
              'health'
            );
            });
            return;
          }
          applyAndSave(() => {
            game.money -= cost;
            dis.severity = Math.max(1, dis.severity - rand(1, 2));
            addLog(
              [
                `You managed your ${dis.name}. (-Severity)`,
                `Treatment helped control your ${dis.name}. (-Severity)`,
                `You kept your ${dis.name} in check. (-Severity)`
              ],
              'health'
            );
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
            addLog(
              [
                `Doctor visit costs $${cost}. Not enough money.`,
                `$${cost} for the doctor is beyond your means.`,
                `You couldn't afford the $${cost} doctor visit.`
              ],
              'health'
            );
            });
            return;
          }
          applyAndSave(() => {
            game.money -= cost;
            dis.severity = clamp(dis.severity - rand(3, 6));
            if (dis.severity <= 0) {
              game.diseases = game.diseases.filter(d => d !== dis);
              game.health = clamp(game.health + rand(4, 8));
              addLog(
                [
                  `You recovered from ${dis.name}. (+Health)`,
                  `${dis.name} is gone. (+Health)`,
                  `You beat ${dis.name}. (+Health)`
                ],
                'health'
              );
            } else {
              addLog(
                [
                  `Treatment reduced severity of ${dis.name}.`,
                  `${dis.name} became less severe.`,
                  `Therapy eased the effects of ${dis.name}.`
                ],
                'health'
              );
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

