import { game, ACHIEVEMENTS } from '../state.js';

export function renderAchievements(container) {
  const list = document.createElement('div');
  list.className = 'achievements';
  for (const [id, text] of Object.entries(ACHIEVEMENTS)) {
    const unlocked = game.achievements.some(a => a.id === id);
    const e = document.createElement('div');
    e.className = 'entry';
    e.textContent = unlocked ? text : `${text} (locked)`;
    list.appendChild(e);
  }
  container.appendChild(list);
}
