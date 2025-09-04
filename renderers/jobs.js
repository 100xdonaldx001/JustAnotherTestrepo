import { game, addLog, saveGame, unlockAchievement } from '../state.js';
import { generateJobs } from '../jobs.js';
import { refreshOpenWindows } from '../windowManager.js';
import { educationRank, eduName } from '../school.js';

export function renderJobs(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  if (game.age < 16) {
    head.textContent = 'You are too young to work. Come back at age 16+';
    container.appendChild(head);
    return;
  }
  head.textContent = 'Pick a job. Advanced roles require higher education.';
  container.appendChild(head);
  if (game.job) {
    const perf = document.createElement('div');
    perf.className = 'muted';
    perf.textContent = `Performance: ${game.jobPerformance}%`;
    container.appendChild(perf);
    const info = document.createElement('div');
    info.className = 'muted';
    const thresholds = { entry: 3, mid: 5 };
    const next = game.jobLevel === 'entry' ? 'mid' : game.jobLevel === 'mid' ? 'senior' : null;
    if (next) {
      info.textContent = `Current Level: ${game.jobLevel} (${game.jobExperience}/${thresholds[game.jobLevel]} yrs to ${next})`;
    } else {
      info.textContent = `Current Level: ${game.jobLevel} (max level)`;
    }
    container.appendChild(info);
    const quit = document.createElement('button');
    quit.className = 'btn';
    quit.textContent = 'Quit Job';
    quit.addEventListener('click', () => {
      game.job = null;
      game.jobExperience = 0;
      game.jobLevel = null;
      addLog('You quit your job.');
      saveGame();
      refreshOpenWindows();
    });
    container.appendChild(quit);
  }
  const jobs = generateJobs();
  const wrap = document.createElement('div');
  wrap.className = 'jobs';
  for (const j of jobs) {
    const e = document.createElement('div');
    e.className = 'job';
    const okEdu = educationRank(game.education.highest) >= educationRank(j.reqEdu);
    const ok = okEdu;
    const left = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = j.title;
    left.appendChild(strong);
    const req = document.createElement('div');
    req.className = 'muted';
    req.textContent = `Req Edu: ${eduName(j.reqEdu)}`;
    left.appendChild(req);
    const lvl = document.createElement('div');
    lvl.className = 'muted';
    lvl.textContent = `Level: ${j.level}`;
    left.appendChild(lvl);
    const right = document.createElement('div');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `$${j.salary.toLocaleString()}/yr`;
    right.appendChild(badge);
    e.appendChild(left);
    e.appendChild(right);
    if (!ok) e.style.opacity = 0.6;
    e.title = ok ? 'Take job' : 'You do not meet the education requirements';
    e.addEventListener('click', () => {
      if (!ok) {
        addLog('You were not qualified for that role. Improve your Education.', 'job');
        refreshOpenWindows();
        saveGame();
        return;
      }
      game.job = { ...j, baseTitle: j.title };
      game.jobExperience = 0;
      game.jobLevel = j.level;
      addLog(`You became a ${j.title}. Salary $${j.salary.toLocaleString()}/yr.`, 'job');
      unlockAchievement('first-job', 'Got your first job.');
      refreshOpenWindows();
      saveGame();
    });
    wrap.appendChild(e);
  }
  container.appendChild(wrap);
}
