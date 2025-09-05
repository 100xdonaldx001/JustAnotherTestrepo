import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

export function renderReligion(container) {
  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Explore your spiritual side.';
  container.appendChild(head);

  const serviceBtn = document.createElement('button');
  serviceBtn.className = 'btn';
  serviceBtn.textContent = 'Attend Service';
  serviceBtn.addEventListener('click', () => {
    if (!game.religion || game.religion === 'none') {
      applyAndSave(() => {
        addLog('You have no religion to attend services for.', 'religion');
      });
      return;
    }
    applyAndSave(() => {
      const faithGain = rand(1, 3);
      game.faith = clamp((game.faith || 0) + faithGain);
      game.happiness = clamp(game.happiness + rand(1, 2));
      addLog(
        `You attended a ${game.religion} service. +${faithGain} Faith`,
        'religion'
      );
    });
  });
  container.appendChild(serviceBtn);

  const convertWrap = document.createElement('div');
  convertWrap.style.marginTop = '8px';
  const convertInput = document.createElement('input');
  convertInput.type = 'text';
  convertInput.placeholder = 'New religion';
  const convertBtn = document.createElement('button');
  convertBtn.className = 'btn';
  convertBtn.textContent = 'Convert';
  convertBtn.addEventListener('click', () => {
    const rel = convertInput.value.trim();
    if (!rel) return;
    applyAndSave(() => {
      game.religion = rel;
      game.faith = 50;
      game.happiness = clamp(game.happiness + 2);
      addLog(`You converted to ${rel}.`, 'religion');
    });
  });
  convertWrap.appendChild(convertInput);
  convertWrap.appendChild(convertBtn);
  container.appendChild(convertWrap);

  const donateWrap = document.createElement('div');
  donateWrap.style.marginTop = '8px';
  const donateInput = document.createElement('input');
  donateInput.type = 'number';
  donateInput.min = '1';
  donateInput.value = '100';
  donateInput.style.width = '80px';
  const donateBtn = document.createElement('button');
  donateBtn.className = 'btn';
  donateBtn.textContent = 'Donate';
  donateBtn.addEventListener('click', () => {
    const amt = Math.floor(Number(donateInput.value));
    if (amt <= 0) return;
    if (game.money < amt) {
      applyAndSave(() => {
        addLog(`Donation requires $${amt}. Not enough money.`, 'religion');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= amt;
      const gain = Math.max(1, Math.floor(amt / 100));
      game.faith = clamp((game.faith || 0) + gain);
      game.happiness = clamp(game.happiness + 1);
      addLog(`You donated $${amt}. +${gain} Faith`, 'religion');
    });
  });
  donateWrap.appendChild(donateInput);
  donateWrap.appendChild(donateBtn);
  container.appendChild(donateWrap);
}

