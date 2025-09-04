import { rand } from '../utils.js';

const newsEvents = [
  { headline: 'Tech stocks soar on innovation surge', modifier: 1.1 },
  { headline: 'Economic slowdown rattles markets', modifier: 0.9 },
  { headline: 'Energy sector rallies on new discoveries', modifier: 1.05 },
  { headline: 'Regulation fears trigger sell-off', modifier: 0.95 }
];

export function generateMarketNews() {
  return newsEvents[rand(0, newsEvents.length - 1)];
}

