import { openWindow } from '../windowManager.js';
import { game } from '../state.js';

function openActivity(id, title, modulePath, exportName) {
  openWindow(id, title, async (container, win) => {
    container.textContent = 'Loading...';
    try {
      const mod = await import(modulePath);
      container.innerHTML = '';
      mod[exportName](container, win);
    } catch (err) {
      container.textContent = 'Failed to load activity.';
      console.error('Failed to load activity:', err);
    }
  });
}

const ACTIVITIES_CATEGORIES = {
  'Leisure & Lifestyle': [
    'Outdoor Lifestyle',
    'Hiking',
    'Luxury Lifestyle',
    'Salon & Spa',
    'Shopping',
    'Social Media',
    'Accessories',
    'Movie Theater',
    'Nightlife',
    'Vacation',
    'Car Dealership',
    'Car Maintenance'
  ],
  'Family & Relationships': [
    'Adoption',
    'Daycare',
    'Fertility',
    'Love',
    'Volunteer Shelter',
    'Pets',
    'Zoo',
    'Zoo Trip',
    'Elder Care'
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
    'Gym',
    'Doctor',
    'Plastic Surgery',
    'Rehab',
    'Mind & Work',
    'Meditation Retreat',
    'Health Insurance'
  ],
  'Travel & Community': [
    'Commune',
    'Emigrate',
    'Charity',
    'Religion'
  ],
  'Business & Finance': ['Business']
};

const ACTIVITY_ICONS = {
  'Outdoor Lifestyle': '🌲',
  Hiking: '🥾',
  'Luxury Lifestyle': '💎',
  'Salon & Spa': '💅',
  Shopping: '🛍️',
  'Social Media': '📱',
  Accessories: '🧢',
  'Movie Theater': '🎬',
  Nightlife: '🌃',
  Vacation: '🏖️',
  'Car Dealership': '🚗',
  'Car Maintenance': '🛠️',
  Religion: '🙏',
  Adoption: '👶',
  Daycare: '🧸',
  Fertility: '🧬',
  Love: '❤️',
  'Volunteer Shelter': '🤝',
  Pets: '🐾',
  Zoo: '🦁',
  'Zoo Trip': '🚌',
  'Elder Care': '👴',
  Casino: '🎰',
  Gamble: '🎲',
  Lottery: '🎟️',
  'Horse Racing': '🐎',
  'Race Tracks': '🏁',
  Racing: '🏎️',
  Crime: '🦹',
  'Black Market': '🕶️',
  'Secret Agent': '🕵️',
  Identity: '🆔',
  Lawsuit: '⚖️',
  Licenses: '📜',
  'Will & Testament': '📝',
  Gym: '🏋️',
  Doctor: '🩺',
  'Plastic Surgery': '💉',
  Rehab: '🚭',
  'Mind & Work': '🧠',
  'Meditation Retreat': '🧘',
  'Health Insurance': '📑',
  Commune: '🏘️',
  Emigrate: '✈️',
  Charity: '💝',
  Prison: '🚔',
  Business: '💼'
};

