import { openWindow } from '../windowManager.js';

function openActivity(id, title, modulePath, exportName) {
  openWindow(id, title, async (container, win) => {
    container.textContent = 'Loading...';
    const mod = await import(modulePath);
    mod[exportName](container, win);
  });
}

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
  Love: () => openActivity('love', 'Love', '../activities/love.js', 'renderLove'),
  Doctor: () => openActivity('doctor', 'Doctor', '../activities/doctor.js', 'renderDoctor'),
  'Plastic Surgery': () => openActivity('plasticSurgery', 'Plastic Surgery', '../activities/plasticSurgery.js', 'renderPlasticSurgery'),
  Casino: () => openActivity('casino', 'Casino', '../activities/casino.js', 'renderCasino'),
  Gamble: () => openActivity('gamble', 'Gamble', '../activities/gamble.js', 'renderGamble'),
  Adoption: () => openActivity('adoption', 'Adoption', '../activities/adoption.js', 'renderAdoption'),
  Fertility: () => openActivity('fertility', 'Fertility', '../activities/fertility.js', 'renderFertility'),
  Lottery: () => openActivity('lottery', 'Lottery', '../activities/lottery.js', 'renderLottery'),
  'Movie Theater': () => openActivity('movieTheater', 'Movie Theater', '../activities/movieTheater.js', 'renderMovieTheater'),
  'Social Media': () => openActivity('socialmedia', 'Social Media', '../activities/socialMedia.js', 'renderSocialMedia'),
  Vacation: () => openActivity('vacation', 'Vacation', '../activities/vacation.js', 'renderVacation'),
  'Salon & Spa': () => openActivity('salonAndSpa', 'Salon & Spa', '../activities/salonAndSpa.js', 'renderSalonAndSpa'),
  Crime: () => openActivity('crime', 'Crime', '../activities/crime.js', 'renderCrime'),
  'Black Market': () => openActivity('blackMarket', 'Black Market', '../activities/blackMarket.js', 'renderBlackMarket'),
  Identity: () => openActivity('identity', 'Identity', '../activities/identity.js', 'renderIdentity'),
  Emigrate: () => openActivity('emigrate', 'Emigrate', '../activities/emigrate.js', 'renderEmigrate'),
  Commune: () => openActivity('commune', 'Commune', '../activities/commune.js', 'renderCommune'),
  'Mind & Work': () => openActivity('mindwork', 'Mind & Work', '../activities/mindAndWork.js', 'renderMindAndWork'),
  Rehab: () => openActivity('rehab', 'Rehab', '../activities/rehab.js', 'renderRehab'),
  'Will & Testament': () => openActivity('will', 'Will & Testament', '../activities/willAndTestament.js', 'renderWillAndTestament'),
  Licenses: () => openActivity('licenses', 'Licenses', '../activities/licenses.js', 'renderLicenses'),
  Lawsuit: () => openActivity('lawsuit', 'Lawsuit', '../activities/lawsuit.js', 'renderLawsuit'),
  'Secret Agent': () => openActivity('secretAgent', 'Secret Agent', '../activities/secretAgent.js', 'renderSecretAgent'),
  'Race Tracks': () => openActivity('raceTracks', 'Race Tracks', '../activities/raceTracks.js', 'renderRaceTracks'),
  Racing: () => openActivity('racing', 'Racing', '../activities/racing.js', 'renderRacing'),
  'Horse Racing': () => openActivity('horseRacing', 'Horse Racing', '../activities/horseRacing.js', 'renderHorseRacing'),
  'Zoo Trip': () => openActivity('zooTrip', 'Zoo Trip', '../activities/zooTrip.js', 'renderZooTrip'),
  Zoo: () => openActivity('zoo', 'Zoo', '../activities/zoo.js', 'renderZoo'),
  Accessories: () => openActivity('accessories', 'Accessories', '../activities/accessories.js', 'renderAccessories'),
  Nightlife: () => openActivity('nightlife', 'Nightlife', '../activities/nightlife.js', 'renderNightlife'),
  'Outdoor Lifestyle': () => openActivity('outdoorLifestyle', 'Outdoor Lifestyle', '../activities/outdoorLifestyle.js', 'renderOutdoorLifestyle'),
  'Luxury Lifestyle': () => openActivity('luxuryLifestyle', 'Luxury Lifestyle', '../activities/luxuryLifestyle.js', 'renderLuxuryLifestyle'),
  Pets: () => openActivity('pets', 'Pets', '../activities/pets.js', 'renderPets'),
  Shopping: () => openActivity('shopping', 'Shopping', '../activities/shopping.js', 'renderShopping')
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

