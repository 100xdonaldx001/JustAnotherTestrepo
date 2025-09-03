import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';

const MISSIONS = [
  {
    label: 'Gather Intel',
    success() {
      const cash = rand(500, 1500);
      game.money += cash;
      game.smarts = clamp(game.smarts + rand(1, 3));
      addLog(`Intel mission succeeded. +$${cash} and Smarts.`);
    },
    fail() {
      const dmg = rand(5, 12);
      game.health = clamp(game.health - dmg);
      addLog(`Intel mission failed. -${dmg} Health.`);
    }
  },
  {
    label: 'Sabotage',
    success() {
      const cash = rand(2000, 4000);
      game.money += cash;
      game.happiness = clamp(game.happiness + rand(1, 4));
      addLog(`Sabotage successful. +$${cash} and Happiness.`);
    },
    fail() {
      const dmg = rand(10, 20);
      game.health = clamp(game.health - dmg);
      addLog(`You were injured during sabotage. -${dmg} Health.`);
    }
  },
  {
    label: 'Assassination',
    success() {
      const cash = rand(5000, 10000);
      game.money += cash;
      game.happiness = clamp(game.happiness + rand(2, 6));
      addLog(`Assassination succeeded. +$${cash} and Happiness.`);
    },
    fail() {
      const dmg = rand(15, 30);
      game.health = clamp(game.health - dmg);
      addLog(`Assassination attempt failed. -${dmg} Health.`);
    }
  }
];

export function renderSecretAgent(container) {
  const wrap = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'muted';
  head.textContent = 'Choose a mission. Success yields rewards; failure can be painful.';
  wrap.appendChild(head);

  for (const m of MISSIONS) {
    const btn = document.createElement('button');
    btn.className = 'btn block';
    btn.textContent = m.label;
    btn.addEventListener('click', () => {
      applyAndSave(() => {
        const success = rand(1, 100) <= 60;
        if (success) {
          m.success();
        } else {
          m.fail();
        }
      });
    });
    wrap.appendChild(btn);
  }

  container.appendChild(wrap);
}

