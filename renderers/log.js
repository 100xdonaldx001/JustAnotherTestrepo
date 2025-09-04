import { game } from '../state.js';

export function renderLog(container) {
  const headlineBox = document.createElement('div');
  headlineBox.className = 'headlines';
  container.appendChild(headlineBox);

  const categories = Array.from(new Set(game.log.map(l => l.category || 'general')));
  const select = document.createElement('select');
  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = 'All';
  select.appendChild(allOpt);
  for (const cat of categories) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  }
  container.appendChild(select);

  const list = document.createElement('div');
  list.className = 'log';
  list.setAttribute('aria-live', 'polite');
  container.appendChild(list);

  const renderHeadlines = () => {
    headlineBox.innerHTML = '';
    const headlines = game.log.filter(l => l.category === 'news').slice(0, 5);
    for (const h of headlines) {
      const div = document.createElement('div');
      div.className = 'headline';
      div.textContent = h.text;
      headlineBox.appendChild(div);
    }
  };

  const renderList = () => {
    list.innerHTML = '';
    const selected = select.value;
    const items =
      selected === 'all'
        ? game.log
        : game.log.filter(item => item.category === selected);
    if (items.length === 0) {
      const e = document.createElement('div');
      e.className = 'entry';
      e.textContent = 'Your story will appear here.';
      list.appendChild(e);
    } else {
      for (const item of items) {
        const e = document.createElement('div');
        e.className = 'entry';
        e.innerHTML = `<div>${item.text}</div><time>${item.when}</time>`;
        list.appendChild(e);
      }
    }
    renderHeadlines();
  };

  select.addEventListener('change', renderList);
  renderHeadlines();
  renderList();
}
