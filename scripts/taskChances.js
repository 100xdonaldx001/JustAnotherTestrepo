export const taskChances = {
  // Crime action base risk percentages
  crime: {
    pickpocket: 12, // Pickpocket risk
    shoplift: 18, // Shoplift risk
    carTheft: 35, // Car theft risk
    bankRobbery: 60, // Bank robbery risk
    burglary: 25, // Burglary risk
    fraudScheme: 30, // Fraud scheme risk
    vandalism: 15, // Vandalism risk
    assault: 40, // Assault risk
    smuggling: 45, // Smuggling risk
    arson: 50 // Arson risk
  },

  // Gambling activities
  gamble: {
    rouletteBase: 48 // Base chance to win roulette
  },

  // Racing activities
  racing: {
    vehicleBase: 50, // Base chance to win a vehicle race
    footBase: 50 // Base chance to win a foot race
  },

  // Real estate repairs
  realEstate: {
    repair10: 40, // Success chance for 10% repair investment
    repair25: 60, // Success chance for 25% repair investment
    repair50: 80, // Success chance for 50% repair investment
    repair100: 95, // Success chance for full repair investment
    sell: 80 // Chance to find a buyer when selling property
  },

  // Job-related chances
  jobs: {
    hire: 75, // Chance to be hired when applying for a job
    bonus: 80, // Chance to receive a performance bonus
    demotion: 20, // Chance of demotion when performance is poor
    freelanceSurface: 60, // Chance freelance gigs appear after unemployment
    overtimeApproval: 85 // Chance overtime requests are approved
  },

  // Doctor visit outcomes
  doctor: {
    treatIllness: 75, // Chance treatment cures your illness
    diagnoseDisease: 75 // Chance doctor finds a disease
  },

  // Health insurance plans
  health: {
    planApproval: 80 // Chance an insurance plan approves you
  },

  // Family-related actions
  family: {
    adoption: 70, // Chance adoption is approved
    birthSuccess: 90, // Chance birth results in a child
    twins: 5, // Chance a birth results in twins
    gatheringSuccess: 85, // Chance a family gathering improves relationships
    childTime: 90, // Chance a child is available to spend time
    spouseTime: 90, // Chance a spouse is available to spend time
    spouseArgue: 80 // Chance a spouse engages in an argument
  },

  // Travel actions
  travel: {
    emigrate: 75 // Chance emigration is approved
  },

  // Horse race betting
  raceTracks: {
    local: 40, // Chance to win at the local track
    regional: 30, // Chance to win at the regional track
    national: 15 // Chance to win at the national track
  },

  // Social media events
  socialMedia: {
    controversy: 10, // Chance a post causes controversy
    majorSponsorship: 20, // Chance of a big sponsorship deal
    minorSponsorship: 10 // Chance of a small sponsorship deal
  },

  // Black market outcomes
  blackMarket: {
    caught: 30, // Chance of being caught buying contraband
    fine: 50 // Chance the penalty is a fine instead of jail
  },

  // Lottery prize thresholds
  lottery: {
    standardJackpot: 0.2, // Roll threshold for standard jackpot
    standardBig: 0.01, // Roll threshold for standard big prize
    standardSmall: 0.005, // Roll threshold for standard small prize
    scratchJackpot: 0.0001, // Roll threshold for scratch-off jackpot
    scratchMid: 2, // Roll threshold for scratch-off mid prize
    scratchSmall: 5 // Roll threshold for scratch-off small prize
  },

  // Identity theft outcomes
  identity: {
    theftSuccess: 50, // Chance identity theft succeeds
    theftJail: 60 // Chance failed theft leads to jail
  },

  // Secret agent missions
  secretAgent: {
    gatherIntel: 60, // Chance gather intel mission succeeds
    sabotage: 60, // Chance sabotage mission succeeds
    assassination: 60 // Chance assassination mission succeeds
  },

  // Sports tournament
  sports: {
    tournamentBase: 50 // Base chance to win a tournament
  },

  // Banking operations
  bank: {
    loanApproval: 70 // Chance loan is approved
  },

  // Traffic events
  traffic: {
    accident: 10, // Chance of getting into an accident
    injuryOutcome: 50, // Chance accident causes injury instead of fine
    findCash: 5 // Chance to find money while commuting
  },

  // Weekend events
  weekend: {
    happiness: 40, // Chance weekend boosts happiness
    health: 35, // Chance weekend improves health
    boredom: 25 // Chance weekend is dull
  },

  // Car-related actions
  cars: {
    maintenanceSuccess: 80, // Chance scheduled maintenance succeeds
    dealDiscount: 25, // Chance to negotiate a car discount
    inStock: 85, // Chance desired car is in stock
    freeExtra: 15 // Chance dealer throws in a free extra
  },

  // Fitness activities
  gym: {
    workoutInjury: 1, // Chance of injury during a workout
    joinInjury: 1 // Chance of injury when joining the gym
  },

  // Outdoor adventures
  hiking: {
    injury: 15 // Chance of getting hurt while hiking
  },

  // Romance actions
  love: {
    findPartner: 65 // Chance to meet a new partner
  },

  // Business ventures
  business: {
    startupSuccess: 60 // Chance a new business launches successfully
  },

  // Charitable efforts
  charity: {
    publicity: 20, // Chance donation gains public recognition
    matchingDonation: 15 // Chance donation is matched by a sponsor
  },

  // Fertility treatments
  fertility: {
    iui: 25, // Success chance for intrauterine insemination
    ivf: 40, // Success chance for in vitro fertilization
    surrogacy: 90 // Success chance for surrogacy
  },

  // Legal disputes
  lawsuit: {
    fileWin: 50, // Chance of winning a filed lawsuit
    defendWin: 50 // Chance of winning when defending a lawsuit
  },

  // Pet care
  pets: {
    trainingSuccess: 70, // Chance pet training improves talent
    breedingSuccess: 60 // Chance two pets successfully breed
  },

  // Rehabilitation programs
  rehab: {
    therapySuccess: 70 // Chance a rehab therapy session helps
  },

  // Religious experiences
  religion: {
    enlightenment: 10 // Chance of a spiritual enlightenment
  },

  // Mental health therapy
  therapy: {
    sessionSuccess: 80 // Chance a therapy session is effective
  },

  // Military service
  military: {
    enlistSuccess: 80 // Chance enlistment is accepted
  },

  // Accessories purchases
  accessories: {
    purchaseSuccess: 90 // Chance accessory purchase succeeds
  },

  // Commune activities
  commune: {
    mealSuccess: 80 // Chance communal meal boosts happiness
  },

  // Childcare services
  daycare: {
    reliable: 85 // Chance daycare operates as planned
  },

  // Elder care visits
  elderCare: {
    visitSuccess: 90 // Chance a visit improves parent's health
  },

  // Property maintenance
  property: {
    suddenExpense: 15, // Chance of unexpected repair costs
    valueBoost: 10 // Chance property value increases slightly
  },

  // Insurance policies
  insurance: {
    purchaseSuccess: 80 // Chance insurance application is approved
  },

  // Luxury lifestyle purchases
  luxuryLifestyle: {
    purchaseSuccess: 90, // Chance high-end item is available
    itemAuthentic: 95 // Chance purchased item is genuine
  },

  // Plastic surgery procedures
  plasticSurgery: {
    botox: 95, // Chance botox procedure succeeds
    noseJob: 90, // Chance nose job succeeds
    liposuction: 85, // Chance liposuction succeeds
    tummyTuck: 80, // Chance tummy tuck succeeds
    faceLift: 75 // Chance face lift succeeds
  },

  // Political endeavors
  politics: {
    campaignSuccess: 50, // Chance campaign qualifies for ballot
    policyPass: 40 // Chance first policy passes after election
  },

  // Sibling interactions
  siblings: {
    hangout: 80, // Chance sibling agrees to spend time
    rivalry: 60 // Chance sibling engages in rivalry
  },

  // Horse racing events
  horseRacing: {
    raceDay: 85 // Chance race is held
  },

  // Meditation retreats
  meditationRetreat: {
    peace: 70 // Chance retreat is rejuvenating
  },

  // Pet shows
  petShow: {
    win: 40 // Chance pet wins a show
  },

  // Casinos
  casino: {
    machineWorking: 90 // Chance the slot machine works
  },

  // Substance use
  substances: {
    alcoholHospitalized: 5, // Chance drinking leads to hospitalization
    drugOverdose: 2 // Chance drug use causes overdose
  },

  // Mind and work activities
  mindAndWork: {
    meditationSuccess: 80 // Chance meditation is effective
  },

  // Movie theater outings
  movieTheater: {
    ticketAvailable: 90 // Chance show has available seats
  },

  // Salon and spa services
  salonAndSpa: {
    haircutSuccess: 90, // Chance a haircut goes well
    massageSuccess: 85 // Chance a massage is relaxing
  },

  // Shopping trips
  shopping: {
    purchaseSuccess: 90 // Chance desired item is in stock
  },

  // Zoo exhibits
  zoo: {
    exhibitOpen: 85 // Chance an exhibit is open
  },

  // Zoo trips
  zooTrip: {
    enjoyment: 80 // Chance the trip is enjoyable
  },

  // Nightlife events
  nightlife: {
    entry: 85 // Chance you get into the venue
  },

  // Outdoor lifestyles
  outdoorLifestyle: {
    campingSuccess: 75 // Chance camping trip is successful
  },

  // Prison activities
  prison: {
    exercisePermit: 80 // Chance guards allow yard exercise
  },

  // Renovation permits
  renovation: {
    permitApproval: 70 // Chance city approves renovation permit
  },

  // Vacations
  vacation: {
    enjoyment: 85 // Chance vacation is enjoyable
  },

  // Licenses
  licenses: {
    examPass: 70 // Chance you pass the license exam
  },

  // Volunteer work
  volunteerShelter: {
    accepted: 80 // Chance the shelter needs volunteers
  },

  // Estate planning
  will: {
    planSuccess: 90 // Chance will paperwork is processed
  },

  // Gang interactions
  gang: {
    join: 80, // Chance a gang lets you join
    missionSuccess: 65, // Chance a gang mission succeeds
    jailOnFail: 50 // Chance a failed mission results in jail
  },

  // Age-up random events
  ageUp: {
    learnToRead: 90, // Chance learning to read happens at age 5
    discoverGames: 90, // Chance discovering video games at age 12
    partTimeJob: 90, // Chance to receive a part-time job hint at age 16
    moveOut: 80, // Chance of moving out at age 25
    reflectWisdom: 80, // Chance of gaining wisdom at age 30
    midlifeSplurge: 80, // Chance of a midlife purchase at age 40
    militaryDraft: 5, // Chance of being drafted between 18-25
    fluBase: 8, // Base chance of catching the flu each year
    achesBase: 5, // Base chance of age-related aches after 50
    findWallet: 1, // Chance to find a wallet with cash
    loseWallet: 1, // Chance to lose your wallet
    randomInsight: 1, // Chance to randomly gain smarts
    religiousHoliday: 10, // Chance of celebrating a religious holiday
    findCoin: 10, // Chance to find loose change
    sprainAnkle: 3, // Chance to sprain your ankle
    meetMentor: 4, // Chance to meet a helpful mentor
    carBreakdown: 2, // Chance your car breaks down
    jobOffer: 2, // Chance of receiving a surprise job offer
    winContest: 1, // Chance to win a local contest
    loseFriend: 2, // Chance to lose touch with a friend
    neighborhoodParty: 3, // Chance to attend a neighborhood party
    burglaryVictim: 1, // Chance your home is burglarized
    unexpectedGift: 2, // Chance to get an unexpected gift
    minorIllness: 5, // Chance of catching a minor illness
    payRaise: 2, // Chance to receive an unexpected pay raise
    dreamSuccess: 1, // Chance a lifelong dream comes true
    applianceBreak: 4, // Chance an appliance breaks
    petRunsAway: 1, // Chance a pet runs away
    promotionOpportunity: 3, // Chance for a surprise promotion
    communityService: 2, // Chance to be invited to community service
    randomDonation: 2, // Chance to donate to a good cause
    learnHobby: 5, // Chance to pick up a new hobby
    weightGain: 6, // Chance to gain some weight
    exercisePrompt: 2, // Chance to feel the urge to exercise
    hospitalized: 1 // Chance of being hospitalized unexpectedly
  }
};

