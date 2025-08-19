import { openWindow } from '../windowManager.js';
import { renderVacation } from '../activities/vacation.js';
import { renderLottery } from '../activities/lottery.js';
import { renderLove } from '../activities/love.js';
import { renderPets } from '../activities/pets.js';

const ACTIVITIES_CATEGORIES = {
  'Leisure & Lifestyle': [
    'Outdoor Lifestyle',
    'Luxury Lifestyle',
    'Salon & Spa',
    'Shopping',
    'Social Media',
    'Accessories',
    'Movie Theater',
    'Nightlife',
    'Vacation'
  ],
  'Family & Relationships': [
    'Adoption',
    'Fertility',
    'Love',
    'Pets',
    'Zoo',
    'Zoo Trip'
  ],
  'Gambling & Racing': [
    'Casino',
    'Gamble',
    'Lottery',
    'Horse Racing',
    'Race Tracks',
    'Racing'
  ],
  'Crime & Legal': [
    'Crime',
    'Black Market',
    'Secret Agent',
    'Identity',
    'Lawsuit',
    'Licenses',
    'Will & Testament'
  ],
  'Health & Self-Improvement': [
    'Doctor',
    'Plastic Surgery',
    'Rehab',
    'Mind & Work'
  ],
  'Travel & Community': [
    'Commune',
    'Emigrate'
  ]
};

export function renderActivities(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  for (const [name, items] of Object.entries(ACTIVITIES_CATEGORIES)) {
    const head = document.createElement('div');
    head.className = 'muted';
    head.style.margin = '8px 0 4px';
    head.textContent = name;
    wrap.appendChild(head);
    for (const item of items) {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = item;
      btn.disabled = item !== 'Love';
      if (item === 'Love') {
        btn.addEventListener('click', () => openWindow('love', 'Love', renderLove));
      }
      btn.disabled = item !== 'Lottery';
      if (item === 'Lottery') {
        btn.addEventListener('click', () => openWindow('lottery', 'Lottery', renderLottery));
      }
      btn.disabled = item !== 'Vacation';
      if (item === 'Vacation') {
        btn.addEventListener('click', () => openWindow('vacation', 'Vacation', renderVacation));
      }
      btn.disabled = item !== 'Pets';
      if (item === 'Pets') {
        btn.addEventListener('click', () => openWindow('pets', 'Pets', renderPets));
      }
      }
      wrap.appendChild(btn);
    }
  }

  container.appendChild(wrap);
}

