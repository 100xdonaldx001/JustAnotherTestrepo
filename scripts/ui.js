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
  const transparencyToggle = document.getElementById('transparencyToggle');
  document.body.classList.toggle('solid-windows', solid);
  if (transparencyToggle) {
    transparencyToggle.textContent = solid ? '⬛' : '🔲';
    transparencyToggle.setAttribute('aria-pressed', String(solid));
    if (!solid) {
      if (!transparencySlider) {
        transparencySlider = document.createElement('input');
        transparencySlider.type = 'range';
        transparencySlider.min = '0.2';
        transparencySlider.max = '1';
        transparencySlider.step = '0.01';
        transparencySlider.style.marginLeft = '8px';
        const stored = parseFloat(localStorage.getItem('windowOpacity')) || 0.92;
        transparencySlider.value = String(stored);
        transparencySlider.addEventListener('input', e => {
          const value = e.target.value;
          document.documentElement.style.setProperty('--window-opacity', value);
          localStorage.setItem('windowOpacity', value);
        });
      }
      const stored = parseFloat(localStorage.getItem('windowOpacity')) || parseFloat(transparencySlider.value);
      document.documentElement.style.setProperty('--window-opacity', String(stored));
      transparencyToggle.after(transparencySlider);
    } else if (transparencySlider) {
      transparencySlider.remove();
      document.documentElement.style.setProperty('--window-opacity', '1');
    }
  }
  if (!solid) {
    const value = transparencySlider ? transparencySlider.value : '0.92';
    localStorage.setItem('windowOpacity', value);
  }
  localStorage.setItem('solidWindows', solid ? '1' : '0');
}

