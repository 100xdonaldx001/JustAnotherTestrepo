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

let transparencySlider;

export function setWindowTransparency(solid) {
  const stored = parseFloat(localStorage.getItem('windowBlur')) || 2;
  document.documentElement.style.setProperty('--window-blur', `${stored}px`);
  const transparencyToggle = document.getElementById('transparencyToggle');
  document.body.classList.toggle('solid-windows', solid);
  if (transparencyToggle) {
    transparencyToggle.textContent = solid ? '⬛' : '🔲';
    transparencyToggle.setAttribute('aria-pressed', String(solid));
    if (!solid) {
      if (!transparencySlider) {
        transparencySlider = document.createElement('input');
        transparencySlider.type = 'range';
        transparencySlider.min = '0';
        transparencySlider.max = '10';
        transparencySlider.step = '0.5';
        transparencySlider.style.marginLeft = '8px';
        transparencySlider.setAttribute('aria-label', 'Adjust background blur');
        transparencySlider.title = 'Adjust background blur';
        transparencySlider.value = String(stored);
        transparencySlider.addEventListener('input', e => {
          const value = e.target.value;
          document.documentElement.style.setProperty('--window-blur', `${value}px`);
          localStorage.setItem('windowBlur', value);
        });
      }
      transparencyToggle.after(transparencySlider);
      document.documentElement.style.removeProperty('--window-opacity');
    } else {
      document.documentElement.style.setProperty('--window-opacity', '1');
      if (transparencySlider) {
        transparencySlider.remove();
      }
    }
  }
  if (!solid) {
    const value = transparencySlider ? transparencySlider.value : String(stored);
    localStorage.setItem('windowBlur', value);
  }
  localStorage.setItem('solidWindows', solid ? '1' : '0');
}

