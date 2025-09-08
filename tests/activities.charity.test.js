/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

const game = { money: 500, reputation: 50, charityTotal: 0, charityYear: 0, log: [] };
const addLog = jest.fn((text, category = 'general') => {
  game.log.unshift({ text, category });
});
const applyAndSave = fn => fn();
const rand = jest.fn();

await jest.unstable_mockModule('../scripts/utils.js', () => ({
  rand,
  clamp: v => v
}));
await jest.unstable_mockModule('../scripts/state.js', () => ({
  game,
  addLog,
  applyAndSave,
  saveGame: jest.fn()
}));
await jest.unstable_mockModule('../scripts/taskChances.js', () => ({
  taskChances: { charity: { matchingDonation: 100, publicity: 0 } }
}));

const { renderCharity } = await import('../scripts/activities/charity.js');

test('matching donation doubles amount and logs message', () => {
  rand.mockReturnValueOnce(1).mockReturnValueOnce(100);
  const container = document.createElement('div');
  renderCharity(container);
  const input = container.querySelector('input');
  const btn = container.querySelector('button');
  input.value = '100';
  btn.click();
  expect(game.charityTotal).toBe(200);
  expect(game.charityYear).toBe(200);
  expect(game.reputation).toBe(52);
  expect(addLog).toHaveBeenCalledWith('A sponsor matched your donation!', 'charity');
  expect(addLog).toHaveBeenCalledWith('You donated $200. +2 Reputation.', 'charity');
});
