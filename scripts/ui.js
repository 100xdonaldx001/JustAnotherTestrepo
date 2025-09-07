export function setTheme(theme) {
  const themeToggle = document.getElementById('themeToggle');
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  if (themeToggle) {
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
  localStorage.setItem('theme', theme);
}

export function setWindowTransparency(solid) {
  const transparencyToggle = document.getElementById('transparencyToggle');
  document.body.classList.toggle('solid-windows', solid);
  document.documentElement.style.removeProperty('--window-blur');
  if (transparencyToggle) {
    transparencyToggle.textContent = solid ? '⬛' : '🔲';
    transparencyToggle.setAttribute('aria-pressed', String(solid));
  }
  if (solid) {
    document.documentElement.style.setProperty('--window-opacity', '1');
  } else {
    document.documentElement.style.removeProperty('--window-opacity');
  }
  localStorage.setItem('solidWindows', solid ? '1' : '0');
}

