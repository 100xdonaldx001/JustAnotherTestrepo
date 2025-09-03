import { game, addLog, saveGame } from './state.js';

export function tickJail() {
  if (!game.inJail) return;
  if (typeof game.jailYears !== 'number') game.jailYears = 1;
  game.jailYears -= 1;
  if (game.jailYears <= 0) {
    game.inJail = false;
    delete game.jailYears;
    addLog([
      'You were released from jail.',
      'Freedom at last—you left jail.',
      'Your jail time ended and you walked free.',
      'The prison gates opened; you\'re out.',
      'You served your sentence and were released.'
    ], 'crime');
  }
  saveGame();
}
