import { rand, clamp } from '../utils.js';
import { taskChances } from '../taskChances.js';

export const randomEvents = [
  {
    key: 'foundMoney',
    chance: taskChances.randomEvents.foundMoney,
    effect(game, addLog) {
      const amount = rand(20, 200);
      game.money += amount;
      addLog(`You found $${amount.toLocaleString()} on the street. (+Money)`, 'random');
    }
  },
  {
    key: 'taxRefund',
    chance: taskChances.randomEvents.taxRefund,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You received a tax refund of $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'inheritanceGift',
    chance: taskChances.randomEvents.inheritanceGift,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A distant relative left you $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'lotteryPrize',
    chance: taskChances.randomEvents.lotteryPrize,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You won a small lottery prize of $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'freelanceBonus',
    chance: taskChances.randomEvents.freelanceBonus,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A freelance gig paid out $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'yardSaleProfit',
    chance: taskChances.randomEvents.yardSaleProfit,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You made $${amount.toLocaleString()} from a yard sale. (+Money)`, 'random');
    }
  },
  {
    key: 'cashBackReward',
    chance: taskChances.randomEvents.cashBackReward,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`Cash back rewards totaled $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'investmentDividend',
    chance: taskChances.randomEvents.investmentDividend,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`An investment dividend paid $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'refundCheck',
    chance: taskChances.randomEvents.refundCheck,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You received a refund check for $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'soldOldStuff',
    chance: taskChances.randomEvents.soldOldStuff,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You sold old items for $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'birthdayMoney',
    chance: taskChances.randomEvents.birthdayMoney,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`Birthday gifts totaled $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'rebateCheck',
    chance: taskChances.randomEvents.rebateCheck,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A rebate check arrived for $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'creditCardPoints',
    chance: taskChances.randomEvents.creditCardPoints,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`Credit card points converted to $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'carpoolSavings',
    chance: taskChances.randomEvents.carpoolSavings,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`Carpooling saved you $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'scholarshipAward',
    chance: taskChances.randomEvents.scholarshipAward,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You received a scholarship of $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'grantReceived',
    chance: taskChances.randomEvents.grantReceived,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A grant provided $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'gameShowWin',
    chance: taskChances.randomEvents.gameShowWin,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You won $${amount.toLocaleString()} on a game show. (+Money)`, 'random');
    }
  },
  {
    key: 'lawsuitSettlement',
    chance: taskChances.randomEvents.lawsuitSettlement,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A lawsuit settlement awarded you $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'overtimePay',
    chance: taskChances.randomEvents.overtimePay,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`Overtime pay added $${amount.toLocaleString()} to your income. (+Money)`, 'random');
    }
  },
  {
    key: 'neighborRepayment',
    chance: taskChances.randomEvents.neighborRepayment,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A neighbor repaid $${amount.toLocaleString()} they owed. (+Money)`, 'random');
    }
  },
  {
    key: 'classActionPayout',
    chance: taskChances.randomEvents.classActionPayout,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A class action suit paid you $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'cryptoGain',
    chance: taskChances.randomEvents.cryptoGain,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`Your crypto investment gained $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'stockSplit',
    chance: taskChances.randomEvents.stockSplit,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A stock split yielded $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'cashTips',
    chance: taskChances.randomEvents.cashTips,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You collected $${amount.toLocaleString()} in tips. (+Money)`, 'random');
    }
  },
  {
    key: 'sideGigIncome',
    chance: taskChances.randomEvents.sideGigIncome,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`A side gig earned you $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'treasureFound',
    chance: taskChances.randomEvents.treasureFound,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money += amount;
      addLog(`You found buried treasure worth $${amount.toLocaleString()}. (+Money)`, 'random');
    }
  },
  {
    key: 'lostWallet',
    chance: taskChances.randomEvents.lostWallet,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`You lost your wallet with $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'carRepairBill',
    chance: taskChances.randomEvents.carRepairBill,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A car repair cost you $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'hospitalBill',
    chance: taskChances.randomEvents.hospitalBill,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A hospital bill set you back $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'parkingTicket',
    chance: taskChances.randomEvents.parkingTicket,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A parking ticket cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'speedingFine',
    chance: taskChances.randomEvents.speedingFine,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A speeding fine cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'taxesDue',
    chance: taskChances.randomEvents.taxesDue,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Taxes came due for $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'petSurgery',
    chance: taskChances.randomEvents.petSurgery,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Pet surgery ran you $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'brokenPhone',
    chance: taskChances.randomEvents.brokenPhone,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`You replaced a broken phone for $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'scamVictim',
    chance: taskChances.randomEvents.scamVictim,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A scam cost you $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'rentIncrease',
    chance: taskChances.randomEvents.rentIncrease,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Rent increased by $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'burglaryLoss',
    chance: taskChances.randomEvents.burglaryLoss,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A burglary cost you $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'homeRepairs',
    chance: taskChances.randomEvents.homeRepairs,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Home repairs cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'dentedCar',
    chance: taskChances.randomEvents.dentedCar,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Fixing a dented car cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'charityPressure',
    chance: taskChances.randomEvents.charityPressure,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`You felt pressured to donate $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'theftVictim',
    chance: taskChances.randomEvents.theftVictim,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`You were pickpocketed for $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'applianceReplacement',
    chance: taskChances.randomEvents.applianceReplacement,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Replacing an appliance cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'utilitySpike',
    chance: taskChances.randomEvents.utilitySpike,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A utility spike cost you $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'insuranceDeductible',
    chance: taskChances.randomEvents.insuranceDeductible,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`An insurance deductible cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'lawsuitFees',
    chance: taskChances.randomEvents.lawsuitFees,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Legal fees cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'vehicleTowing',
    chance: taskChances.randomEvents.vehicleTowing,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Towing fees cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'subscriptionRenewal',
    chance: taskChances.randomEvents.subscriptionRenewal,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Subscription renewals totaled $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'loanInterest',
    chance: taskChances.randomEvents.loanInterest,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`Loan interest cost $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'lostBet',
    chance: taskChances.randomEvents.lostBet,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`You lost a bet of $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'failedInvestment',
    chance: taskChances.randomEvents.failedInvestment,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A failed investment lost you $${amount.toLocaleString()}. (-Money)`, 'random');
    }
  },
  {
    key: 'friendBorrowed',
    chance: taskChances.randomEvents.friendBorrowed,
    effect(game, addLog) {
      const amount = rand(20, 300);
      game.money = Math.max(0, game.money - amount);
      addLog(`A friend borrowed $${amount.toLocaleString()} and never paid back. (-Money)`, 'random');
    }
  },
  {
    key: 'spaDay',
    chance: taskChances.randomEvents.spaDay,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A spa day revitalized you. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'healthyMeal',
    chance: taskChances.randomEvents.healthyMeal,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`You ate a healthy meal. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'jogInPark',
    chance: taskChances.randomEvents.jogInPark,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A jog in the park boosted your energy. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'yogaSession',
    chance: taskChances.randomEvents.yogaSession,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A yoga session centered your body. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'doctorCheckup',
    chance: taskChances.randomEvents.doctorCheckup,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A routine checkup improved your health. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'vitaminBoost',
    chance: taskChances.randomEvents.vitaminBoost,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Vitamins gave you extra vitality. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'massageTherapy',
    chance: taskChances.randomEvents.massageTherapy,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Massage therapy relaxed your muscles. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'meditationRetreat',
    chance: taskChances.randomEvents.meditationRetreat,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Meditation cleared your mind. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'earlyNightSleep',
    chance: taskChances.randomEvents.earlyNightSleep,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`An early night of sleep felt great. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'natureHike',
    chance: taskChances.randomEvents.natureHike,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A nature hike refreshed you. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'gymAchievement',
    chance: taskChances.randomEvents.gymAchievement,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`You hit a new gym milestone. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'fluShot',
    chance: taskChances.randomEvents.fluShot,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A flu shot kept you strong. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'dentalCleaning',
    chance: taskChances.randomEvents.dentalCleaning,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A dental cleaning made you feel healthier. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'beachVacation',
    chance: taskChances.randomEvents.beachVacation,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A beach vacation recharged you. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'laughterTherapy',
    chance: taskChances.randomEvents.laughterTherapy,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A good laugh boosted your wellbeing. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'quitSmoking',
    chance: taskChances.randomEvents.quitSmoking,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`You made progress quitting smoking. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'hydrationKick',
    chance: taskChances.randomEvents.hydrationKick,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Drinking water made you feel great. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'newBike',
    chance: taskChances.randomEvents.newBike,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Riding a new bike energized you. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'stretchingRoutine',
    chance: taskChances.randomEvents.stretchingRoutine,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A stretching routine helped your body. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'stressFreeWeek',
    chance: taskChances.randomEvents.stressFreeWeek,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A stress-free week improved your health. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'danceClass',
    chance: taskChances.randomEvents.danceClass,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A dance class kept you active. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'farmersMarket',
    chance: taskChances.randomEvents.farmersMarket,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Fresh food from the market helped. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'groupSport',
    chance: taskChances.randomEvents.groupSport,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Playing a group sport boosted fitness. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'petTherapy',
    chance: taskChances.randomEvents.petTherapy,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`Time with a pet warmed your heart. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'gardeningDay',
    chance: taskChances.randomEvents.gardeningDay,
    effect(game, addLog) {
      const gain = rand(1, 5);
      game.health = clamp(game.health + gain);
      addLog(`A day of gardening invigorated you. (+${gain} Health)`, 'random');
    }
  },
  {
    key: 'sprainedAnkle',
    chance: taskChances.randomEvents.sprainedAnkle,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`You sprained your ankle. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'caughtFlu',
    chance: taskChances.randomEvents.caughtFlu,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`You caught the flu. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'foodPoisoning',
    chance: taskChances.randomEvents.foodPoisoning,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Food poisoning made you sick. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'minorCarAccident',
    chance: taskChances.randomEvents.minorCarAccident,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A minor car accident bruised you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'overworked',
    chance: taskChances.randomEvents.overworked,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Being overworked drained you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'allergicReaction',
    chance: taskChances.randomEvents.allergicReaction,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`An allergic reaction hit you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'sunburn',
    chance: taskChances.randomEvents.sunburn,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`You got a painful sunburn. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'slippedDisc',
    chance: taskChances.randomEvents.slippedDisc,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`You slipped a disc. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'coldSnap',
    chance: taskChances.randomEvents.coldSnap,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A cold snap gave you chills. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'hangover',
    chance: taskChances.randomEvents.hangover,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A hangover slowed you down. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'insectBites',
    chance: taskChances.randomEvents.insectBites,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Insect bites irritated you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'stomachBug',
    chance: taskChances.randomEvents.stomachBug,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A stomach bug hit hard. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'pulledMuscle',
    chance: taskChances.randomEvents.pulledMuscle,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`You pulled a muscle. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'hikingFall',
    chance: taskChances.randomEvents.hikingFall,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`You fell while hiking. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'burnout',
    chance: taskChances.randomEvents.burnout,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Burnout took its toll. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'dehydration',
    chance: taskChances.randomEvents.dehydration,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Dehydration weakened you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'lateNightOut',
    chance: taskChances.randomEvents.lateNightOut,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A late night out exhausted you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'stressFracture',
    chance: taskChances.randomEvents.stressFracture,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A stress fracture slowed you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'minorSurgeryRecovery',
    chance: taskChances.randomEvents.minorSurgeryRecovery,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Recovery from minor surgery hurt. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'toothache',
    chance: taskChances.randomEvents.toothache,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A toothache bothered you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'insomnia',
    chance: taskChances.randomEvents.insomnia,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Insomnia wore you down. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'foodAllergy',
    chance: taskChances.randomEvents.foodAllergy,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A food allergy flared up. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'kneePain',
    chance: taskChances.randomEvents.kneePain,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Your knee started hurting. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'migraine',
    chance: taskChances.randomEvents.migraine,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`A migraine ruined your day. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'backPain',
    chance: taskChances.randomEvents.backPain,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`Back pain limited you. (-${loss} Health)`, 'random');
    }
  },
  {
    key: 'sprainedWrist',
    chance: taskChances.randomEvents.sprainedWrist,
    effect(game, addLog) {
      const loss = rand(1, 5);
      game.health = clamp(game.health - loss);
      addLog(`You sprained your wrist. (-${loss} Health)`, 'random');
    }
  },
];

export function rollRandomEvent(game, addLog) {
  for (const event of randomEvents) {
    if (Math.random() <= event.chance) {
      event.effect(game, addLog);
      return event.key;
    }
  }
  return null;
}
