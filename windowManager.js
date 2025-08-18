let desktop;
let template;
let zCounter = 10;

const windowRegistry = new Map();

function setActive(win) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');
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
    const n = desktop.querySelectorAll('.window').length;
    win.style.left = 60 + n * 24 + 'px';
    win.style.top = 60 + n * 18 + 'px';
    desktop.appendChild(win);
    makeDraggable(win);
  }
  return win;
}

export function initWindowManager(desktopEl, templateEl) {
  desktop = desktopEl;
  template = templateEl;
}

export function openWindow(id, title, renderFn) {
  const win = ensureWindow(id, title);
  windowRegistry.set(id, renderFn);
  const c = win.querySelector('.content');
  c.innerHTML = '';
  renderFn(c, win);
  win.classList.remove('hidden');
  bringToFront(win);
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
}

export function refreshOpenWindows() {
  for (const [id, fn] of windowRegistry.entries()) {
    const win = desktop.querySelector(`.window[data-id="${id}"]`);
    if (!win || win.classList.contains('hidden')) continue;
    const c = win.querySelector('.content');
    c.innerHTML = '';
    fn(c, win);
  }
}

