import { game, addLog, saveGame, unlockAchievement } from './state.js';
import { rand, clamp } from './utils.js';
import { getFaker } from './utils/faker.js';
import { taskChances } from './taskChances.js';

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
const DEFAULT_MORTGAGE_RATE = 0.05;

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
    const url = new URL('./activities/data/houseCategories.json', import.meta.url);
    const res = await fetch(url);
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

function generatePropertyDetails() {
  const street = faker.location?.streetAddress
    ? faker.location.streetAddress()
    : faker.location.city();
  const city = faker.location?.city ? faker.location.city() : '';
  const desc = faker.lorem?.sentence ? faker.lorem.sentence() : 'A lovely property.';
  return {
    address: `${street}${city ? ', ' + city : ''}`,
    beds: rand(1, 5),
    baths: rand(1, 4),
    area: rand(500, 5000),
    desc
  };
}

export function getPropertyDetails(prop) {
  if (!prop.details) {
    prop.details = generatePropertyDetails();
  }
  return prop.details;
}

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

export function buyProperty(broker, listing, mortgage = false) {
  if (!mortgage && game.money < listing.value) {
    addLog(`Not enough money to buy ${listing.name}.`, 'property');
    saveGame();
    return false;
  }
  if (!mortgage) {
    game.money -= listing.value;
  }
  const prop = {
    id: Date.now(),
    name: listing.name,
    value: listing.value,
    maintenanceCost: Math.round(listing.value * MAINTENANCE_RATE),
    condition: 100,
    rented: false,
    rent: 0,
    tenant: null,
    icon: listing.icon,
    renovation: null,
    details: listing.details,
    mortgage: null
  };
  if (mortgage) {
    const rate = game.loanInterestRate || DEFAULT_MORTGAGE_RATE;
    const months = 30 * 12;
    const monthlyRate = rate / 12;
    const payment = Math.round(
      listing.value * (monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1)
    );
    prop.mortgage = {
      balance: listing.value,
      rate,
      payment
    };
  }
  game.properties.push(prop);
  broker.listings = broker.listings.filter(l => l !== listing);
  addLog(
    `You bought ${listing.name} from ${broker.name} for $${listing.value.toLocaleString()}${
      mortgage ? ' with a mortgage' : ''
    }.`,
    'property'
  );
  if (game.properties.length === 1) {
    unlockAchievement('first-property');
  }
  saveGame();
  return true;
}

export function sellProperty(prop) {
  if (rand(1, 100) > taskChances.realEstate.sell) {
    addLog(
      [
        `No buyer was found for ${prop.name}.`,
        `Unable to find a buyer for ${prop.name}.`,
        `Nobody offered to purchase ${prop.name}.`
      ],
      'property'
    );
    saveGame();
    return;
  }
  const payoff = prop.mortgage ? prop.mortgage.balance : 0;
  const proceeds = Math.max(0, prop.value - payoff);
  game.money += proceeds;
  game.properties = game.properties.filter(p => p !== prop);
  addLog(
    [
      `You sold ${prop.name} for $${prop.value.toLocaleString()}${
        payoff > 0 ? ` and paid off $${payoff.toLocaleString()} mortgage` : ''
      }.`,
      `${prop.name} sold for $${prop.value.toLocaleString()}${
        payoff > 0 ? ` with $${payoff.toLocaleString()} mortgage payoff` : ''
      }.`,
      `A buyer purchased ${prop.name} for $${prop.value.toLocaleString()}${
        payoff > 0 ? ` and you cleared $${payoff.toLocaleString()} mortgage` : ''
      }.`
    ],
    'property'
  );
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
  const chanceMap = {
    10: taskChances.realEstate.repair10,
    25: taskChances.realEstate.repair25,
    50: taskChances.realEstate.repair50,
    100: taskChances.realEstate.repair100
  };
  const chance = chanceMap[percent] ?? Math.min(95, percent);
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
  const foreclosed = [];
  for (const prop of game.properties) {
    let factor;
    const phase = game.economyPhase;
    if (phase === 'boom') {
      factor = rand(105, 115) / 100;
    } else if (phase === 'recession') {
      factor = rand(85, 100) / 100;
    } else {
      factor = rand(95, 110) / 100;
    }
    prop.value = Math.round(prop.value * factor);
    const tax = Math.round(prop.value * 0.01);
    game.money -= tax;
      addLog(`Paid $${tax.toLocaleString()} in property tax for ${prop.name}.`, 'property');
    if (prop.mortgage) {
      let paid = 0;
      for (let m = 0; m < 12; m++) {
        const interest = Math.round(prop.mortgage.balance * prop.mortgage.rate / 12);
        prop.mortgage.balance += interest;
        const payment = Math.min(prop.mortgage.payment, prop.mortgage.balance);
        if (game.money >= payment) {
          game.money -= payment;
          prop.mortgage.balance -= payment;
          paid += payment;
          if (prop.mortgage.balance <= 0) break;
        } else {
          addLog(`You couldn't pay the mortgage on ${prop.name}. It was foreclosed.`, 'property');
          game.happiness = clamp(game.happiness - 20, 0, 100);
          foreclosed.push(prop);
          break;
        }
      }
      if (foreclosed.includes(prop)) {
        continue;
      }
      addLog(`Paid $${paid.toLocaleString()} toward the mortgage for ${prop.name}.`, 'property');
      if (prop.mortgage.balance <= 0) {
        addLog(`Mortgage on ${prop.name} fully paid off.`, 'property');
        prop.mortgage = null;
      }
    }
    if (prop.renovation) {
      prop.renovation.years -= 1;
      if (prop.renovation.years <= 0) {
        const increase = Math.round(prop.renovation.cost * 1.5);
        prop.value += increase;
        prop.condition = 100;
        addLog(
          `Renovation complete on ${prop.name}. Value increased by $${increase.toLocaleString()}.`,
          'property'
        );
        prop.renovation = null;
      }
      continue;
    }
    if (prop.rented) {
      game.money += prop.rent;
      prop.condition = clamp(prop.condition - rand(1, 3), 0, 100);
    }
  }
  if (foreclosed.length) {
    game.properties = game.properties.filter(p => !foreclosed.includes(p));
  }
}

