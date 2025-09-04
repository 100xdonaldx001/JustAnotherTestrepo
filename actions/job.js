import { game, addLog, saveGame, applyAndSave } from '../state.js';
import { rand, clamp } from '../utils.js';
import { adjustJobPerformance, generateJobs, freelanceJobs } from '../jobs.js';
import { checkForAccident } from './traffic.js';

function commute() {
  if (game.car) {
    checkForAccident();
  }
}

export function paySalary() {
  if (game.job && !game.inJail) {
    commute();
    adjustJobPerformance();
    const monthly = game.job.salary / 12;
    const months = rand(10, 12);
    let earned = Math.round(monthly * months);
    if (game.jobPerformance >= 80) {
      const bonus = Math.round(earned * 0.2);
      earned += bonus;
      addLog('Your high performance earned you a bonus.', 'job');
    } else if (game.jobPerformance <= 20 && rand(1, 100) <= 20) {
      game.job.salary = Math.round(game.job.salary * 0.9);
      addLog('Poor performance led to a demotion and pay cut.', 'job');
    }
    game.money += earned;
    game.job.experience = (game.job.experience || 0) + (game.job.expMultiplier || 1);
    addLog([
      `You worked as a ${game.job.title} and earned $${earned.toLocaleString()}.`,
      `Your job as a ${game.job.title} paid $${earned.toLocaleString()}.`,
      `Working as a ${game.job.title} brought in $${earned.toLocaleString()}.`,
      `As a ${game.job.title}, you earned $${earned.toLocaleString()}.`,
      `You pulled in $${earned.toLocaleString()} from your ${game.job.title} job.`
    ], 'job');
    game.unemployment = 0;
  } else if (!game.inJail) {
    game.unemployment = (game.unemployment || 0) + 1;
    if (game.unemployment >= 2) {
      const listings = generateJobs();
      if (!listings.some(j => j.field === 'freelance')) {
        const gig = freelanceJobs[rand(0, freelanceJobs.length - 1)];
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
        addLog('Freelance gigs surfaced due to prolonged unemployment.', 'job');
      }
    }
  }
}

export function tickEconomy() {
  if (rand(1, 5) === 1) {
    const states = ['boom', 'normal', 'recession'];
    const next = states[rand(0, states.length - 1)];
    if (next !== game.economy) {
      game.economy = next;
      game.jobListings = [];
      addLog(`The economy shifted to a ${next}.`, 'economy');
    }
  }
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

