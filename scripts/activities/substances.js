import { game, addLog, applyAndSave, die } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderSubstances(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent =
    'Indulge in alcohol or drugs. Increases addiction and may harm health.';
  container.appendChild(head);

  const mk = (text, fn) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = text;
    b.addEventListener('click', fn);
    return b;
  };

  container.appendChild(
    mk('Drink Alcohol ($20)', () => {
      const cost = 20;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Drinks cost $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        if (rand(1, 100) <= taskChances.substances.alcoholHospitalized) {
          game.health = clamp(game.health - rand(10, 20));
          addLog('You drank too much and needed hospitalization. (-Health)', 'health');
          return;
        }
        game.health = clamp(game.health - rand(1, 3));
        game.alcoholAddiction = clamp(game.alcoholAddiction + rand(1, 4));
        addLog('You went drinking. (-Health, +Alcohol Addiction)', 'health');
      });
    })
  );

  container.appendChild(
    mk('Use Drugs ($100)', () => {
      const cost = 100;
      if (game.money < cost) {
        applyAndSave(() => {
          addLog(`Drugs cost $${cost}. Not enough money.`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= cost;
        if (rand(1, 100) <= taskChances.substances.drugOverdose) {
          addLog('You overdosed on drugs.', 'health');
          die('A drug overdose.');
          return;
        }
        game.health = clamp(game.health - rand(2, 6));
        game.drugAddiction = clamp(game.drugAddiction + rand(2, 6));
        addLog('You used drugs. (-Health, +Drug Addiction)', 'health');
      });
    })
  );
}

