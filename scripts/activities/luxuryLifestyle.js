import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderLuxuryLifestyle(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Indulge in high-end items to boost your status.';
  container.appendChild(head);

  const items = [
    { name: 'Luxury Car', cost: 100000, happiness: 10, looks: 5 },
    { name: 'Designer Wardrobe', cost: 20000, happiness: 5, looks: 10 },
    { name: 'Luxury Yacht', cost: 2000000, happiness: 25, looks: 15 },
    { name: 'Private Jet', cost: 5000000, happiness: 30, looks: 20 }
  ];

  const list = document.createElement('div');
  for (const item of items) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `Buy ${item.name} ($${item.cost.toLocaleString()})`;
    btn.disabled = game.money < item.cost;
    btn.addEventListener('click', () => {
      if (game.money < item.cost) {
        applyAndSave(() => {
          addLog(`${item.name} costs $${item.cost.toLocaleString()}. Not enough money.`, 'luxury');
        });
        return;
      }
      if (rand(1, 100) > taskChances.luxuryLifestyle.purchaseSuccess) {
        applyAndSave(() => {
          addLog(`${item.name} was unavailable at the boutique.`, 'luxury');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= item.cost;
        if (rand(1, 100) > taskChances.luxuryLifestyle.itemAuthentic) {
          addLog(`The ${item.name} turned out to be counterfeit. (-$${item.cost.toLocaleString()})`, 'luxury');
          return;
        }
        game.happiness = clamp(game.happiness + item.happiness);
        game.looks = clamp(game.looks + item.looks);
        addLog(`You bought a ${item.name}. +${item.happiness} Happiness, +${item.looks} Looks.`, 'luxury');
      });
    });
    list.appendChild(btn);
  }

  container.appendChild(list);
}

