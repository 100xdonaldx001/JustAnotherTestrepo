import { refreshOpenWindows } from './windowManager.js';
import { rand } from './utils.js';
import { showEndScreen, hideEndScreen } from './endscreen.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';
import { initBrokers } from './realestate.js';

export function storageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export const game = {
  year: new Date().getFullYear(),
  age: 0,
  maxAge: rand(80, 120),
  health: 80,
  happiness: 70,
  smarts: 65,
  looks: 50,
  addiction: 0,
  money: 0,
  followers: 0,
  properties: [],
  job: null,
  jobListings: [],
  jobListingsYear: null,
  relationships: [],
  inheritance: null,
  gender: '',
  name: '',
  city: '',
  country: '',
  sick: false,
  inJail: false,
  alive: true,
  log: []
};

export function addLog(text) {
  const when = `${game.year} • age ${game.age}`;
  game.log.unshift({ when, text });
  if (game.log.length > 200) game.log.pop();
  refreshOpenWindows();
}

export function die(reason) {
  game.alive = false;
  addLog(reason);
  showEndScreen(game);
}

export function saveGame() {
  if (!storageAvailable()) {
    console.warn('Local storage is unavailable; cannot save game.');
    return;
  }
  localStorage.setItem('gameState', JSON.stringify(game));
}

export function loadGame() {
  if (!storageAvailable()) {
    console.warn('Local storage is unavailable; cannot load game.');
    return false;
  }
  const data = localStorage.getItem('gameState');
  if (!data) return false;
  try {
    Object.assign(game, JSON.parse(data));
  } catch {
    localStorage.removeItem('gameState');
    return false;
  }
  refreshOpenWindows();
  return true;
}

export function newLife() {
  const now = new Date().getFullYear();
  hideEndScreen();
  localStorage.removeItem('gameState');
  let gender = prompt('Enter gender (Male/Female):')?.trim();
  if (gender) {
    const lower = gender.toLowerCase();
    if (lower === 'male') gender = 'Male';
    else if (lower === 'female') gender = 'Female';
  }
  if (!gender) {
    gender = rand(0, 1) === 0 ? 'Male' : 'Female';
  }
  let name = prompt('Enter name:')?.trim();
  if (!name) {
    const firstName = faker.person.firstName(
      gender === 'Male' ? 'male' : gender === 'Female' ? 'female' : undefined
    );
    const lastName = faker.person.lastName();
    name = `${firstName} ${lastName}`;
  }
  const city = faker.location.city();
  const country = faker.location.country();
  Object.assign(game, {
    year: now,
    age: 0,
    maxAge: rand(80, 120),
    health: 80,
    happiness: 70,
    smarts: 65,
    looks: 50,
    addiction: 0,
    money: 0,
    followers: 0,
    properties: [],
    job: null,
    jobListings: [],
    jobListingsYear: null,
    relationships: [],
    inheritance: null,
    gender,
    name,
    city,
    country,
    sick: false,
    inJail: false,
    alive: true,
    log: []
  });
  initBrokers();
  addLog('You were born. A new life begins.');
  refreshOpenWindows();
  saveGame();
}

window.addEventListener('beforeunload', saveGame);

