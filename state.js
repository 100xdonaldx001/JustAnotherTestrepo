import { refreshOpenWindows } from './windowManager.js';
import { rand } from './utils.js';
import { showEndScreen, hideEndScreen } from './endscreen.js';
import { faker as fallbackFaker } from './nameGenerator.js';
import { initBrokers } from './realestate.js';

let faker = fallbackFaker;

(async () => {
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm');
    faker = mod.faker;
  } catch (err) {
    console.warn('Faker CDN import failed, using internal generator', err);
  }
})();

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
  loanBalance: 0,
  loanInterestRate: 0.05,
  followers: 0,
  properties: [],
  job: null,
  jobPerformance: 50,
  jobExperience: 0,
  jobLevel: null,
  jobListings: [],
  jobListingsYear: null,
  relationships: [],
  inheritance: null,
  achievements: [],
  education: {
    current: null,
    highest: 'none',
    progress: 0,
    droppedOut: false,
    major: null
  },
  gender: '',
  name: '',
  city: '',
  country: '',
  sick: false,
  inJail: false,
  alive: true,
  log: []
};

/**
 * Adds an entry to the game log and refreshes any open windows.
 * @param {string} text - Message to record in the log.
 * @returns {void}
 */
export function addLog(text, category = 'general') {
  if (Array.isArray(text)) {
    text = text[rand(0, text.length - 1)];
  }
  const when = `${game.year} • age ${game.age}`;
  game.log.unshift({ when, text, category });
  if (game.log.length > 200) game.log.pop();
  refreshOpenWindows();
}

export function unlockAchievement(id, text) {
  if (game.achievements.some(a => a.id === id)) return;
  game.achievements.push({ id, text });
  addLog(`Achievement unlocked: ${text}`);
  saveGame();
}

/**
 * Ends the current life with a supplied reason.
 * @param {string} reason - Cause of death to log.
 * @returns {void}
 */
export function die(reason) {
  game.alive = false;
  addLog(reason, 'life');
  showEndScreen(game);
}

/**
 * Saves the current game state to local storage.
 * @returns {void}
 */
export function saveGame() {
  if (!storageAvailable()) {
    console.warn('Local storage is unavailable; cannot save game.');
    return;
  }
  localStorage.setItem('gameState', JSON.stringify(game));
}

/**
 * Loads the game state from local storage if available.
 * @returns {boolean} True if a saved game was found and loaded.
 */
export function applyAndSave(updater) {
  updater();
  refreshOpenWindows();
  saveGame();
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

export function newLife(genderInput, nameInput) {
/**
 * Starts a new life, resetting the game state and prompting for basic info.
 * @returns {void}
 */
  const now = new Date().getFullYear();
  hideEndScreen();
  localStorage.removeItem('gameState');
  let gender = genderInput?.trim();
  if (gender) {
    const lower = gender.toLowerCase();
    if (lower === 'male') gender = 'Male';
    else if (lower === 'female') gender = 'Female';
  } else {
    gender = rand(0, 1) === 0 ? 'Male' : 'Female';
  }
  let name = nameInput?.trim();
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
    loanBalance: 0,
    loanInterestRate: 0.05,
    followers: 0,
    properties: [],
    job: null,
    jobPerformance: 50,
    jobExperience: 0,
    jobLevel: null,
    jobListings: [],
    jobListingsYear: null,
    relationships: [],
    inheritance: null,
    achievements: [],
    education: {
      current: null,
      highest: 'none',
      progress: 0,
      droppedOut: false,
      major: null
    },
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
  addLog([
    'You were born. A new life begins.',
    'Welcome to the world! A new journey starts.',
    'A new life springs forth—you were just born.',
    'You entered the world. The adventure begins.',
    'A new life dawns as you are born.'
  ], 'life');
  refreshOpenWindows();
  saveGame();
}

window.addEventListener('beforeunload', saveGame);

