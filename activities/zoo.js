import { game, addLog, saveGame } from '../state.js';
import { clamp } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';

const EXHIBITS = [
  { name: 'Lions', cost: 25, stat: 'happiness', gain: 4 },
  { name: 'Reptile House', cost: 15, stat: 'smarts', gain: 3 },
  { name: 'Aquarium', cost: 20, stat: 'happiness', gain: 5 },
  { name: 'Aviary', cost: 10, stat: 'smarts', gain: 2 }
];

export function renderZoo(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Visit animal exhibits. Tickets improve happiness or education.';
  wrap.appendChild(head);

  const list = document.createElement('div');
  for (const ex of EXHIBITS) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `${ex.name} ($${ex.cost})`;
    btn.disabled = game.money < ex.cost;
    btn.addEventListener('click', () => {
      if (game.money < ex.cost) {
        addLog('You cannot afford that ticket.');
        refreshOpenWindows();
        saveGame();
        return;
      }
      game.money -= ex.cost;
      if (ex.stat === 'happiness') {
        game.happiness = clamp(game.happiness + ex.gain);
      } else if (ex.stat === 'smarts') {
        game.smarts = clamp(game.smarts + ex.gain);
      }
      const statName = ex.stat === 'smarts' ? 'Smarts' : 'Happiness';
      addLog(`You visited the ${ex.name}. +${ex.gain} ${statName}.`);
      refreshOpenWindows();
      saveGame();
    });
    list.appendChild(btn);
  }
  wrap.appendChild(list);

  container.appendChild(wrap);
}

