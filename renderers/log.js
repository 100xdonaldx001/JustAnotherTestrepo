import { game } from '../state.js';

export function renderLog(container) {
  const list = document.createElement('div');
  list.className = 'log';
  if (game.log.length === 0) {
    const e = document.createElement('div');
    e.className = 'entry';
    e.textContent = 'Your story will appear here.';
    list.appendChild(e);
  } else {
    for (const item of game.log) {
      const e = document.createElement('div');
      e.className = 'entry';
      e.innerHTML = `<div>${item.text}</div><time>${item.when}</time>`;
      list.appendChild(e);
    }
  }
  container.appendChild(list);
}
