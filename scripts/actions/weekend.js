import { game, addLog } from '../state.js';
import { rand, clamp } from '../utils.js';

/**
 * Triggers a small random weekend event.
 * @returns {void}
 */
export function weekendEvent() {
  let roll = rand(1, 3);
  if (typeof roll !== 'number' || isNaN(roll)) {
    roll = Math.floor(Math.random() * 3) + 1;
  }
  if (roll === 1) {
    game.happiness = clamp(game.happiness + 2);
    addLog([
      'A relaxing weekend lifted your spirits. (+Happiness)',
      'You enjoyed a peaceful weekend. (+Happiness)',
      'Quiet time over the weekend boosted your mood. (+Happiness)',
      'You took it easy this weekend. (+Happiness)',
      'The weekend left you feeling refreshed. (+Happiness)'
    ]);
  } else if (roll === 2) {
    game.health = clamp(game.health + 1);
    addLog([
      'You went hiking this weekend. (+Health)',
      'A weekend walk improved your health. (+Health)',
      'Fresh air this weekend made you feel better. (+Health)',
      'Outdoor time this weekend boosted your health. (+Health)',
      'Staying active this weekend helped your health. (+Health)'
    ], 'health');
  } else {
    game.happiness = clamp(game.happiness - 1);
    addLog([
      'A dull weekend left you feeling down. (-Happiness)',
      'You were bored all weekend. (-Happiness)',
      'Nothing exciting happened this weekend. (-Happiness)',
      'The weekend dragged on without fun. (-Happiness)',
      'You felt lonely over the weekend. (-Happiness)'
    ]);
  }
}

