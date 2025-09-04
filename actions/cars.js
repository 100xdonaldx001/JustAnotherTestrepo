import { game, addLog, applyAndSave } from '../state.js';

export function buyCar(car) {
  applyAndSave(() => {
    if (game.money < car.cost) {
      addLog(`You cannot afford the ${car.name}.`, 'cars');
      return;
    }
    game.money -= car.cost;
    game.cars.push({ name: car.name, value: car.cost });
    addLog(`You purchased a ${car.name}. (-$${car.cost.toLocaleString()})`, 'cars');
  });
}

export function scheduleMaintenance() {
  applyAndSave(() => {
    if (game.cars.length === 0) {
      addLog('You have no cars needing maintenance.', 'cars');
      return;
    }
    for (const car of game.cars) {
      const cost = Math.min(500, Math.round(car.value * 0.05));
      if (game.money >= cost) {
        game.money -= cost;
        addLog(`You maintained your ${car.name} for $${cost.toLocaleString()}.`, 'cars');
      } else {
        addLog(`Could not afford maintenance for ${car.name}.`, 'cars');
      }
    }
  });
}

