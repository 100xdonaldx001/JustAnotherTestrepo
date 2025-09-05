import { game } from '../state.js';
import {
  addInvestment,
  updateInvestmentRisk,
  riskTiers,
  calculateDividend
} from '../investment.js';

export function renderInvestment(container) {
  const g = document.createElement('div');

  const form = document.createElement('div');
  const nameInput = document.createElement('input');
  nameInput.placeholder = 'Asset name';
  const amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.placeholder = 'Amount';
  const riskSelect = document.createElement('select');
  ['low', 'medium', 'high'].forEach(r => {
    const o = document.createElement('option');
    o.value = r;
    o.textContent = r;
    riskSelect.appendChild(o);
  });
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add';
  addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const risk = riskSelect.value;
    if (name && amount > 0) {
      addInvestment(name, amount, risk);
      nameInput.value = '';
      amountInput.value = '';
    }
  });
  form.appendChild(nameInput);
  form.appendChild(amountInput);
  form.appendChild(riskSelect);
  form.appendChild(addBtn);
  g.appendChild(form);

  const title = document.createElement('h3');
  title.textContent = 'Portfolio';
  g.appendChild(title);

  if (game.portfolio.length === 0) {
    const none = document.createElement('div');
    none.textContent = 'No investments.';
    g.appendChild(none);
  } else {
    game.portfolio.forEach(inv => {
      const row = document.createElement('div');
      row.style.marginTop = '4px';
      const info = document.createElement('span');
      info.textContent = `${inv.name} - $${inv.amount.toLocaleString()} - Dividend $${Math.round(
        calculateDividend(inv)
      ).toLocaleString()}`;
      row.appendChild(info);
      const select = document.createElement('select');
      Object.keys(riskTiers).forEach(r => {
        const o = document.createElement('option');
        o.value = r;
        o.textContent = r;
        if (inv.risk === r) o.selected = true;
        select.appendChild(o);
      });
      select.addEventListener('change', () => {
        updateInvestmentRisk(inv, select.value);
      });
      row.appendChild(select);
      g.appendChild(row);
    });
  }

  container.appendChild(g);
}

