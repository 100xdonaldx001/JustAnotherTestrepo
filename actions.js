import { game, addLog, die, saveGame, applyAndSave, unlockAchievement } from './state.js';
import { rand, clamp } from './utils.js';
import { tickJail } from './jail.js';
import { tickRelationships } from './activities/love.js';
import { tickRealEstate } from './realestate.js';
import { advanceSchool, accrueStudentLoanInterest } from './school.js';
import { tickJob, adjustJobPerformance } from './jobs.js';
import * as msg from './messages/actionMessages.js';

const promotionThresholds = { entry: 3, mid: 5 };
const promotionOrder = { entry: 'mid', mid: 'senior' };

function paySalary() {
  if (game.job && !game.inJail) {
    adjustJobPerformance();
    const monthly = game.job.salary / 12;
    const months = rand(10, 12);
    let earned = Math.round(monthly * months);
    if (game.jobPerformance >= 80) {
      const bonus = Math.round(earned * 0.2);
      earned += bonus;
      addLog('Your high performance earned you a bonus.', 'job');
    } else if (game.jobPerformance <= 20 && rand(1, 100) <= 20) {
      game.job.salary = Math.round(game.job.salary * 0.9);
      addLog('Poor performance led to a demotion and pay cut.', 'job');
    }
    game.money += earned;
    game.job.experience = (game.job.experience || 0) + (game.job.expMultiplier || 1);
      addLog(
        msg.paySalaryMessages(game.job.title, earned),
        'job'
      );
  }
}

function randomEvent() {
  if (game.age === 5) {
    addLog(msg.age5LiteracyMessages, 'education');
    game.smarts = clamp(game.smarts + rand(2, 5));
  }
  if (game.age === 12) {
    addLog(msg.age12VideoGameMessages, 'hobby');
    game.happiness = clamp(game.happiness + 4);
    game.looks = clamp(game.looks - 1);
  }
  if (game.age === 16) {
    addLog(msg.age16PartTimeJobMessages, 'job');
  }
  if (game.age === 25) {
    const rent = Math.min(2000, game.money);
    game.money -= rent;
    game.happiness = clamp(game.happiness + 2);
    addLog(msg.age25OwnPlaceMessages);
  }
  if (game.age === 30) {
    game.smarts = clamp(game.smarts + rand(1, 3));
    addLog(msg.age30ReflectionMessages);
  }
  if (game.age === 40) {
    const cost = Math.min(5000, game.money);
    game.money -= cost;
    game.happiness = clamp(game.happiness + 3);
    addLog(msg.age40SplurgeMessages);
  }
  if (!game.sick && rand(1, 100) <= 8) {
    game.sick = true;
    addLog(msg.fluMessages, 'health');
  }
  if (game.age > 50 && rand(1, 100) <= game.age - 45) {
    addLog(msg.age50HealthDeclineMessages, 'health');
    game.health = clamp(game.health - rand(2, 6));
  }
  if (rand(1, 200) === 1) {
    const found = rand(20, 200);
    game.money += found;
    addLog(msg.foundWalletMessages(found));
  }
  if (rand(1, 250) === 1 && game.money > 0) {
    const lost = Math.min(game.money, rand(10, 300));
    game.money -= lost;
    addLog(msg.lostWalletMessages(lost));
  }
  if (rand(1, 300) === 1) {
    game.smarts = clamp(game.smarts + rand(2, 4));
    addLog(msg.chanceLearningMessages);
  }
  if (rand(1, 1000) === 1) {
    die('A tragic accident ended your life.');
  }
}

function tickEconomy() {
  if (rand(1, 5) === 1) {
    const states = ['boom', 'normal', 'recession'];
    const next = states[rand(0, states.length - 1)];
    if (next !== game.economy) {
      game.economy = next;
      game.jobListings = [];
      addLog(`The economy shifted to a ${next}.`, 'economy');
    }
  }
}

/**
 * Advances the game by one year and processes daily updates.
 * @returns {void}
 */
