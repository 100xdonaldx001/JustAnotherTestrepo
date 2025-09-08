import { storageSetItem, storageRemoveItem } from './state.js';

export function setTheme(theme) {
  const themeToggle = document.getElementById('themeToggle');
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  if (themeToggle) {
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    const icon = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', label);
    const srSpan = themeToggle.querySelector('.visually-hidden');
    if (srSpan) srSpan.textContent = label;
    const iconSpan = themeToggle.querySelector('.icon');
    if (iconSpan) iconSpan.textContent = icon;
  }
  storageSetItem('theme', theme);
}

export function setWindowTransparency(solid) {
  storageRemoveItem('windowBlur');
  document.documentElement.style.setProperty('--window-blur', '2px');
  const transparencyToggle = document.getElementById('transparencyToggle');
  document.body.classList.toggle('solid-windows', solid);
  if (transparencyToggle) {
    const label = solid ? 'Disable window transparency' : 'Enable window transparency';
    const icon = solid ? '⬛' : '🔲';
    transparencyToggle.setAttribute('aria-pressed', String(solid));
    transparencyToggle.setAttribute('aria-label', label);
    const srSpan = transparencyToggle.querySelector('.visually-hidden');
    if (srSpan) srSpan.textContent = label;
    const iconSpan = transparencyToggle.querySelector('.icon');
    if (iconSpan) iconSpan.textContent = icon;
    if (!solid) {
      document.documentElement.style.removeProperty('--window-opacity');
    } else {
      document.documentElement.style.setProperty('--window-opacity', '1');
    }
  }
  storageSetItem('solidWindows', solid ? '1' : '0');
}

