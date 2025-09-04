import { rand, clamp } from './utils.js';
import { game, saveGame, addLog } from './state.js';

const jobFields = {
  technology: {
    entry: [
      ['IT Support', 34000, 'high'],
      ['Help Desk Technician', 33000, 'none'],
      ['Junior Web Developer', 40000, 'college'],
      ['Data Entry Clerk', 30000, 'none'],
      ['QA Tester', 38000, 'high'],
      ['Computer Operator', 36000, 'high'],
      ['Technical Writer', 42000, 'college'],
      ['Junior Developer', 42000, 'college'],
      ['Computer Technician', 35000, 'trade']
    ],
    mid: [
      ['Systems Administrator', 60000, 'college'],
      ['Network Engineer', 65000, 'college'],
      ['Database Analyst', 62000, 'college'],
      ['Frontend Developer', 70000, 'college', 'Computer Science'],
      ['Backend Developer', 72000, 'college'],
      ['DevOps Engineer', 74000, 'college'],
      ['UX Designer', 68000, 'college'],
      ['Engineer', 52000, 'university'],
      ['Systems Analyst', 61000, 'college'],
      ['IT Specialist', 55000, 'trade']
    ],
    senior: [
      ['Senior Software Engineer', 90000, 'university'],
      ['IT Director', 110000, 'university'],
      ['Chief Technology Officer', 150000, 'university'],
      ['Lead Data Scientist', 125000, 'university'],
      ['Security Architect', 115000, 'university'],
      ['AI Researcher', 130000, 'university']
    ]
  },
  healthcare: {
    entry: [
      ['Medical Assistant', 32000, 'high'],
      ['Pharmacy Technician', 34000, 'high'],
      ['Certified Nursing Assistant', 31000, 'high'],
      ['Dental Assistant', 33000, 'high'],
      ['Home Health Aide', 28000, 'none'],
      ['Lab Assistant', 36000, 'college'],
      ['Medical Receptionist', 30000, 'none']
    ],
    mid: [
      ['Registered Nurse', 60000, 'college', 'Nursing'],
      ['Radiology Technician', 58000, 'college'],
      ['Physical Therapist Assistant', 50000, 'college'],
      ['Dietitian', 52000, 'college'],
      ['Occupational Therapist', 65000, 'college'],
      ['Respiratory Therapist', 54000, 'college'],
      ['Healthcare Administrator', 62000, 'college'],
      ['Nurse', 39000, 'college']
    ],
    senior: [
      ['Physician', 130000, 'university'],
      ['Surgeon', 160000, 'university'],
      ['Chief Nursing Officer', 110000, 'university'],
      ['Medical Director', 140000, 'university'],
      ['Psychiatrist', 150000, 'university'],
      ['Chief Medical Researcher', 125000, 'university']
    ]
  },
  education: {
    entry: [
      ['Teacher Aide', 28000, 'high'],
      ['Substitute Teacher', 30000, 'college'],
      ['Preschool Teacher', 32000, 'college'],
      ['Library Assistant', 29000, 'none'],
      ['Tutor', 31000, 'none'],
      ['After School Coordinator', 33000, 'high'],
      ['Admissions Assistant', 35000, 'college']
    ],
    mid: [
      ['Elementary Teacher', 45000, 'college'],
      ['High School Teacher', 47000, 'college'],
      ['School Counselor', 55000, 'college'],
      ['Librarian', 50000, 'college'],
      ['Curriculum Developer', 60000, 'college'],
      ['Academic Advisor', 52000, 'college'],
      ['Instructional Designer', 58000, 'college'],
      ['Teacher', 38000, 'college']
    ],
    senior: [
      ['School Principal', 80000, 'university'],
      ['College Professor', 90000, 'university'],
      ['Dean of Students', 95000, 'university'],
      ['District Administrator', 100000, 'university'],
      ['Vice Chancellor', 110000, 'university'],
      ['University President', 150000, 'university']
    ]
  },
  business: {
    entry: [
      ['Sales Associate', 30000, 'none'],
      ['Marketing Assistant', 35000, 'college'],
      ['Customer Service Rep', 32000, 'none'],
      ['Administrative Assistant', 34000, 'high'],
      ['Data Entry Specialist', 31000, 'none'],
      ['Junior Analyst', 38000, 'college'],
      ['HR Assistant', 36000, 'college'],
      ['Store Clerk', 21000, 'none'],
      ['Receptionist', 26000, 'high']
    ],
    mid: [
      ['Account Manager', 55000, 'college'],
      ['Business Analyst', 60000, 'college'],
      ['Project Manager', 65000, 'college'],
      ['Marketing Manager', 63000, 'college'],
      ['Operations Manager', 68000, 'college'],
      ['Financial Analyst', 62000, 'college', 'Finance'],
      ['Product Manager', 70000, 'college'],
      ['Accountant', 45000, 'college']
    ],
    senior: [
      ['Director of Operations', 90000, 'university'],
      ['Chief Financial Officer', 140000, 'university'],
      ['Chief Marketing Officer', 135000, 'university'],
      ['Senior VP Sales', 120000, 'university'],
      ['Chief Executive Officer', 180000, 'university'],
      ['Strategy Director', 110000, 'university']
    ]
  },
  art: {
    entry: [
      ['Graphic Design Intern', 28000, 'none'],
      ['Junior Graphic Designer', 32000, 'college'],
      ['Art Studio Assistant', 27000, 'none'],
      ['Photographer Assistant', 30000, 'none'],
      ['Illustrator', 33000, 'high'],
      ['Video Editor', 34000, 'college'],
      ['Junior Animator', 35000, 'college']
    ],
    mid: [
      ['Graphic Designer', 45000, 'college'],
      ['Art Director', 60000, 'college'],
      ['UX/UI Designer', 65000, 'college'],
      ['Multimedia Artist', 55000, 'college'],
      ['Production Artist', 48000, 'college'],
      ['Interior Designer', 50000, 'college'],
      ['Storyboard Artist', 52000, 'college'],
      ['Designer', 36000, 'college']
    ],
    senior: [
      ['Creative Director', 90000, 'university'],
      ['Lead Animator', 85000, 'university'],
      ['Senior UX Strategist', 95000, 'university'],
      ['Design Director', 100000, 'university'],
      ['Chief Creative Officer', 120000, 'university'],
      ['Senior Industrial Designer', 105000, 'university']
    ]
  },
  trades: {
    entry: [
      ['Apprentice Electrician', 32000, 'high'],
      ['Apprentice Plumber', 31000, 'high'],
      ['Carpenter Assistant', 30000, 'none'],
      ['Construction Laborer', 28000, 'none'],
      ['Auto Mechanic Trainee', 29000, 'high'],
      ['Welder Helper', 30000, 'high'],
      ['HVAC Trainee', 32000, 'high'],
      ['Janitor', 18000, 'none']
    ],
    mid: [
      ['Electrician', 50000, 'high'],
      ['Plumber', 48000, 'high'],
      ['Carpenter', 45000, 'high'],
      ['Auto Mechanic', 46000, 'high'],
      ['Welder', 47000, 'high'],
      ['HVAC Technician', 50000, 'high'],
      ['Machinist', 52000, 'college']
    ],
    senior: [
      ['Master Electrician', 75000, 'university'],
      ['Master Plumber', 74000, 'university'],
      ['Construction Manager', 90000, 'university'],
      ['Auto Shop Owner', 85000, 'university'],
      ['Senior HVAC Engineer', 80000, 'university'],
      ['Manufacturing Director', 95000, 'university']
    ]
  },
  hospitality: {
    entry: [
      ['Server', 26000, 'none'],
      ['Hotel Housekeeper', 25000, 'none'],
      ['Front Desk Clerk', 27000, 'none'],
      ['Barista', 22000, 'none', 1900],
      ['Host', 24000, 'none'],
      ['Line Cook', 28000, 'none'],
      ['Bellhop', 26000, 'none']
    ],
    mid: [
      ['Restaurant Manager', 45000, 'high'],
      ['Sous Chef', 40000, 'high'],
      ['Event Planner', 42000, 'college'],
      ['Hotel Manager', 50000, 'college'],
      ['Travel Agent', 38000, 'high'],
      ['Catering Manager', 46000, 'college'],
      ['Pastry Chef', 43000, 'high'],
      ['Chef', 33000, 'high']
    ],
    senior: [
      ['Executive Chef', 70000, 'university'],
      ['Resort Director', 90000, 'university'],
      ['Hospitality Director', 85000, 'university'],
      ['Senior Event Director', 80000, 'university'],
      ['Food & Beverage VP', 95000, 'university'],
      ['Chief Hotel Officer', 100000, 'university']
    ]
  },
  law: {
    entry: [
      ['Police Cadet', 32000, 'high'],
      ['Paralegal', 38000, 'college'],
      ['Court Clerk', 35000, 'college'],
      ['Firefighter', 36000, 'high'],
      ['Social Work Assistant', 30000, 'high'],
      ['Correctional Officer', 34000, 'high'],
      ['Junior Policy Analyst', 40000, 'college']
    ],
    mid: [
      ['Police Officer', 50000, 'college'],
      ['Probation Officer', 48000, 'college'],
      ['Public Relations Officer', 52000, 'college'],
      ['Social Worker', 55000, 'college'],
      ['Legal Consultant', 60000, 'college'],
      ['Urban Planner', 62000, 'college'],
      ['Public Defender', 65000, 'college'],
      ['Lawyer', 72000, 'university']
    ],
    senior: [
      ['Judge', 120000, 'university'],
      ['District Attorney', 130000, 'university'],
      ['Police Chief', 100000, 'university'],
      ['Fire Chief', 95000, 'university'],
      ['Chief Policy Advisor', 110000, 'university'],
      ['Agency Director', 115000, 'university']
    ]
  },
  science: {
    entry: [
      ['Lab Technician', 34000, 'college'],
      ['Research Assistant', 36000, 'college'],
      ['Field Technician', 32000, 'high'],
      ['Environmental Tech', 35000, 'college'],
      ['Data Analyst', 38000, 'college'],
      ['Geology Assistant', 33000, 'high'],
      ['Quality Control Tech', 34000, 'high']
    ],
    mid: [
      ['Biologist', 60000, 'college'],
      ['Chemist', 62000, 'college'],
      ['Environmental Scientist', 65000, 'college'],
      ['Geologist', 63000, 'college'],
      ['Research Scientist', 68000, 'college'],
      ['Marine Biologist', 64000, 'college'],
      ['Astronomer', 70000, 'college'],
      ['Lab Manager', 58000, 'college']
    ],
    senior: [
      ['Lead Research Scientist', 95000, 'university'],
      ['Senior Chemist', 90000, 'university'],
      ['Science Director', 110000, 'university'],
      ['Chief Environmental Scientist', 105000, 'university'],
      ['Astrophysicist', 120000, 'university'],
      ['Chief Data Scientist', 115000, 'university'],
      ['Research Director', 125000, 'masters'],
      ['Principal Investigator', 140000, 'phd']
    ]
  },
  transportation: {
    entry: [
      ['Delivery Driver', 28000, 'none'],
      ['Forklift Operator', 30000, 'none'],
      ['Bus Driver', 32000, 'high'],
      ['Taxi Driver', 29000, 'none'],
      ['Flight Attendant', 35000, 'high'],
      ['Railway Worker', 31000, 'high'],
      ['Cargo Handler', 27000, 'none'],
      ['Courier', 24000, 'none'],
      ['Driver', 28000, 'none']
    ],
    mid: [
      ['Truck Driver', 40000, 'high'],
      ['Logistics Coordinator', 45000, 'college'],
      ['Dispatcher', 42000, 'high'],
      ['Warehouse Manager', 48000, 'high'],
      ['Aviation Technician', 52000, 'college'],
      ['Railway Conductor', 46000, 'high'],
      ['Maritime Navigator', 55000, 'college'],
      ['Diesel Mechanic', 47000, 'trade']
    ],
    senior: [
      ['Airline Pilot', 120000, 'university'],
      ['Port Director', 100000, 'university'],
      ['Transport Director', 90000, 'university'],
      ['Logistics Director', 95000, 'university'],
      ['Fleet Manager', 85000, 'university'],
      ['Chief Transportation Officer', 110000, 'university']
    ]
  } 
};

