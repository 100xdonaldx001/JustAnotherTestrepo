import { game } from '../state.js';
import { scheduleMaintenance } from '../actions/cars.js';

export function renderCarMaintenance(container) {
  const wrap = document.createElement('div');

  if (game.cars.length === 0) {
    const none = document.createElement('div');
    none.textContent = 'You do not own any cars.';
    wrap.appendChild(none);
  } else {
    const list = document.createElement('ul');
    for (const car of game.cars) {
      const li = document.createElement('li');
      li.textContent = car.name;
      list.appendChild(li);
    }
    wrap.appendChild(list);

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Schedule Maintenance';
    btn.addEventListener('click', scheduleMaintenance);
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

