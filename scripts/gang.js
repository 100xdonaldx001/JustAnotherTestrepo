import { game, addLog, saveGame, applyAndSave } from './state.js';
import { rand, clamp } from './utils.js';

export function joinGang(name) {
  if (game.gang) {
    addLog([
      'You are already part of a gang.',
      "You're already in a gang.",
      'You cannot join another gang right now.'
    ], 'gang');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.gang = { name, reputation: 50 };
    addLog([
      `You joined the ${name} gang.`,
      `The ${name} gang welcomed you.`,
      `You are now part of the ${name} gang.`
    ], 'gang');
  });
}

export function leaveGang() {
  if (!game.gang) {
    addLog([
      'You are not in a gang.',
      "There's no gang to leave.",
      'You walk alone already.'
    ], 'gang');
    saveGame();
    return;
  }
  applyAndSave(() => {
    const name = game.gang.name;
    game.gang = null;
    addLog([
      `You left the ${name} gang.`,
      `The ${name} gang is no longer your crew.`,
      `You parted ways with the ${name} gang.`
    ], 'gang');
  });
}

export function gangMission() {
  if (!game.gang) {
    addLog([
      'You need to join a gang first.',
      "You can't run missions without a gang.",
      'No gang, no mission.'
    ], 'gang');
    saveGame();
    return;
  }
  if (game.inJail) {
    addLog([
      'You cannot go on a mission while in jail.',
      'Jail time stops your gang missions.',
      'Missions are off-limits in jail.'
    ], 'gang');
    saveGame();
    return;
  }
  applyAndSave(() => {
    const success = rand(1, 100) > 35;
    if (success) {
      const reward = rand(500, 2000);
      game.money += reward;
      addLog([
        `Gang mission succeeded. You earned $${reward.toLocaleString()}.`,
        `Mission success! $${reward.toLocaleString()} added to your stash.`,
        `You completed the mission and gained $${reward.toLocaleString()}.`
      ], 'gang');
    } else {
      if (rand(1, 100) <= 50) {
        game.inJail = true;
        game.jailYears = rand(1, 3);
        addLog([
          `Mission failed and you were caught. ${game.jailYears} year(s) in jail.`,
          `The mission went south—you got ${game.jailYears} year(s) in jail.`,
          `You were busted after the mission and jailed for ${game.jailYears} year(s).`
        ], 'gang');
      } else {
        const dmg = rand(5, 15);
        game.health = clamp(game.health - dmg);
        addLog([
          `Mission failed and you were hurt (-${dmg} Health).`,
          `A botched mission injured you (-${dmg} Health).`,
          `You took damage during the mission (-${dmg} Health).`
        ], 'gang');
      }
    }
  });
}

