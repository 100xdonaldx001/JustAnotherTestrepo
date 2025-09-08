/** @jest-environment jsdom */
import { jest } from '@jest/globals';

const game = {
  inJail: false,
  job: {},
  state: { children: [{}] },
  siblings: [{}]
};

await jest.unstable_mockModule('../scripts/state.js', () => ({ game }));
await jest.unstable_mockModule('../scripts/windowManager.js', () => ({ openWindow: jest.fn() }));

const { renderActivities } = await import('../scripts/renderers/activities.js');

test('sorts categories and activities alphabetically', () => {
  const container = document.createElement('div');
  renderActivities(container);
  const headings = Array.from(container.querySelectorAll('.muted')).map(h => h.textContent);
  const sortedHeadings = [...headings].sort();
  expect(headings).toEqual(sortedHeadings);

  const wrap = container.querySelector('.actions');
  const nodes = Array.from(wrap.children);
  const start = nodes.findIndex(n => n.textContent === 'Business & Finance') + 1;
  const businessButtons = [];
  for (let i = start; i < nodes.length && !nodes[i].classList.contains('muted'); i++) {
    if (nodes[i].tagName === 'BUTTON') {
      businessButtons.push(nodes[i].textContent);
    }
  }
  expect(businessButtons).toEqual(['🏦 Bank', '💼 Business']);
});
