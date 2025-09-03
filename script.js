import { initWindowManager, openWindow, toggleWindow, registerWindow, restoreOpenWindows, closeAllWindows } from './windowManager.js';
import { newLife, loadGame } from './state.js';
import { renderStats } from './renderers/stats.js';
import { renderActions } from './renderers/actions.js';
import { renderLog } from './renderers/log.js';
import { renderJobs } from './renderers/jobs.js';
import { renderCharacter } from './renderers/character.js';
import { renderActivities } from './renderers/activities.js';
import { renderRealEstate } from './renderers/realestate.js';
import { renderHelp } from './renderers/help.js';
import { renderNewLife } from './renderers/newlife.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

async function loadPartials() {
  const loadDock = async () => {
    try {
      const response = await fetch('partials/dock.html');
      const html = await response.text();
      document.getElementById('dock').outerHTML = html;
    } catch (err) {
      console.error('Failed to load dock partial:', err);
      const dock = document.getElementById('dock');
      if (dock) {
        dock.textContent = 'Failed to load dock.';
      }
    }
  };

  const loadWindowTemplate = async () => {
    try {
      const response = await fetch('partials/window-template.html');
      const html = await response.text();
      document.getElementById('window-template').innerHTML = html;
    } catch (err) {
      console.error('Failed to load window template partial:', err);
      const template = document.getElementById('window-template');
      if (template) {
        template.textContent = 'Failed to load window template.';
      }
    }
  };

  await Promise.all([loadDock(), loadWindowTemplate()]);
}

await loadPartials();

const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

let theme = localStorage.getItem('theme');
if (!theme) {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
setTheme(theme);

const desktop = document.getElementById('desktop');
const template = document.getElementById('window-template');

initWindowManager(desktop, template);

window.addEventListener('window-open', e => {
  const { id } = e.detail;
  document.querySelectorAll(`[data-toggle="${id}"]`).forEach(btn => {
    btn.classList.add('active');
  });
});

window.addEventListener('window-close', e => {
  const { id } = e.detail;
  document.querySelectorAll(`[data-toggle="${id}"]`).forEach(btn => {
    btn.classList.remove('active');
  });
});

registerWindow('stats', 'Stats', renderStats);
registerWindow('actions', 'Actions', renderActions);
registerWindow('log', 'Log', renderLog);
registerWindow('jobs', 'Jobs', renderJobs);
registerWindow('character', 'Character', renderCharacter);
registerWindow('activities', 'Activities', renderActivities);
registerWindow('realestate', 'Real Estate', renderRealEstate);
registerWindow('help', 'Help', renderHelp);
registerWindow('newLife', 'New Life', renderNewLife);

restoreOpenWindows();

const windows = {
  stats: { title: 'Stats', renderer: renderStats },
  actions: { title: 'Actions', renderer: renderActions },
  log: { title: 'Log', renderer: renderLog },
  jobs: { title: 'Jobs', renderer: renderJobs },
  character: { title: 'Character', renderer: renderCharacter },
  activities: { title: 'Activities', renderer: renderActivities },
  realestate: { title: 'Real Estate', renderer: renderRealEstate },
  help: { title: 'Help', renderer: renderHelp },
  newLife: { title: 'New Life', renderer: renderNewLife }
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
  if (confirm('Start a new life? Your current progress will be lost.')) {
    newLife();
    openStats();
  }
});
document.getElementById('closeAll').addEventListener('click', () => {
  closeAllWindows();
});

themeToggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
});

if (!loadGame()) {
  newLife();
}
openWindowById('stats');
openWindowById('actions');
openWindowById('log');
openWindowById('character');

