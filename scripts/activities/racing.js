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
      const chance = Math.min(50 + game.skills.racing, 90);
      if (rand(1, 100) <= chance) {
        const prize = rand(200, 500) + game.skills.racing * 10;
        game.money += prize;
        game.happiness = clamp(game.happiness + rand(5, 10));
        addLog(`You won a vehicle race and earned $${prize}.`, 'leisure');
      } else {
        const dmg = rand(5, 15);
        game.health = clamp(game.health - dmg);
        game.happiness = clamp(game.happiness - rand(5, 10));
        addLog(`You crashed during a vehicle race. -${dmg} Health.`, 'leisure');
      }
      game.skills.racing += 1;
    });
  });
  wrap.appendChild(vehicleBtn);

  const footBtn = document.createElement('button');
  footBtn.className = 'btn';
  footBtn.textContent = 'Race on Foot';
  footBtn.addEventListener('click', () => {
    applyAndSave(() => {
      const chance = Math.min(50 + game.skills.racing, 90);
      if (rand(1, 100) <= chance) {
        const gain = rand(5, 10) + Math.floor(game.skills.racing / 5);
        game.health = clamp(game.health + gain);
        game.happiness = clamp(game.happiness + rand(2, 6));
        addLog(`You won the foot race. +${gain} Health.`, 'leisure');
      } else {
        const loss = rand(2, 7);
        game.health = clamp(game.health - loss);
        game.happiness = clamp(game.happiness - rand(1, 4));
        addLog(`You lost the foot race. -${loss} Health.`, 'leisure');
      }
      game.skills.racing += 1;
    });
  });
  wrap.appendChild(footBtn);

  container.appendChild(wrap);
}

