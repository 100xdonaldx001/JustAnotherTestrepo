import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { getFaker } from '../utils/faker.js';
import { spendTimeWithSpouse, argueWithSpouse } from '../actions/family.js';

const faker = await getFaker();

export function renderLove(container) {
  const wrap = document.createElement('div');

  const list = document.createElement('div');
  if (game.spouse) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.margin = '4px 0';

    const span = document.createElement('span');
    span.textContent = `${game.spouse.name} (${game.spouse.happiness}%)`;
    span.textContent = `${game.spouse.name} (Spouse, ${game.spouse.happiness}%)`;
    row.appendChild(span);

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Divorce';
    btn.style.marginLeft = 'auto';
    btn.addEventListener('click', () => {
      applyAndSave(() => {
        const name = game.spouse.name;
        game.money = Math.floor(game.money / 2);
        game.spouse = null;
        game.happiness = clamp(game.happiness - 30);
        addLog(`You divorced ${name} and split your money.`, 'relationship');
        addLog(`You divorced ${game.spouse.name}.`, 'relationship');
        game.spouse = null;
        game.maritalStatus = 'single';
      });
    });
    row.appendChild(btn);

    list.appendChild(row);
  }
  if (game.relationships.length) {
    for (const [i, rel] of game.relationships.entries()) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.margin = '4px 0';
  if (!game.spouse && !game.relationships.length) {
    const none = document.createElement('div');
    none.className = 'muted';
    none.textContent = 'You are currently single.';
    list.appendChild(none);
  }
  for (const [i, rel] of game.relationships.entries()) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.margin = '4px 0';

    const span = document.createElement('span');
    span.textContent = `${rel.name} (${rel.happiness}%)`;
    row.appendChild(span);

      const spend = document.createElement('button');
      spend.className = 'btn';
      spend.textContent = 'Spend Time';
      spend.style.marginLeft = '8px';
      spend.addEventListener('click', () => spendTimeWithSpouse(i));
      row.appendChild(spend);

      const argue = document.createElement('button');
      argue.className = 'btn';
      argue.textContent = 'Argue';
      argue.style.marginLeft = '8px';
      argue.addEventListener('click', () => argueWithSpouse(i));
      row.appendChild(argue);

      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = 'Break up';
      btn.style.marginLeft = 'auto';
      btn.addEventListener('click', () => {
        applyAndSave(() => {
    const proposeBtn = document.createElement('button');
    proposeBtn.className = 'btn';
    proposeBtn.textContent = 'Propose';
    proposeBtn.style.marginLeft = 'auto';
    proposeBtn.addEventListener('click', () => {
      applyAndSave(() => {
        if (rand(1, 100) <= rel.happiness) {
          game.spouse = rel;
          game.maritalStatus = 'married';
          game.relationships.splice(i, 1);
          addLog(`You married ${rel.name}.`, 'relationship');
        } else {
          addLog(`${rel.name} rejected your proposal.`, 'relationship');
        }
      });
    });
    row.appendChild(proposeBtn);

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Break up';
    btn.style.marginLeft = '4px';
    btn.addEventListener('click', () => {
      applyAndSave(() => {
        game.relationships.splice(i, 1);
        addLog(`You broke up with ${rel.name}.`, 'relationship');
      });
    });
    row.appendChild(btn);

    list.appendChild(row);
  }

  if (!game.spouse && !game.relationships.length) {
    const none = document.createElement('div');
    none.className = 'muted';
    none.textContent = 'You are currently single.';
    list.appendChild(none);
  }

  wrap.appendChild(list);

  const findBtn = document.createElement('button');
  findBtn.className = 'btn';
  findBtn.textContent = 'Find Partner';
  findBtn.addEventListener('click', () => {
    applyAndSave(() => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const partner = { name, happiness: rand(40, 80) };
      game.relationships.push(partner);
      addLog(`You started dating ${name}.`, 'relationship');
    });
  });
  wrap.appendChild(findBtn);

  container.appendChild(wrap);
}

export function tickRelationships() {
  applyAndSave(() => {
    for (let i = game.relationships.length - 1; i >= 0; i--) {
      const r = game.relationships[i];
      r.happiness = clamp(r.happiness + rand(-10, 5));
      if (r.happiness <= 0) {
        addLog(`${r.name} left you.`, 'relationship');
        game.relationships.splice(i, 1);
      }
    }
  });
}

export function tickSpouse() {
  applyAndSave(() => {
    if (!game.spouse) return;
    game.spouse.happiness = clamp(game.spouse.happiness + rand(-10, 5));
    if (game.spouse.happiness <= 0) {
      addLog(`${game.spouse.name} divorced you.`, 'relationship');
      game.spouse = null;
      game.maritalStatus = 'single';
    }
  });
}

