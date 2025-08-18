import { game } from '../state.js';

export function renderCharacter(container) {
  const div = document.createElement('div');
  div.className = 'grid';
  div.innerHTML = `
        <div class="row"><strong>Name:</strong> <span>${game.name}</span></div>
        <div class="row"><strong>Gender:</strong> <span>${game.gender}</span></div>
        <div class="row"><strong>Location:</strong> <span>${game.city}, ${game.country}</span></div>`;
  container.appendChild(div);
}

