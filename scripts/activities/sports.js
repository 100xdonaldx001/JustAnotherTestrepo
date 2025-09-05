import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

export function renderSports(container) {
  const wrap = document.createElement('div');

  const trainBtn = document.createElement('button');
  trainBtn.className = 'btn';
  trainBtn.textContent = 'Train';
  trainBtn.addEventListener('click', () => {
    applyAndSave(() => {
      const gain = rand(2, 5);
      game.skills.fitness += gain;
      game.health = clamp(game.health + gain);
      addLog(`You trained hard. +${gain} Fitness and Health.`, 'health');
    });
  });
  wrap.appendChild(trainBtn);

  const tourBtn = document.createElement('button');
  tourBtn.className = 'btn';
  tourBtn.textContent = 'Enter Tournament';
  tourBtn.addEventListener('click', () => {
    applyAndSave(() => {
      game.athleticRecord.tournaments += 1;
      const chance = Math.min(50 + game.skills.fitness, 95);
      if (rand(1, 100) <= chance) {
        const prize = rand(5000, 20000);
        game.money += prize;
        game.athleticRecord.wins += 1;
        game.happiness = clamp(game.happiness + rand(5, 10));
        addLog(`You won the tournament and earned $${prize.toLocaleString()}.`, 'leisure');
      } else {
        const loss = rand(2, 6);
        game.health = clamp(game.health - loss);
        addLog(`You lost the tournament. -${loss} Health.`, 'leisure');
      }
    });
  });
  wrap.appendChild(tourBtn);

  const endorseBtn = document.createElement('button');
  endorseBtn.className = 'btn';
  endorseBtn.textContent = 'Seek Endorsement';
  endorseBtn.addEventListener('click', () => {
    applyAndSave(() => {
      if (game.athleticRecord.wins === 0) {
        addLog('No brands are interested yet. Win a tournament first.', 'job');
        return;
      }
      const pay = rand(2000, 10000) + game.athleticRecord.wins * 500;
      game.money += pay;
      game.followers += rand(100, 500);
      game.athleticRecord.endorsements += 1;
      addLog(`You signed an endorsement deal for $${pay.toLocaleString()}.`, 'job');
    });
  });
  wrap.appendChild(endorseBtn);

  container.appendChild(wrap);
}