const fieldDiscoveryYear = {
  technology: 1940
};

const jobDiscoveryYear = {
  'Auto Mechanic Trainee': 1890,
  'Auto Mechanic': 1890,
  'Auto Shop Owner': 1890,
  'Diesel Mechanic': 1920,
  'HVAC Trainee': 1902,
  'HVAC Technician': 1902,
  'Senior HVAC Engineer': 1902,
  'Airline Pilot': 1914,
  'Flight Attendant': 1914,
  'Aviation Technician': 1914
};

const partTimeJobs = [
  ['Barista', 22000, 'none', 1900],
  ['Retail Clerk', 20000, 'none', 1900],
  ['Tutor', 25000, 'high', 1900],
  ['Dog Walker', 18000, 'none', 1900],
  ['Library Assistant', 21000, 'none', 1900]
];

const allJobs = [];
for (const [field, levels] of Object.entries(jobFields)) {
  const fieldYear = fieldDiscoveryYear[field] || 0;
  for (const [level, jobs] of Object.entries(levels)) {
    for (const [title, base, edu, major] of jobs) {
      const availableFrom = jobDiscoveryYear[title] || fieldYear;
      allJobs.push({
        field,
        level,
        title,
        base,
        reqEdu: edu,
        reqMajor: major,
        tuitionAssistance: ['education', 'healthcare', 'law'].includes(field),
        availableFrom
      });
    }
  }
}

