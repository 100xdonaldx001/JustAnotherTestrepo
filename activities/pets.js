import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';

export { openWindow };

const ADOPTABLE = [
  { type: 'Dog', cost: 500, requiresVolunteer: true },
  { type: 'Cat', cost: 300, requiresVolunteer: true },
  { type: 'Parrot', cost: 200 },
  { type: 'Goldfish', cost: 50 }
];

export function renderPets(container) {
  game.pets = game.pets || [];
  game.petMemorials = game.petMemorials || [];
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
    btn.disabled =
      game.money < a.cost || (a.requiresVolunteer && !game.volunteeredShelter);
    btn.addEventListener('click', () => {
      if (a.requiresVolunteer && !game.volunteeredShelter) {
        applyAndSave(() => {
          addLog('You need to volunteer at the shelter first.', 'pet');
        });
        return;
      }
      if (game.money < a.cost) {
        applyAndSave(() => {
          addLog('You cannot afford that pet.', 'pet');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= a.cost;
        game.pets.push({
          type: a.type,
          age: 0,
          happiness: 70,
          health: 100,
          alive: true
        });
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
      if (pet.alive) {
        info.innerHTML = `<strong>${pet.type}</strong> Age ${pet.age} • Happiness ${pet.happiness} • Health ${pet.health}`;
      } else {
        info.innerHTML = `<strong>${pet.type}</strong> Age ${pet.age} • Deceased`;
      }
      row.appendChild(info);
      const actions = document.createElement('div');
      if (pet.alive) {
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
            pet.health = Math.max(pet.health - 5, 0);
            if (pet.health <= 0) {
              pet.alive = false;
              addLog(`Your ${pet.type} passed away.`, 'pet');
            } else {
              addLog(`Your ${pet.type} aged a year.`, 'pet');
            }
          });
        });
        actions.appendChild(ageBtn);
        const vet = document.createElement('button');
        vet.className = 'btn';
        vet.textContent = 'Visit Vet';
        vet.addEventListener('click', () => {
          applyAndSave(() => {
            const cost = 100;
            if (game.money < cost) {
              addLog('You cannot afford the vet.', 'pet');
              return;
            }
            game.money -= cost;
            pet.health = 100;
            addLog(`You took your ${pet.type} to the vet. (-$${cost})`, 'pet');
          });
        });
        actions.appendChild(vet);
      } else {
        const mem = document.createElement('button');
        mem.className = 'btn';
        mem.textContent = 'Memorialize';
        mem.addEventListener('click', () => {
          applyAndSave(() => {
            game.petMemorials.push({ type: pet.type, age: pet.age });
            game.pets = game.pets.filter(p => p !== pet);
            addLog(`You memorialized your ${pet.type}.`, 'pet');
          });
        });
        actions.appendChild(mem);
      }
      row.appendChild(actions);
      wrap.appendChild(row);
    }
    if (game.petMemorials.length) {
      const memHead = document.createElement('div');
      memHead.className = 'muted';
      memHead.style.marginTop = '8px';
      memHead.textContent = 'Pet Memorials';
      wrap.appendChild(memHead);
      for (const pet of game.petMemorials) {
        const row = document.createElement('div');
        row.className = 'pet';
        row.textContent = `${pet.type} • Age ${pet.age}`;
        wrap.appendChild(row);
      }
    }
  }

  container.appendChild(wrap);
}

