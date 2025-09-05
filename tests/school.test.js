import { jest } from '@jest/globals';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

global.window = { addEventListener: jest.fn() };

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

const school = await import('../scripts/school.js');
const state = await import('../scripts/state.js');
const { advanceSchool, dropOut, reEnrollHighSchool, getGed, chooseMajor } = school;
const { game } = state;

beforeEach(() => {
  game.age = 0;
  game.log.length = 0;
  Object.assign(game.education, {
    current: null,
    highest: 'none',
    progress: 0,
    droppedOut: false
  });
  game.major = null;
});

describe('advanceSchool', () => {
  test('starts elementary school and logs entry', () => {
    game.age = 5;
    advanceSchool();
    expect(game.education.current).toBe('elementary');
    expect(game.education.progress).toBe(1);
    expect(game.education.highest).toBe('none');
    expect(game.log[0].text).toBe('You started Elementary School.');
  });

  test('completes elementary school and resets progress', () => {
    game.education.current = 'elementary';
    game.education.progress = 5;
    advanceSchool();
    expect(game.education.highest).toBe('elementary');
    expect(game.education.current).toBeNull();
    expect(game.education.progress).toBe(0);
    expect(game.log[0].text).toBe('You finished Elementary School.');
  });
});

describe('dropOut', () => {
  test('drops out of high school and logs entry', () => {
    game.age = 16;
    game.education.current = 'high';
    dropOut();
    expect(game.education.current).toBeNull();
    expect(game.education.droppedOut).toBe(true);
    expect(game.log[0].text).toBe('You dropped out of high school.');
  });
});

describe('reEnrollHighSchool', () => {
  test('re-enrolls and resets progress', () => {
    game.education.droppedOut = true;
    game.education.highest = 'trade';
    reEnrollHighSchool();
    expect(game.education.droppedOut).toBe(false);
    expect(game.education.current).toBe('high');
    expect(game.education.progress).toBe(0);
    expect(game.log[0].text).toBe('You started High School.');
  });
});

describe('getGed', () => {
  test('awards GED, resets progress and logs entry', () => {
    game.education.highest = 'middle';
    getGed();
    expect(game.education.highest).toBe('high');
    expect(game.education.current).toBeNull();
    expect(game.education.progress).toBe(0);
    expect(game.education.droppedOut).toBe(false);
    expect(game.log[0].text).toBe('You obtained a GED.');
  });
});

describe('chooseMajor', () => {
  test('blocks major selection before college', () => {
    chooseMajor('Computer Science');
    expect(game.education.major).toBeNull();
  });

  test('allows choosing Computer Science in college', () => {
    game.education.highest = 'college';
    chooseMajor('Computer Science');
    expect(game.education.major).toBe('Computer Science');
  });
});
