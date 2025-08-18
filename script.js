import { initWindowManager, openWindow, toggleWindow } from './windowManager.js';
import { newLife } from './state.js';
import { renderStats } from './renderers/stats.js';
import { renderActions } from './renderers/actions.js';
import { renderLog } from './renderers/log.js';
import { renderJobs } from './renderers/jobs.js';

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

document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-toggle');
    if (id === 'stats') toggleStats();
    if (id === 'actions') toggleActions();
    if (id === 'log') toggleLog();
    if (id === 'jobs') toggleJobs();
  });
});

document.getElementById('newLife').addEventListener('click', () => {
  newLife();
});

newLife();
openStats();
openActions();
openLog();
