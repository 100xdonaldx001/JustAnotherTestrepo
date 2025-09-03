import { game } from '../state.js';

export function renderAchievements(container) {
  const list = document.createElement('div');
  list.className = 'achievements';
  if (game.achievements.length === 0) {
    const e = document.createElement('div');
    e.textContent = 'No achievements unlocked yet.';
    list.appendChild(e);
  } else {
    for (const a of game.achievements) {
      const e = document.createElement('div');
      e.className = 'entry';
      e.textContent = a.text;
      list.appendChild(e);
    }
  }
  container.appendChild(list);
}
