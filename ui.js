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
  if (transparencyToggle) {
    transparencyToggle.textContent = solid ? '⬛' : '🔲';
    transparencyToggle.setAttribute('aria-pressed', String(solid));
  }
  localStorage.setItem('solidWindows', solid ? '1' : '0');
}

