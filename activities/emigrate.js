import { game, addLog, saveGame } from '../state.js';
import { clamp, rand } from '../utils.js';
import { refreshOpenWindows } from '../windowManager.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';

export function renderEmigrate(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Move to another country for a fresh start.';
  container.appendChild(head);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Emigrate ($2,000)';
  btn.addEventListener('click', () => {
    const cost = 2000;
    if (game.money < cost) {
      addLog('Emigration costs $2,000. Not enough money.');
      refreshOpenWindows();
      saveGame();
      return;
    }
    game.money -= cost;
    const oldCity = game.city;
    const oldCountry = game.country;
    const newCity = faker.location.city();
    const newCountry = faker.location.country();
    const happinessGain = rand(5, 15);
    const healthLoss = rand(0, 5);
    game.city = newCity;
    game.country = newCountry;
    game.happiness = clamp(game.happiness + happinessGain);
    game.health = clamp(game.health - healthLoss);
    let logMsg = `You emigrated from ${oldCity}, ${oldCountry} to ${newCity}, ${newCountry}. +${happinessGain} Happiness`;
    if (healthLoss > 0) logMsg += `, -${healthLoss} Health`;
    logMsg += '.';
    addLog(logMsg);
    refreshOpenWindows();
    saveGame();
  });

  container.appendChild(btn);
}

