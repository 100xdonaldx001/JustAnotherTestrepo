import { jest } from '@jest/globals';

const game = {
  age: 4,
  year: 2000,
  health: 80,
  happiness: 70,
  smarts: 10,
  money: 0,
  job: { salary: 12000, title: 'Tester', experience: 0 },
  jobPerformance: 50,
  jobExperience: 0,
  jobLevel: 'entry',
  properties: [],
  alive: true,
  sick: false,
  inJail: false,
  maxAge: 100,
  jobListings: []
};

const addLog = jest.fn();
const die = jest.fn();
const saveGame = jest.fn();
const applyAndSave = jest.fn(fn => fn());
const unlockAchievement = jest.fn();

jest.unstable_mockModule('../state.js', () => ({
  game,
  addLog,
  die,
  saveGame,
  applyAndSave,
  unlockAchievement
}));

const randValues = [1, 2, 11, 3, 10, 2, 2, 2, 2, 2];
let randCall = 0;
jest.unstable_mockModule('../utils.js', () => ({
  rand: jest.fn(() => randValues[randCall++]),
  clamp: (value, min = 0, max = 100) => Math.min(Math.max(value, min), max)
}));

jest.unstable_mockModule('../jail.js', () => ({ tickJail: jest.fn() }));
jest.unstable_mockModule('../activities/love.js', () => ({ tickRelationships: jest.fn() }));
jest.unstable_mockModule('../realestate.js', () => ({ tickRealEstate: jest.fn() }));
jest.unstable_mockModule('../school.js', () => ({
  advanceSchool: jest.fn(),
  accrueStudentLoanInterest: jest.fn(),
  dropOut: jest.fn(),
  enrollCollege: jest.fn(),
  enrollUniversity: jest.fn(),
  reEnrollHighSchool: jest.fn(),
  getGed: jest.fn()
}));
jest.unstable_mockModule('../jobs.js', () => ({ tickJob: jest.fn(), adjustJobPerformance: jest.fn() }));

const { ageUp } = await import('../actions.js');
const { game: mockedGame } = await import('../state.js');

describe('ageUp', () => {
  test('increments age, pays salary, and applies age-based events', () => {
    ageUp();
    expect(mockedGame.age).toBe(5);
    expect(mockedGame.year).toBe(2001);
    expect(mockedGame.money).toBe(11000);
    expect(mockedGame.smarts).toBe(13);
  });
});

