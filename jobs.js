import { rand } from './utils.js';
import { game } from './state.js';

export function generateJobs() {
  if (game.jobListingsYear === game.year && game.jobListings.length) {
    return game.jobListings;
  }
  const titles = [
    ['Janitor', 18000, 0],
    ['Store Clerk', 21000, 0],
    ['Courier', 24000, 0],
    ['Barista', 22000, 0],
    ['Receptionist', 26000, 20],
    ['Driver', 28000, 15],
    ['IT Support', 34000, 40],
    ['Junior Developer', 42000, 55],
    ['Nurse', 39000, 45],
    ['Teacher', 38000, 50],
    ['Chef', 33000, 25],
    ['Designer', 36000, 45],
    ['Accountant', 45000, 55],
    ['Engineer', 52000, 65],
    ['Lawyer', 72000, 75]
  ];
  const options = [];
  for (let i = 0; i < 6; i++) {
    const [t, base, req] = titles[rand(0, titles.length - 1)];
    const salary = base + rand(-3000, 12000);
    options.push({ title: t, salary, reqSmarts: req });
  }
  game.jobListings = options;
  game.jobListingsYear = game.year;
  return options;
}
