import { game, addLog, saveGame, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

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

export { dropOut, enrollCollege, enrollUniversity, reEnrollHighSchool, getGed } from '../school.js';
export { workExtra } from './job.js';
export { seeDoctor } from './health.js';
export { crime } from './crime.js';
export { hostFamilyGathering, haveChild, spendTimeWithChild } from './family.js';
export { buyCar, scheduleMaintenance } from './cars.js';
export { renovateProperty } from './renovateProperty.js';
export { ageUp } from './ageUp.js';

