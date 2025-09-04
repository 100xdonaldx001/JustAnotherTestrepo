import { game, addLog, saveGame, applyAndSave, unlockAchievement } from '../state.js';
import { rand, clamp } from '../utils.js';
import { tickJail } from '../jail.js';
import { tickRelationships } from '../activities/love.js';
import { tickRealEstate } from '../realestate.js';
import * as school from '../school.js';
const { advanceSchool, accrueStudentLoanInterest } = school;
import { tickJob } from '../jobs.js';
import { paySalary, tickEconomy } from './job.js';
import { weekendEvent } from './weekend.js';

const promotionThresholds = { entry: 3, mid: 5 };
const promotionOrder = { entry: 'mid', mid: 'senior' };

function randomEvent() {
  if (game.age === 5) {
    addLog([
      'You learned to read and write. (+Smarts)',
      'Reading and writing finally clicked for you. (+Smarts)',
      'Letters and words make sense now—you can read and write. (+Smarts)',
      'You grasped literacy and your mind grew sharper. (+Smarts)',
      'The world of words opened up to you. (+Smarts)'
    ], 'education');
    game.smarts = clamp(game.smarts + rand(2, 5));
  }
  if (game.age === 12) {
    addLog([
      'You discovered video games. (+Happiness, -Looks?)',
      'Video games entered your life and brought you joy. (+Happiness, -Looks?)',
      'You found the world of gaming. (+Happiness, -Looks?)',
      'Pixels and fun: you started playing video games. (+Happiness, -Looks?)',
      'A new hobby emerged—video games! (+Happiness, -Looks?)'
    ], 'hobby');
    game.happiness = clamp(game.happiness + 4);
    game.looks = clamp(game.looks - 1);
  }
  if (game.age === 16) {
    addLog([
      'You can start looking for a part-time job.',
      'It\'s time to search for a part-time job.',
      'A part-time job is now within reach.',
      'You\'re old enough for part-time work.',
      'Start hunting for a part-time job.'
    ], 'job');
  }
  if (game.age === 25) {
    const rent = Math.min(2000, game.money);
    game.money -= rent;
    game.happiness = clamp(game.happiness + 2);
    addLog([
      'You moved into your own place. (-Money, +Happiness)',
      'A place of your own—costly but satisfying. (-Money, +Happiness)',
      'Independence! You got your own place. (-Money, +Happiness)',
      'You settled into a solo home. (-Money, +Happiness)',
      'Your own pad brings joy but drains cash. (-Money, +Happiness)'
    ]);
  }
  if (game.age === 30) {
    game.smarts = clamp(game.smarts + rand(1, 3));
    addLog([
      'You reflected on life and grew wiser. (+Smarts)',
      'Deep thoughts made you wiser. (+Smarts)',
      'Life reflection boosted your wisdom. (+Smarts)',
      'Contemplation sharpened your mind. (+Smarts)',
      'Thinking back on life, you gained insight. (+Smarts)'
    ]);
  }
  if (game.age === 40) {
    const cost = Math.min(5000, game.money);
    game.money -= cost;
    game.happiness = clamp(game.happiness + 3);
    addLog([
      'A midlife splurge lifted your spirits. (-Money, +Happiness)',
      'You treated yourself midlife and felt better. (-Money, +Happiness)',
      'A costly indulgence brightened your mood. (-Money, +Happiness)',
      'Retail therapy worked wonders midlife. (-Money, +Happiness)',
      'You spent freely and cheered up. (-Money, +Happiness)'
    ]);
  }
  const illnessChance = 8 + Math.floor((100 - game.health) / 5);
  if (!game.sick && rand(1, 100) <= illnessChance) {
    game.sick = true;
    addLog([
      'You caught a nasty flu. (See Doctor)',
      'A rough flu has you down. (See Doctor)',
      'You\'re sick with the flu. (See Doctor)',
      'Flu symptoms hit you hard. (See Doctor)',
      'You came down with the flu. (See Doctor)'
    ], 'health');
  }
  if (game.age > 50 && rand(1, 100) <= game.age - 45) {
    addLog([
      'Aches and pains are catching up with you. (-Health)',
      'Your body aches more these days. (-Health)',
      'Nagging pains remind you of age. (-Health)',
      'Soreness creeps in as time passes. (-Health)',
      'Health is waning; aches are frequent. (-Health)'
    ], 'health');
    game.health = clamp(game.health - rand(2, 6));
  }
  if (rand(1, 200) === 1) {
    const found = rand(20, 200);
    game.money += found;
    addLog([
      `You found a wallet with $${found.toLocaleString()} inside. (+Money)`,
      `A wallet on the ground held $${found.toLocaleString()}. (+Money)`,
      `Lucky find! $${found.toLocaleString()} was in a wallet you spotted. (+Money)`,
      `You stumbled upon $${found.toLocaleString()} in a discarded wallet. (+Money)`,
      `Someone\'s lost wallet gave you $${found.toLocaleString()}. (+Money)`
    ]);
  }
  if (rand(1, 250) === 1 && game.money > 0) {
    const lost = Math.min(game.money, rand(10, 300));
    game.money -= lost;
    addLog([
      `You lost your wallet. (-$${lost.toLocaleString()})`,
      `Your wallet went missing. (-$${lost.toLocaleString()})`,
      `Misplaced wallet cost you $${lost.toLocaleString()}.`,
      `You couldn\'t find your wallet and $${lost.toLocaleString()} vanished.`,
      `Losing your wallet set you back $${lost.toLocaleString()}.`
    ]);
  }
  if (rand(1, 300) === 1) {
    game.smarts = clamp(game.smarts + rand(2, 4));
    addLog([
      'A chance encounter taught you something new. (+Smarts)',
      'You learned something unexpected. (+Smarts)',
      'An accidental lesson increased your Smarts. (+Smarts)',
      'You stumbled upon knowledge. (+Smarts)',
      'Serendipity made you smarter. (+Smarts)'
    ]);
  }
  if (rand(1, 150) === 1) {
    const bill = rand(1000, 10000);
    const coverage = game.insurancePlan ? game.insurancePlan.coverage : 0;
    const finalBill = Math.floor(bill * (1 - coverage));
    const covered = bill - finalBill;
    let debt = 0;
    if (game.money >= finalBill) {
      game.money -= finalBill;
    } else {
      debt = finalBill - game.money;
      game.medicalBills += debt;
      game.money = 0;
    }
    addLog(
      `You were hospitalized. Bill $${bill.toLocaleString()}${
        covered > 0 ? ', insurance covered $' + covered.toLocaleString() : ''
      }.${debt > 0 ? ` You couldn't pay $${debt.toLocaleString()}.` : ''}`,
      'health'
    );
  }
}

