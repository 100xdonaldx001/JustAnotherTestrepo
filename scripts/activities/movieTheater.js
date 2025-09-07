import { game, addLog, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';
import { openWindow as windowOpen } from '../windowManager.js';

export { windowOpen as openWindow };

const TICKET_COST = 12;
const EVENTS = [
  {
    text: 'You loved the blockbuster and feel fantastic.',
    happiness: 4
  },
  {
    text: 'The movie was a snooze fest. What a waste.',
    happiness: -2
  },
  {
    text: 'You found $5 under your seat during the previews.',
    happiness: 1,
    money: 5
  }
];

export function renderMovieTheater(container) {
  const wrap = document.createElement('div');
  const result = document.createElement('div');
  result.className = 'muted';

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = `Buy Ticket ($${TICKET_COST})`;
  if (game.money < TICKET_COST) btn.disabled = true;
  btn.addEventListener('click', () => {
    if (game.money < TICKET_COST) return;
    if (rand(1, 100) > taskChances.movieTheater.ticketAvailable) {
      applyAndSave(() => {
        addLog('The show was sold out.', 'leisure');
      });
      return;
    }
    applyAndSave(() => {
      game.money -= TICKET_COST;
      const event = EVENTS[rand(0, EVENTS.length - 1)];
      game.happiness = clamp(game.happiness + event.happiness);
      if (event.money) game.money += event.money;
      addLog(event.text, 'leisure');
      result.textContent = event.text;
    });
  });

  wrap.appendChild(btn);
  wrap.appendChild(result);
  container.appendChild(wrap);
}

