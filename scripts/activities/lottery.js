import { game, addLog, applyAndSave } from '../state.js';
import { clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';

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
      const roll = Math.random() * 100;
      let prize = 0;
      let mood = -2;
      let msg = 'You bought a lottery ticket but won nothing.';
      if (roll <= taskChances.lottery.standardSmall) {
        prize = 100;
        mood = 3;
        msg = `You won $${prize}.`;
      } else if (roll <= taskChances.lottery.standardBig) {
        prize = 1000;
        mood = 8;
        msg = `You won $${prize.toLocaleString()}.`;
      } else if (roll <= taskChances.lottery.standardJackpot) {
        prize = 10000;
        mood = 20;
        msg = `Jackpot! You won $${prize.toLocaleString()}.`;
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
      const roll = Math.random() * 100;
      let prize = 0;
      let mood = -1;
      let msg = 'You scratched the ticket but won nothing.';
      if (roll <= taskChances.lottery.scratchJackpot) {
        prize = 500;
        mood = 10;
        msg = `Jackpot! You won $${prize}.`;
      } else if (roll <= taskChances.lottery.scratchMid) {
        prize = 50;
        mood = 4;
        msg = `You won $${prize}.`;
      } else if (roll <= taskChances.lottery.scratchSmall) {
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

export function renderLottery(container, win) {
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

  select.value = win?.dataset.lotteryType || 'standard';
  if (win) {
    win.dataset.lotteryType = select.value;
  }

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

  select.addEventListener('change', () => {
    if (win) {
      win.dataset.lotteryType = select.value;
    }
    renderCurrent();
  });
  renderCurrent();

  container.appendChild(wrap);
}

