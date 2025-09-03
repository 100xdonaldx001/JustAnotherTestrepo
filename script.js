import { initWindowManager, openWindow, toggleWindow, registerWindow, restoreOpenWindows, closeAllWindows, getRegisteredWindows } from './windowManager.js';
import { newLife, loadGame, addLog } from './state.js';
import { renderStats } from './renderers/stats.js';
import { renderActions } from './renderers/actions.js';
import { renderLog } from './renderers/log.js';
import { renderJobs } from './renderers/jobs.js';
import { renderCharacter } from './renderers/character.js';
import { renderActivities } from './renderers/activities.js';
import { renderRealEstate } from './renderers/realestate.js';
import { renderHelp } from './renderers/help.js';
import { renderNewLife } from './renderers/newlife.js';
import { renderAchievements } from './renderers/achievements.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .catch(err => {
        console.error('SW registration failed', err);
        addLog('Service worker registration failed.');
      });
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

const dock = document.querySelector('.dock');
const themeToggle = document.getElementById('themeToggle');

if (dock) {
  const buttons = Array.from(dock.querySelectorAll('button'));
  dock.addEventListener('keydown', e => {
    const { key } = e;
    const currentIndex = buttons.indexOf(document.activeElement);
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % buttons.length;
      buttons[nextIndex].focus();
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[prevIndex].focus();
    } else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      if (currentIndex !== -1) {
        buttons[currentIndex].click();
      }
    }
  });
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-pressed', String(isDark));
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
registerWindow('achievements', 'Achievements', renderAchievements);
registerWindow('help', 'Help', renderHelp);
registerWindow('newLife', 'New Life', renderNewLife);

restoreOpenWindows();

const registeredWindows = getRegisteredWindows();

function openWindowById(id) {
  const win = registeredWindows.get(id);
  if (win) {
    openWindow(id, win.title, win.renderFn);
  }
}

function toggleWindowById(id) {
  const win = windows[id];
  if (win) {
    toggleWindow(id, win.title, win.renderer);
  }
}

Object.keys(windows).forEach(id => {
  if (id === 'newLife') return;
  document.querySelectorAll(`[data-toggle="${id}"]`).forEach(btn => {
    btn.addEventListener('click', () => toggleWindow(id, title, renderFn));
  });
}

document.querySelectorAll(`[data-toggle="newLife"]`).forEach(btn => {
  btn.addEventListener('click', () => {
    openWindow('newLife', 'New Life', renderNewLife);
  });
});
document.getElementById('closeAll').addEventListener('click', () => {
  closeAllWindows();
});

themeToggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
});

if (!loadGame()) {
  openWindow('newLife', 'New Life', renderNewLife);
}
openWindowById('stats');
openWindowById('actions');
openWindowById('log');
openWindowById('character');

