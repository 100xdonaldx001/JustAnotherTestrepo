import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderWillAndTestament(container) {
  const wrap = document.createElement('div');

  const options = [
    {
      label: 'Leave to partner',
      action: () => {
        if (rand(1, 100) > taskChances.will.planSuccess) {
          applyAndSave(() => {
            addLog('Paperwork error prevented updating your will.', 'property');
          });
          return;
        }
        applyAndSave(() => {
          if (!game.relationships.length) {
            addLog('You have no partner to leave your estate to.', 'property');
          } else {
            const partner = game.relationships[0].name;
            game.inheritance = { [partner]: 1 };
            addLog(`You updated your will: everything goes to ${partner}.`, 'property');
          }
        });
      }
    },
    {
      label: 'Divide among children',
      action: () => {
        if (rand(1, 100) > taskChances.will.planSuccess) {
          applyAndSave(() => {
            addLog('Legal delays prevented changes to your will.', 'property');
          });
          return;
        }
        applyAndSave(() => {
          if (!game.state.children || game.state.children.length === 0) {
            addLog('You have no children to inherit your estate.', 'property');
          } else {
            const share = 1 / game.state.children.length;
            game.inheritance = {};
            for (const child of game.state.children) {
              game.inheritance[child.name] = share;
            }
            addLog('You updated your will to divide your estate among your children.', 'property');
          }
        });
      }
    },
    {
      label: 'Donate to charity',
      action: () => {
        if (rand(1, 100) > taskChances.will.planSuccess) {
          applyAndSave(() => {
            addLog('Clerical issues kept your will the same.', 'property');
          });
          return;
        }
        applyAndSave(() => {
          game.inheritance = { Charity: 1 };
          addLog('You updated your will to donate your estate to charity.', 'property');
        });
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

