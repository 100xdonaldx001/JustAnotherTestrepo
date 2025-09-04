import { game, addLog, applyAndSave } from '../state.js';

export function renderBank(container) {
  if (typeof game.savingsBalance !== 'number') game.savingsBalance = 0;
  if (typeof game.creditScore !== 'number') game.creditScore = 650;

  const wrap = document.createElement('div');

  const stats = document.createElement('div');
  stats.className = 'muted';
  function updateStats() {
    stats.textContent = `Savings: $${game.savingsBalance} | Credit Score: ${game.creditScore}`;
  }
  updateStats();
  wrap.appendChild(stats);

  const depInput = document.createElement('input');
  depInput.type = 'number';
  depInput.min = '1';
  depInput.value = '100';
  depInput.style.width = '80px';
  const depBtn = document.createElement('button');
  depBtn.className = 'btn';
  depBtn.textContent = 'Deposit';
  depBtn.addEventListener('click', () => {
    const amt = Math.floor(Number(depInput.value));
    if (amt <= 0) return;
    if (game.money < amt) {
      applyAndSave(() => {
        addLog('Not enough cash to deposit.', 'finance');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= amt;
      game.savingsBalance += amt;
      addLog(`Deposited $${amt}.`, 'finance');
      updateStats();
    });
  });

  const wdInput = document.createElement('input');
  wdInput.type = 'number';
  wdInput.min = '1';
  wdInput.value = '100';
  wdInput.style.width = '80px';
  const wdBtn = document.createElement('button');
  wdBtn.className = 'btn';
  wdBtn.textContent = 'Withdraw';
  wdBtn.addEventListener('click', () => {
    const amt = Math.floor(Number(wdInput.value));
    if (amt <= 0) return;
    if (game.savingsBalance < amt) {
      applyAndSave(() => {
        addLog('Not enough savings to withdraw.', 'finance');
      });
      return;
    }
    applyAndSave(() => {
      game.savingsBalance -= amt;
      game.money += amt;
      addLog(`Withdrew $${amt}.`, 'finance');
      updateStats();
    });
  });

  const loanInput = document.createElement('input');
  loanInput.type = 'number';
  loanInput.min = '100';
  loanInput.value = '1000';
  loanInput.style.width = '80px';
  const loanBtn = document.createElement('button');
  loanBtn.className = 'btn';
  loanBtn.textContent = 'Apply Loan';
  loanBtn.addEventListener('click', () => {
    const amt = Math.floor(Number(loanInput.value));
    if (amt <= 0) return;
    if (game.creditScore < 600) {
      applyAndSave(() => {
        addLog('Loan denied due to low credit score.', 'finance');
      });
      return;
    }
    applyAndSave(() => {
      game.money += amt;
      game.loanBalance += amt;
      game.creditScore = Math.max(300, game.creditScore - 20);
      addLog(`Loan approved for $${amt}.`, 'finance');
      updateStats();
    });
  });

  wrap.appendChild(depInput);
  wrap.appendChild(depBtn);
  wrap.appendChild(document.createElement('br'));
  wrap.appendChild(wdInput);
  wrap.appendChild(wdBtn);
  wrap.appendChild(document.createElement('br'));
  wrap.appendChild(loanInput);
  wrap.appendChild(loanBtn);

  container.appendChild(wrap);
}

