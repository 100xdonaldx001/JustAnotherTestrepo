export function paySalaryMessages(jobTitle, earned) {
  return [
    `You worked as a ${jobTitle} and earned $${earned.toLocaleString()}.`,
    `Your job as a ${jobTitle} paid $${earned.toLocaleString()}.`,
    `Working as a ${jobTitle} brought in $${earned.toLocaleString()}.`,
    `As a ${jobTitle}, you earned $${earned.toLocaleString()}.`,
    `You pulled in $${earned.toLocaleString()} from your ${jobTitle} job.`
  ];
}

export const age5LiteracyMessages = [
  'You learned to read and write. (+Smarts)',
  'Reading and writing finally clicked for you. (+Smarts)',
  'Letters and words make sense now—you can read and write. (+Smarts)',
  'You grasped literacy and your mind grew sharper. (+Smarts)',
  'The world of words opened up to you. (+Smarts)'
];

export const age12VideoGameMessages = [
  'You discovered video games. (+Happiness, -Looks?)',
  'Video games entered your life and brought you joy. (+Happiness, -Looks?)',
  'You found the world of gaming. (+Happiness, -Looks?)',
  'Pixels and fun: you started playing video games. (+Happiness, -Looks?)',
  'A new hobby emerged—video games! (+Happiness, -Looks?)'
];

export const age16PartTimeJobMessages = [
  'You can start looking for a part-time job.',
  "It's time to search for a part-time job.",
  'A part-time job is now within reach.',
  "You're old enough for part-time work.",
  'Start hunting for a part-time job.'
];

export const age25OwnPlaceMessages = [
  'You moved into your own place. (-Money, +Happiness)',
  'A place of your own—costly but satisfying. (-Money, +Happiness)',
  'Independence! You got your own place. (-Money, +Happiness)',
  'You settled into a solo home. (-Money, +Happiness)',
  'Your own pad brings joy but drains cash. (-Money, +Happiness)'
];

export const age30ReflectionMessages = [
  'You reflected on life and grew wiser. (+Smarts)',
  'Deep thoughts made you wiser. (+Smarts)',
  'Life reflection boosted your wisdom. (+Smarts)',
  'Contemplation sharpened your mind. (+Smarts)',
  'Thinking back on life, you gained insight. (+Smarts)'
];

export const age40SplurgeMessages = [
  'A midlife splurge lifted your spirits. (-Money, +Happiness)',
  'You treated yourself midlife and felt better. (-Money, +Happiness)',
  'A costly indulgence brightened your mood. (-Money, +Happiness)',
  'Retail therapy worked wonders midlife. (-Money, +Happiness)',
  'You spent freely and cheered up. (-Money, +Happiness)'
];

export const fluMessages = [
  'You caught a nasty flu. (See Doctor)',
  'A rough flu has you down. (See Doctor)',
  "You're sick with the flu. (See Doctor)",
  'Flu symptoms hit you hard. (See Doctor)',
  'You came down with the flu. (See Doctor)'
];

export const age50HealthDeclineMessages = [
  'Aches and pains are catching up with you. (-Health)',
  'Your body aches more these days. (-Health)',
  'Nagging pains remind you of age. (-Health)',
  'Soreness creeps in as time passes. (-Health)',
  'Health is waning; aches are frequent. (-Health)'
];

export function foundWalletMessages(found) {
  return [
    `You found a wallet with $${found.toLocaleString()} inside. (+Money)`,
    `A wallet on the ground held $${found.toLocaleString()}. (+Money)`,
    `Lucky find! $${found.toLocaleString()} was in a wallet you spotted. (+Money)`,
    `You stumbled upon $${found.toLocaleString()} in a discarded wallet. (+Money)`,
    `Someone's lost wallet gave you $${found.toLocaleString()}. (+Money)`
  ];
}

export function lostWalletMessages(lost) {
  return [
    `You lost your wallet. (-$${lost.toLocaleString()})`,
    `Your wallet went missing. (-$${lost.toLocaleString()})`,
    `Misplaced wallet cost you $${lost.toLocaleString()}.`,
    `You couldn't find your wallet and $${lost.toLocaleString()} vanished.`,
    `Losing your wallet set you back $${lost.toLocaleString()}.`
  ];
}

export const chanceLearningMessages = [
  'A chance encounter taught you something new. (+Smarts)',
  'You learned something from a random meeting. (+Smarts)',
  'An unexpected meeting boosted your knowledge. (+Smarts)',
  'A random interaction broadened your mind. (+Smarts)',
  'Serendipity struck, and you learned. (+Smarts)'
];

export const alreadyDeadMessages = [
  'You are no longer alive. Start a new life.',
  'Your life has ended. Begin anew.',
  "You've passed away. A fresh start awaits.",
  'Death has come. Start over.',
  'Your journey ended. Try a new life.'
];

export const oldAgeDeathMessages = [
  'You died of old age.',
  'Old age finally claimed you.',
  'Your time came due to old age.',
  'Age caught up; you passed away.',
  'Life ended peacefully in old age.'
];

export const studyInJailMessages = [
  'You studied in jail. (+Smarts)',
  'Behind bars, you hit the books. (+Smarts)',
  'Jail time turned into study time. (+Smarts)',
  'You cracked open books in your cell. (+Smarts)',
  'Learning continued even in jail. (+Smarts)'
];

