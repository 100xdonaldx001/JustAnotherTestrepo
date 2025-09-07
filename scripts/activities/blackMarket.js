import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderBlackMarket(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Buy illicit goods with a chance of getting caught.';
  wrap.appendChild(head);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Buy Contraband ($100)';

  const result = document.createElement('div');
  result.className = 'muted';

  btn.addEventListener('click', () => {
    const cost = 100;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('Contraband costs $100. Not enough money.', 'crime');
      });
      return;
    }

    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) <= taskChances.blackMarket.caught) {
        if (rand(1, 100) <= taskChances.blackMarket.fine) {
          const fine = 200;
          game.money = Math.max(0, game.money - fine);
          addLog(`You were caught with contraband and fined $${fine}.`, 'crime');
          result.textContent = `Penalty: Fined $${fine}`;
        } else {
          game.inJail = true;
          game.jailYears = rand(1, 3);
          addLog(`You were jailed for contraband for ${game.jailYears} year(s).`, 'crime');
          result.textContent = `Penalty: Jailed for ${game.jailYears} year(s)`;
        }
      } else {
        const gain = rand(3, 6);
        game.happiness = clamp(game.happiness + gain);
        addLog(`Contraband acquired. +${gain} Happiness.`, 'crime');
        result.textContent = `Success: +${gain} Happiness`;
      }
    });
  });

  wrap.appendChild(btn);
  wrap.appendChild(result);
  container.appendChild(wrap);
}

