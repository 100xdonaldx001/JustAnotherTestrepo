import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function buyCar(car) {
  applyAndSave(() => {
    let price = car.cost;
    if (rand(1, 100) <= taskChances.cars.dealDiscount) {
      price = Math.floor(price * 0.9);
      addLog(
        [
          'You negotiated a discount on the car.',
          'Your haggling scored a car discount.',
          'You secured a price cut on the car.'
        ],
        'cars'
      );
    }
    if (game.money < price) {
      addLog(
        [
          `You cannot afford the ${car.name}.`,
          `${car.name} is out of your price range.`,
          `The ${car.name} costs more than you have.`
        ],
        'cars'
      );
      return;
    }
    game.money -= price;
    game.cars.push({ name: car.name, value: price });
    addLog(
      [
        `You purchased a ${car.name}. (-$${price.toLocaleString()})`,
        `Bought a ${car.name} for $${price.toLocaleString()}.`,
        `You spent $${price.toLocaleString()} on a ${car.name}.`
      ],
      'cars'
    );
  });
}

export function scheduleMaintenance() {
  applyAndSave(() => {
    if (game.cars.length === 0) {
      addLog(
        [
          'You have no cars needing maintenance.',
          'None of your cars require maintenance.',
          'All cars are running fine; no maintenance needed.'
        ],
        'cars'
      );
      return;
    }
    for (const car of game.cars) {
      const cost = Math.min(500, Math.round(car.value * 0.05));
      if (game.money >= cost) {
        game.money -= cost;
        if (rand(1, 100) <= taskChances.cars.maintenanceSuccess) {
          addLog(
            [
              `You maintained your ${car.name} for $${cost.toLocaleString()}.`,
              `Serviced ${car.name} for $${cost.toLocaleString()}.`,
              `You spent $${cost.toLocaleString()} on ${car.name} maintenance.`
            ],
            'cars'
          );
        } else {
          car.value = Math.max(0, Math.round(car.value * 0.9));
          addLog(
            [
              `Maintenance failed for ${car.name}.`,
              `The tune-up on ${car.name} didn't work.`,
              `Servicing ${car.name} was unsuccessful.`
            ],
            'cars'
          );
        }
      } else {
        addLog(
          [
            `Could not afford maintenance for ${car.name}.`,
            `Too broke to maintain ${car.name}.`,
            `Couldn't pay to service ${car.name}.`
          ],
          'cars'
        );
      }
    }
  });
}

