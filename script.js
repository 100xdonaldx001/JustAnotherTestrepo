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

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

const desktop = document.getElementById('desktop');
const template = document.getElementById('window-template');

initWindowManager(desktop, template);

function openStats() {
  openWindow('stats', 'Stats', renderStats);
}
function openActions() {
  openWindow('actions', 'Actions', renderActions);
}
function openLog() {
  openWindow('log', 'Log', renderLog);
}
function openJobs() {
  openWindow('jobs', 'Jobs', renderJobs);
}
function openCharacter() {
  openWindow('character', 'Character', renderCharacter);
}
function openActivities() {
  openWindow('activities', 'Activities', renderActivities);
}
function openRealEstate() {
  openWindow('realestate', 'Real Estate', renderRealEstate);
}
function openHelp() {
  openWindow('help', 'Help', renderHelp);
}

function toggleStats() {
  toggleWindow('stats', 'Stats', renderStats);
}
function toggleActions() {
  toggleWindow('actions', 'Actions', renderActions);
}
function toggleLog() {
  toggleWindow('log', 'Log', renderLog);
}
function toggleJobs() {
  toggleWindow('jobs', 'Jobs', renderJobs);
}
function toggleCharacter() {
  toggleWindow('character', 'Character', renderCharacter);
}
function toggleActivities() {
  toggleWindow('activities', 'Activities', renderActivities);
}
function toggleRealEstate() {
  toggleWindow('realestate', 'Real Estate', renderRealEstate);
}
function toggleHelp() {
  toggleWindow('help', 'Help', renderHelp);
}

document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-toggle');
    if (id === 'stats') toggleStats();
    if (id === 'actions') toggleActions();
    if (id === 'log') toggleLog();
    if (id === 'jobs') toggleJobs();
    if (id === 'character') toggleCharacter();
    if (id === 'activities') toggleActivities();
    if (id === 'realestate') toggleRealEstate();
    if (id === 'help') toggleHelp();
  });
});

document.getElementById('newLife').addEventListener('click', () => {
  if (confirm('Start a new life? Your current progress will be lost.')) {
    newLife();
    openStats();
  }
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

if (!loadGame()) {
  newLife();
}
openStats();
openActions();
openLog();
openCharacter();

