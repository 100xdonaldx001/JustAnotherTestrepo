import { game } from '../state.js';
import { propertyListings, buyProperty, rentProperty, repairProperty } from '../realestate.js';

export function renderRealEstate(container) {
  const g = document.createElement('div');

  const sale = document.createElement('div');
  const saleTitle = document.createElement('h3');
  saleTitle.textContent = 'Properties For Sale';
  sale.appendChild(saleTitle);
  propertyListings.forEach(l => {
    const row = document.createElement('div');
    row.textContent = `${l.name} - $${l.value.toLocaleString()}`;
    const btn = document.createElement('button');
    btn.textContent = 'Buy';
    btn.disabled = game.money < l.value;
    btn.addEventListener('click', () => {
      buyProperty(l);
    });
    row.appendChild(btn);
    sale.appendChild(row);
  });
  g.appendChild(sale);

  const owned = document.createElement('div');
  const ownedTitle = document.createElement('h3');
  ownedTitle.textContent = 'Your Properties';
  owned.appendChild(ownedTitle);
  if (game.properties.length === 0) {
    const none = document.createElement('div');
    none.textContent = 'You own no properties.';
    owned.appendChild(none);
  } else {
    game.properties.forEach(p => {
      const row = document.createElement('div');
      row.style.marginTop = '4px';
      const info = document.createElement('div');
      info.textContent = `${p.name} - Val $${p.value.toLocaleString()} - Cond ${p.condition}%`;
      row.appendChild(info);
      const rentDiv = document.createElement('div');
      if (!p.rented) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 10;
        input.value = 5;
        input.style.width = '40px';
        const rentBtn = document.createElement('button');
        rentBtn.textContent = 'Rent';
        rentBtn.addEventListener('click', () => {
          rentProperty(p, Number(input.value));
        });
        rentDiv.appendChild(input);
        rentDiv.appendChild(rentBtn);
      } else {
        const span = document.createElement('span');
        span.textContent = `Rented to ${p.tenant} ($${p.rent.toLocaleString()}/yr)`;
        rentDiv.appendChild(span);
      }
      row.appendChild(rentDiv);
      const repairDiv = document.createElement('div');
      [10, 25, 50, 100].forEach(pct => {
        const b = document.createElement('button');
        b.textContent = `${pct}% Repair`;
        b.addEventListener('click', () => {
          repairProperty(p, pct);
        });
        repairDiv.appendChild(b);
      });
      row.appendChild(repairDiv);
      owned.appendChild(row);
    });
  }
  g.appendChild(owned);

  container.appendChild(g);
}

