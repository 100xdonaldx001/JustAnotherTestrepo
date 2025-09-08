import { game, addLog, applyAndSave } from '../state.js';
import { openWindow } from '../windowManager.js';
import { getFaker } from '../utils/faker.js';
import { rand, combineChance } from '../utils.js';
import { taskChances } from '../taskChances.js';

const faker = await getFaker();

export { openWindow };

const OPTIONS = [
  { label: 'Adopt a Baby', cost: 20000, age: 0, happiness: 90 },
  { label: 'Adopt a Child', cost: 15000, age: 5, happiness: 80 },
  { label: 'Adopt a Teen', cost: 5000, age: 15, happiness: 70 }
];

export function renderAdoption(container) {
  const wrap = document.createElement('div');

  for (const opt of OPTIONS) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = `${opt.label} - $${opt.cost.toLocaleString()}`;
    if (game.money < opt.cost) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (game.money < opt.cost) return;
      applyAndSave(() => {
        game.money -= opt.cost;
        const roll = rand(1, 100);
        const chance = combineChance(
          taskChances.family.adoption,
          game.happiness,
          game.mentalHealth
        );
        if (roll <= chance) {
          const name = faker.person.firstName();
          const child = { name, age: opt.age, happiness: opt.happiness };
          if (!game.state.children) game.state.children = [];
          game.state.children.push(child);
          addLog(
            [
              `You adopted ${name}.`,
              `${name} joined your family through adoption.`,
              `You became the parent of ${name} by adoption.`
            ],
            'family'
          );
        } else {
          addLog(
            [
              `Adoption application denied. (-$${opt.cost.toLocaleString()})`,
              `Your adoption request was rejected. (-$${opt.cost.toLocaleString()})`,
              `The agency turned down your adoption. (-$${opt.cost.toLocaleString()})`
            ],
            'family'
          );
        }
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