export function generateJobs() {
  if (game.jobListingsYear === game.year && game.jobListings.length) {
    return game.jobListings;
  }
  const options = [];
  const partTimePool = partTimeJobs.filter(j => j[3] <= game.year);
  if (game.education.current !== null && partTimePool.length) {
    for (let i = 0; i < 2; i++) {
      const job = partTimePool[rand(0, partTimePool.length - 1)];
      const salary = job[1] + rand(-1000, 3000);
      options.push({
        title: job[0],
        salary,
        reqEdu: job[2],
        field: 'partTime',
        level: 'entry',
        partTime: true
      });
    }
  }
  const econ = game.economy;
  const count = econ === 'boom' ? 8 : econ === 'recession' ? 4 : 6;
  const mod = econ === 'boom' ? 1.2 : econ === 'recession' ? 0.8 : 1;
  const jobPool = allJobs.filter(
    j => j.availableFrom <= game.year && (!j.reqMajor || j.reqMajor === game.major)
  );
  for (let i = 0; i < count && jobPool.length; i++) {
    const job = jobPool[rand(0, jobPool.length - 1)];
    const salary = Math.round((job.base + rand(-3000, 12000)) * mod);
    options.push({
      title: job.title,
      salary,
      reqEdu: job.reqEdu,
      reqMajor: job.reqMajor,
      field: job.field,
      level: job.level,
      tuitionAssistance: job.tuitionAssistance
    });
  }
  game.jobListings = options;
  game.jobListingsYear = game.year;
  saveGame();
  return options;
}