export function studyResultMessages(gain, mood) {
  return [
    `You studied hard. +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
    `Hours of study earned you +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
    `Focused studying gave you +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
    `You hit the books for +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`,
    `Diligent study boosted you by +${gain} Smarts${mood < 0 ? ` • ${mood} Happiness` : ''}.`
  ];
}

export function meditateMessages(happy, smart) {
  return [
    `You meditated. +${happy} Happiness, +${smart} Smarts.`,
    `Meditation brought +${happy} Happiness and +${smart} Smarts.`,
    `Quiet reflection added +${happy} Happiness and +${smart} Smarts.`,
    `You found peace: +${happy} Happiness, +${smart} Smarts.`,
    `Mindfulness rewarded you with +${happy} Happiness and +${smart} Smarts.`
  ];
}

export const workExtraNoJobMessages = [
  'You need a job first.',
  'Employment comes before overtime.',
  'Find a job before trying that.',
  'No job, no overtime.',
  'Secure work before attempting this.'
];

export const workExtraJailMessages = [
  'You cannot work extra while in jail.',
  'Jail time means no extra work.',
  'Behind bars, overtime is impossible.',
  'No overtime from a cell.',
  "You're locked up—no extra shifts."
];

export function workExtraResultMessages(bonus) {
  return [
    `You took overtime. Earned $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
    `Extra hours paid $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
    `Overtime brought in $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
    `You grabbed overtime for $${bonus.toLocaleString()}. (-Small Health/Happiness)`,
    `Working extra netted $${bonus.toLocaleString()}. (-Small Health/Happiness)`
  ];
}

export const hitGymJailMessages = [
  'You worked out in the yard. (+Health, +Happiness)',
  'Yard exercise boosted your stats. (+Health, +Happiness)',
  'You hit the yard for a workout. (+Health, +Happiness)',
  'Prison yard training helped you. (+Health, +Happiness)',
  'Outdoor reps in the yard lifted you. (+Health, +Happiness)'
];

export const hitGymNoMoneyMessages = [
  'Not enough money for the gym ($20).',
  "You can't afford the $20 gym fee.",
  'Cash shortage keeps you from the gym.',
  'No $20, no gym visit.',
  'Your wallet is too light for the gym.'
];

export const hitGymMessages = [
  'You hit the gym. (+Health, +Happiness)',
  'Gym time improved you. (+Health, +Happiness)',
  'A gym session boosted your stats. (+Health, +Happiness)',
  'You exercised at the gym. (+Health, +Happiness)',
  'Workout complete—feeling better. (+Health, +Happiness)'
];

export const doctorJailMessages = [
  'No access to a doctor here.',
  "You can't see a doctor from jail.",
  "Medical help isn't available here.",
  'No doctors are reachable right now.',
  'This place lacks medical care.'
];

export function doctorNoMoneyMessages(cost) {
  return [
    `Doctor visit costs $${cost}. Not enough money.`,
    `A doctor visit is $${cost}—you can't afford it.`,
    `No $${cost} for the doctor.`,
    `Funds are short for a $${cost} doctor visit.`,
    `You need $${cost} to see the doctor.`
  ];
}

export const doctorHealedMessages = [
  'The doctor treated your illness. (+Health)',
  'Medical care cured your illness. (+Health)',
  "The doctor's treatment healed you. (+Health)",
  'Care from the doctor restored you. (+Health)',
  'A doctor visit wiped out your illness. (+Health)'
];

export const doctorCheckupMessages = [
  'Routine check-up made you feel better. (+Health)',
  'A simple check-up boosted your health. (+Health)',
  "The doctor's exam refreshed you. (+Health)",
  'You felt better after a routine check. (+Health)',
  'A check-up improved your health. (+Health)'
];

export const crimeJailMessages = [
  'You are already in jail.',
  "You're currently jailed.",
  "Locked up already, you can't do that.",
  "You're already behind bars.",
  'No need for more crime; you\'re in jail.'
];

export function crimeSuccessMessages(name, amount) {
  return [
    `Crime succeeded: ${name}. You gained $${amount.toLocaleString()}.`,
    `${name} went smoothly—you got $${amount.toLocaleString()}.`,
    `Success! ${name} netted you $${amount.toLocaleString()}.`,
    `Your ${name} paid off with $${amount.toLocaleString()}.`,
    `${name} worked and earned you $${amount.toLocaleString()}.`
  ];
}

export function crimeCaughtMessages(name, years) {
  return [
    `Busted doing ${name}. You were jailed for ${years} year(s).`,
    `Caught in the act of ${name}; ${years} year(s) in jail.`,
    `${name} failed and landed you ${years} year(s) in jail.`,
    `Authorities nabbed you for ${name}; ${years} year(s) behind bars.`,
    `Your ${name} attempt backfired—${years} year(s) in jail.`
  ];
}

export function crimeInjuryMessages(name, dmg) {
  return [
    `Crime failed: ${name}. You were injured (-${dmg} Health).`,
    `${name} went wrong and you took damage (-${dmg} Health).`,
    `Failure at ${name} left you hurt (-${dmg} Health).`,
    `Injury followed a botched ${name} (-${dmg} Health).`,
    `Attempting ${name} caused harm (-${dmg} Health).`
  ];
}
