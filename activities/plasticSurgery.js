import { game, addLog, applyAndSave } from '../state.js';
import { clamp } from '../utils.js';

export function renderPlasticSurgery(container) {
  const wrap = document.createElement('div');

  const procedures = [
    { name: 'Botox', cost: 1500, gain: 2 },
    { name: 'Nose Job', cost: 4000, gain: 5 },
    { name: 'Liposuction', cost: 5000, gain: 6 },
    { name: 'Tummy Tuck', cost: 3500, gain: 4 },
    { name: 'Face Lift', cost: 6000, gain: 8 }
  ];

  for (const p of procedures) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `${p.name} ($${p.cost.toLocaleString()})`;
    btn.addEventListener('click', () => {
      if (game.money < p.cost) {
        applyAndSave(() => {
          addLog(`Not enough money for ${p.name} ($${p.cost.toLocaleString()}).`, 'health');
        });
        return;
      }
      applyAndSave(() => {
        game.money -= p.cost;
        game.looks = clamp(game.looks + p.gain);
        addLog(`You underwent a ${p.name}. (-$${p.cost.toLocaleString()}, +Looks)`, 'health');
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

