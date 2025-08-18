import { refreshOpenWindows } from './windowManager.js';
import { rand } from './utils.js';
import { showEndScreen, hideEndScreen } from './endscreen.js';

const maleNames = ['John', 'Michael', 'David'];
const femaleNames = ['Sarah', 'Emily', 'Jessica'];
const locations = [
  { city: 'New York', country: 'USA' },
  { city: 'London', country: 'UK' },
  { city: 'Tokyo', country: 'Japan' }
];

export const game = {
  year: new Date().getFullYear(),
  age: 0,
  maxAge: rand(80, 120),
  health: 80,
  happiness: 70,
  smarts: 65,
  looks: 50,
  money: 0,
  job: null,
  jobListings: [],
  jobListingsYear: null,
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

export function newLife() {
  const now = new Date().getFullYear();
  hideEndScreen();
  const gender = rand(0, 1) === 0 ? 'Male' : 'Female';
  const name =
    gender === 'Male'
      ? maleNames[rand(0, maleNames.length - 1)]
      : femaleNames[rand(0, femaleNames.length - 1)];
  const { city, country } = locations[rand(0, locations.length - 1)];
  Object.assign(game, {
    year: now,
    age: 0,
    maxAge: rand(80, 120),
    health: 80,
    happiness: 70,
    smarts: 65,
    looks: 50,
    money: 0,
    job: null,
    jobListings: [],
    jobListingsYear: null,
    gender,
    name,
    city,
    country,
    sick: false,
    inJail: false,
    alive: true,
    log: []
  });
  addLog('You were born. A new life begins.');
  refreshOpenWindows();
}

