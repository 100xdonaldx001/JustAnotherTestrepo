import { game, addLog, applyAndSave, die } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderPlasticSurgery(container) {
  const wrap = document.createElement('div');

  const procedures = [
    { name: 'Botox', cost: 1500, gain: 2, key: 'botox' },
    { name: 'Nose Job', cost: 4000, gain: 5, key: 'noseJob' },
    { name: 'Liposuction', cost: 5000, gain: 6, key: 'liposuction' },
    { name: 'Tummy Tuck', cost: 3500, gain: 4, key: 'tummyTuck' },
    { name: 'Face Lift', cost: 6000, gain: 8, key: 'faceLift' }
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
        if (rand(1, 100) > taskChances.plasticSurgery[p.key]) {
          const roll = Math.random();
          if (roll < 0.1) {
            addLog(`${p.name} went catastrophically wrong. (-$${p.cost.toLocaleString()})`, 'health');
            die(`Complications from a botched ${p.name}.`);
          } else if (roll < 0.55) {
            const dmg = rand(10, 25);
            game.health = clamp(game.health - dmg);
            addLog(`${p.name} went wrong. (-$${p.cost.toLocaleString()}, -${dmg} Health)`, 'health');
          } else {
            const loss = rand(1, p.gain);
            game.looks = clamp(game.looks - loss);
            addLog(`${p.name} was botched. (-$${p.cost.toLocaleString()}, -${loss} Looks)`, 'health');
          }
        } else {
          game.looks = clamp(game.looks + p.gain);
          addLog(`You underwent a ${p.name}. (-$${p.cost.toLocaleString()}, +${p.gain} Looks)`, 'health');
        }
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

