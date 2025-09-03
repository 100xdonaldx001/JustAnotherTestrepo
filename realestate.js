import { game, addLog } from './state.js';
import { rand, clamp } from './utils.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';

export const propertyListings = [
  { id: 1, name: 'Small House', value: 50000 },
  { id: 2, name: 'Downtown Condo', value: 120000 },
  { id: 3, name: 'Luxury Villa', value: 750000 }
];

export function buyProperty(listing) {
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
  addLog(`You bought ${listing.name} for $${listing.value.toLocaleString()}.`);
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

