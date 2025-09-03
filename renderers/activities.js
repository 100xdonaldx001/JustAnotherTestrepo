import { openWindow } from '../windowManager.js';
import { renderVacation } from '../activities/vacation.js';
import { renderLottery } from '../activities/lottery.js';
import { renderLove } from '../activities/love.js';
import { renderPets } from '../activities/pets.js';
import { renderAdoption } from '../activities/adoption.js';
import { renderFertility } from '../activities/fertility.js';
import { renderCasino } from '../activities/casino.js';
import { renderGamble } from '../activities/gamble.js';
import { renderDoctor } from '../activities/doctor.js';
import { renderRaceTracks } from '../activities/raceTracks.js';
import { renderRacing } from '../activities/racing.js';
import { renderHorseRacing } from '../activities/horseRacing.js';
import { renderZooTrip } from '../activities/zooTrip.js';
import { renderZoo } from '../activities/zoo.js';
import { renderAccessories } from '../activities/accessories.js';
import { renderNightlife } from '../activities/nightlife.js';
import { renderOutdoorLifestyle } from '../activities/outdoorLifestyle.js';
import { renderLuxuryLifestyle } from '../activities/luxuryLifestyle.js';
import { renderShopping } from '../activities/shopping.js';
import { renderSocialMedia } from '../activities/socialMedia.js';

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
  Gamble: () => openWindow('gamble', 'Gamble', renderGamble),
  Adoption: () => openWindow('adoption', 'Adoption', renderAdoption),
  Fertility: () => openWindow('fertility', 'Fertility', renderFertility),
  Lottery: () => openWindow('lottery', 'Lottery', renderLottery),
  'Social Media': () => openWindow('socialmedia', 'Social Media', renderSocialMedia),
  Vacation: () => openWindow('vacation', 'Vacation', renderVacation),
  'Race Tracks': () => openWindow('raceTracks', 'Race Tracks', renderRaceTracks),
  Racing: () => openWindow('racing', 'Racing', renderRacing),
  'Horse Racing': () => openWindow('horseRacing', 'Horse Racing', renderHorseRacing),
  'Zoo Trip': () => openWindow('zooTrip', 'Zoo Trip', renderZooTrip),
  Zoo: () => openWindow('zoo', 'Zoo', renderZoo),
  Accessories: () => openWindow('accessories', 'Accessories', renderAccessories),
  Nightlife: () => openWindow('nightlife', 'Nightlife', renderNightlife),
  Pets: () => openWindow('pets', 'Pets', renderPets),
  'Outdoor Lifestyle': () => openWindow('outdoorLifestyle', 'Outdoor Lifestyle', renderOutdoorLifestyle),
  'Luxury Lifestyle': () => openWindow('luxuryLifestyle', 'Luxury Lifestyle', renderLuxuryLifestyle),
  Pets: () => openWindow('pets', 'Pets', renderPets),
  Shopping: () => openWindow('shopping', 'Shopping', renderShopping)
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

