import { game, addLog, saveGame } from '../state.js';
import { rand, clamp } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';

export function renderLove(container) {
  const wrap = document.createElement('div');

  const list = document.createElement('div');
  if (!game.relationships.length) {
    const none = document.createElement('div');
    none.className = 'muted';
    none.textContent = 'You are currently single.';
    list.appendChild(none);
  } else {
    for (const [i, rel] of game.relationships.entries()) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.margin = '4px 0';

      const span = document.createElement('span');
      span.textContent = `${rel.name} (${rel.happiness}%)`;
      row.appendChild(span);

      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = 'Break up';
      btn.style.marginLeft = 'auto';
      btn.addEventListener('click', () => {
        game.relationships.splice(i, 1);
        addLog(`You broke up with ${rel.name}.`);
        refreshOpenWindows();
        saveGame();
      });
      row.appendChild(btn);

      list.appendChild(row);
    }
  }
  wrap.appendChild(list);

  const findBtn = document.createElement('button');
  findBtn.className = 'btn';
  findBtn.textContent = 'Find Partner';
  findBtn.addEventListener('click', () => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const partner = { name, happiness: rand(40, 80) };
    game.relationships.push(partner);
    addLog(`You started dating ${name}.`);
    refreshOpenWindows();
    saveGame();
  });
  wrap.appendChild(findBtn);

  container.appendChild(wrap);
}

export function tickRelationships() {
  for (let i = game.relationships.length - 1; i >= 0; i--) {
    const r = game.relationships[i];
    r.happiness = clamp(r.happiness + rand(-10, 5));
    if (r.happiness <= 0) {
      addLog(`${r.name} left you.`);
      game.relationships.splice(i, 1);
    }
  }
  refreshOpenWindows();
  saveGame();
}

