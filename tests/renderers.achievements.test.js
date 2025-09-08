/** @jest-environment jsdom */
import { game, ACHIEVEMENTS } from '../scripts/state.js';
import { renderAchievements } from '../scripts/renderers/achievements.js';

describe('renderAchievements', () => {
  beforeEach(() => {
    game.achievements = [{ id: 'first-job', text: ACHIEVEMENTS['first-job'] }];
  });

  test('shows summary and entry states', () => {
    const container = document.createElement('div');
    renderAchievements(container);
    const summary = container.querySelector('.summary');
    expect(summary.textContent).toBe('1/5 achievements unlocked');
    expect(container.querySelectorAll('.entry.unlocked')).toHaveLength(1);
    const lockedCount = Object.keys(ACHIEVEMENTS).length - 1;
    expect(container.querySelectorAll('.entry.locked')).toHaveLength(lockedCount);
  });

  test('filters locked achievements', () => {
    const container = document.createElement('div');
    renderAchievements(container);
    const toggle = container.querySelector('.filter input');
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    const hidden = Array.from(container.querySelectorAll('.entry.locked')).every(el => el.style.display === 'none');
    expect(hidden).toBe(true);
  });
});
