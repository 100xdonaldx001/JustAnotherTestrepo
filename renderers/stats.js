import { game } from '../state.js';
import { clamp } from '../utils.js';

export function renderStats(container) {
  const makeKpi = (label, val) => {
    const pct = clamp(val);
    const div = document.createElement('div');
    div.className = 'kpi';
    div.innerHTML = `<span class="label">${label}</span><div class="bar"><div class="fill" style="width:${pct}%"></div></div><span class="num">${pct}</span>`;
    return div;
  };
  const top = document.createElement('div');
  top.className = 'grid';
  top.innerHTML = `
        <div class="row"><strong>Year:</strong> <span>${game.year}</span></div>
        <div class="row"><strong>Age:</strong> <span>${game.age}</span></div>
        <div class="row"><strong>Money:</strong> <span>$${game.money.toLocaleString()}</span></div>
        <div class="row"><strong>Status:</strong> <span>${game.alive ? (game.inJail ? 'In Jail' : 'Alive') : 'Deceased'}</span></div>
        <div class="row"><strong>Job:</strong> <span>${game.job ? `${game.job.title} <span class='badge'>$${game.job.salary.toLocaleString()}</span>` : '—'}</span></div>
        <div class="row"><strong>Illness:</strong> <span>${game.sick ? 'Sick' : '—'}</span></div>`;
  container.appendChild(top);
  container.appendChild(makeKpi('Health', game.health));
  container.appendChild(makeKpi('Happiness', game.happiness));
  container.appendChild(makeKpi('Smarts', game.smarts));
  container.appendChild(makeKpi('Looks', game.looks));
  container.appendChild(makeKpi('Addiction', game.addiction));
  const hint = document.createElement('div');
  hint.className = 'muted';
  hint.style.marginTop = '8px';
  hint.textContent = 'Tip: Open Actions to age up and do stuff. You can drag windows around and click to bring them to the front.';
  container.appendChild(hint);
}
