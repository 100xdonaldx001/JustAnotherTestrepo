import { refreshOpenWindows } from './windowManager.js';

export const game = {
  year: new Date().getFullYear(),
  age: 0,
  health: 80,
  happiness: 70,
  smarts: 65,
  looks: 50,
  money: 0,
  job: null,
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

export function newLife() {
  const now = new Date().getFullYear();
  Object.assign(game, {
    year: now,
    age: 0,
    health: 80,
    happiness: 70,
    smarts: 65,
    looks: 50,
    money: 0,
    job: null,
    sick: false,
    inJail: false,
    alive: true,
    log: []
  });
  addLog('You were born. A new life begins.');
  refreshOpenWindows();
}
