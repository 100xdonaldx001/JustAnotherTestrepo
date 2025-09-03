let desktop;
let template;
let zCounter = 10;

const windowRegistry = new Map();
const OPEN_WINDOWS_KEY = 'window-open';

function persistOpenWindows() {
  const ids = Array.from(desktop.querySelectorAll('.window'))
    .filter(w => !w.classList.contains('hidden'))
    .map(w => w.dataset.id);
  if (ids.length) {
    localStorage.setItem(OPEN_WINDOWS_KEY, JSON.stringify(ids));
  } else {
    localStorage.removeItem(OPEN_WINDOWS_KEY);
  }
}

function savePosition(win) {
  const id = win.dataset.id;
  localStorage.setItem(`window-pos-${id}`, JSON.stringify({
    left: win.style.left,
    top: win.style.top
  }));
}

function restorePosition(win, index) {
  const stored = localStorage.getItem(`window-pos-${win.dataset.id}`);
  if (stored) {
    const pos = JSON.parse(stored);
    win.style.left = pos.left;
    win.style.top = pos.top;
    return;
  }
  const width = win.offsetWidth;
  const height = 300;
  const dRect = desktop.getBoundingClientRect();
  const gap = 20;
  const padding = 60;
  const cols = Math.max(1, Math.floor((dRect.width - padding * 2 + gap) / (width + gap)));
  const col = index % cols;
  const row = Math.floor(index / cols);
  win.style.left = padding + col * (width + gap) + 'px';
  win.style.top = padding + row * (height + gap) + 'px';
  savePosition(win);
}

function setActive(win) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  if (win) {
    win.classList.add('active');
  }
}

function bringToFront(win) {
  zCounter += 1;
  win.style.zIndex = zCounter;
  setActive(win);
}

function makeDraggable(win) {
  const bar = win.querySelector('.titlebar');
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let dragging = false;

  const onDown = e => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest('.controls')) return;
    dragging = true;
    win.classList.add('dragging');
    bringToFront(win);
    const rect = win.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    startX = e.clientX;
    startY = e.clientY;
    bar.setPointerCapture?.(e.pointerId);
  };

  const onMove = e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const dRect = desktop.getBoundingClientRect();
    let newLeft = startLeft + dx;
    let newTop = startTop + dy;
    const maxLeft = dRect.right - win.offsetWidth - 4;
    const maxTop = dRect.bottom - win.offsetHeight - 4;
    newLeft = Math.max(dRect.left + 4, Math.min(maxLeft, newLeft));
    newTop = Math.max(dRect.top + 4, Math.min(maxTop, newTop));
    win.style.left = newLeft - dRect.left + 'px';
    win.style.top = newTop - dRect.top + 'px';
  };

  const onUp = e => {
    dragging = false;
    win.classList.remove('dragging');
    bar.releasePointerCapture?.(e.pointerId);
    savePosition(win);
  };

  bar.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  win.addEventListener('mousedown', () => bringToFront(win));

  const btnClose = win.querySelector('.btn-close');
  btnClose.addEventListener('click', e => {
    e.stopPropagation();
    closeWindow(win.dataset.id);
  });
  btnClose.addEventListener('pointerdown', e => {
    e.stopPropagation();
  });
}

function ensureWindow(id, title) {
  let win = desktop.querySelector(`.window[data-id="${id}"]`);
  if (!win) {
    win = template.content.firstElementChild.cloneNode(true);
    win.dataset.id = id;
    win.querySelector('.title').textContent = title;
    desktop.appendChild(win);
    const index = desktop.querySelectorAll('.window').length - 1;
    restorePosition(win, index);
    makeDraggable(win);
  }
  return win;
}

export function registerWindow(id, title, renderFn) {
  windowRegistry.set(id, { title, renderFn });
}

export function initWindowManager(desktopEl, templateEl) {
  desktop = desktopEl;
  template = templateEl;
  desktop.addEventListener('mousedown', e => {
    if (e.target === desktop) {
      setActive();
    }
  });
}

export function openWindow(id, title, renderFn) {
  registerWindow(id, title, renderFn);
  const win = ensureWindow(id, title);
  const c = win.querySelector('.content');
  c.innerHTML = '';
  renderFn(c, win);
  win.classList.remove('hidden');
  bringToFront(win);
  persistOpenWindows();
}

export function toggleWindow(id, title, renderFn) {
  const win = desktop.querySelector(`.window[data-id="${id}"]`);
  if (win && !win.classList.contains('hidden')) {
    closeWindow(id);
    return;
  }
  openWindow(id, title, renderFn);
}

export function closeWindow(id) {
  const win = desktop.querySelector(`.window[data-id="${id}"]`);
  if (!win) return;
  win.classList.add('hidden');
  const others = Array.from(document.querySelectorAll('.window:not(.hidden)'));
  if (others.length) {
    bringToFront(others[others.length - 1]);
  }
  persistOpenWindows();
}

export function restoreOpenWindows() {
  const stored = localStorage.getItem(OPEN_WINDOWS_KEY);
  if (!stored) return;
  const ids = JSON.parse(stored);
  ids.forEach(id => {
    const entry = windowRegistry.get(id);
    if (entry) {
      openWindow(id, entry.title, entry.renderFn);
    }
  });
}

export function refreshOpenWindows() {
  for (const [id, { renderFn: fn }] of windowRegistry.entries()) {
    const win = desktop.querySelector(`.window[data-id="${id}"]`);
    if (!win || win.classList.contains('hidden')) continue;
    const c = win.querySelector('.content');
    c.innerHTML = '';
    fn(c, win);
  }
}

