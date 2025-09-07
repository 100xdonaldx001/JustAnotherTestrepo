/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

const game = { money: 10, happiness: 0, log: [] };
const addLog = jest.fn();
const applyAndSave = fn => fn();

await jest.unstable_mockModule('../scripts/state.js', () => ({
  game,
  addLog,
  applyAndSave,
  saveGame: jest.fn()
}));

const { renderLottery } = await import('../scripts/activities/lottery.js');

test('keeps selected option after refresh', () => {
  const container = document.createElement('div');
  const win = document.createElement('div');

  renderLottery(container, win);

  const select = container.querySelector('select');
  expect(select.value).toBe('standard');

  select.value = 'scratch';
  select.dispatchEvent(new Event('change'));

  container.innerHTML = '';
  renderLottery(container, win);
  const select2 = container.querySelector('select');
  expect(select2.value).toBe('scratch');
});

