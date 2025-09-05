import { saveGame, loadGame, newLife } from '../state.js';
import { setTheme, setWindowTransparency } from '../ui.js';
import { renderSlotManager } from './newlife.js';

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

  const slotWrap = document.createElement('div');
  renderSlotManager(slotWrap);
  wrap.appendChild(slotWrap);

  wrap.appendChild(mk('Save Game', saveGame));
  wrap.appendChild(mk('Load Game', loadGame));
  wrap.appendChild(mk('Start New Life', () => newLife()));
  wrap.appendChild(
    mk('Toggle Theme', () => {
      const current = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(current);
    })
  );
  wrap.appendChild(
    mk('Toggle Window Transparency', () => {
      const solid = !document.body.classList.contains('solid-windows');
      setWindowTransparency(solid);
    })
  );

  container.appendChild(wrap);
}

