import { game, addLog, saveGame } from '../state.js';
import { refreshOpenWindows } from '../windowManager.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';

const TREATMENTS = [
  { label: 'Intrauterine Insemination', cost: 3000, success: 0.25 },
  { label: 'In Vitro Fertilization', cost: 15000, success: 0.4 },
  { label: 'Surrogacy', cost: 60000, success: 0.9 }
];

export function renderFertility(container) {
  const wrap = document.createElement('div');

  for (const t of TREATMENTS) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = `${t.label} - $${t.cost.toLocaleString()} (${Math.round(t.success * 100)}% success)`;
    if (game.money < t.cost) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (game.money < t.cost) return;
      game.money -= t.cost;
      if (Math.random() < t.success) {
        const name = faker.person.firstName();
        const child = { name, age: 0, happiness: 90 };
        if (!game.children) game.children = [];
        game.children.push(child);
        addLog(`Fertility treatment succeeded! You welcomed ${name}.`);
      } else {
        addLog('Fertility treatment failed.');
      }
      refreshOpenWindows();
      saveGame();
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

