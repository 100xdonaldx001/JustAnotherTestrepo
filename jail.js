import { game, addLog, saveGame } from './state.js';
import { releaseMessages } from './messages/jailMessages.js';

export function tickJail() {
  if (!game.inJail) return;
  if (typeof game.jailYears !== 'number') game.jailYears = 1;
  game.jailYears -= 1;
  if (game.jailYears <= 0) {
    game.inJail = false;
    delete game.jailYears;
    addLog(releaseMessages, 'crime');
  }
  saveGame();
}
