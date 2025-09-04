import { game, addLog, saveGame, unlockAchievement } from './state.js';
import { rand, clamp } from './utils.js';
import { getFaker } from './utils/faker.js';

const faker = await getFaker();

// house categories loaded from external data
let houseCategories = [];
const iconMappings = [
  {
    keywords: ['trailer', 'manufactured'],
    icon: { type: 'fa', icon: 'fa-person-shelter' }
  },
  {
    keywords: [
      'tiny',
      'cottage',
      'cabin',
      'bungalow',
      'mid century',
      'craftsman',
      'colonial'
    ],
    icon: { type: 'mi', icon: 'cottage' }
  },
  {
    keywords: [
      'condo',
      'townhome',
      'loft',
      'penthouse',
      'skyscraper',
      'suite',
      'apartment',
      'duplex'
    ],
    icon: { type: 'fa', icon: 'fa-building' }
  },
  {
    keywords: ['houseboat', 'floating', 'underwater'],
    icon: { type: 'mi', icon: 'houseboat' }
  },
  {
    keywords: ['farm', 'ranch'],
    icon: { type: 'fa', icon: 'fa-tractor' }
  },
  {
    keywords: ['villa'],
    icon: { type: 'mi', icon: 'villa' }
  },
  {
    keywords: ['mansion', 'estate'],
    icon: { type: 'mi', icon: 'domain' }
  },
  {
    keywords: ['chateau', 'castle'],
    icon: { type: 'fa', icon: 'fa-fort-awesome' }
  },
  {
    keywords: ['beach', 'oceanfront', 'river', 'lake', 'coastal', 'lakeside'],
    icon: { type: 'fa', icon: 'fa-water' }
  },
  {
    keywords: ['treehouse'],
    icon: { type: 'fa', icon: 'fa-tree-city' }
  },
  {
    keywords: ['futuristic', 'space', 'lunar', 'galactic'],
    icon: { type: 'fa', icon: 'fa-landmark' }
  }
];

const defaultIcon = { type: 'fa', icon: 'fa-house' };

const MAINTENANCE_RATE = 0.01;

function pickIcon(name) {
  const lower = name.toLowerCase();
  for (const mapping of iconMappings) {
    if (mapping.keywords.some(k => lower.includes(k))) {
      return mapping.icon;
    }
  }
  return defaultIcon;
}

export async function loadHouseCategories() {
  if (houseCategories.length) return houseCategories;
  try {
    const res = await fetch('./activities/data/houseCategories.json');
    houseCategories = await res.json();
    houseCategories.forEach(c => {
      c.icon = pickIcon(c.type);
    });
  } catch (err) {
    console.error('Failed to load house categories', err);
    houseCategories = [];
  }
  return houseCategories;
}

loadHouseCategories();

const brokerNames = [
  'Zalara Realty',
  'Quonix Estates',
  'Vasplex Homes',
  'Nebulo Properties',
  'Fentor Holdings',
  'Glyntor Realty',
  'Xerith Estates',
  'Brivon Homes',
  'Trenlor Realty',
  'Omnix Properties',
  'Kyverna Realty',
  'Dexium Estates',
  'Lunaro Homes',
  'Zyntri Realty',
  'Cryntal Properties',
  'Vornex Homes',
  'Jaxial Realty',
  'Tylora Estates',
  'Plixar Properties',
  'Fynox Realty'
];

export const brokers = [];

function weightedPrice() {
  const min = Math.log10(10000);
  const max = Math.log10(100000000);
  const logVal = min + (max - min) * Math.random() ** 2;
  return Math.round(10 ** logVal);
}

function categoryForPrice(value) {
  const matches = houseCategories.filter(
    c => value >= c.min && value <= c.max
  );
  if (matches.length > 0) {
    return matches[rand(0, matches.length - 1)];
  }
  return houseCategories[houseCategories.length - 1];
}

export async function initBrokers() {
  brokers.length = 0;
  await loadHouseCategories();
  const names = [...brokerNames];
  for (let i = 0; i < 5; i++) {
    const listings = [];
    const count = rand(1, 20);
    for (let j = 0; j < count; j++) {
      const value = weightedPrice();
      const category = categoryForPrice(value);
      listings.push({
        id: `${i}-${j}-${Date.now()}`,
        name: category.type,
        value,
        icon: category.icon
      });
    }
    const name = names.splice(rand(0, names.length - 1), 1)[0];
    brokers.push({
      id: i + 1,
      name,
      listings
    });
  }
}

export function buyProperty(broker, listing) {
  if (game.money < listing.value) {
    addLog(`Not enough money to buy ${listing.name}.`, 'property');
    saveGame();
    return false;
  }
  game.money -= listing.value;
  const prop = {
    id: Date.now(),
    name: listing.name,
    value: listing.value,
    maintenanceCost: Math.round(listing.value * MAINTENANCE_RATE),
    condition: 100,
    rented: false,
    rent: 0,
    tenant: null,
    icon: listing.icon
  };
  game.properties.push(prop);
  broker.listings = broker.listings.filter(l => l !== listing);
  addLog(
    `You bought ${listing.name} from ${broker.name} for $${listing.value.toLocaleString()}.`,
    'property'
  );
  if (game.properties.length === 1) {
    unlockAchievement('first-property', 'Bought your first property.');
  }
  saveGame();
  return true;
}

export function sellProperty(prop) {
  game.money += prop.value;
  game.properties = game.properties.filter(p => p !== prop);
  addLog(`You sold ${prop.name} for $${prop.value.toLocaleString()}.`, 'property');
  saveGame();
}

export function rentProperty(prop, percent) {
  if (prop.rented) {
    addLog(`${prop.name} is already rented.`, 'property');
    saveGame();
    return;
  }
  const pct = clamp(percent, 1, 10);
  const rent = Math.round(prop.value * pct / 100);
  const tenant = `${faker.person.firstName()} ${faker.person.lastName()}`;
  prop.rented = true;
  prop.rent = rent;
  prop.tenant = tenant;
  addLog(`You rented ${prop.name} to ${tenant} for $${rent.toLocaleString()} per year.`, 'property');
  saveGame();
}

export function repairProperty(prop, percent) {
  const cost = Math.round(prop.value * percent / 100);
  if (game.money < cost) {
    addLog(`Repairing ${prop.name} costs $${cost.toLocaleString()}. Not enough money.`, 'property');
    saveGame();
    return;
  }
  game.money -= cost;
  let chance = 0;
  if (percent === 10) chance = 40;
  else if (percent === 25) chance = 60;
  else if (percent === 50) chance = 80;
  else if (percent === 100) chance = 95;
  else chance = Math.min(95, percent);
  const roll = rand(1, 100);
  if (roll <= chance) {
    prop.condition = 100;
    addLog(`Repair succeeded on ${prop.name}.`, 'property');
  } else {
    addLog(`Repair failed on ${prop.name}.`, 'property');
  }
  saveGame();
}

export function tickRealEstate() {
  for (const prop of game.properties) {
    const factor = rand(95, 110) / 100;
    prop.value = Math.round(prop.value * factor);
    const tax = Math.round(prop.value * 0.01);
    game.money -= tax;
    addLog(`Paid $${tax.toLocaleString()} in property tax for ${prop.name}.`);
    if (prop.rented) {
      game.money += prop.rent;
      prop.condition = clamp(prop.condition - rand(1, 3), 0, 100);
    }
  }
}

