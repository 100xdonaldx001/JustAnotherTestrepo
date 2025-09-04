import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';
import { rand, clamp } from '../utils.js';

export { openWindow };

const ADOPTABLE = [
  { type: 'Dog', cost: 500, requiresVolunteer: true },
  { type: 'Cat', cost: 300, requiresVolunteer: true },
  { type: 'Parrot', cost: 200 },
  { type: 'Goldfish', cost: 50 }
];

const BREEDS = {
  Dog: ['Labrador', 'Beagle', 'Poodle', 'Bulldog'],
  Cat: ['Siamese', 'Persian', 'Maine Coon', 'Sphynx'],
  Parrot: ['Macaw', 'Cockatiel', 'African Grey'],
  Goldfish: ['Comet', 'Fantail', 'Oranda']
};

function randomBreed(type) {
  const list = BREEDS[type] || ['Mixed'];
  return list[rand(0, list.length - 1)];
}

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
        const breed = randomBreed(a.type);
        game.money -= a.cost;
        game.pets.push({
          type: a.type,
          breed,
          talent: rand(10, 40),
          age: 0,
          happiness: 70,
          health: 100,
          alive: true
        });
        addLog(`You adopted a ${breed} ${a.type}.`, 'pet');
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
        info.innerHTML = `<strong>${pet.breed} ${pet.type}</strong> Age ${pet.age} • Talent ${pet.talent} • Happiness ${pet.happiness} • Health ${pet.health}`;
      } else {
        info.innerHTML = `<strong>${pet.breed} ${pet.type}</strong> Age ${pet.age} • Deceased`;
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
        const train = document.createElement('button');
        train.className = 'btn';
        train.textContent = 'Train';
        train.addEventListener('click', () => {
          applyAndSave(() => {
            const cost = 100;
            if (game.money < cost) {
              addLog('You cannot afford training.', 'pet');
              return;
            }
            game.money -= cost;
            pet.talent = clamp(pet.talent + rand(5, 15));
            addLog(`You trained your ${pet.type}. (-$${cost})`, 'pet');
          });
        });
        actions.appendChild(train);
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
    const alivePets = game.pets.filter(p => p.alive);
    if (alivePets.length >= 2) {
      const breedHead = document.createElement('div');
      breedHead.className = 'muted';
      breedHead.style.marginTop = '8px';
      breedHead.textContent = 'Breed Pets';
      wrap.appendChild(breedHead);
      const form = document.createElement('div');
      const sel1 = document.createElement('select');
      const sel2 = document.createElement('select');
      for (let i = 0; i < game.pets.length; i++) {
        const p = game.pets[i];
        if (!p.alive) continue;
        const opt1 = document.createElement('option');
        opt1.value = i;
        opt1.textContent = `${p.breed} ${p.type}`;
        const opt2 = opt1.cloneNode(true);
        sel1.appendChild(opt1);
        sel2.appendChild(opt2);
      }
      form.appendChild(sel1);
      form.appendChild(sel2);
      const breedBtn = document.createElement('button');
      breedBtn.className = 'btn';
      breedBtn.textContent = 'Pair';
      breedBtn.addEventListener('click', () => {
        const p1 = game.pets[sel1.value];
        const p2 = game.pets[sel2.value];
        if (p1 === p2) {
          applyAndSave(() => addLog('Choose two different pets.', 'pet'));
          return;
        }
        if (p1.type !== p2.type) {
          applyAndSave(() => addLog('Pets must be of the same type.', 'pet'));
          return;
        }
        applyAndSave(() => {
          const childBreed = rand(0, 1) === 0 ? p1.breed : p2.breed;
          const childTalent = clamp(Math.round((p1.talent + p2.talent) / 2 + rand(-10, 10)));
          game.pets.push({
            type: p1.type,
            breed: childBreed,
            talent: childTalent,
            age: 0,
            happiness: 70,
            health: 100,
            alive: true
          });
          addLog(`Your ${p1.type}s produced a ${childBreed} ${p1.type}.`, 'pet');
        });
      });
      form.appendChild(breedBtn);
      wrap.appendChild(form);
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