const ACTIVITY_RENDERERS = {
  Love: () => openActivity('love', 'Love', '../activities/love.js', 'renderLove'),
  Gym: () => openActivity('gym', 'Gym', '../activities/gym.js', 'renderGym'),
  Doctor: () => openActivity('doctor', 'Doctor', '../activities/doctor.js', 'renderDoctor'),
  'Health Insurance': () => openActivity(
    'healthInsurance',
    'Health Insurance',
    '../activities/health.js',
    'renderHealth'
  ),
  'Plastic Surgery': () => openActivity('plasticSurgery', 'Plastic Surgery', '../activities/plasticSurgery.js', 'renderPlasticSurgery'),
  Casino: () => openActivity('casino', 'Casino', '../activities/casino.js', 'renderCasino'),
  Gamble: () => openActivity('gamble', 'Gamble', '../activities/gamble.js', 'renderGamble'),
  Adoption: () => openActivity('adoption', 'Adoption', '../activities/adoption.js', 'renderAdoption'),
  Daycare: () => openActivity('daycare', 'Daycare', '../activities/daycare.js', 'renderDaycare'),
  Fertility: () => openActivity('fertility', 'Fertility', '../activities/fertility.js', 'renderFertility'),
  'Elder Care': () => openActivity('elderCare', 'Elder Care', '../activities/elderCare.js', 'renderElderCare'),
  Lottery: () => openActivity('lottery', 'Lottery', '../activities/lottery.js', 'renderLottery'),
  'Movie Theater': () => openActivity('movieTheater', 'Movie Theater', '../activities/movieTheater.js', 'renderMovieTheater'),
  'Social Media': () => openActivity('socialmedia', 'Social Media', '../activities/socialMedia.js', 'renderSocialMedia'),
  Vacation: () => openActivity('vacation', 'Vacation', '../activities/vacation.js', 'renderVacation'),
  'Salon & Spa': () => openActivity('salonAndSpa', 'Salon & Spa', '../activities/salonAndSpa.js', 'renderSalonAndSpa'),
  Crime: () => openActivity('crime', 'Crime', '../activities/crime.js', 'renderCrime'),
  Prison: () => openActivity('prison', 'Prison', '../activities/prison.js', 'renderPrison'),
  'Black Market': () => openActivity('blackMarket', 'Black Market', '../activities/blackMarket.js', 'renderBlackMarket'),
  Identity: () => openActivity('identity', 'Identity', '../activities/identity.js', 'renderIdentity'),
  Emigrate: () => openActivity('emigrate', 'Emigrate', '../activities/emigrate.js', 'renderEmigrate'),
  Commune: () => openActivity('commune', 'Commune', '../activities/commune.js', 'renderCommune'),
  'Mind & Work': () => openActivity('mindwork', 'Mind & Work', '../activities/mindAndWork.js', 'renderMindAndWork'),
  'Meditation Retreat': () => openActivity('meditationRetreat', 'Meditation Retreat', '../activities/meditationRetreat.js', 'renderMeditationRetreat'),
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
  Hiking: () => openActivity('hiking', 'Hiking', '../activities/hiking.js', 'renderHiking'),
  'Luxury Lifestyle': () => openActivity('luxuryLifestyle', 'Luxury Lifestyle', '../activities/luxuryLifestyle.js', 'renderLuxuryLifestyle'),
  'Volunteer Shelter': () =>
    openActivity('volunteerShelter', 'Volunteer Shelter', '../activities/volunteerShelter.js', 'renderVolunteerShelter'),
  Pets: () => openActivity('pets', 'Pets', '../activities/pets.js', 'renderPets'),
  Shopping: () => openActivity('shopping', 'Shopping', '../activities/shopping.js', 'renderShopping'),
  'Car Dealership': () => openActivity('carDealership', 'Car Dealership', '../activities/carDealership.js', 'renderCarDealership'),
  'Car Maintenance': () => openActivity('carMaintenance', 'Car Maintenance', '../activities/carMaintenance.js', 'renderCarMaintenance'),
  Charity: () => openActivity('charity', 'Charity', '../activities/charity.js', 'renderCharity'),
  Religion: () => openActivity('religion', 'Religion', '../activities/religion.js', 'renderReligion'),
  Business: () => openActivity('business', 'Business', '../activities/business.js', 'renderBusiness')
};

export function renderActivities(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  const categories = {};
  for (const [name, items] of Object.entries(ACTIVITIES_CATEGORIES)) {
    categories[name] = [...items];
  }
  if (game.inJail) {
    categories['Crime & Legal'] = ['Prison', ...categories['Crime & Legal']];
  }

  for (const [name, items] of Object.entries(categories)) {
    const head = document.createElement('div');
    head.className = 'muted';
    head.style.margin = '8px 0 4px';
    head.textContent = name;
    wrap.appendChild(head);

    for (const item of items) {
      if (
        item === 'Daycare' &&
        (!game.job || !game.children || game.children.length === 0)
      ) {
        continue;
      }
      const btn = document.createElement('button');
      btn.className = 'btn';
      const icon = ACTIVITY_ICONS[item];
      btn.textContent = icon ? `${icon} ${item}` : item;
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

