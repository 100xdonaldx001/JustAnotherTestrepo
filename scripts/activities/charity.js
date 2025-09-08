import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderCharity(container) {
  if (typeof game.charityTotal !== 'number') game.charityTotal = 0;
  if (typeof game.charityYear !== 'number') game.charityYear = 0;
  if (typeof game.reputation !== 'number') game.reputation = 50;

  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Donate to charity to boost your reputation and reduce taxes.';
  wrap.appendChild(head);

  const total = document.createElement('div');
  total.textContent = `Total Donated: $${game.charityTotal}`;
  total.style.margin = '4px 0';
  wrap.appendChild(total);

  const amount = document.createElement('input');
  amount.type = 'number';
  amount.min = '1';
  amount.value = '100';
  amount.style.width = '80px';

  const donate = document.createElement('button');
  donate.className = 'btn';
  donate.textContent = 'Donate';
  donate.addEventListener('click', () => {
    const amt = Math.floor(Number(amount.value));
    if (amt <= 0) return;
    if (game.money < amt) {
      applyAndSave(() => {
        addLog(`Donation requires $${amt}. Not enough money.`, 'charity');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= amt;
      let donated = amt;
      if (rand(1, 100) <= taskChances.charity.matchingDonation) {
        donated *= 2;
        addLog('A sponsor matched your donation!', 'charity');
      }
      const gain = Math.max(1, Math.floor(donated / 100));
      game.reputation = clamp(game.reputation + gain);
      if (rand(1, 100) <= taskChances.charity.publicity) {
        game.reputation = clamp(game.reputation + 5);
        addLog('Your donation made headlines! +5 Reputation.', 'charity');
      }
      game.charityTotal += donated;
      game.charityYear += donated;
      addLog(`You donated $${donated}. +${gain} Reputation.`, 'charity');
      total.textContent = `Total Donated: $${game.charityTotal}`;
    });
  });

  wrap.appendChild(amount);
  wrap.appendChild(donate);
  container.appendChild(wrap);
}

