import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { getCurrentWeather } from '../utils/weather.js';

export function renderVacation(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Take a relaxing trip to boost your happiness.';
  container.appendChild(head);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Go on Vacation ($500)';
  btn.addEventListener('click', () => {
    const cost = 500;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('Vacation costs $500. Not enough money.', 'travel');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      const weather = getCurrentWeather();
      let gain = rand(8, 15);
      if (weather === 'rainy') {
        gain = Math.max(0, gain - 2);
      } else if (weather === 'snowy') {
        gain = Math.max(0, gain - 4);
      }
      game.happiness = clamp(game.happiness + gain);
      addLog(`You went on a vacation in ${weather} weather. +${gain} Happiness.`, 'travel');
    });
  });

  container.appendChild(btn);
}
