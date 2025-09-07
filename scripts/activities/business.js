import { game, addLog, applyAndSave, unlockAchievement } from '../state.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderBusiness(container) {
  const wrap = document.createElement('div');

  const startBtn = document.createElement('button');
  startBtn.className = 'btn';
  startBtn.textContent = 'Start Business';
  startBtn.addEventListener('click', () => {
    const cost = rand(5000, 20000);
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('Not enough money to start a business.', 'business');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      if (rand(1, 100) > taskChances.business.startupSuccess) {
        addLog('Your business failed to launch.', 'business');
        return;
      }
      const biz = {
        name: 'Business',
        startupCost: cost,
        revenue: rand(8000, 30000),
        expenses: rand(4000, 15000),
        employees: 0,
        payroll: 0,
        profit: 0
      };
      game.businesses.push(biz);
      addLog(`Started a business for $${cost.toLocaleString()}.`, 'business');
      if (game.businesses.length === 1) {
        unlockAchievement('first-business', 'Started your first business.');
      }
      updateList();
    });
  });

  wrap.appendChild(startBtn);

  const list = document.createElement('div');
  wrap.appendChild(list);

  function updateList() {
    list.innerHTML = '';
    game.businesses.forEach(biz => {
      const row = document.createElement('div');
      row.textContent = `${biz.name}: ${biz.employees} employees, Payroll $${
        (biz.payroll || 0).toLocaleString()
      }, Profit $${biz.profit.toLocaleString()}`;
      const hire = document.createElement('button');
      hire.className = 'btn';
      hire.textContent = 'Hire';
      hire.addEventListener('click', () => {
        applyAndSave(() => {
          biz.employees += 1;
          addLog(`Hired an employee for ${biz.name}.`, 'business');
          updateList();
        });
      });
      const fire = document.createElement('button');
      fire.className = 'btn';
      fire.textContent = 'Fire';
      fire.addEventListener('click', () => {
        if (biz.employees <= 0) return;
        applyAndSave(() => {
          biz.employees -= 1;
          addLog(`Fired an employee from ${biz.name}.`, 'business');
          updateList();
        });
      });
      row.appendChild(hire);
      row.appendChild(fire);
      list.appendChild(row);
    });
  }

  updateList();
  container.appendChild(wrap);
}

export function tickBusinesses() {
  for (const biz of game.businesses) {
    const payroll = biz.expenses * biz.employees;
    biz.payroll = payroll;
    const profit = biz.revenue - payroll;
    game.money += profit;
    biz.profit += profit;
    addLog(
      `Business ${biz.name} ${profit >= 0 ? 'earned' : 'lost'} $${Math.abs(profit).toLocaleString()}.`,
      'business'
    );
  }
  const total = game.businesses.reduce((sum, b) => sum + b.profit, 0);
  if (total >= 100000) {
    unlockAchievement('business-tycoon', 'Earned $100k in business profits.');
  }
}

