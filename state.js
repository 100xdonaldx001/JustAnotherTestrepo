import { refreshOpenWindows, openWindow, closeAllWindows } from './windowManager.js';
import { rand } from './utils.js';
import { StateMachine } from './utils/stateMachine.js';
import { showEndScreen, hideEndScreen } from './endscreen.js';
import { initBrokers } from './realestate.js';
import { getFaker } from './utils/faker.js';
import { renderLog } from './renderers/log.js';
import { renderCharacter } from './renderers/character.js';

const faker = await getFaker();

export const lifeState = new StateMachine('initial', {
  initial: { start: 'alive' },
  alive: { die: 'dead', restart: 'alive' },
  dead: { restart: 'alive' }
});

function randomParent() {
  return { age: rand(20, 60), health: rand(60, 100) };
}

function randomSiblings() {
  const count = rand(0, 3);
  const siblings = [];
  for (let i = 0; i < count; i++) {
    siblings.push({ age: rand(0, 18), happiness: rand(40, 80) });
  }
  return siblings;
}

export const ACHIEVEMENTS = {
  'first-job': 'Got your first job.',
  'first-property': 'Bought your first property.',
  millionaire: 'Earned $1,000,000.',
  centenarian: 'Reached age 100.',
  phd: 'Earned a PhD.'
};

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
  economyPhase: 'normal',
  economyPhaseYears: rand(3, 7),
  insurancePlan: null,
  medicalBills: 0,
  economy: 'normal',
  weather: 'sunny',
  loanInterestRate: 0.05,
  followers: 0,
  lastPost: 0,
  reputation: 50,
  charityTotal: 0,
  charityYear: 0,
  taxPaid: 0,
  properties: [],
  cars: [],
  portfolio: [],
  businesses: [],
  job: null,
  jobSatisfaction: 50,
  jobPerformance: 50,
  jobExperience: 0,
  jobLevel: null,
  retired: false,
  pension: 0,
  pensionFromSavings: false,
  unemployment: 0,
  jobListings: [],
  jobListingsYear: null,
  relationships: [],
  children: [],
  siblings: [],
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
  onParole: false,
  alive: true,
  skills: {
    gambling: 0,
    racing: 0,
    fitness: 0
  },
  log: []
};

let currentSlot = storageAvailable() ? localStorage.getItem('currentSlot') : null;

function getSlots() {
  if (!storageAvailable()) return [];
  try {
    const slots = JSON.parse(localStorage.getItem('saveSlots') || '[]');
    return Array.isArray(slots) ? slots : [];
  } catch {
    return [];
  }
}

function setSlots(slots) {
  if (storageAvailable()) {
    localStorage.setItem('saveSlots', JSON.stringify(slots));
  }
}

export function listSlots() {
  return getSlots();
}

export function getCurrentSlot() {
  return currentSlot;
}

export function setCurrentSlot(name) {
  if (!storageAvailable()) return;
  currentSlot = name;
  localStorage.setItem('currentSlot', name);
}

export function deleteSlot(name) {
  if (!storageAvailable()) return;
  localStorage.removeItem(`gameState_${name}`);
  const slots = getSlots().filter(s => s !== name);
  setSlots(slots);
  if (currentSlot === name) {
    currentSlot = null;
    localStorage.removeItem('currentSlot');
  }
}

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

export function unlockAchievement(id) {
  if (game.achievements.some(a => a.id === id)) return;
  const text = ACHIEVEMENTS[id] || id;
  game.achievements.push({ id, text });
  addLog(`Achievement unlocked: ${text}`, 'achievement');
  saveGame();
}

/**
 * Ends the current life with a supplied reason.
 * @param {string} reason - Cause of death to log.
 * @returns {void}
 */
