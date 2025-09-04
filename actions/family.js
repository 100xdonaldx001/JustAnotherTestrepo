import { game, addLog, saveGame, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

export function hostFamilyGathering() {
  if (!game.alive) return;
  if (!game.relationships || game.relationships.length === 0) {
    addLog([
      'You tried to host a family gathering, but no one showed up.',
      'A family gathering wasn\'t possible without family.',
      'There was no one to invite for a family gathering.',
      'With no relatives around, the family gathering fell through.',
      'Family plans fizzled—no one to gather with.'
    ], 'relationship');
    saveGame();
    return;
  }
  applyAndSave(() => {
    for (const rel of game.relationships) {
      rel.happiness = clamp(rel.happiness + rand(5, 15));
    }
    addLog([
      'You hosted a family gathering. (+Relationship Happiness)',
      'A family get-together strengthened your bonds. (+Relationship Happiness)',
      'Family gathering brought everyone closer. (+Relationship Happiness)',
      'You gathered the family and raised spirits. (+Relationship Happiness)',
      'A reunion with family warmed hearts. (+Relationship Happiness)'
    ], 'relationship');
  });
}

