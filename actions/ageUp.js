import { game, addLog, saveGame, applyAndSave, unlockAchievement, die } from '../state.js';
import { rand, clamp } from '../utils.js';
import { tickJail } from '../jail.js';
import { tickRelationships } from '../activities/love.js';
import { tickRealEstate } from '../realestate.js';
import { tickBusinesses } from '../activities/business.js';
import * as school from '../school.js';
const { advanceSchool, accrueStudentLoanInterest } = school;
import { tickJob } from '../jobs.js';
import { paySalary } from './job.js';
import { calculateDividend } from '../investment.js';
import { weekendEvent } from './weekend.js';

const promotionThresholds = { entry: 3, mid: 5 };
const promotionOrder = { entry: 'mid', mid: 'senior' };

function collectDividends() {
  let total = 0;
  for (const inv of game.portfolio) {
    const div = Math.round(calculateDividend(inv));
    if (div > 0) {
      game.money += div;
      total += div;
    }
  }
  return total;
}

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
    game.mentalHealth = clamp(game.mentalHealth - rand(3, 6));
    addLog([
      'You caught a nasty flu. (See Doctor, -Mental Health)',
      'A rough flu has you down. (See Doctor, -Mental Health)',
      'You\'re sick with the flu. (See Doctor, -Mental Health)',
      'Flu symptoms hit you hard. (See Doctor, -Mental Health)',
      'You came down with the flu. (See Doctor, -Mental Health)'
    ], 'health');
  }
  if (game.age > 50 && rand(1, 100) <= game.age - 45) {
    addLog([
      'Aches and pains are catching up with you. (-Health, -Mental Health)',
      'Your body aches more these days. (-Health, -Mental Health)',
      'Nagging pains remind you of age. (-Health, -Mental Health)',
      'Soreness creeps in as time passes. (-Health, -Mental Health)',
      'Health is waning; aches are frequent. (-Health, -Mental Health)'
    ], 'health');
    game.health = clamp(game.health - rand(2, 6));
    game.mentalHealth = clamp(game.mentalHealth - rand(1, 4));
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
  if (rand(1, 40) === 1) {
    addLog(
      [
        'You feel like you should exercise more.',
        'A friend suggests you hit the gym.',
        'Your body is craving a workout.',
        'Maybe join a gym to stay in shape.',
        'It might be time to work out.'
      ],
    );
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

function tickEconomyPhase() {
  game.economyPhaseYears -= 1;
  if (game.economyPhaseYears <= 0) {
    const phases = ['boom', 'normal', 'recession'];
    const next = phases[rand(0, phases.length - 1)];
    if (next !== game.economyPhase) {
      game.economyPhase = next;
      game.jobListings = [];
      addLog(`The economy entered a ${next}.`, 'economy');
    }
    game.economyPhaseYears = rand(3, 7);
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
    let healthLoss = rand(1, 4);
    if (game.age < 18) {
      healthLoss = Math.floor(healthLoss / 2);
    }
    game.health = clamp(game.health - healthLoss);
    game.happiness = clamp(game.happiness + rand(-2, 3));
    if (game.age >= 5 && game.age <= 18 && school.triggerPeerPressure) {
      school.triggerPeerPressure();
    }
    if (game.sick) {
      if (game.age < 18) {
        game.health = clamp(game.health + rand(4, 8));
        addLog('Your parents took you to the doctor. (+Health)', 'health');
        game.sick = false;
      } else {
        game.health = clamp(game.health - rand(2, 6));
      }
    }
    const salaryIncome = paySalary();
    const dividendIncome = collectDividends();
    if (game.retired && game.pension > 0) {
      if (game.pensionFromSavings) {
        const amount = Math.min(game.pension, game.money);
        game.money -= amount;
        addLog(`Your savings covered $${amount.toLocaleString()} in pension.`, 'job');
      } else {
        game.money += game.pension;
        addLog(`You received $${game.pension.toLocaleString()} in pension.`, 'job');
      }
    }
    accrueStudentLoanInterest();
    randomEvent();
    tickJob();
    tickEconomyPhase();
    weekendEvent();
    tickRealEstate();
    const rentIncome = game.properties.reduce(
      (sum, p) => sum + (p.rented ? p.rent : 0),
      0
    );
    const totalIncome = salaryIncome + dividendIncome + rentIncome;
    const deduction = Math.min(totalIncome, game.charityYear || 0);
    const taxable = Math.max(0, totalIncome - deduction);
    const tax = Math.round(taxable * 0.2);
    if (tax > 0) {
      game.money -= tax;
      game.taxPaid = (game.taxPaid || 0) + tax;
      addLog(
        `You paid $${tax.toLocaleString()} in taxes on $${totalIncome.toLocaleString()} income.`,
        'finance'
      );
    }
    game.charityYear = 0;
    tickBusinesses();
    if (game.children && game.children.length > 0) {
      for (const child of game.children) {
        child.age += 1;
        child.happiness = clamp(child.happiness + rand(-2, 2));
        if (child.age === 18) {
          addLog([
            'Your child became an adult.',
            'One of your children turned 18.',
            'You watched your child reach adulthood.',
            'Eighteen years flew by—your child is grown.',
            'Your child is now all grown up.'
          ], 'family');
          unlockAchievement('raise-child', 'Raised a child to adulthood.');
        }
      }
    }
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
        die([
          'You died of old age.',
          'Old age finally claimed you.',
          'Your time came due to old age.',
          'Age caught up; you passed away.',
          'Life ended peacefully in old age.'
        ]);
      }
    game.pets = game.pets || [];
    for (const pet of game.pets) {
      if (!pet.alive) continue;
      pet.age += 1;
      pet.happiness = clamp(pet.happiness - rand(2, 6));
      pet.health = clamp(pet.health - rand(1, 5));
      if (rand(1, 100) <= 10) {
        pet.health = clamp(pet.health - rand(5, 15));
        addLog(`Your ${pet.type} got sick. (-Health)`, 'pet');
      }
      if (pet.health <= 0) {
        pet.alive = false;
        addLog(`Your ${pet.type} has passed away.`, 'pet');
      }
    }
    tickJail();
    tickRelationships();
  });
}

