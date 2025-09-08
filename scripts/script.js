import { initWindowManager, openWindow, toggleWindow, registerWindow, restoreOpenWindows, closeAllWindows, getRegisteredWindows } from './windowManager.js';
import { newLife, loadGame, addLog, getCurrentSlot, listSlots, storageGetItem } from './state.js';
import { renderStats } from './renderers/stats.js';
import { renderActions } from './renderers/actions.js';
import { renderLog } from './renderers/log.js';
import { renderJobs } from './renderers/jobs.js';
import { renderCharacter } from './renderers/character.js';
import { renderActivities } from './renderers/activities.js';
import { renderRealEstate } from './renderers/realestate.js';
import { renderInvestment } from './renderers/investment.js';
import { renderHelp } from './renderers/help.js';
import { renderNewLife } from './renderers/newlife.js';
import { renderAchievements } from './renderers/achievements.js';
import { renderSettings } from './renderers/settings.js';
import { setTheme, setWindowTransparency } from './ui.js';

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
const transparencyToggle = document.getElementById('transparencyToggle');

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


let theme = storageGetItem('theme');
if (!theme) {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
setTheme(theme);

let solid = storageGetItem('solidWindows') === '1';
setWindowTransparency(solid);

if (transparencyToggle) {
  transparencyToggle.addEventListener('click', () => {
    solid = !solid;
    setWindowTransparency(solid);
  });
}

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
registerWindow('investment', 'Investments', renderInvestment);
registerWindow('achievements', 'Achievements', renderAchievements);
registerWindow('settings', 'Settings', renderSettings);
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
  const win = registeredWindows.get(id);
  if (win) {
    toggleWindow(id, win.title, win.renderFn);
  }
}

for (const [id] of registeredWindows.entries()) {
  if (id === 'newLife') continue;
  document.querySelectorAll(`[data-toggle="${id}"]`).forEach(btn => {
    btn.addEventListener('click', () => toggleWindowById(id));
  });
}

document.querySelectorAll(`[data-toggle="settings"]`).forEach(btn => {
  btn.addEventListener('click', () => {
    toggleWindow('settings', 'Settings', renderSettings);
  });
});

document.querySelectorAll(`[data-toggle="newLife"]`).forEach(btn => {
  btn.addEventListener('click', () => {
    openWindow('newLife', 'New Life', renderNewLife);
  });
});
const closeAllBtn = document.getElementById('closeAll');
if (closeAllBtn) {
  closeAllBtn.addEventListener('click', () => {
    closeAllWindows();
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
  });
}

const activeSlot = getCurrentSlot();
const slots = listSlots();
if (activeSlot) {
  if (!loadGame(activeSlot)) {
    openWindow('newLife', 'New Life', renderNewLife);
  }
} else if (slots.length) {
  openWindow('settings', 'Settings', renderSettings);
} else {
  openWindow('newLife', 'New Life', renderNewLife);
}
openWindowById('stats');
openWindowById('actions');
openWindowById('log');
openWindowById('character');

