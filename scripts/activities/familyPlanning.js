import { game, addLog, applyAndSave } from '../state.js';
import { taskChances } from '../taskChances.js';
import { rand, clamp } from '../utils.js';
import { getFaker } from '../utils/faker.js';

const faker = await getFaker();

export function renderFamilyPlanning(container) {
  const wrap = document.createElement('div');

  const conceiveBtn = document.createElement('button');
  conceiveBtn.className = 'btn block';
  conceiveBtn.textContent = `Try to Conceive (${taskChances.familyPlanning.conception}% chance)`;
  conceiveBtn.addEventListener('click', () => {
    applyAndSave(() => {
      if (rand(1, 100) <= taskChances.familyPlanning.conception) {
        const name = faker.person.firstName();
        const child = { name, age: 0, happiness: 50, smarts: 50 };
        game.state.children.push(child);
        addLog(`You welcomed ${name} to the family.`, 'family');
        renderChildren();
      } else {
        addLog('Conception attempt failed.', 'family');
      }
    });
  });
  wrap.appendChild(conceiveBtn);

  const list = document.createElement('div');
  wrap.appendChild(list);

  function careForChild(index) {
    applyAndSave(() => {
      const child = game.state.children[index];
      if (rand(1, 100) <= taskChances.familyPlanning.care) {
        child.happiness = clamp(child.happiness + rand(5, 15));
        child.smarts = clamp(child.smarts + rand(1, 5));
        addLog(`You cared for ${child.name}. (+Happiness, +Smarts)`, 'family');
      } else {
        addLog(`${child.name} resisted your care.`, 'family');
      }
    });
    renderChildren();
  }

  function renderChildren() {
    list.innerHTML = '';
    const kids = game.state.children;
    if (!kids.length) {
      const note = document.createElement('div');
      note.className = 'muted';
      note.textContent = 'No children yet.';
      list.appendChild(note);
      return;
    }
    kids.forEach((child, i) => {
      const childDiv = document.createElement('div');
      childDiv.className = 'child';
      childDiv.textContent = `${child.name} - Age ${child.age} | Happiness ${child.happiness} | Smarts ${child.smarts}`;
      const careBtn = document.createElement('button');
      careBtn.className = 'btn block';
      careBtn.textContent = `Care for ${child.name}`;
      careBtn.addEventListener('click', () => careForChild(i));
      childDiv.appendChild(careBtn);
      list.appendChild(childDiv);
    });
  }

  renderChildren();
  container.appendChild(wrap);
}

