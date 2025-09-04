import { game } from '../state.js';
import { openWindow } from '../windowManager.js';
import { renovateProperty } from '../actions/renovateProperty.js';

export { openWindow };

/**
 * Renders the renovation interface to start property renovations.
 * @param {HTMLElement} container - The DOM element to render into.
 * @returns {void}
 */
export function renderRenovation(container) {
  const wrap = document.createElement('div');
  if (game.properties.length === 0) {
    wrap.textContent = 'You own no properties.';
    container.appendChild(wrap);
    return;
  }
  game.properties.forEach(prop => {
    const row = document.createElement('div');
    const info = document.createElement('span');
    info.textContent = `${prop.name} (Value $${prop.value.toLocaleString()})`;
    const costInput = document.createElement('input');
    costInput.type = 'number';
    costInput.min = '1';
    costInput.value = Math.round(prop.value * 0.1);
    costInput.style.width = '80px';
    const yearInput = document.createElement('input');
    yearInput.type = 'number';
    yearInput.min = '1';
    yearInput.value = '1';
    yearInput.style.width = '40px';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Renovate';
    btn.addEventListener('click', () => {
      const cost = Math.floor(Number(costInput.value));
      const yrs = Math.floor(Number(yearInput.value));
      if (cost > 0 && yrs > 0) {
        renovateProperty(prop, cost, yrs);
      }
    });
    row.appendChild(info);
    row.appendChild(document.createTextNode(' Cost $'));
    row.appendChild(costInput);
    row.appendChild(document.createTextNode(' Years '));
    row.appendChild(yearInput);
    row.appendChild(btn);
    wrap.appendChild(row);
  });
  container.appendChild(wrap);
}

