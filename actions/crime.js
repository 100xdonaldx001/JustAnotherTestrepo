import { game, addLog, saveGame, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

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
      }
    }
  });
}

