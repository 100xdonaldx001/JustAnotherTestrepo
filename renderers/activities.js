import { openWindow } from '../windowManager.js';
import { renderVacation } from '../activities/vacation.js';
import { renderLottery } from '../activities/lottery.js';
import { renderLove } from '../activities/love.js';
import { renderPets } from '../activities/pets.js';
import { renderAdoption } from '../activities/adoption.js';
import { renderCasino } from '../activities/casino.js';
import { renderDoctor } from '../activities/doctor.js';
import { renderWillAndTestament } from '../activities/willAndTestament.js';

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

const ACTIVITY_RENDERERS = {
  Love: () => openWindow('love', 'Love', renderLove),
  Doctor: () => openWindow('doctor', 'Doctor', renderDoctor),
  Casino: () => openWindow('casino', 'Casino', renderCasino),
  Adoption: () => openWindow('adoption', 'Adoption', renderAdoption),
  Lottery: () => openWindow('lottery', 'Lottery', renderLottery),
  Vacation: () => openWindow('vacation', 'Vacation', renderVacation),
  Pets: () => openWindow('pets', 'Pets', renderPets),
  'Will & Testament': () =>
    openWindow('will', 'Will & Testament', renderWillAndTestament)
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
      if (ACTIVITY_RENDERERS[item]) {
        btn.addEventListener('click', ACTIVITY_RENDERERS[item]);
      } else {
        btn.disabled = true;
      }
      wrap.appendChild(btn);
    }
  }

  container.appendChild(wrap);
}

