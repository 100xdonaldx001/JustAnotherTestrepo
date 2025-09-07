import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { getCurrentWeather } from '../utils/weather.js';
import { taskChances } from '../taskChances.js';

const DESTINATIONS = [
  { name: 'Domestic', cost: 1, happiness: 1 },
  { name: 'International', cost: 2, happiness: 1.5 },
  { name: 'Cruise', cost: 1.5, happiness: 1.2 }
];

export function renderVacation(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Take a relaxing trip to boost your happiness.';
  wrap.appendChild(head);

  const controls = document.createElement('div');
  controls.style.marginTop = '8px';

  const days = document.createElement('input');
  days.type = 'number';
  days.min = '1';
  days.placeholder = 'Days';
  controls.appendChild(days);

  const select = document.createElement('select');
  select.style.marginLeft = '8px';
  DESTINATIONS.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = d.name;
    select.appendChild(opt);
  });
  controls.appendChild(select);

  wrap.appendChild(controls);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Go on Vacation';
  btn.style.marginTop = '8px';
  btn.addEventListener('click', () => {
    const duration = Math.max(parseInt(days.value, 10) || 0, 0);
    if (duration <= 0) {
      applyAndSave(() => {
        addLog('Enter a valid duration.', 'travel');
      });
      return;
    }
    const dest = DESTINATIONS[parseInt(select.value, 10)];
    const cost = 500 * duration * dest.cost;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog(`Vacation costs $${cost}. Not enough money.`, 'travel');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) > taskChances.vacation.enjoyment) {
        addLog('You fell ill during the trip. No happiness gained.', 'travel');
        return;
      }
      const weather = getCurrentWeather();
      let gain = rand(8, 15);
      if (weather === 'rainy') {
        gain = Math.max(0, gain - 2);
      } else if (weather === 'snowy') {
        gain = Math.max(0, gain - 4);
      }
      game.happiness = clamp(game.happiness + gain);
      addLog([
        `You went on a vacation in ${weather} weather. +${gain} Happiness.`,
        `You went on a ${duration}-day ${dest.name.toLowerCase()} vacation. +${gain} Happiness.`
      ], 'travel');
    });
  });
  wrap.appendChild(btn);

  container.appendChild(wrap);
}
