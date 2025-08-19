import { game, addLog } from '../state.js';
import { openWindow, refreshOpenWindows } from '../windowManager.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';

export { openWindow };

const OPTIONS = [
  { label: 'Adopt a Baby', cost: 20000, age: 0, happiness: 90 },
  { label: 'Adopt a Child', cost: 15000, age: 5, happiness: 80 },
  { label: 'Adopt a Teen', cost: 5000, age: 15, happiness: 70 }
];

export function renderAdoption(container) {
  const wrap = document.createElement('div');

  for (const opt of OPTIONS) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = `${opt.label} - $${opt.cost.toLocaleString()}`;
    if (game.money < opt.cost) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (game.money < opt.cost) return;
      game.money -= opt.cost;
      const name = faker.person.firstName();
      const child = { name, age: opt.age, happiness: opt.happiness };
      if (!game.children) game.children = [];
      game.children.push(child);
      addLog(`You adopted ${name}.`);
      refreshOpenWindows();
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

