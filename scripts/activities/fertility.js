import { game, addLog, applyAndSave } from '../state.js';
import { getFaker } from '../utils/faker.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

const faker = await getFaker();

const TREATMENTS = [
  { label: 'Intrauterine Insemination', cost: 3000, key: 'iui' },
  { label: 'In Vitro Fertilization', cost: 15000, key: 'ivf' },
  { label: 'Surrogacy', cost: 60000, key: 'surrogacy' }
];

export function renderFertility(container) {
  const wrap = document.createElement('div');

  for (const t of TREATMENTS) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = `${t.label} - $${t.cost.toLocaleString()} (${taskChances.fertility[t.key]}% success)`;
    if (game.money < t.cost) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (game.money < t.cost) return;
      applyAndSave(() => {
        game.money -= t.cost;
        if (rand(1, 100) <= taskChances.fertility[t.key]) {
          const name = faker.person.firstName();
          const child = { name, age: 0, happiness: 90 };
          if (!game.children) game.children = [];
          game.children.push(child);
          addLog(`Fertility treatment succeeded! You welcomed ${name}.`, 'family');
        } else {
          addLog('Fertility treatment failed.', 'family');
        }
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

