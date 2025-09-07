import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderMilitary(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  const mk = (text, fn) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = text;
    b.addEventListener('click', fn);
    return b;
  };

  wrap.appendChild(
    mk('Enlist', () => {
      applyAndSave(() => {
        if (game.military.enlisted) {
          addLog('You are already enlisted.', 'military');
          return;
        }
        if (rand(1, 100) > taskChances.military.enlistSuccess) {
          addLog('The military rejected your application.', 'military');
          return;
        }
        game.military.enlisted = true;
        game.military.drafted = false;
        game.military.deployed = false;
        game.job = {
          title: 'Soldier',
          baseTitle: 'Soldier',
          salary: 30000,
          field: 'military',
          level: 'entry'
        };
        game.jobLevel = 'entry';
        game.jobExperience = 0;
        addLog('You enlisted in the military as a Soldier.', 'military');
      });
    })
  );

  wrap.appendChild(
    mk('Deploy', () => {
      applyAndSave(() => {
        if (!game.military.enlisted) {
          addLog('You are not in the military.', 'military');
          return;
        }
        if (game.military.deployed) {
          addLog('You are already deployed.', 'military');
          return;
        }
        game.military.deployed = true;
        const health = rand(1, 5);
        const happy = rand(0, 3);
        game.health = clamp(game.health - health);
        game.happiness = clamp(game.happiness - happy);
        const msg = `You were deployed. -${health} Health${happy ? `, -${happy} Happiness` : ''}.`;
        addLog(msg, 'military');
      });
    })
  );

  wrap.appendChild(
    mk('Discharge', () => {
      applyAndSave(() => {
        if (!game.military.enlisted) {
          addLog('You are not in the military.', 'military');
          return;
        }
        game.military.enlisted = false;
        game.military.drafted = false;
        game.military.deployed = false;
        game.job = null;
        game.jobLevel = null;
        addLog('You were discharged from the military.', 'military');
      });
    })
  );

  container.appendChild(wrap);
}

