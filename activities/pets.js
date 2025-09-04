import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';
import { rand } from '../utils.js';

export { openWindow };

const ADOPTABLE = [
  { type: 'Dog', cost: 500 },
  { type: 'Cat', cost: 300 },
  { type: 'Parrot', cost: 200 },
  { type: 'Goldfish', cost: 50 }
];

const RARE_PETS = [
  { type: 'Chinchilla', cost: 800 },
  { type: 'Fennec Fox', cost: 1500 }
];

export function offerRandomPetAdoption() {
  const rareChance = game.shelterVolunteer ? 20 : 5;
  if (rand(1, 100) > rareChance) return null;
  return RARE_PETS[rand(0, RARE_PETS.length - 1)];
}

export function renderPets(container) {
  game.pets = game.pets || [];
  const wrap = document.createElement('div');
  const volunteerBtn = document.createElement('button');
  volunteerBtn.className = 'btn block';
  volunteerBtn.textContent = 'Volunteer at Shelter';
  volunteerBtn.disabled = game.shelterVolunteer;
  volunteerBtn.addEventListener('click', () => {
    applyAndSave(() => {
      game.shelterVolunteer = true;
      addLog('You volunteered at the animal shelter.', 'pet');
    });
  });
  wrap.appendChild(volunteerBtn);

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Adoptable Pets';
  wrap.appendChild(head);

  const list = document.createElement('div');
  function addAdoptButton(pet) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `${pet.type} ($${pet.cost})`;
    btn.disabled = game.money < pet.cost;
    btn.addEventListener('click', () => {
      if (game.money < pet.cost) {
        applyAndSave(() => {
          addLog('You cannot afford that pet.', 'pet');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= pet.cost;
        game.pets.push({ type: pet.type, age: 0, happiness: 70 });
        addLog(`You adopted a ${pet.type}.`, 'pet');
      });
    });
    list.appendChild(btn);
  }
  for (const a of ADOPTABLE) addAdoptButton(a);
  const rarePet = offerRandomPetAdoption();
  if (rarePet) addAdoptButton(rarePet);
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