export function tickJob() {
  if (!game.job) {
    game.jobSatisfaction = 0;
    return;
  }
  if (rand(1, 100) <= 20) {
    const loss = rand(5, 15);
    game.jobSatisfaction = clamp(game.jobSatisfaction - loss);
    addLog(
      [
        `Work was stressful. Job Satisfaction -${loss}.`,
        `Rough days at work lowered your Job Satisfaction by ${loss}.`,
        `You felt burnt out at work. Job Satisfaction -${loss}.`
      ],
      'job'
    );
  }
  if (rand(1, 100) <= 5) {
    const raise = rand(1000, 5000);
    const gain = rand(10, 20);
    game.job.salary += raise;
    game.jobSatisfaction = clamp(game.jobSatisfaction + gain);
    addLog(
      [
        `You were promoted! +$${raise.toLocaleString()} salary and +${gain} Job Satisfaction.`,
        `Promotion time! Salary up $${raise.toLocaleString()}, Job Satisfaction +${gain}.`,
        `Hard work paid off with a promotion (+$${raise.toLocaleString()}, +${gain} Job Satisfaction).`
      ],
      'job'
    );
  }
  if (game.jobSatisfaction < 30) {
    const dmg = rand(1, 4);
    game.health = clamp(game.health - dmg);
    addLog(
      [
        'Your low job satisfaction is hurting your health. Consider finding a new job.',
        'Stress from your job is taking a toll on your health. Maybe it\'s time for a change.',
        'Unhappiness at work is affecting your health. Think about switching jobs.'
      ],
      'job'
    );
  }
}

export function adjustJobPerformance(activity) {
  if (!game.job) return;
  let change = rand(-3, 3);
  if (activity === 'good') {
    change += rand(1, 3);
  } else if (activity === 'bad') {
    change -= rand(1, 3);
  }
  game.jobPerformance = clamp(game.jobPerformance + change);
  if (change > 0) {
    addLog('You impressed your boss. (+Performance)', 'job');
  } else if (change < 0) {
    addLog('You slacked off at work. (-Performance)', 'job');
  }
}
