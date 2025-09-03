import { game } from '../state.js';
import { ageUp, study, meditate, hitGym, workExtra, seeDoctor, crime } from '../actions.js';
import { dropOut, enrollCollege, enrollUniversity } from '../school.js';
import { toggleWindow } from '../windowManager.js';
import { renderJobs } from './jobs.js';

export function renderActions(container) {
  const g = document.createElement('div');
  g.className = 'actions';
  const mk = (text, fn, disabled = false) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = text;
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  };
  const dead = !game.alive;
  g.appendChild(mk('👉 Age Up One Year', ageUp, dead));
  g.appendChild(mk('📚 Study (+Smarts)', study, dead));
  g.appendChild(mk('🧘 Meditate (+Happiness/Smarts)', meditate, dead));
  g.appendChild(mk('🏋️ Gym (+Health/Happiness)', hitGym, dead));
  g.appendChild(mk('💼 Job Hunt (open window)', () => toggleWindow('jobs', 'Jobs', renderJobs), dead));
  g.appendChild(mk('💵 Work Overtime (+$$)', workExtra, dead || !game.job || game.inJail));
  g.appendChild(mk('🩺 See Doctor', seeDoctor, dead));
  g.appendChild(mk('🕶️ Crime (risky)', crime, dead));
  if (!dead && game.age >= 16 && game.education.current === 'high' && !game.education.droppedOut) {
    g.appendChild(mk('🚪 Drop Out of School', dropOut));
  }
  if (!dead && !game.education.current && game.education.highest === 'high') {
    g.appendChild(mk('🎓 Attend College', enrollCollege));
    g.appendChild(mk('🎓 Attend University', enrollUniversity));
  }
  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  let txt = 'Actions adjust your stats. Some actions are limited while in jail.';
  if (game.age < 16) txt += ' You are under 16, so most jobs are unavailable yet.';
  if (game.inJail) txt += ' You are in jail: Work/Doctor/Crime disabled. You can still age, study, and work out.';
  note.textContent = txt;
  g.appendChild(note);
  container.appendChild(g);
}
