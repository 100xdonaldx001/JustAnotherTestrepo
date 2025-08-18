import { game, addLog } from './state.js';
import { rand, clamp } from './utils.js';
import { tickJail } from './jail.js';
import { refreshOpenWindows } from './windowManager.js';

function paySalary() {
  if (game.job && !game.inJail) {
    const monthly = game.job.salary / 12;
    const earned = Math.round(monthly * rand(10, 12));
    game.money += earned;
    addLog(`You worked as a ${game.job.title} and earned $${earned.toLocaleString()}.`);
  }
}

function randomEvent() {
  if (game.age === 5) {
    addLog('You learned to read and write. (+Smarts)');
    game.smarts = clamp(game.smarts + rand(2, 5));
  }
  if (game.age === 12) {
    addLog('You discovered video games. (+Happiness, -Looks?)');
    game.happiness = clamp(game.happiness + 4);
    game.looks = clamp(game.looks - 1);
  }
  if (game.age === 16) {
    addLog('You can start looking for a part-time job.');
  }
  if (game.age === 18) {
    addLog('You finished school. Time to work or study!');
  }
  if (!game.sick && rand(1, 100) <= 8) {
    game.sick = true;
    addLog('You caught a nasty flu. (See Doctor)');
  }
  if (game.age > 50 && rand(1, 100) <= game.age - 45) {
    addLog('Aches and pains are catching up with you. (-Health)');
    game.health = clamp(game.health - rand(2, 6));
  }
  if (rand(1, 1000) === 1) {
    game.alive = false;
    addLog('A tragic accident ended your life.');
  }
}

export function ageUp() {
  if (!game.alive) {
    addLog('You are no longer alive. Start a new life.');
    return;
  }
  game.age += 1;
  game.year += 1;
  game.health = clamp(game.health - rand(1, 4));
  game.happiness = clamp(game.happiness + rand(-2, 3));
  if (game.sick) {
    game.health = clamp(game.health - rand(2, 6));
  }
  paySalary();
  randomEvent();
  if (game.health <= 0) {
    game.alive = false;
    addLog('Your health reached zero. You passed away.');
  }
  tickJail();
  refreshOpenWindows();
}

export function study() {
  if (!game.alive) return;
  if (game.inJail) {
    addLog('You studied in jail. (+Smarts)');
  }
  const gain = rand(2, 4);
  const mood = rand(-1, 1);
  game.smarts = clamp(game.smarts + gain);
  game.happiness = clamp(game.happiness + mood);
  addLog(`You studied hard. +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`);
  refreshOpenWindows();
}

export function workExtra() {
  if (!game.job) {
    addLog('You need a job first.');
    return;
  }
  if (game.inJail) {
    addLog('You cannot work extra while in jail.');
    return;
  }
  const bonus = rand(200, 1500);
  game.money += bonus;
  game.happiness = clamp(game.happiness - rand(0, 2));
  game.health = clamp(game.health - rand(0, 2));
  addLog(`You took overtime. Earned $${bonus.toLocaleString()}. (-Small Health/Happiness)`);
  refreshOpenWindows();
}

export function hitGym() {
  if (game.inJail) {
    game.health = clamp(game.health + rand(2, 5));
    game.happiness = clamp(game.happiness + rand(1, 3));
    addLog('You worked out in the yard. (+Health, +Happiness)');
  } else {
    const cost = 20;
    if (game.money < cost) {
      addLog('Not enough money for the gym ($20).');
      return;
    }
    game.money -= cost;
    game.health = clamp(game.health + rand(2, 5));
    game.happiness = clamp(game.happiness + rand(1, 3));
    addLog('You hit the gym. (+Health, +Happiness)');
  }
  refreshOpenWindows();
}

export function seeDoctor() {
  if (game.inJail) {
    addLog('No access to a doctor here.');
    return;
  }
  const cost = game.sick ? 120 : 60;
  if (game.money < cost) {
    addLog(`Doctor visit costs $${cost}. Not enough money.`);
    return;
  }
  game.money -= cost;
  if (game.sick) {
    game.sick = false;
    game.health = clamp(game.health + rand(6, 12));
    addLog('The doctor treated your illness. (+Health)');
  } else {
    game.health = clamp(game.health + rand(2, 6));
    addLog('Routine check-up made you feel better. (+Health)');
  }
  refreshOpenWindows();
}

export function crime() {
  if (game.inJail) {
    addLog('You are already in jail.');
    return;
  }
  const crimes = [
    { name: 'Pickpocket', risk: 12, reward: [50, 180] },
    { name: 'Shoplift', risk: 18, reward: [80, 400] },
    { name: 'Car theft', risk: 35, reward: [800, 6000] },
    { name: 'Bank robbery', risk: 60, reward: [5000, 45000] }
  ];
  const c = crimes[rand(0, crimes.length - 1)];
  const roll = rand(1, 100);
  if (roll > c.risk) {
    const amount = rand(c.reward[0], c.reward[1]);
    game.money += amount;
    game.happiness = clamp(game.happiness + rand(0, 2));
    addLog(`Crime succeeded: ${c.name}. You gained $${amount.toLocaleString()}.`);
  } else {
    if (rand(1, 100) <= 75) {
      game.inJail = true;
      game.jailYears = rand(1, 4);
      addLog(`Busted doing ${c.name}. You were jailed for ${game.jailYears} year(s).`);
    } else {
      const dmg = rand(4, 15);
      game.health = clamp(game.health - dmg);
      addLog(`Crime failed: ${c.name}. You were injured (-${dmg} Health).`);
      if (game.health <= 0) {
        game.alive = false;
        addLog('You died from your injuries.');
      }
    }
  }
  refreshOpenWindows();
}
