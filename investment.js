import { game, addLog, saveGame } from './state.js';
import { rand } from './utils.js';
import { generateMarketNews } from './utils/marketNews.js';

if (!('portfolio' in game)) {
  game.portfolio = 0;
}

export function invest(amount) {
  if (game.money < amount) {
    addLog('Not enough money to invest.', 'investment');
    return false;
  }
  game.money -= amount;
  game.portfolio += amount;
  addLog(`You invested $${amount.toLocaleString()}.`, 'investment');
  saveGame();
  return true;
}

export function tickInvestments() {
  if (!game.portfolio) return;
  const news = generateMarketNews();
  const base = rand(95, 105) / 100;
  const modifier = base * news.modifier;
  game.portfolio = Math.round(game.portfolio * modifier);
  addLog(news.headline, 'news');
  addLog(`Your portfolio is now worth $${game.portfolio.toLocaleString()}.`, 'investment');
  saveGame();
}

