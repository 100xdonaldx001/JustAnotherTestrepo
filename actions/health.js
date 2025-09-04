import { game, addLog, saveGame, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

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

