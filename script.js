import { initWindowManager, openWindow, toggleWindow } from './windowManager.js';
import { newLife, loadGame } from './state.js';
import { renderStats } from './renderers/stats.js';
import { renderActions } from './renderers/actions.js';
import { renderLog } from './renderers/log.js';
import { renderJobs } from './renderers/jobs.js';
import { renderCharacter } from './renderers/character.js';
import { renderActivities } from './renderers/activities.js';
import { renderRealEstate } from './renderers/realestate.js';

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
openStats();
openActions();
openLog();
openCharacter();
