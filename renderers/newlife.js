import { newLife } from '../state.js';
import { openWindow, closeWindow } from '../windowManager.js';
import { renderStats } from './stats.js';

export function renderNewLife(container) {
  const form = document.createElement('form');
  form.className = 'new-life';

  const msg = document.createElement('p');
  msg.textContent = 'Start a new life. Your current progress will be lost.';
  form.appendChild(msg);

  const genderLabel = document.createElement('label');
  genderLabel.textContent = 'Gender:';
  const genderSelect = document.createElement('select');
  ['Male', 'Female'].forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    genderSelect.appendChild(opt);
  });
  genderLabel.appendChild(genderSelect);
  form.appendChild(genderLabel);

  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name:';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameLabel.appendChild(nameInput);
  form.appendChild(nameLabel);

  const controls = document.createElement('div');
  const start = document.createElement('button');
  start.type = 'submit';
  start.textContent = 'Start New Life';
  controls.appendChild(start);
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', () => {
    closeWindow('newLife');
  });
  controls.appendChild(cancel);
  form.appendChild(controls);

  form.addEventListener('submit', e => {
    e.preventDefault();
    newLife(genderSelect.value, nameInput.value);
    openWindow('stats', 'Stats', renderStats);
    closeWindow('newLife');
  });

  container.appendChild(form);
}

