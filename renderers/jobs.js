import { game, addLog, saveGame } from '../state.js';
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
  head.textContent = 'Pick a job. Smarter roles require higher Smarts.';
  container.appendChild(head);
  const jobs = generateJobs();
  const wrap = document.createElement('div');
  wrap.className = 'jobs';
  for (const j of jobs) {
    const e = document.createElement('div');
    e.className = 'job';
    const ok = game.smarts >= j.reqSmarts;
    const left = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = j.title;
    left.appendChild(strong);
    const req = document.createElement('div');
    req.className = 'muted';
    req.textContent = `Req Smarts: ${j.reqSmarts}`;
    left.appendChild(req);
    const right = document.createElement('div');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `$${j.salary.toLocaleString()}/yr`;
    right.appendChild(badge);
    e.appendChild(left);
    e.appendChild(right);
    if (!ok) e.style.opacity = 0.6;
    e.title = ok ? 'Take job' : 'Your Smarts are too low for this role';
    e.addEventListener('click', () => {
      if (!ok) {
        addLog('You were not qualified for that role. (+Study to improve Smarts)', 'job');
        refreshOpenWindows();
        saveGame();
        return;
      }
      game.job = j;
      addLog(`You became a ${j.title}. Salary $${j.salary.toLocaleString()}/yr.`, 'job');
      refreshOpenWindows();
      saveGame();
    });
    wrap.appendChild(e);
  }
  container.appendChild(wrap);
}
