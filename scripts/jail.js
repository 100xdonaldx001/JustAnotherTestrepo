import { game, addLog, saveGame } from './state.js';
import { rand } from './utils.js';

export function tickJail() {
  if (game.inJail) {
    if (typeof game.jailYears !== 'number') game.jailYears = 1;
    game.jailYears -= 1;
    if (game.gang) {
      const roll = rand(1, 100);
      if (roll <= 20) {
        game.jailYears = Math.max(0, game.jailYears - 1);
        addLog([
          'Your gang connections reduced your sentence.',
          'Gang ties helped cut your jail time.',
          'Friends in the gang shaved time off your sentence.'
        ], 'crime');
      } else if (roll >= 90) {
        game.jailYears += 1;
        addLog([
          'A gang conflict extended your sentence.',
          'Gang trouble in prison added to your time.',
          'Rival gangs caused your sentence to increase.'
        ], 'crime');
      }
    }
    const parole = game.jailYears > 0 && rand(1, 100) <= 20;
    if (game.jailYears <= 0 || parole) {
      game.inJail = false;
      delete game.jailYears;
      if (parole) {
        game.onParole = true;
        game.paroleYears = rand(1, 3);
        addLog([
          `You were released on parole for ${game.paroleYears} year(s).`,
          `Conditional release granted: ${game.paroleYears} year(s) on parole.`,
          `Paroled with ${game.paroleYears} year(s) to stay clean.`,
          `Early release came with ${game.paroleYears} year(s) of parole.`,
          `${game.paroleYears} year(s) of parole accompany your release.`
        ], 'crime');
      } else {
        addLog([
          'You were released from jail.',
          'Freedom at last—you left jail.',
          'Your jail time ended and you walked free.',
          'The prison gates opened; you\'re out.',
          'You served your sentence and were released.'
        ], 'crime');
      }
    }
    saveGame();
    return;
  }
  if (game.onParole) {
    if (typeof game.paroleYears !== 'number') game.paroleYears = 1;
    game.paroleYears -= 1;
    if (game.paroleYears <= 0) {
      game.onParole = false;
      delete game.paroleYears;
      addLog([
        'You completed your parole.',
        'Parole period ended; you are fully free.',
        'Your parole concluded successfully.',
        'Conditions met: parole finished.',
        'Parole over—you\'re entirely free now.'
      ], 'crime');
    }
    saveGame();
  }
}

