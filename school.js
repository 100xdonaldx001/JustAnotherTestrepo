import { game, addLog, applyAndSave, saveGame } from './state.js';

export const EDU_LEVELS = ['none', 'elementary', 'middle', 'high', 'college', 'university'];

const durations = {
  elementary: 6,
  middle: 3,
  high: 4,
  college: 4,
  university: 4
};

export function educationRank(level) {
  return EDU_LEVELS.indexOf(level || 'none');
}

export function eduName(level) {
  switch (level) {
    case 'elementary':
      return 'Elementary School';
    case 'middle':
      return 'Middle School';
    case 'high':
      return 'High School';
    case 'college':
      return 'College';
    case 'university':
      return 'University';
    default:
      return 'No School';
  }
}

function startStage(stage) {
  game.education.current = stage;
  game.education.progress = 0;
  addLog(`You started ${eduName(stage)}.`, 'education');
}

export function advanceSchool() {
  const edu = game.education;
  if (edu.droppedOut) return;
  if (!edu.current) {
    if (game.age >= 5 && edu.highest === 'none') {
      startStage('elementary');
    } else if (edu.highest === 'elementary') {
      startStage('middle');
    } else if (edu.highest === 'middle') {
      startStage('high');
    }
  }
  if (edu.current) {
    edu.progress += 1;
    const needed = durations[edu.current];
    if (edu.progress >= needed) {
      edu.highest = edu.current;
      addLog(`You finished ${eduName(edu.current)}.`, 'education');
      edu.current = null;
      edu.progress = 0;
      if (edu.highest === 'high') {
        addLog('Consider attending college or university.', 'education');
      }
    }
  }
}

export function dropOut() {
  if (game.age < 16 || game.education.current !== 'high' || game.education.droppedOut) {
    addLog('You cannot drop out right now.', 'education');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.education.current = null;
    game.education.droppedOut = true;
    addLog('You dropped out of high school.', 'education');
  });
}

export function enrollCollege() {
  if (game.education.highest !== 'high' || game.education.current) {
    addLog('You need a high school diploma first.', 'education');
    saveGame();
    return;
  }
  applyAndSave(() => {
    startStage('college');
  });
}

export function enrollUniversity() {
  if (game.education.highest !== 'high' || game.education.current) {
    addLog('You need a high school diploma first.', 'education');
    saveGame();
    return;
  }
  applyAndSave(() => {
    startStage('university');
  });
}