export function ageUp() {
  if (!game.alive) {
    addLog([
      'You are no longer alive. Start a new life.',
      'Your life has ended. Begin anew.',
      'You\'ve passed away. A fresh start awaits.',
      'Death has come. Start over.',
      'Your journey ended. Try a new life.'
    ], 'life');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.age += 1;
    game.year += 1;
    advanceSchool();
    game.health = clamp(game.health - rand(1, 4));
    game.happiness = clamp(game.happiness + rand(-2, 3));
    if (game.age >= 5 && game.age <= 18 && school.triggerPeerPressure) {
      school.triggerPeerPressure();
    }
    if (game.sick) {
      game.health = clamp(game.health - rand(2, 6));
    }
    paySalary();
    accrueStudentLoanInterest();
    randomEvent();
    tickJob();
    tickEconomy();
    weekendEvent();
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
      unlockAchievement('first-job');
    }
    if (game.properties.length > 0) {
      unlockAchievement('first-property');
    }
    if (game.money >= 1000000) {
      unlockAchievement('millionaire');
    }
    if (game.age >= 100) {
      unlockAchievement('centenarian');
    }
    if (game.education?.highest === 'phd') {
      unlockAchievement('phd');
    }
    if (game.age >= game.maxAge) {
      game.alive = false;
      addLog([
        'You died of old age.',
        'Old age finally claimed you.',
        'Your time came due to old age.',
        'Age caught up; you passed away.',
        'Life ended peacefully in old age.'
      ], 'life');
    }
    tickJail();
    tickRelationships();
  });
}

