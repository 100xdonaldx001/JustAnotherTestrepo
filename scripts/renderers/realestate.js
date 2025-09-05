import { game } from '../state.js';
import {
  brokers,
  buyProperty,
  rentProperty,
  repairProperty,
  sellProperty,
  getPropertyDetails
} from '../realestate.js';
import { openWindow, closeWindow, refreshOpenWindows } from '../windowManager.js';

export function renderRealEstate(container) {
  const g = document.createElement('div');

  const brokersDiv = document.createElement('div');
  const brokersTitle = document.createElement('h3');
  brokersTitle.textContent = 'Brokers';
  brokersDiv.appendChild(brokersTitle);
  brokers.forEach(b => {
    const btn = document.createElement('button');
    btn.textContent = b.name;
    btn.addEventListener('click', () => {
      openWindow(`broker-${b.id}`, b.name, c => renderBrokerListings(b, c));
    });
    brokersDiv.appendChild(btn);
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
      const propBtn = document.createElement('button');
      const icon = document.createElement(p.icon.type === 'fa' ? 'i' : 'span');
      if (p.icon.type === 'fa') {
        icon.className = `fa-solid ${p.icon.icon}`;
      } else {
        icon.className = 'material-icons';
        icon.textContent = p.icon.icon;
      }
      icon.classList.add('property-icon');
      propBtn.appendChild(icon);
      let text = ` ${p.name} - Val $${p.value.toLocaleString()} - Cond ${p.condition}%`;
      if (p.mortgage) {
        text += ` - Mort $${p.mortgage.balance.toLocaleString()}`;
      }
      if (p.renovation) {
        text += ` - Renovation ${p.renovation.years} yr${p.renovation.years > 1 ? 's' : ''} left`;
      }
      propBtn.appendChild(document.createTextNode(text));
      propBtn.addEventListener('click', () => {
        openWindow(`prop-${p.id}`, p.name, c => renderOwnedDetails(p, c));
      });
      row.appendChild(propBtn);
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

function renderBrokerListings(broker, container) {
  const listings = [...broker.listings].sort((l1, l2) => l1.value - l2.value);
  if (listings.length === 0) {
    const none = document.createElement('div');
    none.textContent = 'No properties available.';
    container.appendChild(none);
    return;
  }
  const wrap = document.createElement('div');
  wrap.className = 'properties';
  listings.forEach(l => {
    const row = document.createElement('div');
    row.className = 'property';
    const icon = document.createElement(l.icon.type === 'fa' ? 'i' : 'span');
    if (l.icon.type === 'fa') {
      icon.className = `fa-solid ${l.icon.icon}`;
    } else {
      icon.className = 'material-icons';
      icon.textContent = l.icon.icon;
    }
    icon.classList.add('property-icon');
    row.appendChild(icon);
    const span = document.createElement('span');
    span.textContent = ` ${l.name} - $${l.value.toLocaleString()}`;
    row.appendChild(span);
    row.addEventListener('click', () => {
      openWindow(`listing-${l.id}`, l.name, c => renderListingDetails(broker, l, c));
    });
    wrap.appendChild(row);
  });
  container.appendChild(wrap);
}

function renderListingDetails(broker, listing, container) {
  const details = getPropertyDetails(listing);
  const address = document.createElement('div');
  address.textContent = details.address;
  container.appendChild(address);
  const stats = document.createElement('div');
  stats.textContent = `${details.beds} bed, ${details.baths} bath, ${details.area} sq ft`;
  container.appendChild(stats);
  const desc = document.createElement('div');
  desc.textContent = details.desc;
  container.appendChild(desc);
  const price = document.createElement('div');
  price.textContent = `Price: $${listing.value.toLocaleString()}`;
  container.appendChild(price);
  const rate = game.loanInterestRate;
  const months = 30 * 12;
  const monthlyRate = rate / 12;
  const payment = Math.round(
    listing.value * (monthlyRate * (1 + monthlyRate) ** months) /
      ((1 + monthlyRate) ** months - 1)
  );
  const mortInfo = document.createElement('div');
  mortInfo.textContent = `Mortgage: $${payment.toLocaleString()}/mo @ ${(rate * 100).toFixed(2)}%`;
  container.appendChild(mortInfo);
  const buyBtn = document.createElement('button');
  buyBtn.textContent = 'Buy';
  buyBtn.disabled = game.money < listing.value;
  buyBtn.addEventListener('click', () => {
    const ok = buyProperty(broker, listing);
    if (ok) {
      closeWindow(`listing-${listing.id}`);
      refreshOpenWindows();
    }
  });
  container.appendChild(buyBtn);
  const mortBtn = document.createElement('button');
  mortBtn.textContent = 'Buy w/ Mortgage';
  mortBtn.addEventListener('click', () => {
    const ok = buyProperty(broker, listing, true);
    if (ok) {
      closeWindow(`listing-${listing.id}`);
      refreshOpenWindows();
    }
  });
  container.appendChild(mortBtn);
}

function renderOwnedDetails(prop, container) {
  const details = getPropertyDetails(prop);
  const address = document.createElement('div');
  address.textContent = details.address;
  container.appendChild(address);
  const stats = document.createElement('div');
  stats.textContent = `${details.beds} bed, ${details.baths} bath, ${details.area} sq ft`;
  container.appendChild(stats);
  const desc = document.createElement('div');
  desc.textContent = details.desc;
  container.appendChild(desc);
  const value = document.createElement('div');
  value.textContent = `Value: $${prop.value.toLocaleString()}`;
  container.appendChild(value);
  const cond = document.createElement('div');
  cond.textContent = `Condition: ${prop.condition}%`;
  container.appendChild(cond);
  if (prop.mortgage) {
    const mort = document.createElement('div');
    mort.textContent = `Mortgage Balance: $${prop.mortgage.balance.toLocaleString()} ($${prop.mortgage.payment.toLocaleString()}/mo @ ${(prop.mortgage.rate * 100).toFixed(2)}%)`;
    container.appendChild(mort);
  }
  if (prop.rented) {
    const rentInfo = document.createElement('div');
    rentInfo.textContent = `Rented to ${prop.tenant} ($${prop.rent.toLocaleString()}/yr)`;
    container.appendChild(rentInfo);
  }
}

