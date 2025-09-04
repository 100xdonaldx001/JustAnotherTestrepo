import { saveGame, loadGame, newLife, game } from '../state.js';
import { setTheme } from '../script.js';

export function renderSettings(container) {
  const wrap = document.createElement('div');
  wrap.className = 'settings';

  const mk = (text, fn) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = text;
    b.addEventListener('click', fn);
    return b;
  };

  const diffLabel = document.createElement('label');
  diffLabel.textContent = 'Difficulty: ';
  const select = document.createElement('select');
  ['easy', 'normal', 'hard'].forEach(level => {
    const opt = document.createElement('option');
    opt.value = level;
    opt.textContent = level[0].toUpperCase() + level.slice(1);
    if (game.difficulty === level) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', e => {
    game.difficulty = e.target.value;
    saveGame();
  });
  diffLabel.appendChild(select);
  wrap.appendChild(diffLabel);

  wrap.appendChild(mk('Save Game', saveGame));
  wrap.appendChild(mk('Load Game', loadGame));
  wrap.appendChild(mk('Start New Life', () => newLife()));
  wrap.appendChild(
    mk('Toggle Theme', () => {
      const current = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(current);
    })
  );

  container.appendChild(wrap);
}

