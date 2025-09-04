import { game } from '../state.js';
import { brokers, buyProperty, rentProperty, repairProperty, sellProperty } from '../realestate.js';

export function renderRealEstate(container) {
  const g = document.createElement('div');

  const brokersDiv = document.createElement('div');
  const brokersTitle = document.createElement('h3');
  brokersTitle.textContent = 'Brokers';
  brokersDiv.appendChild(brokersTitle);
  brokers.forEach(b => {
    const section = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = b.name;
    section.appendChild(summary);
    const listings = [...b.listings].sort((l1, l2) => l1.value - l2.value);
    if (listings.length === 0) {
      const none = document.createElement('div');
      none.textContent = 'No properties available.';
      section.appendChild(none);
    } else {
      listings.forEach(l => {
        const row = document.createElement('div');
        const icon = document.createElement(l.icon.type === 'fa' ? 'i' : 'span');
        if (l.icon.type === 'fa') {
          icon.className = `fa-solid ${l.icon.icon}`;
        } else {
          icon.className = 'material-icons';
          icon.textContent = l.icon.icon;
        }
        icon.style.marginRight = '4px';
        row.appendChild(icon);
        row.appendChild(document.createTextNode(` ${l.name} - $${l.value.toLocaleString()}`));
        const btn = document.createElement('button');
        btn.textContent = 'Buy';
        btn.disabled = game.money < l.value;
        btn.addEventListener('click', () => {
          buyProperty(b, l);
        });
        row.appendChild(btn);
        section.appendChild(row);
      });
    }
    brokersDiv.appendChild(section);
  });
  g.appendChild(brokersDiv);

  const owned = document.createElement('div');
  const ownedTitle = document.createElement('h3');
  ownedTitle.textContent = 'Your Properties';
  owned.appendChild(ownedTitle);
  if (game.properties.length === 0) {
    const none = document.createElement('div');
    none.textContent = 'You own no properties.';
    owned.appendChild(none);
  } else {
    const ownedProps = [...game.properties].sort((p1, p2) => p1.value - p2.value);
    ownedProps.forEach(p => {
      const row = document.createElement('div');
      row.style.marginTop = '4px';
      const info = document.createElement('div');
      const icon = document.createElement(p.icon.type === 'fa' ? 'i' : 'span');
      if (p.icon.type === 'fa') {
        icon.className = `fa-solid ${p.icon.icon}`;
      } else {
        icon.className = 'material-icons';
        icon.textContent = p.icon.icon;
      }
      icon.style.marginRight = '4px';
      info.appendChild(icon);
      let text = ` ${p.name} - Val $${p.value.toLocaleString()} - Cond ${p.condition}%`;
      if (p.renovation) {
        text += ` - Renovation ${p.renovation.years} yr${p.renovation.years > 1 ? 's' : ''} left`;
      }
      info.appendChild(document.createTextNode(text));
      row.appendChild(info);
      const rentDiv = document.createElement('div');
      if (!p.rented && !p.renovation) {
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
      } else if (p.rented) {
        const span = document.createElement('span');
        span.textContent = `Rented to ${p.tenant} ($${p.rent.toLocaleString()}/yr)`;
        rentDiv.appendChild(span);
      } else {
        const span = document.createElement('span');
        span.textContent = 'Under renovation';
        rentDiv.appendChild(span);
      }
      row.appendChild(rentDiv);
      const repairDiv = document.createElement('div');
      if (p.renovation) {
        const span = document.createElement('span');
        span.textContent = 'Under renovation';
        repairDiv.appendChild(span);
      } else {
        [10, 25, 50, 100].forEach(pct => {
          const b = document.createElement('button');
          b.textContent = `${pct}% Repair`;
          b.addEventListener('click', () => {
            repairProperty(p, pct);
          });
          repairDiv.appendChild(b);
        });
      }
      row.appendChild(repairDiv);
      const sellDiv = document.createElement('div');
      const sellBtn = document.createElement('button');
      sellBtn.textContent = 'Sell';
      sellBtn.addEventListener('click', () => {
        sellProperty(p);
      });
      sellDiv.appendChild(sellBtn);
      row.appendChild(sellDiv);
      owned.appendChild(row);
    });
  }
  g.appendChild(owned);

  container.appendChild(g);
}

