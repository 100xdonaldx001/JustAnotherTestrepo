import { game, addLog, applyAndSave } from '../state.js';
import { spendTimeWithSpouse } from '../actions/family.js';
import { refreshOpenWindows } from '../windowManager.js';

export function renderRelationships(container) {
  const wrap = document.createElement('div');

  if (!game.relationships.length) {
    const none = document.createElement('div');
    none.className = 'muted';
    none.textContent = 'You have no current relationships.';
    wrap.appendChild(none);
    container.appendChild(wrap);
    return;
  }

  for (const [i, rel] of game.relationships.entries()) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.margin = '4px 0';

    const name = document.createElement('span');
    name.textContent = rel.name;
    row.appendChild(name);

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.marginLeft = '8px';
    const fill = document.createElement('div');
    fill.className = 'fill';
    fill.style.width = `${rel.happiness}%`;
    bar.appendChild(fill);
    row.appendChild(bar);

    const call = document.createElement('button');
    call.className = 'btn';
    call.textContent = 'Call';
    call.style.marginLeft = '8px';
    call.addEventListener('click', () => {
      spendTimeWithSpouse(i);
      refreshOpenWindows();
    });
    row.appendChild(call);

    const breakup = document.createElement('button');
    breakup.className = 'btn';
    breakup.textContent = 'Break Up';
    breakup.style.marginLeft = '8px';
    breakup.addEventListener('click', () => {
      applyAndSave(() => {
        const name = rel.name;
        game.relationships.splice(i, 1);
        addLog(`You broke up with ${name}.`, 'relationship');
      });
      refreshOpenWindows();
    });
    row.appendChild(breakup);

    wrap.appendChild(row);
  }

  container.appendChild(wrap);
}

