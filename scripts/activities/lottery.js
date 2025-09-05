import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { openWindow } from '../windowManager.js';

export { openWindow };

function renderStandardLottery(container) {
  const wrap = document.createElement('div');
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Buy Ticket ($5)';
  btn.disabled = game.money < 5;
  btn.addEventListener('click', () => {
    if (game.money < 5) return;
    applyAndSave(() => {
      game.money -= 5;
      const roll = rand(1, 100);
      let prize = 0;
      let mood = -2;
      let msg = 'You bought a lottery ticket but won nothing.';
      if (roll === 1) {
        prize = 10000;
        mood = 20;
        msg = `Jackpot! You won $${prize.toLocaleString()}.`;
      } else if (roll <= 5) {
        prize = 1000;
        mood = 8;
        msg = `You won $${prize.toLocaleString()}.`;
      } else if (roll <= 20) {
        prize = 100;
        mood = 3;
        msg = `You won $${prize}.`;
      }
      game.money += prize;
      game.happiness = clamp(game.happiness + mood);
      addLog(msg, 'gambling');
    });
  });
  wrap.appendChild(btn);
  container.appendChild(wrap);
}

export function renderScratchOff(container) {
  const wrap = document.createElement('div');
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Scratch-Off ($2)';
  btn.disabled = game.money < 2;
  btn.addEventListener('click', () => {
    if (game.money < 2) return;
    applyAndSave(() => {
      game.money -= 2;
      const roll = rand(1, 100);
      let prize = 0;
      let mood = -1;
      let msg = 'You scratched the ticket but won nothing.';
      if (roll === 1) {
        prize = 500;
        mood = 10;
        msg = `Jackpot! You won $${prize}.`;
      } else if (roll <= 10) {
        prize = 50;
        mood = 4;
        msg = `You won $${prize}.`;
      } else if (roll <= 30) {
        prize = 10;
        mood = 1;
        msg = `You won $${prize}.`;
      }
      game.money += prize;
      game.happiness = clamp(game.happiness + mood);
      addLog(msg, 'gambling');
    });
  });
  wrap.appendChild(btn);
  container.appendChild(wrap);
}

export function renderLottery(container) {
  const wrap = document.createElement('div');

  const select = document.createElement('select');
  const optStandard = document.createElement('option');
  optStandard.value = 'standard';
  optStandard.textContent = 'Standard Lottery';
  select.appendChild(optStandard);
  const optScratch = document.createElement('option');
  optScratch.value = 'scratch';
  optScratch.textContent = 'Scratch-Off Ticket';
  select.appendChild(optScratch);
  wrap.appendChild(select);

  const content = document.createElement('div');
  content.style.marginTop = '8px';
  wrap.appendChild(content);

  const renderCurrent = () => {
    content.innerHTML = '';
    if (select.value === 'scratch') {
      renderScratchOff(content);
    } else {
      renderStandardLottery(content);
    }
  };

  select.addEventListener('change', renderCurrent);
  renderCurrent();

  container.appendChild(wrap);
}

