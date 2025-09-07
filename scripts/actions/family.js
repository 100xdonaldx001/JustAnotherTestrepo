import { game, addLog, saveGame, applyAndSave, unlockAchievement } from '../state.js';
import { rand, clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';

const FIRST_CHILD_DESC = 'Had your first child.';
const HAPPY_CHILD_DESC = 'Raised a very happy child.';

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
    if (rand(1, 100) > taskChances.family.gatheringSuccess) {
      addLog(
        [
          'The family gathering ended in awkward silence.',
          'Your family get-together fizzled out awkwardly.',
          'Family time fell flat with uncomfortable quiet.'
        ],
        'relationship'
      );
      return;
    }
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

export function haveChild() {
  if (!game.alive) return;
  if (rand(1, 100) > taskChances.family.birthSuccess) {
    applyAndSave(() => {
      addLog(
        [
          'The pregnancy was unsuccessful.',
          'The pregnancy did not succeed.',
          'Sadly, the pregnancy failed.'
        ],
        'family'
      );
    });
    return;
  }
  applyAndSave(() => {
    const child = { age: 0, happiness: 50 };
    if (!game.children) game.children = [];
    game.children.push(child);
    if (rand(1, 100) <= taskChances.family.twins) {
      game.children.push({ age: 0, happiness: 50 });
      addLog(
        [
          'You welcomed twins into the world.',
          'Twins were born into your family.',
          'You became the parent of newborn twins.'
        ],
        'family'
      );
    } else {
      addLog([
        'You welcomed a new child into the world.',
        'A child joined your family.',
        'You became a parent to a newborn.'
      ], 'family');
    }
    if (game.children.length === 1) {
      unlockAchievement('first-child', FIRST_CHILD_DESC);
    }
  });
}

export function spendTimeWithChild(index = 0) {
  if (!game.alive || !game.children || !game.children[index]) return;
  if (rand(1, 100) > taskChances.family.childTime) {
    applyAndSave(() => {
      addLog(
        [
          'Your child was too busy to hang out.',
          "Your child couldn't find time to be with you.",
          'Your child had no time to hang out.'
        ],
        'family'
      );
    });
    return;
  }
  applyAndSave(() => {
    const child = game.children[index];
    child.happiness = clamp(child.happiness + rand(5, 15));
    addLog([
      'You spent quality time with your child. (+Child Happiness)',
      'A fun day with your child lifted their spirits. (+Child Happiness)',
      'Bonding with your child made them happier. (+Child Happiness)'
    ], 'family');
    if (child.happiness >= 90) {
      unlockAchievement('happy-child', HAPPY_CHILD_DESC);
    }
  });
}

export function spendTimeWithSpouse(index = 0) {
  if (!game.alive || !game.relationships || !game.relationships[index]) return;
  if (rand(1, 100) > taskChances.family.spouseTime) {
    applyAndSave(() => {
      addLog(
        [
          'Your spouse was unavailable.',
          "Your spouse couldn't make time.",
          "Your spouse wasn't free to join you."
        ],
        'relationship'
      );
    });
    return;
  }
  applyAndSave(() => {
    const rel = game.relationships[index];
    rel.happiness = clamp(rel.happiness + rand(5, 15));
    addLog([
      `You spent quality time with ${rel.name}. (+Relationship Happiness)`,
      `A nice day with ${rel.name} improved your bond. (+Relationship Happiness)`,
      `You hung out with ${rel.name}. (+Relationship Happiness)`
    ], 'relationship');
  });
}

export function argueWithSpouse(index = 0) {
  if (!game.alive || !game.relationships || !game.relationships[index]) return;
  if (rand(1, 100) > taskChances.family.spouseArgue) {
    applyAndSave(() => {
      addLog(
        [
          'Your spouse refused to engage in an argument.',
          "Your spouse wouldn't argue with you.",
          'Your spouse declined to fight.'
        ],
        'relationship'
      );
    });
    return;
  }
  applyAndSave(() => {
    const rel = game.relationships[index];
    rel.happiness = clamp(rel.happiness - rand(5, 15));
    addLog([
      `You argued with ${rel.name}. (-Relationship Happiness)`,
      `A disagreement with ${rel.name} hurt your bond. (-Relationship Happiness)`,
      `You had a fight with ${rel.name}. (-Relationship Happiness)`
    ], 'relationship');
    if (rel.happiness <= 0) {
      addLog(
        [
          `${rel.name} left you.`,
          `${rel.name} walked away from the relationship.`,
          `${rel.name} decided to part ways.`
        ],
        'relationship'
      );
      game.relationships.splice(index, 1);
    }
  });
}
             
export function spendTimeWithSibling(index = 0) {
  if (!game.alive || !game.siblings || !game.siblings[index]) return;
  if (rand(1, 100) > taskChances.siblings.hangout) {
    applyAndSave(() => {
      addLog(
        [
          'Your sibling was too busy to hang out.',
          "Your sibling couldn't make time for you.",
          'Your sibling had no time to hang out.'
        ],
        'family'
      );
    });
    return;
  }
  applyAndSave(() => {
    const sibling = game.siblings[index];
    sibling.happiness = clamp(sibling.happiness + rand(5, 15));
    addLog([
      'You spent quality time with your sibling. (+Sibling Happiness)',
      'Bonding with your sibling lifted their spirits. (+Sibling Happiness)',
      'You enjoyed time with your sibling. (+Sibling Happiness)'
    ], 'family');
  });
}

export function siblingRivalry(index = 0) {
  if (!game.alive || !game.siblings || !game.siblings[index]) return;
  if (rand(1, 100) > taskChances.siblings.rivalry) {
    applyAndSave(() => {
      addLog(
        [
          'Your sibling ignored your attempt at rivalry.',
          'Your sibling brushed off your rivalry.',
          "Your sibling wasn't interested in competing."
        ],
        'family'
      );
    });
    return;
  }
  applyAndSave(() => {
    const sibling = game.siblings[index];
    sibling.happiness = clamp(sibling.happiness - rand(5, 15));
    addLog([
      'A rivalry with your sibling caused tension. (-Sibling Happiness)',
      'You argued with your sibling. (-Sibling Happiness)',
      'Sibling rivalry flared up. (-Sibling Happiness)'
    ], 'family');
  });
}

