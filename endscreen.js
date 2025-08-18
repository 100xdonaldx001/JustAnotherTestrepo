const screenEl = document.getElementById('endscreen');

export function showEndScreen(game) {
  screenEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'Life Story';
  screenEl.appendChild(title);
  const list = document.createElement('ul');
  for (const item of game.log.slice().reverse()) {
    const li = document.createElement('li');
    li.innerHTML = `<time>${item.when}</time> ${item.text}`;
    list.appendChild(li);
  }
  screenEl.appendChild(list);
  screenEl.classList.remove('hidden');
}

export function hideEndScreen() {
  screenEl.classList.add('hidden');
  screenEl.innerHTML = '';
}

