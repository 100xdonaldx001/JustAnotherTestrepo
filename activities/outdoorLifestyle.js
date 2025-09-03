import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

export function renderOutdoorLifestyle(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Enjoy nature to boost your well-being.';
  wrap.appendChild(head);

  const options = [
    { label: 'Go Hiking', cost: 0, health: [2, 5], happiness: [1, 3], log: 'went hiking' },
    {
      label: 'Go Camping ($100)',
      cost: 100,
      health: [1, 4],
      happiness: [4, 8],
      log: 'went camping'
    }
  ];

  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = opt.label;
    if (opt.cost && game.money < opt.cost) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (opt.cost && game.money < opt.cost) return;
      applyAndSave(() => {
        if (opt.cost) game.money -= opt.cost;
        const healthGain = rand(opt.health[0], opt.health[1]);
        const happinessGain = rand(opt.happiness[0], opt.happiness[1]);
        game.health = clamp(game.health + healthGain);
        game.happiness = clamp(game.happiness + happinessGain);
        addLog(`You ${opt.log}. +${healthGain} Health, +${happinessGain} Happiness.`);
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

