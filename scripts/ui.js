import { storageSetItem, storageRemoveItem } from './state.js';

export function setTheme(theme) {
  const themeToggle = document.getElementById('themeToggle');
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  if (themeToggle) {
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
  storageSetItem('theme', theme);
}

export function setWindowTransparency(solid) {
  storageRemoveItem('windowBlur');
  document.documentElement.style.setProperty('--window-blur', '2px');
  const transparencyToggle = document.getElementById('transparencyToggle');
  document.body.classList.toggle('solid-windows', solid);
  if (transparencyToggle) {
    transparencyToggle.textContent = solid ? '⬛' : '🔲';
    transparencyToggle.setAttribute('aria-pressed', String(solid));
    if (!solid) {
      document.documentElement.style.removeProperty('--window-opacity');
    } else {
      document.documentElement.style.setProperty('--window-opacity', '1');
    }
  }
  storageSetItem('solidWindows', solid ? '1' : '0');
}

