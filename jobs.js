import { rand } from './utils.js';
import { game, saveGame } from './state.js';

export function generateJobs() {
  if (game.jobListingsYear === game.year && game.jobListings.length) {
    return game.jobListings;
  }
  const titles = [
    ['Janitor', 18000, 0, 'none'],
    ['Store Clerk', 21000, 0, 'none'],
    ['Courier', 24000, 0, 'none'],
    ['Barista', 22000, 0, 'none'],
    ['Receptionist', 26000, 20, 'high'],
    ['Driver', 28000, 15, 'none'],
    ['IT Support', 34000, 40, 'high'],
    ['Junior Developer', 42000, 55, 'college'],
    ['Nurse', 39000, 45, 'college'],
    ['Teacher', 38000, 50, 'college'],
    ['Chef', 33000, 25, 'high'],
    ['Designer', 36000, 45, 'college'],
    ['Accountant', 45000, 55, 'college'],
    ['Engineer', 52000, 65, 'university'],
    ['Lawyer', 72000, 75, 'university']
  ];
  const options = [];
  for (let i = 0; i < 6; i++) {
    const [t, base, req, edu] = titles[rand(0, titles.length - 1)];
    const salary = base + rand(-3000, 12000);
    options.push({ title: t, salary, reqSmarts: req, reqEdu: edu });
  }
  game.jobListings = options;
  game.jobListingsYear = game.year;
  saveGame();
  return options;
}
