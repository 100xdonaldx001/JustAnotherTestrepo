import { game, addLog, die, saveGame, applyAndSave, unlockAchievement } from './state.js';
import { rand, clamp } from './utils.js';
import { tickJail } from './jail.js';
import { tickRelationships } from './activities/love.js';
import { tickRealEstate } from './realestate.js';
import { advanceSchool } from './school.js';
import { adjustJobPerformance } from './jobs.js';

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
    addLog([
      `You worked as a ${game.job.title} and earned $${earned.toLocaleString()}.`,
      `Your job as a ${game.job.title} paid $${earned.toLocaleString()}.`,
      `Working as a ${game.job.title} brought in $${earned.toLocaleString()}.`,
      `As a ${game.job.title}, you earned $${earned.toLocaleString()}.`,
      `You pulled in $${earned.toLocaleString()} from your ${game.job.title} job.`
    ], 'job');
  }
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
  if (!game.sick && rand(1, 100) <= 8) {
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
      'You learned something from a random meeting. (+Smarts)',
      'An unexpected meeting boosted your knowledge. (+Smarts)',
      'A random interaction broadened your mind. (+Smarts)',
      'Serendipity struck, and you learned. (+Smarts)'
    ]);
  }
  if (rand(1, 1000) === 1) {
    die('A tragic accident ended your life.');
  }
}

/**
 * Advances the game by one year and processes daily updates.
 * @returns {void}
 */
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
    if (game.sick) {
      game.health = clamp(game.health - rand(2, 6));
    }
    paySalary();
    randomEvent();
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
      addLog([
        'You died of old age.',
        'Old age finally claimed you.',
        'Your time came due to old age.',
        'Age caught up; you passed away.',
        'Life ended peacefully in old age.'
      ], 'life');
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
      addLog([
        'You studied in jail. (+Smarts)',
        'Behind bars, you hit the books. (+Smarts)',
        'Jail time turned into study time. (+Smarts)',
        'You cracked open books in your cell. (+Smarts)',
        'Learning continued even in jail. (+Smarts)'
      ], 'education');
    }
    const gain = rand(2, 4);
    const mood = rand(-1, 1);
    game.smarts = clamp(game.smarts + gain);
    game.happiness = clamp(game.happiness + mood);
    addLog([
      `You studied hard. +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
      `Hours of study earned you +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
      `Focused studying gave you +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
      `You hit the books for +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
      `Diligent study boosted you by +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`
    ], 'education');
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
    addLog([
      `You meditated. +${happy} Happiness, +${smart} Smarts.`,
      `Meditation brought +${happy} Happiness and +${smart} Smarts.`,
      `Quiet reflection added +${happy} Happiness and +${smart} Smarts.`,
      `You found peace: +${happy} Happiness, +${smart} Smarts.`,
      `Mindfulness rewarded you with +${happy} Happiness and +${smart} Smarts.`
    ]);
  });
}

/**
 * Works overtime to earn extra money at the cost of well-being.
 * @returns {void}
 */
export function workExtra() {
  if (!game.job) {
    addLog([
      'You need a job first.',
      'Employment comes before overtime.',
      'Find a job before trying that.',
      'No job, no overtime.',
      'Secure work before attempting this.'
    ], 'job');
    saveGame();
    return;
  }
  if (game.inJail) {
    addLog([
      'You cannot work extra while in jail.',
      'Jail time means no extra work.',
      'Behind bars, overtime is impossible.',
      'No overtime from a cell.',
      'You\'re locked up—no extra shifts.'
    ], 'job');
    saveGame();
    return;
  }
  applyAndSave(() => {
    const bonus = rand(200, 1500);
    game.money += bonus;
    game.happiness = clamp(game.happiness - rand(0, 2));
    game.health = clamp(game.health - rand(0, 2));
    addLog([
      `You took overtime. Earned $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `Extra hours paid $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `Overtime brought in $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `You grabbed overtime for $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `Working extra netted $${bonus.toLocaleString()}. (-Small Health/Happiness)`
    ], 'job');
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
      addLog([
        'You worked out in the yard. (+Health, +Happiness)',
        'Yard exercise boosted your stats. (+Health, +Happiness)',
        'You hit the yard for a workout. (+Health, +Happiness)',
        'Prison yard training helped you. (+Health, +Happiness)',
        'Outdoor reps in the yard lifted you. (+Health, +Happiness)'
      ], 'health');
    });
    return;
  }
  const cost = 20;
  if (game.money < cost) {
    addLog([
      'Not enough money for the gym ($20).',
      'You can\'t afford the $20 gym fee.',
      'Cash shortage keeps you from the gym.',
      'No $20, no gym visit.',
      'Your wallet is too light for the gym.'
    ], 'health');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.money -= cost;
    game.health = clamp(game.health + rand(2, 5));
    game.happiness = clamp(game.happiness + rand(1, 3));
    addLog([
      'You hit the gym. (+Health, +Happiness)',
      'Gym time improved you. (+Health, +Happiness)',
      'A gym session boosted your stats. (+Health, +Happiness)',
      'You exercised at the gym. (+Health, +Happiness)',
      'Workout complete—feeling better. (+Health, +Happiness)'
    ], 'health');
  });
}

