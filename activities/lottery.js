import { game, addLog } from '../state.js';
import { rand, clamp } from '../utils.js';
import { openWindow, refreshOpenWindows } from '../windowManager.js';

export { openWindow };

export function renderLottery(container) {
  const wrap = document.createElement('div');
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Buy Ticket ($5)';
  btn.disabled = game.money < 5;
  btn.addEventListener('click', () => {
    if (game.money < 5) return;
    game.money -= 5;
    const roll = rand(1, 100);
    let prize = 0;
    let mood = -2;
    let msg = 'You bought a lottery ticket but won nothing.';
    if (roll === 1) {
      prize = 10000;
      mood = 20;
      msg = `Jackpot! You won $${prize.toLocaleString()}.`;
    } else if (roll <= 5) {
      prize = 1000;
      mood = 8;
      msg = `You won $${prize.toLocaleString()}.`;
    } else if (roll <= 20) {
      prize = 100;
      mood = 3;
      msg = `You won $${prize}.`;
    }
    game.money += prize;
    game.happiness = clamp(game.happiness + mood);
    addLog(msg);
    refreshOpenWindows();
  });
  wrap.appendChild(btn);
  container.appendChild(wrap);
}

