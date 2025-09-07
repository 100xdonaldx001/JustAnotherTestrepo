import { game, addLog, applyAndSave } from '../state.js';
import { buyCar } from '../actions/cars.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

const CARS = [
  { name: 'Used Hatchback', cost: 4000 },
  { name: 'Sports Coupe', cost: 25000 },
  { name: 'Luxury Sedan', cost: 60000 }
];

export function renderCarDealership(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Browse vehicles to purchase.';
  wrap.appendChild(head);

  for (const car of CARS) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = `${car.name} ($${car.cost})`;
    btn.disabled = game.money < car.cost;
    btn.addEventListener('click', () => {
      if (rand(1, 100) > taskChances.cars.inStock) {
        applyAndSave(() => {
          addLog(`The ${car.name} is currently out of stock.`, 'cars');
        });
        return;
      }
      buyCar(car);
      if (rand(1, 100) <= taskChances.cars.freeExtra) {
        applyAndSave(() => {
          addLog('The dealer threw in free floor mats.', 'cars');
        });
      }
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

