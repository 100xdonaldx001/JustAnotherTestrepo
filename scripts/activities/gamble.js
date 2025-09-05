import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { openWindow } from '../windowManager.js';

export { openWindow };

const LOSS_LIMIT = 1000;
let sessionLoss = 0;

export function renderGamble(container) {
  const wrap = document.createElement('div');

  const gameSelect = document.createElement('select');
  [
    { value: 'blackjack', text: 'Blackjack' },
    { value: 'roulette', text: 'Roulette' }
  ].forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.value;
    opt.textContent = g.text;
    gameSelect.appendChild(opt);
  });
  wrap.appendChild(gameSelect);

  const gameOptions = document.createElement('div');
  wrap.appendChild(gameOptions);

  const betInput = document.createElement('input');
  betInput.type = 'number';
  betInput.min = '1';
  betInput.value = '10';
  betInput.style.margin = '0 8px';
  wrap.appendChild(betInput);

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Play';
  wrap.appendChild(btn);

  const result = document.createElement('div');
  result.className = 'muted';
  result.style.marginTop = '8px';
  wrap.appendChild(result);

  function updateGameOptions() {
    gameOptions.innerHTML = '';
    if (gameSelect.value === 'roulette') {
      const colorSelect = document.createElement('select');
      ['red', 'black'].forEach(color => {
        const opt = document.createElement('option');
        opt.value = color;
        opt.textContent = color.charAt(0).toUpperCase() + color.slice(1);
        colorSelect.appendChild(opt);
      });
      gameOptions.appendChild(colorSelect);
    }
  }

  gameSelect.addEventListener('change', updateGameOptions);
  updateGameOptions();

  btn.addEventListener('click', () => {
    const bet = Math.floor(Number(betInput.value));
    if (bet <= 0) return;
    if (game.money < bet) {
      applyAndSave(() => {
        addLog('Not enough money to bet.', 'gambling');
      });
      return;
    }
    if (sessionLoss + bet > LOSS_LIMIT) {
      applyAndSave(() => {
        addLog('Loss limit reached. Take a break.', 'gambling');
      });
      return;
    }
    const selectedGame = gameSelect.value;
    applyAndSave(() => {
      game.money -= bet;
      sessionLoss += bet;
      let payout = 0;
      let win = false;
      let message = '';
      if (selectedGame === 'blackjack') {
        const player = rand(16, 21) + Math.floor(game.skills.gambling / 20);
        const dealer = rand(16, 23);
        if (player > 21) {
          win = false;
          message = `You bust with ${player}. Dealer had ${dealer}.`;
        } else if (dealer > 21 || player > dealer) {
          win = true;
          payout = bet * 2;
          message = `You ${player} vs Dealer ${dealer}.`;
        } else {
          win = false;
          message = `Dealer ${dealer} beats you ${player}.`;
        }
      } else if (selectedGame === 'roulette') {
        const colorSelect = gameOptions.querySelector('select');
        const choice = colorSelect.value;
        const chance = Math.min(48 + game.skills.gambling, 90);
        const winRoll = rand(1, 100) <= chance;
        const wheel = winRoll ? choice : choice === 'red' ? 'black' : 'red';
        win = winRoll;
        if (win) {
          payout = bet * 2;
        }
        message = `Roulette landed on ${wheel}.`;
      }
      if (win) {
        game.money += payout;
        sessionLoss = Math.max(0, sessionLoss - payout);
        addLog(`You won $${payout} at ${selectedGame}.`, 'gambling');
        result.textContent = `${message} You won $${payout}.`;
      } else {
        addLog(`You lost $${bet} at ${selectedGame}.`, 'gambling');
        result.textContent = `${message} You lost $${bet}.`;
      }
      game.skills.gambling += 1;
    });
  });

  container.appendChild(wrap);
}

