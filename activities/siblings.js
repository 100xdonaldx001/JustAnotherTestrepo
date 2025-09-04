import { game } from '../state.js';
import { spendTimeWithSibling, siblingRivalry } from '../actions/family.js';

export function renderSiblings(container) {
  game.siblings = game.siblings || [];
  const wrap = document.createElement('div');

  if (!game.siblings.length) {
    const note = document.createElement('div');
    note.className = 'muted';
    note.textContent = 'You have no siblings.';
    wrap.appendChild(note);
    container.appendChild(wrap);
    return;
  }

  for (let i = 0; i < game.siblings.length; i++) {
    const sibling = game.siblings[i];
    const row = document.createElement('div');
    row.className = 'sibling';

    const info = document.createElement('div');
    const name = sibling.name ? sibling.name : `Sibling ${i + 1}`;
    info.innerHTML = `<strong>${name}</strong> Age ${sibling.age} • Happiness ${sibling.happiness}`;
    row.appendChild(info);

    const actions = document.createElement('div');
    const spend = document.createElement('button');
    spend.className = 'btn';
    spend.textContent = 'Spend Time';
    spend.addEventListener('click', () => spendTimeWithSibling(i));
    actions.appendChild(spend);

    const rivalry = document.createElement('button');
    rivalry.className = 'btn';
    rivalry.textContent = 'Rivalry';
    rivalry.addEventListener('click', () => siblingRivalry(i));
    actions.appendChild(rivalry);

    row.appendChild(actions);
    wrap.appendChild(row);
  }

  container.appendChild(wrap);
}

