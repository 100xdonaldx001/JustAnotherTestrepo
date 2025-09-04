import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { openWindow } from '../windowManager.js';

export { openWindow };

export function renderGamble(container) {
  const wrap = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.value = '10';
  input.style.width = '80px';

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Bet';

  const result = document.createElement('div');
  result.className = 'muted';

  btn.addEventListener('click', () => {
    const bet = Math.floor(Number(input.value));
    if (bet <= 0) return;
    if (game.money < bet) {
      applyAndSave(() => {
        addLog('Not enough money to bet.', 'gambling');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= bet;
      const chance = Math.min(50 + game.skills.gambling, 90);
      if (rand(1, 100) <= chance) {
        const payout = bet * 2;
        game.money += payout;
        addLog(`You won $${payout}.`, 'gambling');
        result.textContent = `Result: Won $${payout}`;
      } else {
        addLog(`You lost $${bet}.`, 'gambling');
        result.textContent = 'Result: Loss';
      }
      game.skills.gambling += 1;
    });
  });

  wrap.appendChild(input);
  wrap.appendChild(btn);
  wrap.appendChild(result);
  container.appendChild(wrap);
}

