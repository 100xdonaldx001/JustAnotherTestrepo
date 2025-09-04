import { game, addLog, applyAndSave, unlockAchievement } from '../state.js';
import { rand } from '../utils.js';

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
      const biz = {
        name: 'Business',
        startupCost: cost,
        revenue: rand(8000, 30000),
        expenses: rand(4000, 15000),
        employees: rand(1, 10),
        profit: 0
      };
      game.businesses.push(biz);
      addLog(`Started a business for $${cost.toLocaleString()}.`, 'business');
      if (game.businesses.length === 1) {
        unlockAchievement('first-business', 'Started your first business.');
      }
    });
  });

  wrap.appendChild(startBtn);
  container.appendChild(wrap);
}

export function tickBusinesses() {
  for (const biz of game.businesses) {
    const annualCost = biz.expenses * biz.employees;
    const profit = biz.revenue - annualCost;
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

