import { game, addLog, applyAndSave } from '../state.js';
import { rand } from '../utils.js';
import { getFaker } from '../utils/faker.js';

const faker = await getFaker();

if (!game.state) game.state = {};
if (typeof game.state.cash !== 'number') game.state.cash = 0;
if (!Array.isArray(game.state.portfolio)) game.state.portfolio = [];
if (!Array.isArray(game.state.market)) game.state.market = generateMarket();

export const market = game.state.market;

function randomLetter() {
  if (faker.string && typeof faker.string.alpha === 'function') {
    return faker.string.alpha(1).toUpperCase();
  }
  return String.fromCharCode(65 + rand(0, 25));
}

function companyName() {
  if (faker.company && typeof faker.company.name === 'function') {
    return faker.company.name();
  }
  return `${faker.person.lastName()} ${faker.location.city()} Corp`;
}

function generateSymbol(name, used) {
  let letters = name.replace(/[^A-Za-z]/g, '').toUpperCase();
  let symbol = letters.slice(0, 4);
  while (used.has(symbol) || symbol.length < 3) {
    letters += randomLetter();
    symbol = letters.slice(0, 4);
  }
  used.add(symbol);
  return symbol;
}

function generateMarket() {
  const used = new Set();
  const m = [];

  const bondData = [
    ['government', 0.02],
    ['local', 0.025],
    ['corporate', 0.03]
  ];
  for (const [type, dividend] of bondData) {
    const name = `${companyName()} ${type} bond`;
    m.push({
      name,
      symbol: generateSymbol(name, used),
      price: rand(90, 110),
      dividend,
      category: 'bond',
      type,
      risk: rand(1, 100)
    });
  }

  const cryptos = [
    ['Bitcoin', 'BTC', 10000, 60000],
    ['Ethereum', 'ETH', 500, 5000]
  ];
  for (const [name, symbol, min, max] of cryptos) {
    m.push({
      name,
      symbol,
      price: rand(min, max),
      dividend: 0,
      category: 'crypto',
      risk: rand(1, 100)
    });
  }

  const fundName = `${companyName()} Fund`;
  m.push({
    name: fundName,
    symbol: generateSymbol(fundName, used),
    price: rand(100, 200),
    dividend: 0.02,
    category: 'fund',
    risk: rand(1, 100)
  });

  const pennyName = companyName();
  m.push({
    name: pennyName,
    symbol: generateSymbol(pennyName, used),
    price: rand(1, 5),
    dividend: 0,
    category: 'penny',
    risk: rand(1, 100)
  });

  const sectorData = {
    communication: 0.02,
    consumer: 0.02,
    energy: 0.025,
    financial: 0.02,
    healthcare: 0.02,
    industrial: 0.02,
    materials: 0.015,
    technology: 0.03
  };
  for (const sector of Object.keys(sectorData)) {
    const name = companyName();
    m.push({
      name,
      symbol: generateSymbol(name, used),
      price: rand(40, 100),
      dividend: sectorData[sector],
      category: 'stock',
      sector,
      risk: rand(1, 100)
    });
  }

  return m;
}

function findStock(symbol) {
  return market.find(s => s.symbol === symbol);
}

export function buyStock(symbol, shares) {
  const stock = findStock(symbol);
  if (!stock || shares <= 0) return;
  const cost = stock.price * shares;
  if (game.state.cash < cost) {
    applyAndSave(() => {
      addLog(`Not enough cash to buy ${symbol}.`, 'finance');
    });
    return;
  }
  applyAndSave(() => {
    game.state.cash -= cost;
    if (stock.category === 'bond') {
      game.state.portfolio.push({
        symbol,
        shares,
        endYear: game.year + rand(3, 10)
      });
    } else {
      const holding = game.state.portfolio.find(p => p.symbol === symbol);
      if (holding) {
        holding.shares += shares;
      } else {
        game.state.portfolio.push({ symbol, shares });
      }
    }
    addLog(
      `Bought ${shares} shares of ${stock.name} (${symbol}) for $${cost.toLocaleString()}.`,
      'finance'
    );
  });
}

export function sellStock(symbol, shares) {
  const stock = findStock(symbol);
  if (!stock || shares <= 0) return;
  let total = 0;
  for (const h of game.state.portfolio) {
    if (h.symbol === symbol) total += h.shares;
  }
  if (total < shares) {
    applyAndSave(() => {
      addLog(`Not enough shares of ${symbol} to sell.`, 'finance');
    });
    return;
  }
  const revenue = stock.price * shares;
  applyAndSave(() => {
    let remaining = shares;
    for (let i = game.state.portfolio.length - 1; i >= 0 && remaining > 0; i--) {
      const h = game.state.portfolio[i];
      if (h.symbol !== symbol) continue;
      const sell = Math.min(h.shares, remaining);
      h.shares -= sell;
      remaining -= sell;
      if (h.shares === 0) game.state.portfolio.splice(i, 1);
    }
    game.state.cash += revenue;
    addLog(
      `Sold ${shares} shares of ${stock.name} (${symbol}) for $${revenue.toLocaleString()}.`,
      'finance'
    );
  });
}

export function tickStocks() {
  let dividends = 0;
  let maturities = 0;
  for (const stock of market) {
    const vol = (stock.risk || 1) / 10;
    const change = 1 + (Math.random() - 0.5) * 0.1 * vol;
    stock.price = Math.max(1, Math.round(stock.price * change));
  }
  for (let i = game.state.portfolio.length - 1; i >= 0; i--) {
    const holding = game.state.portfolio[i];
    const stock = findStock(holding.symbol);
    if (!stock) continue;
    if (stock.category === 'bond' && holding.endYear <= game.year) {
      const payout = stock.price * holding.shares;
      game.state.cash += payout;
      maturities += payout;
      addLog(
        `Your ${stock.name} matured paying $${payout.toLocaleString()}.`,
        'finance'
      );
      game.state.portfolio.splice(i, 1);
      continue;
    }
    const payout = Math.round(stock.price * (stock.dividend || 0) * holding.shares);
    if (payout > 0) dividends += payout;
  }
  if (dividends > 0) {
    game.state.cash += dividends;
    addLog(
      `Your investments paid $${dividends.toLocaleString()} in dividends.`,
      'finance'
    );
  }
  return dividends + maturities;
}

