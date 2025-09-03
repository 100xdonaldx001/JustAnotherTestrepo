import { game, addLog, saveGame } from '../state.js';
import { rand } from '../utils.js';
import { refreshOpenWindows, openWindow } from '../windowManager.js';

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
      addLog('Not enough money to bet.');
      refreshOpenWindows();
      saveGame();
      return;
    }
    game.money -= bet;
    if (rand(0, 1) === 1) {
      const payout = bet * 2;
      game.money += payout;
      addLog(`You won $${payout}.`);
      result.textContent = `Result: Won $${payout}`;
    } else {
      addLog(`You lost $${bet}.`);
      result.textContent = 'Result: Loss';
    }
    refreshOpenWindows();
    saveGame();
  });

  wrap.appendChild(input);
  wrap.appendChild(btn);
  wrap.appendChild(result);
  container.appendChild(wrap);
}

