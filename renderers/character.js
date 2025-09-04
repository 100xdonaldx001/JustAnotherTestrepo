import { game, applyAndSave, addLog } from '../state.js';

export function renderCharacter(container) {
  const div = document.createElement('div');
  div.className = 'grid';
  let childrenHTML = '';
  if (game.children && game.children.length > 0) {
    childrenHTML = '<div class="row"><strong>Children:</strong><ul>';
    for (const [i, child] of game.children.entries()) {
      const name = child.name ? child.name : `Child ${i + 1}`;
      childrenHTML += `<li>${name} - Age ${child.age}, Happiness ${child.happiness}</li>`;
    }
    childrenHTML += '</ul></div>';
  }
  div.innerHTML = `
        <div class="row"><strong>Name:</strong> <span class="char-name">${game.name}</span></div>
        <div class="row"><strong>Gender:</strong> <span>${game.gender}</span></div>
        <div class="row"><strong>Location:</strong> <span>${game.city}, ${game.country}</span></div>
        ${childrenHTML}`;
  const nameSpan = div.querySelector('.char-name');
  container.appendChild(div);

  const renameBtn = document.createElement('button');
  renameBtn.textContent = 'Rename';
  renameBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = game.name;
    const confirm = document.createElement('button');
    confirm.textContent = 'Confirm';
    confirm.addEventListener('click', () => {
      const newName = input.value.trim();
      if (newName && newName !== game.name) {
        applyAndSave(() => {
          game.name = newName;
          addLog(`You changed your name to ${newName}.`);
        });
        nameSpan.textContent = game.name;
      }
      container.removeChild(wrapper);
      container.appendChild(renameBtn);
    });
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    wrapper.appendChild(confirm);
    container.appendChild(wrapper);
    container.removeChild(renameBtn);
    input.focus();
  });
  container.appendChild(renameBtn);
}

