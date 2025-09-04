import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';

export function renderSocialMedia(container) {
  if (typeof game.followers !== 'number') game.followers = 0;

  const wrap = document.createElement('div');

  const info = document.createElement('div');
  info.className = 'muted';
  info.textContent = 'Share updates to gain followers and boost happiness.';
  wrap.appendChild(info);

  const count = document.createElement('div');
  count.textContent = `Followers: ${game.followers}`;
  count.style.margin = '4px 0';
  wrap.appendChild(count);

  const post = document.createElement('button');
  post.className = 'btn';
  post.textContent = 'Post Update';
  post.addEventListener('click', () => {
    applyAndSave(() => {
      const gained = rand(1, 20);
      game.followers += gained;
      const gain = rand(1, 3);
      game.happiness = clamp(game.happiness + gain);
      const rep = rand(1, 3);
      game.reputation = clamp(game.reputation + rep);
      addLog(
        `You posted on social media and gained ${gained} followers (+${rep} Reputation).`,
        'social'
      );
      count.textContent = `Followers: ${game.followers}`;
    });
  });

  const promote = document.createElement('button');
  promote.className = 'btn';
  promote.textContent = 'Promote Account ($100)';
  promote.addEventListener('click', () => {
    const cost = 100;
    if (game.money < cost) {
      applyAndSave(() => {
        addLog('Promotion costs $100. Not enough money.', 'social');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= cost;
      const gained = rand(50, 100);
      game.followers += gained;
      game.happiness = clamp(game.happiness + 5);
      const rep = rand(3, 6);
      game.reputation = clamp(game.reputation + rep);
      addLog(
        `You promoted your account and gained ${gained} followers (+${rep} Reputation).`,
        'social'
      );
      count.textContent = `Followers: ${game.followers}`;
    });
  });

  wrap.appendChild(post);
  wrap.appendChild(promote);
  container.appendChild(wrap);
}
