import { saveGame, loadGame, newLife } from '../state.js';
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

