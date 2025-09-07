import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { openWindow as windowOpen } from '../windowManager.js';
import { taskChances } from '../taskChances.js';

export { windowOpen as openWindow };

export function renderCasino(container) {
  const wrap = document.createElement('div');
  const result = document.createElement('div');
  result.className = 'muted';

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Play Slots ($10)';
  btn.addEventListener('click', () => {
    const bet = 10;
    if (game.money < bet) {
      applyAndSave(() => {
        addLog('Not enough money to gamble.', 'gambling');
      });
      return;
    }
    if (rand(1, 100) > taskChances.casino.machineWorking) {
      applyAndSave(() => {
        addLog('The slot machine is out of order.', 'gambling');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= bet;
      const reels = [rand(0, 2), rand(0, 2), rand(0, 2)];
      const allSame = reels[0] === reels[1] && reels[1] === reels[2];
      const pair = !allSame &&
        (reels[0] === reels[1] || reels[0] === reels[2] || reels[1] === reels[2]);
      let win = 0;
      if (allSame) win = bet * 5;
      else if (pair) win = bet * 2;
      if (win > 0) {
        game.money += win;
        game.happiness = clamp(game.happiness + 4);
        addLog(`Slots win! You earned $${win}.`, 'gambling');
        result.textContent = `Result: ${reels.join(' ')} - Won $${win}`;
      } else {
        game.happiness = clamp(game.happiness - 2);
        addLog('Slots loss. Better luck next time.', 'gambling');
        result.textContent = `Result: ${reels.join(' ')} - Loss`;
      }
    });
  });

  wrap.appendChild(btn);
  wrap.appendChild(result);
  container.appendChild(wrap);
}
