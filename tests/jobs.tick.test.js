import { jest } from '@jest/globals';

describe('tickJob', () => {
  test('handles promotion, satisfaction loss, and health impact', async () => {
    const randMock = jest
      .fn()
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(3);

    const mockGame = {
      job: { salary: 50000 },
      jobSatisfaction: 15,
      health: 80
    };

    await jest.unstable_mockModule('../scripts/utils.js', () => ({
      rand: randMock,
      clamp: (v, a = 0, b = 100) => Math.max(a, Math.min(b, v)),
      combineChance: (...vals) =>
        Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    }));

    await jest.unstable_mockModule('../scripts/state.js', () => ({
      game: mockGame,
      saveGame: jest.fn(),
      addLog: jest.fn()
    }));

    const { tickJob } = await import('../scripts/jobs.js');
    const { game } = await import('../scripts/state.js');

    tickJob();

    expect(game.job.salary).toBe(51000);
    expect(game.jobSatisfaction).toBe(20);
    expect(game.health).toBe(77);
  });
});

