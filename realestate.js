import { game, addLog } from './state.js';
import { rand, clamp } from './utils.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';

// house categories with associated price ranges (ranges may overlap)
const houseCategories = [
  { type: 'Trailer', min: 10000, max: 25000 },
  { type: 'Tiny House', min: 15000, max: 75000 },
  { type: 'Condo', min: 20000, max: 150000 },
  { type: 'Manufactured Home', min: 50000, max: 250000 },
  { type: 'Cottage', min: 80000, max: 350000 },
  { type: 'Houseboat', min: 50000, max: 500000 },
  { type: 'Farm', min: 150000, max: 1000000 },
  { type: 'TownHome', min: 200000, max: 1500000 },
  { type: 'Bungalow', min: 150000, max: 1200000 },
  { type: 'Duplex', min: 250000, max: 2000000 },
  { type: 'Mid Century Home', min: 300000, max: 3000000 },
  { type: 'Craftsman Home', min: 400000, max: 3500000 },
  { type: 'Ranch', min: 500000, max: 5000000 },
  { type: 'Loft', min: 600000, max: 4000000 },
  { type: 'Colonial Home', min: 800000, max: 8000000 },
  { type: 'Chateau', min: 5000000, max: 25000000 },
  { type: 'Beach House', min: 1000000, max: 10000000 },
  { type: 'Mansion', min: 10000000, max: 50000000 },
  { type: 'Luxury Villa', min: 5000000, max: 60000000 },
  { type: 'Penthouse', min: 5000000, max: 50000000 },
  { type: 'Castle', min: 20000000, max: 100000000 },
  { type: 'Skyscraper Apartment', min: 50000000, max: 100000000 },
  { type: 'Futuristic Home', min: 30000000, max: 100000000 },
  { type: 'Treehouse', min: 20000, max: 150000 },
  { type: 'Villa', min: 1500000, max: 40000000 },
  { type: 'Studio Apartment', min: 10000, max: 50000 },
  { type: 'Row House', min: 15000, max: 60000 },
  { type: 'Mobile Home', min: 20000, max: 70000 },
  { type: 'Yurt', min: 25000, max: 60000 },
  { type: 'Igloo', min: 20000, max: 50000 },
  { type: 'Cave Home', min: 30000, max: 90000 },
  { type: 'Basement Suite', min: 40000, max: 100000 },
  { type: 'Coach House', min: 45000, max: 120000 },
  { type: 'Laneway House', min: 50000, max: 130000 },
  { type: 'Garden Shed', min: 10000, max: 30000 },
  { type: 'Container Home', min: 30000, max: 110000 },
  { type: 'Cohousing Unit', min: 60000, max: 150000 },
  { type: 'Student Apartment', min: 20000, max: 80000 },
  { type: 'Tiny Condo', min: 50000, max: 200000 },
  { type: 'Cabin', min: 70000, max: 250000 },
  { type: 'Modular Home', min: 100000, max: 250000 },
  { type: 'Suburban Home', min: 150000, max: 300000 },
  { type: 'Townhouse', min: 180000, max: 450000 },
  { type: 'Row Condo', min: 150000, max: 400000 },
  { type: 'Eco Cottage', min: 120000, max: 350000 },
  { type: 'River Cabin', min: 200000, max: 500000 },
  { type: 'Lake Cottage', min: 200000, max: 500000 },
  { type: 'Forest Cabin', min: 180000, max: 450000 },
  { type: 'Desert House', min: 220000, max: 480000 },
  { type: 'Mountain Hut', min: 150000, max: 400000 },
  { type: 'Coastal Bungalow', min: 250000, max: 500000 },
  { type: 'Country Home', min: 200000, max: 450000 },
  { type: 'Farmhouse', min: 250000, max: 600000 },
  { type: 'Riverside Home', min: 200000, max: 550000 },
  { type: 'City Loft', min: 300000, max: 650000 },
  { type: 'Urban Loft', min: 500000, max: 900000 },
  { type: 'Garden Home', min: 500000, max: 1000000 },
  { type: 'Modern Ranch', min: 550000, max: 1100000 },
  { type: 'Split-Level Home', min: 600000, max: 1200000 },
  { type: 'Industrial Loft', min: 650000, max: 1300000 },
  { type: 'Modern Farmhouse', min: 700000, max: 1400000 },
  { type: 'Family Estate', min: 750000, max: 1500000 },
  { type: 'City Villa', min: 800000, max: 1600000 },
  { type: 'Beachfront Condo', min: 850000, max: 1700000 },
  { type: 'Hilltop House', min: 900000, max: 1800000 },
  { type: 'Country Manor', min: 950000, max: 1900000 },
  { type: 'Urban Townhome', min: 500000, max: 1500000 },
  { type: 'Eco Home', min: 800000, max: 2000000 },
  { type: 'Cliff House', min: 900000, max: 2200000 },
  { type: 'River House', min: 700000, max: 2000000 },
  { type: 'Mountain Chalet', min: 1000000, max: 3000000 },
  { type: 'Lake House', min: 1000000, max: 4000000 },
  { type: 'Savannah Estate', min: 1200000, max: 3500000 },
  { type: 'Island Bungalow', min: 1500000, max: 4500000 },
  { type: 'Suburban Estate', min: 1300000, max: 3000000 },
  { type: 'Gated Villa', min: 2000000, max: 5000000 },
  { type: 'Lakeside Villa', min: 1800000, max: 4500000 },
  { type: 'Oceanfront Home', min: 2500000, max: 5500000 },
  { type: 'Skyline Condo', min: 2000000, max: 4500000 },
  { type: 'Executive Suite', min: 1500000, max: 4000000 },
  { type: 'Penthouse Suite', min: 3000000, max: 7000000 },
  { type: 'Mega Ranch', min: 2500000, max: 5000000 },
  { type: 'Futuristic Villa', min: 2000000, max: 8000000 },
  { type: 'Sky Loft', min: 1500000, max: 3500000 },
  { type: 'Luxury Condo', min: 2000000, max: 5000000 },
  { type: 'Cliffside Mansion', min: 5000000, max: 20000000 },
  { type: 'Desert Villa', min: 5000000, max: 25000000 },
  { type: 'Riverfront Mansion', min: 6000000, max: 30000000 },
  { type: 'Coastal Estate', min: 7000000, max: 35000000 },
  { type: 'Highland Castle', min: 10000000, max: 40000000 },
  { type: 'Mega Mansion', min: 15000000, max: 60000000 },
  { type: 'Sky Villa', min: 8000000, max: 45000000 },
  { type: 'Urban Penthouse', min: 10000000, max: 50000000 },
  { type: 'Space Age Home', min: 15000000, max: 70000000 },
  { type: 'Floating Mansion', min: 20000000, max: 80000000 },
  { type: 'Skyscraper Loft', min: 50000000, max: 90000000 },
  { type: 'Space Station Condo', min: 60000000, max: 100000000 },
  { type: 'Underwater Home', min: 55000000, max: 100000000 },
  { type: 'Lunar Villa', min: 70000000, max: 100000000 },
  { type: 'Galactic Estate', min: 80000000, max: 100000000 }
];

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

