import { jest } from '@jest/globals';

const game = {
  age: 4,
  year: 2000,
  health: 80,
  happiness: 70,
  smarts: 10,
  money: 0,
  savingsBalance: 0,
  creditScore: 650,
  charityTotal: 0,
  charityYear: 0,
  taxPaid: 0,
  religion: 'none',
  faith: 0,
  job: { salary: 12000, title: 'Tester', experience: 0 },
  jobPerformance: 50,
  jobExperience: 0,
  jobLevel: 'entry',
  retired: false,
  pension: 0,
  pensionFromSavings: false,
  properties: [],
  portfolio: [],
  businesses: [],
  alive: true,
  sick: false,
  inJail: false,
  maxAge: 100,
  jobListings: [],
  parents: {
    mother: { age: 50, health: 80 },
    father: { age: 52, health: 80 }
  },
  siblings: []
};

const addLog = jest.fn();
const die = jest.fn();
const saveGame = jest.fn();
const applyAndSave = jest.fn(fn => fn());
const unlockAchievement = jest.fn();
const distributeInheritance = jest.fn(relative => {
  const amount = 10000;
  game.money += amount;
  addLog(
    `Your ${relative} left you $${amount.toLocaleString()} in inheritance. (+Money)`,
    'family'
  );
});

jest.unstable_mockModule('../state.js', () => ({
  game,
  addLog,
  die,
  saveGame,
  applyAndSave,
  unlockAchievement,
  distributeInheritance
}));

const randValues = [1, 2, 11, 3, 10, 2, 2, 2, 2, 2];
let randCall = 0;
jest.unstable_mockModule('../utils.js', () => ({
  rand: jest.fn(() => randValues[randCall++]),
  clamp: (value, min = 0, max = 100) => Math.min(Math.max(value, min), max)
}));

jest.unstable_mockModule('../jail.js', () => ({ tickJail: jest.fn() }));
jest.unstable_mockModule('../activities/love.js', () => ({ tickRelationships: jest.fn(), tickSpouse: jest.fn() }));
jest.unstable_mockModule('../actions/elderCare.js', () => ({
  tickParents: jest.fn(() => {
    if (game.parents.mother) {
      game.parents.mother.age++;
      if (game.parents.mother.health <= 0) {
        addLog(game.parents.mother.cause, 'family');
        distributeInheritance('mother');
        delete game.parents.mother;
      }
    }
    if (game.parents.father) {
      game.parents.father.age++;
      if (game.parents.father.health <= 0) {
        addLog(game.parents.father.cause, 'family');
        distributeInheritance('father');
        delete game.parents.father;
      }
    }
    for (let i = game.siblings.length - 1; i >= 0; i--) {
      const sib = game.siblings[i];
      sib.age++;
      if (sib.health <= 0) {
        addLog(sib.cause, 'family');
        game.siblings.splice(i, 1);
      }
    }
  })
}));
jest.unstable_mockModule('../realestate.js', () => ({ tickRealEstate: jest.fn() }));
jest.unstable_mockModule('../activities/business.js', () => ({ tickBusinesses: jest.fn() }));
jest.unstable_mockModule('../school.js', () => ({
  advanceSchool: jest.fn(),
  accrueStudentLoanInterest: jest.fn(),
  dropOut: jest.fn(),
  enrollCollege: jest.fn(),
  enrollUniversity: jest.fn(),
  reEnrollHighSchool: jest.fn(),
  getGed: jest.fn(),
  triggerPeerPressure: jest.fn(),
  eduName: jest.fn()
}));
jest.unstable_mockModule('../jobs.js', () => ({ tickJob: jest.fn(), adjustJobPerformance: jest.fn() }));
jest.unstable_mockModule('../utils/weather.js', () => ({
  updateWeather: jest.fn(),
  getCurrentWeather: jest.fn(() => 'sunny')
}));
jest.unstable_mockModule('../actions/weekend.js', () => ({ weekendEvent: jest.fn() }));

const { ageUp } = await import('../actions.js');
const { game: mockedGame } = await import('../state.js');
const { triggerPeerPressure } = await import('../school.js');

describe('ageUp', () => {
  beforeEach(() => {
    Object.assign(game, {
      age: 4,
      year: 2000,
      health: 80,
      happiness: 70,
      smarts: 10,
      money: 0,
      savingsBalance: 0,
      creditScore: 650,
      charityTotal: 0,
      charityYear: 0,
      taxPaid: 0,
      religion: 'none',
      faith: 0,
      job: { salary: 12000, title: 'Tester', experience: 0 },
      jobPerformance: 50,
      jobExperience: 0,
      jobLevel: 'entry',
      retired: false,
      pension: 0,
      pensionFromSavings: false,
      properties: [],
      portfolio: [],
      businesses: [],
      alive: true,
      sick: false,
      inJail: false,
      maxAge: 100,
      jobListings: [],
      parents: {
        mother: { age: 50, health: 80 },
        father: { age: 52, health: 80 }
      },
      siblings: []
    });
    randCall = 0;
  });

  test('increments age, pays salary, and applies age-based events', () => {
    ageUp();
    expect(mockedGame.age).toBe(5);
    expect(mockedGame.year).toBe(2001);
    expect(mockedGame.money).toBe(8800);
    expect(mockedGame.taxPaid).toBe(2200);
    expect(mockedGame.smarts).toBe(13);
    expect(triggerPeerPressure).toHaveBeenCalled();
  });

  test('health reaching zero does not end life', () => {
    game.health = 0;
    ageUp();
    expect(mockedGame.alive).toBe(true);
  });

  test('pays pension when retired', () => {
    Object.assign(game, { job: null, retired: true, pension: 500, pensionFromSavings: false, money: 0 });
    ageUp();
    expect(mockedGame.money).toBe(500);
  });

  test('deducts savings when pension from savings', () => {
    Object.assign(game, { job: null, retired: true, pension: 300, pensionFromSavings: true, money: 1000 });
    ageUp();
    expect(mockedGame.money).toBe(700);
  });

  test('children lose less health and recover when sick', () => {
    randValues.length = 0;
    randValues.push(4, 0, 5);
    randCall = 0;
    Object.assign(game, {
      age: 10,
      year: 2000,
      health: 80,
      happiness: 70,
      sick: true,
      job: null,
      unemployment: 0
    });
    ageUp();
    expect(mockedGame.health).toBe(83);
    expect(mockedGame.sick).toBe(false);
  });

  test('applies interest to savings balance', () => {
    game.savingsBalance = 1000;
    ageUp();
    expect(mockedGame.savingsBalance).toBe(1020);
  });

  test('ages relatives and handles deaths with inheritance', () => {
    game.parents.mother.health = 0;
    game.parents.mother.cause = 'Heart attack';
    game.siblings = [{ name: 'Alex', age: 20, health: 0, cause: 'Accident' }];
    addLog.mockClear();
    ageUp();
    expect(game.parents.mother).toBeUndefined();
    expect(game.parents.father.age).toBe(53);
    expect(game.siblings.length).toBe(0);
    expect(addLog).toHaveBeenCalledWith('Heart attack', 'family');
    expect(addLog).toHaveBeenCalledWith('Accident', 'family');
    expect(distributeInheritance).toHaveBeenCalledWith('mother');
  });
});
