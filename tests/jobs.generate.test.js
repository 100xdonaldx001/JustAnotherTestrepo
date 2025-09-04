import { jest } from '@jest/globals';

const noop = () => {};
global.window = { addEventListener: noop, dispatchEvent: noop };
global.document = {
  getElementById: () => ({ classList: { add: noop, remove: noop }, appendChild: noop, textContent: '' }),
  createElement: () => ({ appendChild: noop, addEventListener: noop, classList: { add: noop, remove: noop }, textContent: '' }),
  querySelectorAll: () => [],
  querySelector: () => null
};
global.fetch = async () => ({ json: async () => [] });

const { game } = await import('../state.js');
const { generateJobs } = await import('../jobs.js');

function resetGame() {
  game.year = 2000;
  game.jobListings = [];
  game.jobListingsYear = null;
  game.retired = false;
}

describe('generateJobs economy effects', () => {
  let randSpy;
  beforeEach(() => {
    randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    resetGame();
    game.education.current = null;
  });
  afterEach(() => {
    randSpy.mockRestore();
  });
  function gen(econ) {
    game.economy = econ;
    game.jobListings = [];
    game.jobListingsYear = null;
    return generateJobs();
  }
  test('job count and salaries vary with economy', () => {
    const boom = gen('boom');
    const normal = gen('normal');
    const recession = gen('recession');
    expect(boom).toHaveLength(8);
    expect(normal).toHaveLength(6);
    expect(recession).toHaveLength(4);
    const baseSalary = normal[0].salary;
    expect(boom[0].salary).toBe(Math.round(baseSalary * 1.2));
    expect(recession[0].salary).toBe(Math.round(baseSalary * 0.8));
  });
});

describe('generateJobs part-time', () => {
  let randSpy;
  beforeEach(() => {
    randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    resetGame();
    game.economy = 'normal';
    game.education.current = 'college';
  });
  afterEach(() => {
    randSpy.mockRestore();
  });
  test('includes part-time jobs when enrolled', () => {
    const jobs = generateJobs();
    const partTime = jobs.filter(j => j.partTime);
    expect(partTime).toHaveLength(2);
    expect(jobs).toHaveLength(8);
  });
});


describe('generateJobs retirement', () => {
  beforeEach(() => {
    resetGame();
    game.retired = true;
  });
  test('returns no listings for retired characters', () => {
    const jobs = generateJobs();
    expect(jobs).toHaveLength(0);
  });
});
