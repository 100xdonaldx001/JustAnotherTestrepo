import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';

export { openWindow };

const ADOPTABLE = [
  { type: 'Dog', cost: 500 },
  { type: 'Cat', cost: 300 },
  { type: 'Parrot', cost: 200 },
  { type: 'Goldfish', cost: 50 }
];

export function renderPets(container) {
  game.pets = game.pets || [];
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Adoptable Pets';
  wrap.appendChild(head);

  const list = document.createElement('div');
  for (const a of ADOPTABLE) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `${a.type} ($${a.cost})`;
    btn.disabled = game.money < a.cost;
    btn.addEventListener('click', () => {
      if (game.money < a.cost) {
        applyAndSave(() => {
          addLog('You cannot afford that pet.', 'pet');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= a.cost;
        game.pets.push({ type: a.type, age: 0, happiness: 70 });
        addLog(`You adopted a ${a.type}.`, 'pet');
      });
    });
    list.appendChild(btn);
  }
  wrap.appendChild(list);

  if (game.pets.length) {
    const ownHead = document.createElement('div');
    ownHead.className = 'muted';
    ownHead.style.marginTop = '8px';
    ownHead.textContent = 'Your Pets';
    wrap.appendChild(ownHead);
    for (const pet of game.pets) {
      const row = document.createElement('div');
      row.className = 'pet';
      const info = document.createElement('div');
      info.innerHTML = `<strong>${pet.type}</strong> Age ${pet.age} • Happiness ${pet.happiness}`;
      row.appendChild(info);
      const actions = document.createElement('div');
      const play = document.createElement('button');
      play.className = 'btn';
      play.textContent = 'Play';
      play.addEventListener('click', () => {
        applyAndSave(() => {
          pet.happiness = Math.min(pet.happiness + 10, 100);
          addLog(`You played with your ${pet.type}.`, 'pet');
        });
      });
      actions.appendChild(play);
      const ageBtn = document.createElement('button');
      ageBtn.className = 'btn';
      ageBtn.textContent = 'Age';
      ageBtn.addEventListener('click', () => {
        applyAndSave(() => {
          pet.age += 1;
          pet.happiness = Math.max(pet.happiness - 5, 0);
          addLog(`Your ${pet.type} aged a year.`, 'pet');
        });
      });
      actions.appendChild(ageBtn);
      row.appendChild(actions);
      wrap.appendChild(row);
    }
  }

  container.appendChild(wrap);
}

