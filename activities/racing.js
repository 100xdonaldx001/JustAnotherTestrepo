import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

export function renderRacing(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Choose your race type: vehicle or foot.';
  wrap.appendChild(head);

  const vehicleBtn = document.createElement('button');
  vehicleBtn.className = 'btn';
  vehicleBtn.textContent = 'Race Vehicles';
  vehicleBtn.addEventListener('click', () => {
    applyAndSave(() => {
      if (rand(0, 1) === 0) {
        const prize = rand(200, 500);
        game.money += prize;
        game.happiness = clamp(game.happiness + rand(5, 10));
        addLog(`You won a vehicle race and earned $${prize}.`);
      } else {
        const dmg = rand(5, 15);
        game.health = clamp(game.health - dmg);
        game.happiness = clamp(game.happiness - rand(5, 10));
        addLog(`You crashed during a vehicle race. -${dmg} Health.`);
      }
    });
  });
  wrap.appendChild(vehicleBtn);

  const footBtn = document.createElement('button');
  footBtn.className = 'btn';
  footBtn.textContent = 'Race on Foot';
  footBtn.addEventListener('click', () => {
    applyAndSave(() => {
      if (rand(0, 1) === 0) {
        const gain = rand(5, 10);
        game.health = clamp(game.health + gain);
        game.happiness = clamp(game.happiness + rand(2, 6));
        addLog(`You won the foot race. +${gain} Health.`);
      } else {
        const loss = rand(2, 7);
        game.health = clamp(game.health - loss);
        game.happiness = clamp(game.happiness - rand(1, 4));
        addLog(`You lost the foot race. -${loss} Health.`);
      }
    });
  });
  wrap.appendChild(footBtn);

  container.appendChild(wrap);
}

