import { game, addLog, saveGame, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import * as jobs from '../jobs.js';
const { adjustJobPerformance, generateJobs } = jobs;
import { checkForAccident } from './traffic.js';
import { taskChances } from '../taskChances.js';

function commute() {
  if (game.cars && game.cars.length) {
    checkForAccident();
  }
}

export function paySalary() {
  let earned = 0;
  if (game.job && !game.inJail) {
    commute();
    adjustJobPerformance();
    const monthly = game.job.salary / 12;
    const months = rand(10, 12);
    earned = Math.round(monthly * months);
    if (
      game.jobPerformance >= 80 &&
      rand(1, 100) <= taskChances.jobs.bonus
    ) {
      const bonus = Math.round(earned * 0.2);
      earned += bonus;
      addLog(
        [
          'Your high performance earned you a bonus.',
          'Outstanding work rewarded you with a bonus.',
          'Your stellar performance came with a bonus.'
        ],
        'job'
      );
    } else if (
      game.jobPerformance <= 20 &&
      rand(1, 100) <= taskChances.jobs.demotion
    ) {
      game.job.salary = Math.round(game.job.salary * 0.9);
      addLog(
        [
          'Poor performance led to a demotion and pay cut.',
          'Your lackluster work caused a demotion and salary drop.',
          'You were demoted for underperforming and lost some pay.'
        ],
        'job'
      );
    }
    game.money += earned;
    game.jobExperience = (game.jobExperience || 0) + (game.job.expMultiplier || 1);
    addLog([
      `You worked as a ${game.job.title} and earned $${earned.toLocaleString()}.`,
      `Your job as a ${game.job.title} paid $${earned.toLocaleString()}.`,
      `Working as a ${game.job.title} brought in $${earned.toLocaleString()}.`,
      `As a ${game.job.title}, you earned $${earned.toLocaleString()}.`,
      `You pulled in $${earned.toLocaleString()} from your ${game.job.title} job.`
    ], 'job');
    game.unemployment = 0;
  } else if (!game.inJail && !game.retired) {
    game.unemployment = (game.unemployment || 0) + 1;
    if (game.unemployment >= 2) {
      const listings = generateJobs();
      if (
        !listings.some(j => j.field === 'freelance') &&
        rand(1, 100) <= taskChances.jobs.freelanceSurface
      ) {
        const gigs = jobs.freelanceJobs || [];
        if (gigs.length > 0) {
          const gig = gigs[rand(0, gigs.length - 1)];
          const salary = gig[1] + rand(-1000, 1000);
          listings.push({
            title: gig[0],
            salary,
            reqEdu: gig[2],
            field: 'freelance',
            level: 'freelance'
          });
          game.jobListings = listings;
          game.jobListingsYear = game.year;
          addLog(
            [
              'Freelance gigs surfaced due to prolonged unemployment.',
              'Extended unemployment brought new freelance opportunities.',
              'After a long job hunt, some freelance gigs appeared.'
            ],
            'job'
          );
        }
      }
    }
  }
  return earned;
}

export function workExtra() {
  if (!game.job) {
    addLog([
      'You need a job first.',
      'Employment comes before overtime.',
      'Find a job before trying that.',
      'No job, no overtime.',
      'Secure work before attempting this.'
    ], 'job');
    saveGame();
    return;
  }
  if (game.inJail) {
    addLog([
      'You cannot work extra while in jail.',
      'Jail time means no extra work.',
      'Behind bars, overtime is impossible.',
      'No overtime from a cell.',
      'You\'re locked up—no extra shifts.'
    ], 'job');
    saveGame();
    return;
  }
  commute();
  if (rand(1, 100) > taskChances.jobs.overtimeApproval) {
    addLog(
      [
        'Your request for overtime was denied.',
        'Management rejected your overtime request.',
        'No overtime approved for you this time.'
      ],
      'job'
    );
    saveGame();
    return;
  }
  applyAndSave(() => {
    const bonus = rand(200, 1500);
    game.money += bonus;
    game.happiness = clamp(game.happiness - rand(0, 2));
    game.health = clamp(game.health - rand(0, 2));
    addLog([
      `You took overtime. Earned $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `Extra hours paid $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `Overtime brought in $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `You grabbed overtime for $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
      `Working extra netted $${bonus.toLocaleString()}. (-Small Health/Happiness)`
    ], 'job');
  });
}


export function retire(source = 'government') {
  if (game.age < 60) {
    addLog(
      [
        'You are not old enough to retire.',
        "Retirement must wait until you're older.",
        'Too young to retire just yet.'
      ],
      'job'
    );
    saveGame();
    return;
  }
  if (game.retired) {
    addLog(
      [
        'You are already retired.',
        "You're already enjoying retirement.",
        'Retirement has already begun for you.'
      ],
      'job'
    );
    saveGame();
    return;
  }
  applyAndSave(() => {
    const pension = game.job ? Math.round(game.job.salary * 0.5) : 0;
    game.pension = pension;
    game.retired = true;
    game.pensionFromSavings = source === 'savings';
    game.job = null;
    game.jobSatisfaction = 0;
    game.jobPerformance = 0;
    game.jobExperience = 0;
    game.jobLevel = null;
    addLog(
      pension
        ? [
            `You retired with a $${pension.toLocaleString()} pension.`,
            `You ended your career with a $${pension.toLocaleString()} pension.`,
            `Retirement came with a $${pension.toLocaleString()} pension.`
          ]
        : [
            'You retired.',
            'You stepped away from work.',
            'You left the workforce behind.'
          ],
      'job'
    );
  });
}
