import { refreshOpenWindows, openWindow, closeAllWindows } from './windowManager.js';
import { rand } from './utils.js';
import { showEndScreen, hideEndScreen } from './endscreen.js';
import { initBrokers } from './realestate.js';
import { getFaker } from './utils/faker.js';
import { renderNewLife } from './renderers/newlife.js';
import { renderLog } from './renderers/log.js';
import { renderCharacter } from './renderers/character.js';

const faker = await getFaker();

function randomParent() {
  return { age: rand(20, 60), health: rand(60, 100) };
}

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

function setDockButtonsDisabled(disabled) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.dock button').forEach(btn => {
    if (btn.id === 'themeToggle' || btn.id === 'transparencyToggle') return;
    btn.disabled = disabled;
  });
}

export const game = {
  year: rand(1900, new Date().getFullYear()),
  age: 0,
  maxAge: rand(80, 120),
  health: 80,
  happiness: 70,
  smarts: 65,
  looks: 50,
  addiction: 0,
  money: 0,
  loanBalance: 0,
  insuranceLevel: 0,
  economy: 'normal',
  weather: 'sunny',
  loanInterestRate: 0.05,
  followers: 0,
  lastPost: 0,
  reputation: 50,
  charityTotal: 0,
  properties: [],
  cars: [],
  portfolio: [],
  job: null,
  jobSatisfaction: 50,
  jobPerformance: 50,
  jobExperience: 0,
  jobLevel: null,
  unemployment: 0,
  jobListings: [],
  jobListingsYear: null,
  relationships: [],
  parents: {
    mother: randomParent(),
    father: randomParent()
  },
  inheritance: null,
  achievements: [],
  education: {
    current: null,
    highest: 'none',
    progress: 0,
    droppedOut: false
  },
  major: null,
  gender: '',
  name: '',
  city: '',
  country: '',
  sick: false,
  inJail: false,
  alive: true,
  skills: {
    gambling: 0,
    racing: 0
  },
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
  closeAllWindows();
  openWindow('log', 'Log', renderLog);
  openWindow('character', 'Character', renderCharacter);
  openWindow('newLife', 'New Life', renderNewLife);
  setDockButtonsDisabled(true);
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
    if (!game.skills) {
      game.skills = { gambling: 0, racing: 0 };
    }
    if (game.lastPost === undefined) {
      game.lastPost = 0;
    }
  } catch {
    localStorage.removeItem('gameState');
    return false;
  }
  initBrokers().then(refreshOpenWindows);
  refreshOpenWindows();
  return true;
}

export function newLife(genderInput, nameInput) {
/**
 * Starts a new life, resetting the game state and prompting for basic info.
 * @returns {void}
 */
  const currentYear = new Date().getFullYear();
  const startYear = rand(1900, currentYear);
  hideEndScreen();
  setDockButtonsDisabled(false);
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
    year: startYear,
    age: 0,
    maxAge: rand(80, 120),
    health: 80,
    happiness: 70,
    smarts: 65,
    looks: 50,
    addiction: 0,
    money: 0,
    loanBalance: 0,
    insuranceLevel: 0,
    economy: 'normal',
    weather: 'sunny',
    loanInterestRate: 0.05,
    followers: 0,
    lastPost: 0,
    reputation: 50,
    charityTotal: 0,
    properties: [],
    cars: [],
    portfolio: [],
    job: null,
    jobSatisfaction: 50,
    jobPerformance: 50,
    jobExperience: 0,
    jobLevel: null,
    unemployment: 0,
    jobListings: [],
    jobListingsYear: null,
    relationships: [],
    parents: {
      mother: randomParent(),
      father: randomParent()
    },
    inheritance: null,
    achievements: [],
    education: {
      current: null,
      highest: 'none',
      progress: 0,
      droppedOut: false
    },
    major: null,
    gender,
    name,
    city,
    country,
    sick: false,
    inJail: false,
    alive: true,
    skills: {
      gambling: 0,
      racing: 0
    },
    log: []
  });
  initBrokers().then(refreshOpenWindows);
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