export function initBrokers() {
  brokers.length = 0;
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
        value
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
    addLog(`Not enough money to buy ${listing.name}.`);
    return false;
  }
  game.money -= listing.value;
  const prop = {
    id: Date.now(),
    name: listing.name,
    value: listing.value,
    condition: 100,
    rented: false,
    rent: 0,
    tenant: null
  };
  game.properties.push(prop);
  broker.listings = broker.listings.filter(l => l !== listing);
  addLog(
    `You bought ${listing.name} from ${broker.name} for $${listing.value.toLocaleString()}.`
  );
  return true;
}

export function rentProperty(prop, percent) {
  if (prop.rented) {
    addLog(`${prop.name} is already rented.`);
    return;
  }
  const pct = clamp(percent, 1, 10);
  const rent = Math.round(prop.value * pct / 100);
  const tenant = `${faker.person.firstName()} ${faker.person.lastName()}`;
  prop.rented = true;
  prop.rent = rent;
  prop.tenant = tenant;
  addLog(`You rented ${prop.name} to ${tenant} for $${rent.toLocaleString()} per year.`);
}

export function repairProperty(prop, percent) {
  const cost = Math.round(prop.value * percent / 100);
  if (game.money < cost) {
    addLog(`Repairing ${prop.name} costs $${cost.toLocaleString()}. Not enough money.`);
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
    addLog(`Repair succeeded on ${prop.name}.`);
  } else {
    addLog(`Repair failed on ${prop.name}.`);
  }
}

export function tickRealEstate() {
  for (const prop of game.properties) {
    const factor = rand(95, 110) / 100;
    prop.value = Math.round(prop.value * factor);
    if (prop.rented) {
      game.money += prop.rent;
      prop.condition = clamp(prop.condition - rand(1, 3), 0, 100);
    }
  }
}

