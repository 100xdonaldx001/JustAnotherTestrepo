import { StoryNet } from './storyNet.js';
import { newLife } from './state.js';

const screenEl = document.getElementById('endscreen');
const net = new StoryNet();

function generateStory(game) {
  const events = game.log.slice().reverse();
  if (events.length === 0) return 'You had a quiet life.';
  const death = events[events.length - 1].text;
  const jobs = [];
  let studied = false;
  let jailed = false;
  let fit = false;
  for (const e of events) {
    const text = e.text;
    const lower = text.toLowerCase();
    const jobMatch = text.match(/became a ([^.]+)\./);
    if (jobMatch) jobs.push(jobMatch[1]);
    if (lower.includes('studied')) studied = true;
    if (lower.includes('jailed')) jailed = true;
    if (lower.includes('in jail')) jailed = true;
    if (lower.includes('gym') || lower.includes('worked out') || lower.includes('yard')) fit = true;
  }
  const job = jobs[jobs.length - 1];
  const features = [job ? 1 : 0, studied ? 1 : 0, fit ? 1 : 0, jailed ? 1 : 0];
  const outputs = net.forward(features);
  const parts = [`At age ${game.age}, your story came to an end: ${death}`];
  if (outputs[0] > 0.5 && job) parts.push(`You worked as a ${job}.`);
  if (outputs[1] > 0.5) parts.push('Education was a constant thread in your life.');
  if (outputs[2] > 0.5) parts.push('You took time to care for your body.');
  if (outputs[3] > 0.5) parts.push('There were moments when the law caught up with you.');
  return parts.join(' ');
}

export function showEndScreen(game) {
  screenEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'Life Story';
  screenEl.appendChild(title);
  const story = document.createElement('p');
  story.textContent = generateStory(game);
  screenEl.appendChild(story);
  const list = document.createElement('ul');
  for (const item of game.log.slice().reverse()) {
    const li = document.createElement('li');
    li.innerHTML = `<time>${item.when}</time> ${item.text}`;
    list.appendChild(li);
  }
  screenEl.appendChild(list);
  const restart = document.createElement('button');
  restart.textContent = 'Start new life';
  restart.addEventListener('click', () => {
    newLife();
  });
  screenEl.appendChild(restart);
  screenEl.classList.remove('hidden');
}

export function hideEndScreen() {
  screenEl.classList.add('hidden');
  screenEl.innerHTML = '';
}

