import { game, addLog } from '../state.js';
import { generateJobs } from '../jobs.js';
import { refreshOpenWindows } from '../windowManager.js';

export function renderJobs(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  if (game.age < 16) {
    head.textContent = 'You are too young to work. Come back at age 16+';
    container.appendChild(head);
    return;
  }
  head.innerHTML = `Pick a job. Smarter roles require higher Smarts.`;
  container.appendChild(head);
  const jobs = generateJobs();
  const wrap = document.createElement('div');
  wrap.className = 'jobs';
  for (const j of jobs) {
    const e = document.createElement('div');
    e.className = 'job';
    const ok = game.smarts >= j.reqSmarts;
    e.innerHTML = `<div><strong>${j.title}</strong><div class="muted">Req Smarts: ${j.reqSmarts}</div></div><div><span class="badge">$${j.salary.toLocaleString()}/yr</span></div>`;
    if (!ok) e.style.opacity = 0.6;
    e.title = ok ? 'Take job' : 'Your Smarts are too low for this role';
    e.addEventListener('click', () => {
      if (!ok) {
        addLog('You were not qualified for that role. (+Study to improve Smarts)');
        refreshOpenWindows();
        return;
      }
      game.job = j;
      addLog(`You became a ${j.title}. Salary $${j.salary.toLocaleString()}/yr.`);
      refreshOpenWindows();
    });
    wrap.appendChild(e);
  }
  container.appendChild(wrap);
}
