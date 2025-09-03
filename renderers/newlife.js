import { newLife } from '../state.js';
import { openWindow, closeWindow } from '../windowManager.js';
import { renderStats } from './stats.js';

export function renderNewLife(container) {
  const wrap = document.createElement('div');
  wrap.className = 'new-life';

  const msg = document.createElement('p');
  msg.textContent = 'Start a new life? Your current progress will be lost.';
  wrap.appendChild(msg);

  const start = document.createElement('button');
  start.textContent = 'Start New Life';
  start.addEventListener('click', () => {
    newLife();
    openWindow('stats', 'Stats', renderStats);
    closeWindow('newLife');
  });
  wrap.appendChild(start);

  const cancel = document.createElement('button');
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', () => {
    closeWindow('newLife');
  });
  wrap.appendChild(cancel);

  container.appendChild(wrap);
}

