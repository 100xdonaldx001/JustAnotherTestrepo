import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderGym(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Build your body and looks at the gym.';
  container.appendChild(head);

  const workBtn = document.createElement('button');
  workBtn.className = 'btn';
  workBtn.textContent = 'Work Out';
  workBtn.addEventListener('click', () => {
    applyAndSave(() => {
      if (rand(1, 100) <= taskChances.gym.workoutInjury) {
        const loss = rand(1, 3);
        game.health = clamp(game.health - loss);
        addLog(`You injured yourself working out. -${loss} Health.`, 'health');
        return;
      }
      const bonus = Math.floor(game.skills.fitness / 5);
      const healthGain = rand(2, 5) + bonus;
      const looksGain = rand(1, 3) + Math.floor(bonus / 2);
      game.health = clamp(game.health + healthGain);
      game.looks = clamp(game.looks + looksGain);
      game.skills.fitness += 1;
      addLog(
        `You worked out. +${healthGain} Health, +${looksGain} Looks.`,
        'health'
      );
    });
  });
  container.appendChild(workBtn);

  const joinBtn = document.createElement('button');
  joinBtn.className = 'btn';
  joinBtn.textContent = 'Join Gym ($50)';
  joinBtn.addEventListener('click', () => {
    if (game.money < 50) {
      applyAndSave(() => {
        addLog('Gym membership costs $50. Not enough money.', 'health');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= 50;
      if (rand(1, 100) <= taskChances.gym.joinInjury) {
        const loss = rand(1, 4);
        game.health = clamp(game.health - loss);
        addLog(`You hurt yourself on the first day. -${loss} Health.`, 'health');
        return;
      }
      const bonus = Math.floor(game.skills.fitness / 3);
      const healthGain = rand(4, 8) + bonus;
      const looksGain = rand(2, 5) + Math.floor(bonus / 2);
      game.health = clamp(game.health + healthGain);
      game.looks = clamp(game.looks + looksGain);
      game.skills.fitness += 2;
      addLog(
        `You joined a gym. +${healthGain} Health, +${looksGain} Looks.`,
        'health'
      );
    });
  });
  container.appendChild(joinBtn);
}

