import { game } from '../state.js';
import { buyCar } from '../actions/cars.js';

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
    btn.addEventListener('click', () => buyCar(car));
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

