import { game, ACHIEVEMENTS } from '../state.js';

export function renderAchievements(container) {
  const total = Object.keys(ACHIEVEMENTS).length;
  let unlockedCount = 0;

  const list = document.createElement('div');
  list.className = 'achievements';
  for (const [id, text] of Object.entries(ACHIEVEMENTS)) {
    const unlocked = game.achievements.some(a => a.id === id);
    if (unlocked) unlockedCount++;
    const e = document.createElement('div');
    e.className = `entry ${unlocked ? 'unlocked' : 'locked'}`;
    e.textContent = text;
    list.appendChild(e);
  }

  const summary = document.createElement('div');
  summary.className = 'summary';
  summary.textContent = `${unlockedCount}/${total} achievements unlocked`;

  const filterLabel = document.createElement('label');
  filterLabel.className = 'filter';
  const filter = document.createElement('input');
  filter.type = 'checkbox';
  filterLabel.appendChild(filter);
  filterLabel.appendChild(document.createTextNode(' Show unlocked only'));

  filter.addEventListener('change', () => {
    list.querySelectorAll('.entry.locked').forEach(el => {
      el.style.display = filter.checked ? 'none' : '';
    });
  });

  container.appendChild(summary);
  container.appendChild(filterLabel);
  container.appendChild(list);
}
