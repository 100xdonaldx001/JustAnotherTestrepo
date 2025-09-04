import { game, addLog, applyAndSave, saveGame } from './state.js';

export const EDU_LEVELS = ['none', 'elementary', 'middle', 'trade', 'high', 'college', 'university', 'masters', 'phd'];

const durations = {
  elementary: 6,
  middle: 3,
  trade: 2,
  high: 4,
  college: 4,
  university: 4,
  masters: 2,
  phd: 4
};

const tuition = {
  college: 20000,
  university: 40000
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
    case 'trade':
      return 'Trade School';
    case 'high':
      return 'High School';
    case 'college':
      return 'College';
    case 'university':
      return 'University';
    case 'masters':
      return "Master's Degree";
    case 'phd':
      return 'PhD';
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
      startStage('trade');
    } else if (edu.highest === 'trade') {
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
  if (game.loanBalance > 0 && game.job?.tuitionAssistance) {
    const reduction = Math.min(game.loanBalance, 2000);
    game.loanBalance -= reduction;
    addLog(
      game.loanBalance > 0
        ? `Tuition assistance paid $${reduction.toLocaleString()} toward your loans.`
        : 'Your loans were fully paid off through tuition assistance.',
      'education'
    );
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

export function reEnrollHighSchool() {
  if (!game.education.droppedOut || game.education.current) {
    addLog('You cannot re-enroll right now.', 'education');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.education.droppedOut = false;
    startStage('high');
  });
}

export function getGed() {
  if (game.education.highest === 'high' || game.education.current) {
    addLog('You cannot get a GED right now.', 'education');
    saveGame();
    return;
  }
  applyAndSave(() => {
    game.education.highest = 'high';
    game.education.current = null;
    game.education.progress = 0;
    game.education.droppedOut = false;
    addLog('You obtained a GED.', 'education');
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
    game.loanBalance += tuition.college;
    addLog(`You took out $${tuition.college.toLocaleString()} in student loans.`, 'education');
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
    game.loanBalance += tuition.university;
    addLog(`You took out $${tuition.university.toLocaleString()} in student loans.`, 'education');
  });
}

export function accrueStudentLoanInterest() {
  if (game.loanBalance > 0) {
    const interest = Math.round(game.loanBalance * game.loanInterestRate);
    game.loanBalance += interest;
    addLog(
      `Student loan interest accrued $${interest.toLocaleString()}.`,
      'education'
    );
  }
}

export function enrollMasters() {
  if (
    ['college', 'university'].indexOf(game.education.highest) === -1 ||
    game.education.current
  ) {
    addLog('You need a college or university degree first.', 'education');
    saveGame();
    return;
  }
  applyAndSave(() => {
    startStage('masters');
  });
}

export function enrollPhd() {
  if (game.education.highest !== 'masters' || game.education.current) {
    addLog("You need a master's degree first.", 'education');
    saveGame();
    return;
  }
  applyAndSave(() => {
    startStage('phd');
  });
}

