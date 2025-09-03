import { initWindowManager, openWindow, toggleWindow } from './windowManager.js';
import { newLife, loadGame } from './state.js';
import { renderStats } from './renderers/stats.js';
import { renderActions } from './renderers/actions.js';
import { renderLog } from './renderers/log.js';
import { renderJobs } from './renderers/jobs.js';
import { renderCharacter } from './renderers/character.js';
import { renderActivities } from './renderers/activities.js';
import { renderRealEstate } from './renderers/realestate.js';
import { renderHelp } from './renderers/help.js';

async function loadPartials() {
  await Promise.all([
    fetch('partials/dock.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('dock').outerHTML = html;
      }),
    fetch('partials/window-template.html')
      .then(r => r.text())
      .then(html => {
        document.getElementById('window-template').innerHTML = html;
      })
  ]);
}

await loadPartials();

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

const desktop = document.getElementById('desktop');
const template = document.getElementById('window-template');

initWindowManager(desktop, template);

const windows = {
  stats: { title: 'Stats', renderer: renderStats },
  actions: { title: 'Actions', renderer: renderActions },
  log: { title: 'Log', renderer: renderLog },
  jobs: { title: 'Jobs', renderer: renderJobs },
  character: { title: 'Character', renderer: renderCharacter },
  activities: { title: 'Activities', renderer: renderActivities },
  realestate: { title: 'Real Estate', renderer: renderRealEstate },
  help: { title: 'Help', renderer: renderHelp }
};

function openWindowById(id) {
  const win = windows[id];
  if (win) {
    openWindow(id, win.title, win.renderer);
  }
}

function toggleWindowById(id) {
  const win = windows[id];
  if (win) {
    toggleWindow(id, win.title, win.renderer);
  }
}

Object.keys(windows).forEach(id => {
  document.querySelectorAll(`[data-toggle="${id}"]`).forEach(btn => {
    btn.addEventListener('click', () => toggleWindowById(id));
  });
});

document.getElementById('newLife').addEventListener('click', () => {
  newLife();
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

if (!loadGame()) {
  newLife();
}
openWindowById('stats');
openWindowById('actions');
openWindowById('log');
openWindowById('character');

