import { game, addLog, saveGame } from '../state.js';
import { refreshOpenWindows } from '../windowManager.js';

export function renderWillAndTestament(container) {
  const wrap = document.createElement('div');

  const options = [
    {
      label: 'Leave to partner',
      action: () => {
        if (!game.relationships.length) {
          addLog('You have no partner to leave your estate to.');
        } else {
          const partner = game.relationships[0].name;
          game.inheritance = { [partner]: 1 };
          addLog(`You updated your will: everything goes to ${partner}.`);
        }
        refreshOpenWindows();
        saveGame();
      }
    },
    {
      label: 'Divide among children',
      action: () => {
        if (!game.children || game.children.length === 0) {
          addLog('You have no children to inherit your estate.');
        } else {
          const share = 1 / game.children.length;
          game.inheritance = {};
          for (const child of game.children) {
            game.inheritance[child.name] = share;
          }
          addLog('You updated your will to divide your estate among your children.');
        }
        refreshOpenWindows();
        saveGame();
      }
    },
    {
      label: 'Donate to charity',
      action: () => {
        game.inheritance = { Charity: 1 };
        addLog('You updated your will to donate your estate to charity.');
        refreshOpenWindows();
        saveGame();
      }
    }
  ];

  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = opt.label;
    btn.addEventListener('click', opt.action);
    wrap.appendChild(btn);
  }

  const current = document.createElement('div');
  current.className = 'muted';
  current.style.marginTop = '8px';
  if (game.inheritance) {
    const entries = Object.entries(game.inheritance).map(
      ([k, v]) => `${k} ${(v * 100).toFixed(0)}%`
    );
    current.textContent = `Current plan: ${entries.join(', ')}`;
  } else {
    current.textContent = 'No estate plan set.';
  }
  wrap.appendChild(current);

  container.appendChild(wrap);
}

