import { game, addLog, saveGame } from '../state.js';
import { rand, clamp } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';

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
      addLog('Contraband costs $100. Not enough money.');
      refreshOpenWindows();
      saveGame();
      return;
    }

    game.money -= cost;
    if (rand(1, 100) <= 30) {
      if (rand(1, 100) <= 50) {
        const fine = 200;
        game.money = Math.max(0, game.money - fine);
        addLog(`You were caught with contraband and fined $${fine}.`);
        result.textContent = `Penalty: Fined $${fine}`;
      } else {
        game.inJail = true;
        game.jailYears = rand(1, 3);
        addLog(`You were jailed for contraband for ${game.jailYears} year(s).`);
        result.textContent = `Penalty: Jailed for ${game.jailYears} year(s)`;
      }
    } else {
      const gain = rand(3, 6);
      game.happiness = clamp(game.happiness + gain);
      addLog(`Contraband acquired. +${gain} Happiness.`);
      result.textContent = `Success: +${gain} Happiness`;
    }
    refreshOpenWindows();
    saveGame();
  });

  wrap.appendChild(btn);
  wrap.appendChild(result);
  container.appendChild(wrap);
}

