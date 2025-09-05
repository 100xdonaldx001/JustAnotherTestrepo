import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';
import { getFaker } from '../utils/faker.js';

const faker = await getFaker();

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
      applyAndSave(() => {
        game.money -= opt.cost;
        const name = faker.person.firstName();
        const child = { name, age: opt.age, happiness: opt.happiness };
        if (!game.children) game.children = [];
        game.children.push(child);
        addLog(`You adopted ${name}.`, 'family');
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

