import { game, addLog, die, saveGame, applyAndSave } from '../state.js';
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
    game.reputation = clamp(game.reputation - 5);
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
        `Crime succeeded: ${c.name}. You gained $${amount.toLocaleString()}. (-5 Reputation)`,
        `${c.name} went smoothly—you got $${amount.toLocaleString()}. (-5 Reputation)`,
        `Success! ${c.name} netted you $${amount.toLocaleString()}. (-5 Reputation)`,
        `Your ${c.name} paid off with $${amount.toLocaleString()}. (-5 Reputation)`,
        `${c.name} worked and earned you $${amount.toLocaleString()}. (-5 Reputation)`
      ], 'crime');
    } else {
      if (rand(1, 100) <= 75) {
        game.inJail = true;
        game.jailYears = rand(1, 4);
        addLog([
          `Busted doing ${c.name}. You were jailed for ${game.jailYears} year(s). (-5 Reputation)`,
          `Caught in the act of ${c.name}; ${game.jailYears} year(s) in jail. (-5 Reputation)`,
          `${c.name} failed and landed you ${game.jailYears} year(s) in jail. (-5 Reputation)`,
          `Authorities nabbed you for ${c.name}; ${game.jailYears} year(s) behind bars. (-5 Reputation)`,
          `Your ${c.name} attempt backfired—${game.jailYears} year(s) in jail. (-5 Reputation)`
        ], 'crime');
      } else {
        const dmg = rand(4, 15);
        game.health = clamp(game.health - dmg);
        addLog([
          `Crime failed: ${c.name}. You were injured (-${dmg} Health). (-5 Reputation)`,
          `${c.name} went wrong and you took damage (-${dmg} Health). (-5 Reputation)`,
          `Failure at ${c.name} left you hurt (-${dmg} Health). (-5 Reputation)`,
          `Injury followed a botched ${c.name} (-${dmg} Health). (-5 Reputation)`,
          `Attempting ${c.name} caused harm (-${dmg} Health). (-5 Reputation)`
        ], 'crime');
        if (game.health <= 0) {
          die('You died from your injuries.');
        }
      }
    }
  });
}
