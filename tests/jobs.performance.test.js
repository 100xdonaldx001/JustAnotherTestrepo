import { jest } from '@jest/globals';

jest.unstable_mockModule('../scripts/windowManager.js', () => ({
  refreshOpenWindows: jest.fn(),
  openWindow: jest.fn(),
  closeWindow: jest.fn(),
  closeAllWindows: jest.fn()
}));

jest.unstable_mockModule('../scripts/endscreen.js', () => ({
  showEndScreen: jest.fn(),
  hideEndScreen: jest.fn()
}));

jest.unstable_mockModule('../scripts/realestate.js', () => ({
  initBrokers: jest.fn()
}));

global.window = { addEventListener: jest.fn() };
const { game } = await import('../scripts/state.js');
const { adjustJobPerformance } = await import('../scripts/jobs.js');

beforeEach(() => {
  game.job = { title: 'Tester', salary: 0 };
  game.jobPerformance = 50;
  game.log = [];
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('adjustJobPerformance', () => {
  test('increases performance for good activities', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.9);
    adjustJobPerformance('good');
    expect(game.jobPerformance).toBe(53);
    expect(game.log[0].text).toBe('You impressed your boss. (+Performance)');
  });

  test('decreases performance for bad activities', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.9);
    adjustJobPerformance('bad');
    expect(game.jobPerformance).toBe(47);
    expect(game.log[0].text).toBe('You slacked off at work. (-Performance)');
  });
});

