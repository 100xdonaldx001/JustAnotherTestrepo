import { game, addLog, applyAndSave } from '../state.js';
import { clamp } from '../utils.js';

const ACCESSORIES = [
  { name: 'Sunglasses', cost: 50, looks: 2 },
  { name: 'Watch', cost: 100, looks: 3 },
  { name: 'Designer Bag', cost: 500, looks: 5 }
];

export function renderAccessories(container) {
  game.accessories = game.accessories || [];
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Wearable Items';
  wrap.appendChild(head);

  const list = document.createElement('div');
  for (const item of ACCESSORIES) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `${item.name} ($${item.cost})`;
    btn.disabled = game.money < item.cost;
    btn.addEventListener('click', () => {
      if (game.money < item.cost) {
        applyAndSave(() => {
          addLog('You cannot afford that item.', 'shopping');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= item.cost;
        game.looks = clamp(game.looks + item.looks);
        game.accessories.push(item.name);
        addLog(`You bought ${item.name}. (+Looks)`, 'shopping');
      });
    });
    list.appendChild(btn);
  }
  wrap.appendChild(list);

  if (game.accessories.length) {
    const ownHead = document.createElement('div');
    ownHead.className = 'muted';
    ownHead.style.marginTop = '8px';
    ownHead.textContent = 'Your Accessories';
    wrap.appendChild(ownHead);
    for (const acc of game.accessories) {
      const row = document.createElement('div');
      row.textContent = acc;
      wrap.appendChild(row);
    }
  }

  container.appendChild(wrap);
}

