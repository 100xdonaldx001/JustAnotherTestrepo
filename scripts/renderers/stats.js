import { game, hasPersistence } from '../state.js';
import { clamp } from '../utils.js';
import { eduName } from '../school.js';

export function renderStats(container) {
  if (!hasPersistence) {
    const warn = document.createElement('div');
    warn.className = 'warning-banner';
    warn.textContent = '⚠️ Progress will reset when the page reloads.';
    container.appendChild(warn);
  }
  const makeKpi = (label, val, title = '') => {
    const pct = clamp(val);
    const div = document.createElement('div');
    div.className = 'kpi';
    if (title) {
      div.title = title;
    }
    const labelSpan = document.createElement('span');
    labelSpan.className = 'label';
    labelSpan.textContent = label;
    div.appendChild(labelSpan);
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('div');
    fill.className = 'fill';
    fill.style.width = `${pct}%`;
    bar.appendChild(fill);
    div.appendChild(bar);
    const numSpan = document.createElement('span');
    numSpan.className = 'num';
    numSpan.textContent = String(pct);
    div.appendChild(numSpan);
    return div;
  };
  const top = document.createElement('div');
  top.className = 'grid';
  const addRow = (label, value) => {
    const row = document.createElement('div');
    row.className = 'row';
    const strong = document.createElement('strong');
    strong.textContent = `${label}:`;
    row.appendChild(strong);
    row.appendChild(document.createTextNode(' '));
    const span = document.createElement('span');
    if (value instanceof Node) {
      span.appendChild(value);
    } else {
      span.textContent = value;
    }
    row.appendChild(span);
    top.appendChild(row);
  };
  addRow('Year', game.year);
  addRow('Age', game.age);
  addRow('Money', `$${game.money.toLocaleString()}`);
  const econ = document.createElement('span');
  econ.className = `badge ${game.economyPhase}`;
  econ.textContent = game.economyPhase;
  addRow('Economy', econ);
  addRow('Student Debt', `$${game.loanBalance.toLocaleString()}`);
  addRow('Medical Debt', `$${game.medicalBills.toLocaleString()}`);
  const status = game.alive
    ? game.inJail
      ? 'In Jail'
      : game.onParole
        ? 'On Parole'
        : 'Alive'
    : 'Deceased';
  addRow('Status', status);
  if (game.onParole) {
    addRow('Parole', `${game.paroleYears ?? 0} year(s)`);
  }
  if (game.job) {
    const jobSpan = document.createElement('span');
    jobSpan.textContent = `${game.job.title} `;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `$${game.job.salary.toLocaleString()}`;
    jobSpan.appendChild(badge);
    addRow('Job', jobSpan);
  } else {
    addRow('Job', '—');
  }
  const edu = game.education.current
    ? `In ${eduName(game.education.current)}`
    : eduName(game.education.highest);
  addRow('Education', edu);
  addRow('Illness', game.sick ? 'Sick' : '—');
  container.appendChild(top);
  container.appendChild(
    makeKpi('Health', game.health, 'Affects illness risk and recovery speed')
  );
  container.appendChild(
    makeKpi('Mental Health', game.mentalHealth, 'Reflects stress resilience')
  );
  container.appendChild(
    makeKpi('Happiness', game.happiness, 'Influences your decisions and mood')
  );
  container.appendChild(
    makeKpi('Smarts', game.smarts, 'Boosts school and activity outcomes')
  );
  container.appendChild(
    makeKpi('Looks', game.looks, 'Affects social and romantic prospects')
  );
  container.appendChild(
    makeKpi(
      'Alcohol Addiction',
      game.alcoholAddiction,
      'Higher values reduce health and happiness'
    )
  );
  container.appendChild(
    makeKpi(
      'Drug Addiction',
      game.drugAddiction,
      'Higher values reduce health and happiness'
    )
  );
  if (game.job) {
    container.appendChild(
      makeKpi(
        'Job Satisfaction',
        game.jobSatisfaction,
        'Low satisfaction can impact your health'
      )
    );
  }
  const hint = document.createElement('div');
  hint.className = 'muted';
  hint.style.marginTop = '8px';
  hint.textContent = 'Tip: Open Actions to age up and do stuff. You can drag windows around and click to bring them to the front.';
  container.appendChild(hint);
}
