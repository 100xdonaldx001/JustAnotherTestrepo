export function renderHelp(container) {
  const wrap = document.createElement('div');
  wrap.className = 'help';
  const lines = [
    'Goal: live as long as you can while improving your stats.',
    'Drag window title bars to move them. Use the dock buttons to show or hide windows.',
    'With a window title bar focused, use Arrow keys to reposition it.',
    'Use the Actions window to age up and progress through life.',
    'Jobs unlock at age 16. Visit Job Hunt to start working and earn money.'
  ];
  for (const text of lines) {
    const p = document.createElement('p');
    p.textContent = text;
    wrap.appendChild(p);
  }
  container.appendChild(wrap);
}

