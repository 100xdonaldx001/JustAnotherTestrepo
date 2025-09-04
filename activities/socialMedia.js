import { game, addLog, applyAndSave } from '../state.js';
import { clamp, rand } from '../utils.js';
import { generateJobs } from '../jobs.js';

export function renderSocialMedia(container) {
  if (typeof game.followers !== 'number') game.followers = 0;

  const wrap = document.createElement('div');

  const info = document.createElement('div');
  info.className = 'muted';
  info.textContent =
    'Share updates to gain followers, earn sponsorships, or risk controversy.';
  wrap.appendChild(info);

  const count = document.createElement('div');
  count.textContent = `Followers: ${game.followers}`;
  count.style.margin = '4px 0';
  wrap.appendChild(count);

  function refreshJobs() {
    game.jobListingsYear = null;
    generateJobs();
  }

  const post = document.createElement('button');
  post.className = 'btn';
  post.textContent = 'Post Update';
  post.addEventListener('click', () => {
    applyAndSave(() => {
      const now = Date.now();
      const rapid = now - game.lastPost < 60000;
      let gained = rand(1, 20);
      let happinessGain = rand(1, 3);
      if (rapid) {
        gained = Math.floor(gained / 2);
        happinessGain = Math.floor(happinessGain / 2);
      }
      game.followers += gained;
      game.happiness = clamp(game.happiness + happinessGain);
      let message = `You posted on social media and gained ${gained} followers.`;
      if (rapid) {
        message += ' Posting again so soon limited your reach.';
      }
      addLog(message, 'social');

      if (rand(1, 100) <= 10) {
        const lost = Math.min(game.followers, rand(5, 15));
        const repLoss = rand(5, 15);
        game.followers -= lost;
        game.reputation = clamp(game.reputation - repLoss);
        addLog(
          `A controversial post cost you ${lost} followers and ${repLoss} reputation.`,
          'social'
        );
      } else {
        let earnings = 0;
        if (game.followers >= 10000 && rand(1, 100) <= 20) {
          earnings = rand(2000, 5000);
        } else if (game.followers >= 1000 && rand(1, 100) <= 10) {
          earnings = rand(500, 1000);
        }
        if (earnings > 0) {
          game.money += earnings;
          addLog(
            `You secured a sponsorship deal and earned $${earnings.toLocaleString()}.`,
            'social'
          );
        }
      }

      game.lastPost = now;
      count.textContent = `Followers: ${game.followers}`;
      refreshJobs();
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
      addLog(`You promoted your account and gained ${gained} followers.`, 'social');
      count.textContent = `Followers: ${game.followers}`;
      refreshJobs();
    });
  });

  wrap.appendChild(post);
  wrap.appendChild(promote);
  container.appendChild(wrap);
}

