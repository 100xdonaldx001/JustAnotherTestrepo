import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';

export function renderIdentity(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Alter your identity legally or illegally.';
  wrap.appendChild(head);

  const theftBtn = document.createElement('button');
  theftBtn.className = 'btn block';
  theftBtn.textContent = 'Commit Identity Theft';
  theftBtn.addEventListener('click', () => {
    if (game.inJail) {
      applyAndSave(() => {
        addLog('You cannot attempt this in jail.', 'crime');
      });
      return;
    }
    applyAndSave(() => {
      const roll = rand(1, 100);
      if (roll <= 50) {
        const amount = rand(1000, 8000);
        game.money += amount;
        game.happiness = clamp(game.happiness + rand(1, 3));
        addLog(`Identity theft succeeded. You gained $${amount.toLocaleString()}.`, 'crime');
      } else {
        if (rand(1, 100) <= 60) {
          game.inJail = true;
          game.jailYears = rand(1, 3);
          addLog(`Identity theft failed. Jailed for ${game.jailYears} year(s).`, 'crime');
        } else {
          const fine = rand(200, 800);
          game.money = Math.max(game.money - fine, 0);
          game.health = clamp(game.health - rand(1, 4));
          addLog(`Identity theft failed. You paid $${fine} in fines and were roughed up.`, 'crime');
        }
      }
    });
  });
  wrap.appendChild(theftBtn);

  const legalBtn = document.createElement('button');
  legalBtn.className = 'btn block';
  legalBtn.textContent = 'Legal Name Change ($150)';
  legalBtn.addEventListener('click', () => {
    const cost = 150;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('Name change costs $150. Not enough money.', 'identity');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      const oldName = game.name;
      const first = faker.person.firstName(
        game.gender === 'Male' ? 'male' : game.gender === 'Female' ? 'female' : undefined
      );
      const last = faker.person.lastName();
      game.name = `${first} ${last}`;
      game.happiness = clamp(game.happiness + rand(1, 3));
      addLog(`You legally changed your name from ${oldName} to ${game.name}.`, 'identity');
    });
  });
  wrap.appendChild(legalBtn);

  container.appendChild(wrap);
}
