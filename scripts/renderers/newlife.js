import {
  newLife,
  listSlots,
  setCurrentSlot,
  deleteSlot,
  saveGame,
  loadGame,
  getCurrentSlot,
  continueAsChild,
  game
} from '../state.js';
import { openWindow, closeWindow } from '../windowManager.js';
import { renderStats } from './stats.js';

export function renderSlotManager(container) {
  container.innerHTML = '';
  const slots = listSlots();
  const current = getCurrentSlot();
  const wrap = document.createElement('div');
  wrap.className = 'slot-manager';

  if (slots.length) {
    const select = document.createElement('select');
    slots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    });
    if (current) select.value = current;
    wrap.appendChild(select);

    const loadBtn = document.createElement('button');
    loadBtn.className = 'btn';
    loadBtn.textContent = 'Load Slot';
    loadBtn.addEventListener('click', () => {
      setCurrentSlot(select.value);
      loadGame(select.value);
    });
    wrap.appendChild(loadBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn';
    delBtn.textContent = 'Delete Slot';
    delBtn.addEventListener('click', () => {
      deleteSlot(select.value);
      renderSlotManager(container);
    });
    wrap.appendChild(delBtn);
  } else {
    const none = document.createElement('p');
    none.textContent = 'No save slots found.';
    wrap.appendChild(none);
  }

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.placeholder = 'New slot name';
  wrap.appendChild(newInput);

  const createBtn = document.createElement('button');
  createBtn.className = 'btn';
  createBtn.textContent = 'Create Slot';
  createBtn.addEventListener('click', () => {
    const name = newInput.value.trim();
    if (!name) return;
    setCurrentSlot(name);
    saveGame();
    renderSlotManager(container);
  });
  wrap.appendChild(createBtn);

  container.appendChild(wrap);
}

export function renderNewLife(container) {
  if (game.state.children && game.state.children.length > 0) {
    const choice = document.createElement('div');
    const msg = document.createElement('p');
    msg.textContent = 'Continue as one of your children:';
    choice.appendChild(msg);
    game.state.children.forEach((child, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn block';
      const name = child.name ? child.name : `Child ${i + 1}`;
      btn.textContent = `${name} - Age ${child.age}`;
      btn.addEventListener('click', () => {
        continueAsChild(i);
        openWindow('stats', 'Stats', renderStats);
        setTimeout(() => closeWindow('newLife'), 0);
      });
      choice.appendChild(btn);
    });
    container.appendChild(choice);
    const hr = document.createElement('hr');
    container.appendChild(hr);
  }

  const slotArea = document.createElement('div');
  renderSlotManager(slotArea);
  container.appendChild(slotArea);

  const form = document.createElement('form');
  form.className = 'new-life';
  form.autocomplete = 'off';
  form.setAttribute('data-form-type', 'other');

  const msg = document.createElement('p');
  msg.textContent = 'Start a new life. Your current progress will be lost.';
  form.appendChild(msg);

  const genderLabel = document.createElement('label');
  genderLabel.textContent = 'Gender:';
  const genderSelect = document.createElement('select');
  genderSelect.name = 'gender';
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
  nameInput.name = 'name';
  nameInput.autocomplete = 'off';
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
    // Delay closing to allow extensions to process the submit event
    setTimeout(() => closeWindow('newLife'), 0);
  });

  container.appendChild(form);
}

