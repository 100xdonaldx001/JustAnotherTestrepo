import { game, addLog, saveGame } from '../state.js';
import { clamp, rand } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';

const GOODS = [
  { name: 'Gourmet Chocolate', cost: 30, happiness: 4 },
  { name: 'Designer Shoes', cost: 120, happiness: 8 },
  { name: 'Scratch-off Ticket', cost: 5, money: () => rand(0, 50) }
];

export function renderShopping(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Retail therapy for better vibes.';
  wrap.appendChild(head);

  for (const item of GOODS) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `${item.name} ($${item.cost})`;
    btn.disabled = game.money < item.cost;
    btn.addEventListener('click', () => {
      if (game.money < item.cost) {
        addLog(`You cannot afford ${item.name}.`);
        refreshOpenWindows();
        saveGame();
        return;
      }
      game.money -= item.cost;
      let log = `You bought ${item.name}.`;
      if (item.happiness) {
        game.happiness = clamp(game.happiness + item.happiness);
        log += ` +${item.happiness} Happiness.`;
      }
      if (item.money) {
        const gain = typeof item.money === 'function' ? item.money() : item.money;
        game.money += gain;
        log += ` +$${gain}.`;
      }
      addLog(log);
      refreshOpenWindows();
      saveGame();
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}