/**
 * Visits the doctor for health recovery.
 * @returns {void}
 */
export function seeDoctor() {
  if (game.inJail) {
    addLog([
      'No access to a doctor here.',
      'You can\'t see a doctor from jail.',
      'Medical help isn\'t available here.',
      'No doctors are reachable right now.',
      'This place lacks medical care.'
    ], 'health');
    saveGame();
    return;
  }
  const cost = game.sick ? 120 : 60;
  if (game.money < cost) {
    addLog([
      `Doctor visit costs $${cost}. Not enough money.`,
      `A doctor visit is $${cost}—you can\'t afford it.`,
      `No $${cost} for the doctor.`,
      `Funds are short for a $${cost} doctor visit.`,
      `You need $${cost} to see the doctor.`
    ], 'health');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.money -= cost;
    if (game.sick) {
      game.sick = false;
      game.health = clamp(game.health + rand(6, 12));
      addLog([
        'The doctor treated your illness. (+Health)',
        'Medical care cured your illness. (+Health)',
        'The doctor\'s treatment healed you. (+Health)',
        'Care from the doctor restored you. (+Health)',
        'A doctor visit wiped out your illness. (+Health)'
      ], 'health');
    } else {
      game.health = clamp(game.health + rand(2, 6));
      addLog([
        'Routine check-up made you feel better. (+Health)',
        'A simple check-up boosted your health. (+Health)',
        'The doctor\'s exam refreshed you. (+Health)',
        'You felt better after a routine check. (+Health)',
        'A check-up improved your health. (+Health)'
      ], 'health');
    }
  });
}

/**
 * Attempts a crime with varying risk and reward.
 * @returns {void}
 */
export function crime() {
  if (game.inJail) {
    addLog([
      'You are already in jail.',
      'You\'re currently jailed.',
      'Locked up already, you can\'t do that.',
      'You\'re already behind bars.',
      'No need for more crime; you\'re in jail.'
    ], 'crime');
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
      addLog([
        `Crime succeeded: ${c.name}. You gained $${amount.toLocaleString()}.`,
        `${c.name} went smoothly—you got $${amount.toLocaleString()}.`,
        `Success! ${c.name} netted you $${amount.toLocaleString()}.`,
        `Your ${c.name} paid off with $${amount.toLocaleString()}.`,
        `${c.name} worked and earned you $${amount.toLocaleString()}.`
      ], 'crime');
    } else {
      if (rand(1, 100) <= 75) {
        game.inJail = true;
        game.jailYears = rand(1, 4);
        addLog([
          `Busted doing ${c.name}. You were jailed for ${game.jailYears} year(s).`,
          `Caught in the act of ${c.name}; ${game.jailYears} year(s) in jail.`,
          `${c.name} failed and landed you ${game.jailYears} year(s) in jail.`,
          `Authorities nabbed you for ${c.name}; ${game.jailYears} year(s) behind bars.`,
          `Your ${c.name} attempt backfired—${game.jailYears} year(s) in jail.`
        ], 'crime');
      } else {
        const dmg = rand(4, 15);
        game.health = clamp(game.health - dmg);
        addLog([
          `Crime failed: ${c.name}. You were injured (-${dmg} Health).`,
          `${c.name} went wrong and you took damage (-${dmg} Health).`,
          `Failure at ${c.name} left you hurt (-${dmg} Health).`,
          `Injury followed a botched ${c.name} (-${dmg} Health).`,
          `Attempting ${c.name} caused harm (-${dmg} Health).`
        ], 'crime');
        if (game.health <= 0) {
          die('You died from your injuries.');
        }
      }
    }
  });
}

export { dropOut, enrollCollege, enrollUniversity, reEnrollHighSchool, getGed } from './school.js';

