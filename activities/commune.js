import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

const EVENTS = [
  {
    name: 'Share Communal Meal ($20)',
    cost: 20,
    run() {
      const gain = rand(5, 12);
      game.happiness = clamp(game.happiness + gain);
      addLog(`You shared a communal meal. +${gain} Happiness.`);
    }
  },
  {
    name: 'Garden Chores',
    cost: 0,
    run() {
      const healthGain = rand(2, 5);
      const happinessLoss = rand(0, 3);
      game.health = clamp(game.health + healthGain);
      game.happiness = clamp(game.happiness - happinessLoss);
      let msg = `You helped with garden chores. +${healthGain} Health`;
      if (happinessLoss) msg += `, -${happinessLoss} Happiness`;
      addLog(msg + '.');
    }
  },
  {
    name: 'Group Meditation',
    cost: 0,
    run() {
      const gain = rand(4, 8);
      game.happiness = clamp(game.happiness + gain);
      addLog(`You meditated with the group. +${gain} Happiness.`);
    }
  }
];

export function renderCommune(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Connect with your community and share responsibilities.';
  container.appendChild(head);

  for (const ev of EVENTS) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = ev.name;
    btn.addEventListener('click', () => {
      if (ev.cost && game.money < ev.cost) {
        applyAndSave(() => {
          addLog(`${ev.name} costs $${ev.cost}. Not enough money.`);
        });
        return;
      }
      applyAndSave(() => {
        if (ev.cost) game.money -= ev.cost;
        ev.run();
      });
    });
    container.appendChild(btn);
  }
}