export function die(reason) {
  if (!game.alive) return;
  game.alive = false;
  lifeState.transition('die');
  addLog(reason, 'life');
  closeAllWindows();
  openWindow('log', 'Log', renderLog);
  openWindow('character', 'Character', renderCharacter);
  import('./renderers/newlife.js').then(({ renderNewLife }) => {
    openWindow('newLife', 'New Life', renderNewLife);
  });
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
  if (!currentSlot) {
    const existing = getSlots();
    let idx = 1;
    let slot = `slot${idx}`;
    while (existing.includes(slot)) {
      idx++;
      slot = `slot${idx}`;
    }
    setCurrentSlot(slot);
  }
  const slots = getSlots();
  if (!slots.includes(currentSlot)) {
    slots.push(currentSlot);
    setSlots(slots);
  }
  localStorage.setItem(`gameState_${currentSlot}`, JSON.stringify(game));
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

export function loadGame(slot = currentSlot) {
  if (!storageAvailable()) {
    console.warn('Local storage is unavailable; cannot load game.');
    return false;
  }
  if (!slot) return false;
  const data = localStorage.getItem(`gameState_${slot}`);
  if (!data) return false;
  try {
    Object.assign(game, JSON.parse(data));
    if (!game.skills) {
      game.skills = { gambling: 0, racing: 0, fitness: 0 };
    } else if (game.skills.fitness === undefined) {
      game.skills.fitness = 0;
    }
    if (!game.businesses) {
      game.businesses = [];
    }
    if (!('insurancePlan' in game)) {
      game.insurancePlan = null;
    }
    if (typeof game.medicalBills !== 'number') {
      game.medicalBills = 0;
    }
    if (!game.children) {
      game.children = [];
    }
    if (!game.economyPhase) {
      game.economyPhase = 'normal';
    }
    if (!game.economyPhaseYears) {
      game.economyPhaseYears = rand(3, 7);
    }
    if (game.lastPost === undefined) {
      game.lastPost = 0;
    }
  } catch {
    localStorage.removeItem(`gameState_${slot}`);
    deleteSlot(slot);
    return false;
  }
  setCurrentSlot(slot);
  initBrokers().then(refreshOpenWindows);
  refreshOpenWindows();
  return true;
}

export function newLife(genderInput, nameInput, options = {}) {
/**
 * Starts a new life, resetting the game state and prompting for basic info.
 * Accepts optional overrides via the options parameter for generational play.
 * @returns {void}
 */
  lifeState.transition(lifeState.state === 'initial' ? 'start' : 'restart');
  const currentYear = new Date().getFullYear();
  const startYear = options.startYear ?? rand(1900, currentYear);
  hideEndScreen();
  setDockButtonsDisabled(false);
  if (currentSlot) {
    localStorage.removeItem(`gameState_${currentSlot}`);
  } else {
    const slots = listSlots();
    let idx = 1;
    let slot = `slot${idx}`;
    while (slots.includes(slot)) {
      idx++;
      slot = `slot${idx}`;
    }
    setCurrentSlot(slot);
  }
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
    age: options.age ?? 0,
    maxAge: rand(80, 120),
    health: 80,
    happiness: options.happiness ?? 70,
    smarts: 65,
    looks: 50,
    addiction: 0,
    money: 0,
    loanBalance: 0,
    insuranceLevel: 0,
    economyPhase: 'normal',
    economyPhaseYears: rand(3, 7),
    insurancePlan: null,
    medicalBills: 0,
    economy: 'normal',
    weather: 'sunny',
    loanInterestRate: 0.05,
    followers: 0,
    lastPost: 0,
    reputation: 50,
    charityTotal: 0,
    charityYear: 0,
    taxPaid: 0,
    properties: [],
    cars: [],
    portfolio: [],
    businesses: [],
    job: null,
    jobSatisfaction: 50,
    jobPerformance: 50,
    jobExperience: 0,
    jobLevel: null,
    retired: false,
    pension: 0,
    pensionFromSavings: false,
    unemployment: 0,
    jobListings: [],
    jobListingsYear: null,
    relationships: [],
    children: [],
    siblings: options.siblings ?? randomSiblings(),
    parents: options.parents ?? {
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
      racing: 0,
      fitness: 0
    },
    log: []
  });
  initBrokers().then(refreshOpenWindows);
  if (!options.skipBirthLog) {
    addLog([
      'You were born. A new life begins.',
      'Welcome to the world! A new journey starts.',
      'A new life springs forth—you were just born.',
      'You entered the world. The adventure begins.',
      'A new life dawns as you are born.'
    ], 'life');
  }
  refreshOpenWindows();
  saveGame();
}

export function continueAsChild(index) {
  const child = game.children?.[index];
  if (!child) return;
  const name = child.name ? child.name : `Child ${index + 1}`;
  newLife(null, name, {
    startYear: game.year,
    age: child.age,
    happiness: child.happiness,
    skipBirthLog: true
  });
  addLog(`You continue life as ${name}.`, 'life');
}

window.addEventListener('beforeunload', saveGame);

