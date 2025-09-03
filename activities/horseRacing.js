import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { openWindow } from '../windowManager.js';

export { openWindow };

const HORSES = [
  { name: 'Thunderbolt', odds: 2, weight: 50 },
  { name: 'Midnight Dream', odds: 3, weight: 30 },
  { name: 'Golden Hoof', odds: 5, weight: 20 }
];

export function renderHorseRacing(container) {
  const wrap = document.createElement('div');

  const select = document.createElement('select');
  HORSES.forEach((h, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${h.name} (x${h.odds})`;
    select.appendChild(opt);
  });
  wrap.appendChild(select);

  const betInput = document.createElement('input');
  betInput.type = 'number';
  betInput.min = '1';
  betInput.value = '10';
  betInput.style.margin = '0 8px';
  wrap.appendChild(betInput);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Bet';
  wrap.appendChild(btn);

  const result = document.createElement('div');
  result.className = 'muted';
  result.style.marginTop = '8px';
  wrap.appendChild(result);

  btn.addEventListener('click', () => {
    const bet = Math.max(1, parseInt(betInput.value, 10) || 0);
    if (game.money < bet) {
      applyAndSave(() => {
        addLog('Not enough money to bet on horse racing.');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= bet;
      const choice = HORSES[parseInt(select.value, 10)];
      const total = HORSES.reduce((s, h) => s + h.weight, 0);
      let roll = rand(1, total);
      let winner = HORSES[0];
      for (const h of HORSES) {
        if ((roll -= h.weight) <= 0) {
          winner = h;
          break;
        }
      }
      if (winner === choice) {
        const payout = bet * choice.odds;
        game.money += payout;
        game.happiness = clamp(game.happiness + 4);
        addLog(`${choice.name} won! You earned $${payout}.`);
        result.textContent = `Winner: ${winner.name} — You won $${payout}`;
      } else {
        game.happiness = clamp(game.happiness - 2);
        addLog(`${choice.name} lost the race.`);
        result.textContent = `Winner: ${winner.name} — You lost $${bet}`;
      }
    });
  });

  container.appendChild(wrap);
}