export function ageUp() {
  if (!game.alive) {
    addLog(msg.alreadyDeadMessages, 'life');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.age += 1;
    game.year += 1;
    advanceSchool();
    game.health = clamp(game.health - rand(1, 4));
    game.happiness = clamp(game.happiness + rand(-2, 3));
    if (game.sick) {
      game.health = clamp(game.health - rand(2, 6));
    }
    paySalary();
    accrueStudentLoanInterest();
    randomEvent();
    tickJob();
    tickEconomy();
    tickRealEstate();
    if (game.job) {
      game.jobExperience += 1;
      const next = promotionOrder[game.jobLevel];
      const threshold = promotionThresholds[game.jobLevel];
      if (next && game.jobExperience >= threshold) {
        const base = game.job.baseTitle || game.job.title;
        game.jobExperience = 0;
        game.jobLevel = next;
        game.job.title = `${next === 'mid' ? 'Mid' : 'Senior'} ${base}`;
        game.job.salary = Math.round(game.job.salary * 1.5);
        addLog(
          `You were promoted to ${game.job.title}. Salary $${game.job.salary.toLocaleString()}/yr.`,
          'job'
        );
      }
      unlockAchievement('first-job', 'Got your first job.');
    }
    if (game.properties.length > 0) {
      unlockAchievement('first-property', 'Bought your first property.');
    }
    if (game.age >= game.maxAge) {
      game.alive = false;
      addLog(msg.oldAgeDeathMessages, 'life');
    }
    if (game.health <= 0 && game.alive) {
      game.alive = false;
      die('Your health reached zero. You passed away.');
    }
    tickJail();
    tickRelationships();
  });
}

/**
 * Studies to increase smarts, possibly affecting happiness.
 * @returns {void}
 */
export function study() {
  if (!game.alive) return;
  applyAndSave(() => {
    if (game.inJail) {
      addLog(msg.studyInJailMessages, 'education');
    }
    const gain = rand(2, 4);
    const mood = rand(-1, 1);
    game.smarts = clamp(game.smarts + gain);
    game.happiness = clamp(game.happiness + mood);
    addLog(msg.studyResultMessages(gain, mood), 'education');
  });
}

/**
 * Meditates to improve happiness and boost smarts slightly.
 * @returns {void}
 */
export function meditate() {
  if (!game.alive) return;
  applyAndSave(() => {
    const happy = rand(2, 5);
    const smart = rand(1, 2);
    game.happiness = clamp(game.happiness + happy);
    game.smarts = clamp(game.smarts + smart);
    addLog(msg.meditateMessages(happy, smart));
  });
}

/**
 * Works overtime to earn extra money at the cost of well-being.
 * @returns {void}
 */
export function workExtra() {
  if (!game.job) {
    addLog(msg.workExtraNoJobMessages, 'job');
    saveGame();
    return;
  }
  if (game.inJail) {
    addLog(msg.workExtraJailMessages, 'job');
    saveGame();
    return;
  }
  applyAndSave(() => {
    const bonus = rand(200, 1500);
    game.money += bonus;
    game.happiness = clamp(game.happiness - rand(0, 2));
    game.health = clamp(game.health - rand(0, 2));
    addLog(msg.workExtraResultMessages(bonus), 'job');
  });
}

/**
 * Visits the gym or works out in jail to improve stats.
 * @returns {void}
 */
export function hitGym() {
  if (game.inJail) {
    applyAndSave(() => {
      game.health = clamp(game.health + rand(2, 5));
      game.happiness = clamp(game.happiness + rand(1, 3));
      addLog(msg.hitGymJailMessages, 'health');
    });
    return;
  }
  const cost = 20;
  if (game.money < cost) {
    addLog(msg.hitGymNoMoneyMessages, 'health');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.money -= cost;
    game.health = clamp(game.health + rand(2, 5));
    game.happiness = clamp(game.happiness + rand(1, 3));
    addLog(msg.hitGymMessages, 'health');
  });
}

/**
 * Visits the doctor for health recovery.
 * @returns {void}
 */
export function seeDoctor() {
  if (game.inJail) {
    addLog(msg.doctorJailMessages, 'health');
    saveGame();
    return;
  }
  const cost = game.sick ? 120 : 60;
  if (game.money < cost) {
    addLog(msg.doctorNoMoneyMessages(cost), 'health');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.money -= cost;
    if (game.sick) {
      game.sick = false;
      game.health = clamp(game.health + rand(6, 12));
      addLog(msg.doctorHealedMessages, 'health');
    } else {
      game.health = clamp(game.health + rand(2, 6));
      addLog(msg.doctorCheckupMessages, 'health');
    }
  });
}

/**
 * Attempts a crime with varying risk and reward.
 * @returns {void}
 */
export function crime() {
  if (game.inJail) {
    addLog(msg.crimeJailMessages, 'crime');
    saveGame();
    return;
  }
  applyAndSave(() => {
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
      addLog(msg.crimeSuccessMessages(c.name, amount), 'crime');
    } else {
      if (rand(1, 100) <= 75) {
        game.inJail = true;
        game.jailYears = rand(1, 4);
        addLog(msg.crimeCaughtMessages(c.name, game.jailYears), 'crime');
      } else {
        const dmg = rand(4, 15);
        game.health = clamp(game.health - dmg);
        addLog(msg.crimeInjuryMessages(c.name, dmg), 'crime');
        if (game.health <= 0) {
          die('You died from your injuries.');
        }
      }
    }
  });
}

export { dropOut, enrollCollege, enrollUniversity, reEnrollHighSchool, getGed } from './school.js';

