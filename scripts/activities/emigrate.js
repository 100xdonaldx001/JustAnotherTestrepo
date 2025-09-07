import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { getFaker } from '../utils/faker.js';
import { taskChances } from '../taskChances.js';

const faker = await getFaker();

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
      applyAndSave(() => {
        addLog(
          [
            'Emigration costs $2,000. Not enough money.',
            'You cannot afford the $2,000 emigration fee.',
            '$2,000 for emigration is out of reach.'
          ],
          'travel'
        );
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) > taskChances.travel.emigrate) {
        addLog(
          [
            'Your emigration application was denied.',
            'Authorities rejected your emigration request.',
            'Your bid to emigrate was turned down.'
          ],
          'travel'
        );
        return;
      }
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
      addLog(
        [
          logMsg,
          `Left ${oldCity}, ${oldCountry} for ${newCity}, ${newCountry}. +${happinessGain} Happiness${
            healthLoss > 0 ? `, -${healthLoss} Health` : ''
          }`,
          `Emigrated to ${newCity}, ${newCountry} from ${oldCity}, ${oldCountry}. +${happinessGain} Happiness${
            healthLoss > 0 ? `, -${healthLoss} Health` : ''
          }`
        ],
        'travel'
      );
    });
  });

  container.appendChild(btn);
}

