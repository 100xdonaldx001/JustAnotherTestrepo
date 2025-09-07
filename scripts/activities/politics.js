import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';

const OFFICES = [
  { title: 'Council Member', cost: 20000, rep: 40 },
  { title: 'Mayor', cost: 100000, rep: 60 }
];

export function renderPolitics(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Run for office using your reputation and funds.';
  wrap.appendChild(head);

  for (const office of OFFICES) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = `${office.title} - $${office.cost.toLocaleString()}`;
    if (game.money < office.cost) {
      btn.disabled = true;
    }
    btn.addEventListener('click', () => {
      if (game.money < office.cost) return;
      applyAndSave(() => {
        game.money -= office.cost;
        if (rand(1, 100) > taskChances.politics.campaignSuccess) {
          addLog('Your campaign failed to gain traction.', 'politics');
          return;
        }
        const chance = clamp(game.reputation - office.rep + 50, 5, 95);
        const won = rand(1, 100) <= chance;
        if (won) {
          game.politicalCareer = office.title;
          addLog(`You were elected ${office.title}.`, 'politics');
          if (rand(1, 100) <= taskChances.politics.policyPass) {
            game.reputation = clamp(game.reputation + 5);
            addLog('You passed a popular policy. (+Reputation)', 'politics');
          } else {
            addLog('Your first policy proposal failed.', 'politics');
          }
        } else {
          addLog(`You lost the ${office.title} election.`, 'politics');
        }
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

