import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { openWindow } from '../windowManager.js';
import { taskChances } from '../taskChances.js';

export { openWindow };

const TRACKS = [
  { label: 'Local Track', cost: 50, chance: taskChances.raceTracks.local, multiplier: 2 },
  { label: 'Regional Track', cost: 100, chance: taskChances.raceTracks.regional, multiplier: 3 },
  { label: 'National Track', cost: 500, chance: taskChances.raceTracks.national, multiplier: 10 }
];

export function renderRaceTracks(container) {
  const wrap = document.createElement('div');

  for (const track of TRACKS) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = `${track.label} - $${track.cost.toLocaleString()}`;
    if (game.money < track.cost) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (game.money < track.cost) return;
      applyAndSave(() => {
        game.money -= track.cost;
        const roll = rand(1, 100);
        let msg;
        if (roll <= track.chance) {
          const winnings = track.cost * track.multiplier;
          game.money += winnings;
          game.happiness = clamp(game.happiness + 5);
          msg = `You won $${winnings.toLocaleString()} at the ${track.label}.`;
        } else {
          game.happiness = clamp(game.happiness - 5);
          msg = `You lost your bet at the ${track.label}.`;
        }
        addLog(msg, 'gambling');
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

