import { game, addLog, applyAndSave } from '../state.js';
import { clamp } from '../utils.js';
import { getCurrentWeather } from '../utils/weather.js';

const TRIPS = [
  { name: 'Local Zoo', cost: 40, mood: 5 },
  { name: 'Safari Park', cost: 150, mood: 15 }
];

export function renderZooTrip(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Plan a visit to the zoo for some happiness.';
  wrap.appendChild(head);

  const controls = document.createElement('div');
  controls.style.marginTop = '8px';

  const select = document.createElement('select');
  TRIPS.forEach((t, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${t.name} ($${t.cost})`;
    select.appendChild(opt);
  });
  controls.appendChild(select);

  const count = document.createElement('input');
  count.type = 'number';
  count.min = '1';
  count.value = '1';
  count.style.marginLeft = '8px';
  controls.appendChild(count);

  wrap.appendChild(controls);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Take Trip';
  btn.style.marginTop = '8px';
  btn.addEventListener('click', () => {
    const trip = TRIPS[parseInt(select.value, 10)];
    const people = Math.max(parseInt(count.value, 10) || 1, 1);
    const cost = trip.cost * people;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog(`Zoo trip costs $${cost}. Not enough money.`, 'leisure');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      const weather = getCurrentWeather();
      let mood = trip.mood * people;
      if (weather === 'rainy') {
        mood = Math.max(0, mood - 2 * people);
      } else if (weather === 'snowy') {
        mood = Math.max(0, mood - 4 * people);
      }
      game.happiness = clamp(game.happiness + mood);
      addLog(
        `You visited the ${trip.name.toLowerCase()} with ${people} ${people === 1 ? 'person' : 'people'} in ${weather} weather. +${mood} Happiness.`,
        'leisure'
      );
    });
  });
  wrap.appendChild(btn);

  container.appendChild(wrap);
}

