import { game, addLog, saveGame, unlockAchievement } from '../state.js';
import { generateJobs } from '../jobs.js';
import { retire } from '../actions/job.js';
import { refreshOpenWindows } from '../windowManager.js';
import { educationRank, eduName } from '../school.js';
import { rand } from '../utils.js';
import { taskChances } from '../taskChances.js';

export function renderJobs(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  if (game.age < 16) {
    head.textContent = 'You are too young to work. Come back at age 16+';
    container.appendChild(head);
    return;
  }
  if (game.retired) {
    head.textContent = `You are retired. Pension $${game.pension.toLocaleString()}/yr`;
    container.appendChild(head);
    return;
  }
  head.textContent = 'Pick a job. Advanced roles require higher education.';
  container.appendChild(head);
  const econ = document.createElement('div');
  econ.className = 'muted';
  const econMsg = {
    boom: 'Economy is booming: more jobs and higher pay.',
    recession: 'Economy is in recession: fewer jobs and lower pay.',
    normal: 'Economy is stable.'
  };
  econ.textContent = econMsg[game.economyPhase];
  container.appendChild(econ);
  if (game.age >= 60 && !game.retired) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Retire';
    btn.addEventListener('click', () => {
      retire();
      refreshOpenWindows();
    });
    container.appendChild(btn);
  }
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
      game.jobSatisfaction = 0;
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
    const okMajor = !j.reqMajor || game.major === j.reqMajor;
    const okFitness = !j.reqFitness || game.skills.fitness >= j.reqFitness;
    const ok = okEdu && okMajor && okFitness;
    const left = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = j.title;
    left.appendChild(strong);
    const req = document.createElement('div');
    req.className = 'muted';
    req.textContent = `Req Edu: ${eduName(j.reqEdu)}`;
    if (j.reqMajor) {
      req.textContent += ` | Req Major: ${j.reqMajor}`;
    }
    if (j.reqFitness) {
      req.textContent += ` | Req Fitness: ${j.reqFitness}`;
    }
    left.appendChild(req);
    if (j.tuitionAssistance) {
      const perk = document.createElement('div');
      perk.className = 'muted';
      perk.textContent = 'Offers tuition assistance';
      left.appendChild(perk);
    }
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
    e.title = ok ? 'Take job' : 'You do not meet the requirements';
    e.addEventListener('click', () => {
      if (!ok) {
        addLog(
          'You were not qualified for that role. Improve your education or major.',
          'job'
        );
        refreshOpenWindows();
        saveGame();
        return;
      }
      if (rand(1, 100) > taskChances.jobs.hire) {
        addLog('You applied for the job but were not hired.', 'job');
        refreshOpenWindows();
        saveGame();
        return;
      }
      const job = { ...j, experience: 0 };
      if (job.partTime) {
        job.salary = Math.round(job.salary / 2);
        job.expMultiplier = 0.5;
      } else {
        job.expMultiplier = 1;
      }
      game.job = job;
      game.jobExperience = 0;
      game.jobLevel = job.level;
      game.jobSatisfaction = 70;
      addLog(`You became a ${job.title}. Salary $${job.salary.toLocaleString()}/yr.`, 'job');
      unlockAchievement('first-job');
      refreshOpenWindows();
      saveGame();
    });
    wrap.appendChild(e);
  }
  container.appendChild(wrap);
}
