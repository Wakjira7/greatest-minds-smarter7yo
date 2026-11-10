export type SubjectCategory =
  | 'Math & Logic'
  | 'Science & Nature'
  | 'World & Space'
  | 'Words & Spelling'
  | 'Playground Riddles'
  | 'Everyday Traps';

export interface KidClassmate {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatarEmoji: string;
  hatEmoji: string;
  propEmoji: string;
  favoriteSubject: SubjectCategory;
  accuracyRate: number; // e.g. 0.94
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  tagline: string;
  greetingQuote: string;
  correctCheers: string[];
  wrongRoasts: string[];
}

export interface TriviaQuestion7Yo {
  id: string;
  subject: SubjectCategory;
  gradeLevel: 'Kindergarten' | '1st Grade' | '2nd Grade' | '7-Year-Old Genius';
  difficultyRung: number; // 1 to 10
  adultFailRatePct: number; // e.g. 78% of adults get this wrong!
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  kidPeekNote: string;
  kidRoastOnMiss: string;
  funFact: string;
}

export interface LadderRung {
  rung: number;
  prizeLabel: string;
  pointsValue: number;
  gradeTitle: string;
  isSafeHaven?: boolean;
  badgeEmoji: string;
}

export const PRIZE_LADDER: LadderRung[] = [
  {
    rung: 1,
    prizeLabel: '$100',
    pointsValue: 100,
    gradeTitle: 'Kindergarten Gold Star',
    badgeEmoji: '⭐',
  },
  {
    rung: 2,
    prizeLabel: '$500',
    pointsValue: 500,
    gradeTitle: '1st Grade Finger-Paint Pro',
    badgeEmoji: '🖍️',
  },
  {
    rung: 3,
    prizeLabel: '$1,000',
    pointsValue: 1000,
    gradeTitle: 'Recess Hopscotch Champ',
    badgeEmoji: '👟',
  },
  {
    rung: 4,
    prizeLabel: '$5,000',
    pointsValue: 5000,
    gradeTitle: 'Spelling Bee Finalist',
    badgeEmoji: '🐝',
  },
  {
    rung: 5,
    prizeLabel: '$25,000',
    pointsValue: 25000,
    gradeTitle: 'SAFE HAVEN: Certified 2nd Grader',
    isSafeHaven: true,
    badgeEmoji: '🛡️',
  },
  {
    rung: 6,
    prizeLabel: '$50,000',
    pointsValue: 50000,
    gradeTitle: 'Science Fair Volcano Winner',
    badgeEmoji: '🌋',
  },
  {
    rung: 7,
    prizeLabel: '$100,000',
    pointsValue: 100000,
    gradeTitle: 'Homework Club Captain',
    badgeEmoji: '📐',
  },
  {
    rung: 8,
    prizeLabel: '$250,000',
    pointsValue: 250000,
    gradeTitle: "Principal's Honor Roll",
    badgeEmoji: '🏅',
  },
  {
    rung: 9,
    prizeLabel: '$500,000',
    pointsValue: 500000,
    gradeTitle: '7-Year-Old Olympiad Prodigy',
    badgeEmoji: '🧠',
  },
  {
    rung: 10,
    prizeLabel: '$1,000,000',
    pointsValue: 1000000,
    gradeTitle: 'SUPREME 7-YEAR-OLD GENIUS',
    isSafeHaven: true,
    badgeEmoji: '👑',
  },
];

export const KID_CLASSMATES: KidClassmate[] = [
  {
    id: 'leo-math',
    name: 'Leo',
    age: 7,
    grade: '2nd Grade Honor Roll',
    avatarEmoji: '👦🏽',
    hatEmoji: '🎓',
    propEmoji: '🧮',
    favoriteSubject: 'Math & Logic',
    accuracyRate: 0.95,
    accentColor: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.16)',
    accentBorder: 'rgba(245, 158, 11, 0.45)',
    tagline: 'Human Calculator & Chess Club Captain',
    greetingQuote:
      "Hi! I'm Leo, I'm 7 and a half! Don't worry, if the numbers get scary, you can peek at my notebook!",
    correctCheers: [
      'BOOM! High-five! We crushed that like recess dodgeball!',
      'Whoa, you actually knew that one! My teacher Mrs. Gable would give you a gold sticker!',
      'Easy peasy lemon squeezy! Next rung, let’s gooo!',
    ],
    wrongRoasts: [
      'Uhhh... did you forget to carry the one, or did you skip 2nd grade?!',
      'My little brother is 4 and even HE didn’t pick that answer!',
      'Oof! Should have copied my paper when you had the chance!',
    ],
  },
  {
    id: 'maya-science',
    name: 'Maya',
    age: 7,
    grade: '2nd Grade Science Club',
    avatarEmoji: '👧🏻',
    hatEmoji: '🔬',
    propEmoji: '🦖',
    favoriteSubject: 'Science & Nature',
    accuracyRate: 0.94,
    accentColor: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.16)',
    accentBorder: 'rgba(16, 185, 129, 0.45)',
    tagline: 'Dinosaur Expert & Bug Collector',
    greetingQuote:
      "I'm Maya! I have 14 plastic dinosaurs in my backpack and I know EVERY animal fact!",
    correctCheers: [
      'DINO-MITE! T-Rex roar for that brain of yours!! 🦖',
      'Spot on! You’re almost as smart as my pet turtle Barnaby!',
      ' Correct! That’s 100% certified 2nd-grade science power!',
    ],
    wrongRoasts: [
      'Wait... did you really just guess that?! Even a sleepy sloth knows the right answer!',
      'Uh-oh! Looks like someone slept through elementary school nature class!',
      'BZZZZT! My pet hamster Barnaby is shaking his head at you right now!',
    ],
  },
  {
    id: 'toby-world',
    name: 'Toby',
    age: 7,
    grade: '2nd Grade Geography Bee',
    avatarEmoji: '👦🏻',
    hatEmoji: '🚀',
    propEmoji: '🌍',
    favoriteSubject: 'World & Space',
    accuracyRate: 0.93,
    accentColor: '#38BDF8',
    accentBg: 'rgba(56, 189, 248, 0.16)',
    accentBorder: 'rgba(56, 189, 248, 0.45)',
    tagline: 'Future Astronaut & Globe Spinner',
    greetingQuote:
      "Blast off! I'm Toby! I memorized all the planets, oceans, and continents before bedtime!",
    correctCheers: [
      'Houston, we have a GENIUS! Out of this world!! 🚀',
      'Bingo! You navigated that question like a Mars Rover!',
      'Nailed it! Give me a cosmic fist bump!',
    ],
    wrongRoasts: [
      'Houston, we have a BIG problem... with your answer! 😂',
      'Are you from another planet?! Because on Earth, 7-year-olds know that one!',
      'Whoopsie! You just flew your rocket straight into an asteroid of wrongness!',
    ],
  },
  {
    id: 'chloe-words',
    name: 'Chloe',
    age: 7,
    grade: '2nd Grade Spelling Queen',
    avatarEmoji: '👧🏾',
    hatEmoji: '👑',
    propEmoji: '🐝',
    favoriteSubject: 'Words & Spelling',
    accuracyRate: 0.96,
    accentColor: '#EC4899',
    accentBg: 'rgba(236, 72, 153, 0.16)',
    accentBorder: 'rgba(236, 72, 153, 0.45)',
    tagline: 'Undefeated Spelling Bee Champion',
    greetingQuote:
      "Hiya! I'm Chloe! I read 42 chapter books this year. Read the questions carefully—adults always rush!",
    correctCheers: [
      'A-W-E-S-O-M-E! That spells AWESOME! Gold star for you!',
      'Ooh, look at the big brain on the grown-up! Nicely done!',
      'Yay!! We make the best study buddies ever!',
    ],
    wrongRoasts: [
      'F-A-I-L! Sound it out next time, grown-up!',
      'Hehehe! You fell right into the grammar trap! Classic adult mistake!',
      'Oh honey... do I need to lend you my 1st-grade phonics flashcards?',
    ],
  },
  {
    id: 'zane-riddles',
    name: 'Zane',
    age: 7,
    grade: '2nd Grade Prank & Riddle Boss',
    avatarEmoji: '👦🏼',
    hatEmoji: '🧢',
    propEmoji: '🛹',
    favoriteSubject: 'Playground Riddles',
    accuracyRate: 0.92,
    accentColor: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.16)',
    accentBorder: 'rgba(168, 85, 247, 0.45)',
    tagline: 'Master of Trick Questions & Brain Teasers',
    greetingQuote:
      "Sup! I'm Zane! Grown-ups overthink EVERYTHING. Think like a 7-year-old or you're gonna get tricked!",
    correctCheers: [
      'SICK!! You didn’t fall for the adult brain-trap! Respect! 🛹',
      'Whoa, you’re actually street-smart! Kickflip celebration!',
      'Let’s gooo! You beat the trick question!',
    ],
    wrongRoasts: [
      'GOTCHA!! 😂 90% of grown-ups fall for that exact trap!',
      'Bahaha! You overthought it! A 7-year-old gets that in 2 seconds!',
      'Wipeout!! Your adult brain just did a belly-flop on the playground!',
    ],
  },
];

export const SUBJECT_CATEGORIES: Array<{
  id: SubjectCategory;
  emoji: string;
  color: string;
  shortDesc: string;
}> = [
  {
    id: 'Playground Riddles',
    emoji: '🧩',
    color: '#A855F7',
    shortDesc: 'Trick questions kids ace & adults fail',
  },
  {
    id: 'Math & Logic',
    emoji: '🧮',
    color: '#F59E0B',
    shortDesc: '2nd-grade number traps & mental math',
  },
  {
    id: 'Science & Nature',
    emoji: '🦖',
    color: '#10B981',
    shortDesc: 'Animals, human body & dino facts',
  },
  {
    id: 'World & Space',
    emoji: '🌍',
    color: '#38BDF8',
    shortDesc: 'Planets, continents & ocean wonders',
  },
  {
    id: 'Words & Spelling',
    emoji: '🐝',
    color: '#EC4899',
    shortDesc: 'Spelling traps, opposites & wordplay',
  },
  {
    id: 'Everyday Traps',
    emoji: '🎨',
    color: '#FB7185',
    shortDesc: 'Colors, shapes, clocks & common sense',
  },
];

export const TRIVIA_QUESTIONS_7YO: TriviaQuestion7Yo[] = [
  // RUNG 1 — Warmup Kindergarten / 1st Grade
  {
    id: 'q-race-2nd',
    subject: 'Playground Riddles',
    gradeLevel: '1st Grade',
    difficultyRung: 1,
    adultFailRatePct: 68,
    question:
      'You are running in a schoolyard race and you pass the person in 2nd place! What place are you in right now?',
    options: ['1st Place', '2nd Place', '3rd Place', 'Tied for 1st'],
    correctIndex: 1,
    kidPeekNote:
      'Wait! Don’t pick 1st! If you pass the 2nd place runner, you take THEIR spot—so you are in 2nd place!',
    kidRoastOnMiss:
      'Haha! If you passed 2nd place, the 1st place kid is STILL ahead of you! You’re in 2nd!',
    funFact:
      'Over 65% of adults blurt out "1st place" under timer pressure, while kids visualize the runners on the track!',
  },
  {
    id: 'q-paint-mix',
    subject: 'Everyday Traps',
    gradeLevel: 'Kindergarten',
    difficultyRung: 1,
    adultFailRatePct: 22,
    question:
      'In art class, if you mix YELLOW paint and BLUE paint together, what color do you get?',
    options: ['Purple', 'Orange', 'Green', 'Brown'],
    correctIndex: 2,
    kidPeekNote:
      'Yellow + Blue makes GREEN like grass! Red + Blue is the one that makes purple!',
    kidRoastOnMiss:
      'Did you never finger-paint in kindergarten?! Yellow and blue make GREEN!',
    funFact:
      'Yellow and Blue are primary subtractive pigments that reflect green wavelengths when mixed.',
  },
  {
    id: 'q-spider-legs',
    subject: 'Science & Nature',
    gradeLevel: 'Kindergarten',
    difficultyRung: 1,
    adultFailRatePct: 18,
    question: 'How many legs does a spider have?',
    options: ['6 legs', '8 legs', '10 legs', '12 legs'],
    correctIndex: 1,
    kidPeekNote:
      'Insects have 6 legs, but spiders are arachnids—they have 8 legs!',
    kidRoastOnMiss:
      'Count ’em! Spiders have 8 creepy-crawly legs! Bugs have 6!',
    funFact:
      'All arachnids (spiders, scorpions, ticks) have 8 legs, while insects always have 6.',
  },

  // RUNG 2 — 1st Grade
  {
    id: 'q-months-28',
    subject: 'Playground Riddles',
    gradeLevel: '1st Grade',
    difficultyRung: 2,
    adultFailRatePct: 79,
    question: 'How many months of the year have 28 days?',
    options: [
      'Only 1 (February)',
      '2 months',
      '6 months',
      'All 12 months!',
    ],
    correctIndex: 3,
    kidPeekNote:
      'Psst! It’s a trick! EVERY month has at least 28 days—January has 28, March has 28, all 12 do!',
    kidRoastOnMiss:
      'GOTCHA!! You picked February, didn’t you?! Every single month has a 28th day in it!',
    funFact:
      'Nearly 4 out of 5 adults immediately tap "Only 1 (February)" because their brains substitute "only 28 days" for "have 28 days."',
  },
  {
    id: 'q-farmer-sheep',
    subject: 'Math & Logic',
    gradeLevel: '1st Grade',
    difficultyRung: 2,
    adultFailRatePct: 74,
    question:
      'A farmer has 17 fluffy sheep. A thunderstorm hits and ALL BUT 9 run away! How many sheep does the farmer have left?',
    options: ['8 sheep', '9 sheep', '17 sheep', '26 sheep'],
    correctIndex: 1,
    kidPeekNote:
      'Don’t subtract 17 - 9! Read the words: "ALL BUT 9" ran away—that means 9 stayed!',
    kidRoastOnMiss:
      'Bahaha! You did 17 minus 9 = 8, didn’t you?! "All but 9" means 9 sheep are still standing there!',
    funFact:
      'Adults automatically trigger arithmetic subtraction when they see two numbers, whereas kids listen to the story!',
  },
  {
    id: 'q-stop-sign',
    subject: 'Everyday Traps',
    gradeLevel: '1st Grade',
    difficultyRung: 2,
    adultFailRatePct: 35,
    question: 'A red STOP sign on the street is an octagon. How many sides does it have?',
    options: ['6 sides', '7 sides', '8 sides', '10 sides'],
    correctIndex: 2,
    kidPeekNote:
      'Think of an OCTO-pus with 8 arms! An OCTA-gon has 8 sides!',
    kidRoastOnMiss:
      'You drive past stop signs every day and didn’t know an octagon has 8 sides?!',
    funFact:
      'Octa comes from the Greek "okto" meaning eight—just like octopus and octave!',
  },

  // RUNG 3 — 1st / 2nd Grade
  {
    id: 'q-rooster-egg',
    subject: 'Playground Riddles',
    gradeLevel: '1st Grade',
    difficultyRung: 3,
    adultFailRatePct: 81,
    question:
      'A rooster sits on the exact pointed peak of a barn roof facing north. A strong wind blows west. If the rooster lays an egg, which way does the egg roll?',
    options: [
      'It rolls West with the wind',
      'It rolls East against the wind',
      'It rolls South down the shingles',
      'Nowhere—roosters don’t lay eggs!',
    ],
    correctIndex: 3,
    kidPeekNote:
      'Hehehe! Roosters are BOY chickens! Only HENS lay eggs!',
    kidRoastOnMiss:
      'BWAHAHA! You were calculating wind speed for a ROOSTER?! Roosters are boys—they don’t lay eggs!!',
    funFact:
      'Adding irrelevant physics details ("facing north", "wind blows west") tricks adult brains into ignoring the word "rooster."',
  },
  {
    id: 'q-flying-mammal',
    subject: 'Science & Nature',
    gradeLevel: '2nd Grade',
    difficultyRung: 3,
    adultFailRatePct: 41,
    question:
      'Which of these animals is the ONLY mammal in the world that can truly fly?',
    options: ['Flying Squirrel', 'Bat', 'Ostrich', 'Puffin'],
    correctIndex: 1,
    kidPeekNote:
      'Flying squirrels only glide! Bats have fur, drink milk as babies, and truly fly!',
    kidRoastOnMiss:
      'Flying squirrels just parachute-glide from trees! BATS are the only flying mammals!',
    funFact:
      'Bats belong to the order Chiroptera ("hand-wing") and make up about 20% of all mammal species on Earth.',
  },
  {
    id: 'q-spell-incorrectly',
    subject: 'Words & Spelling',
    gradeLevel: '2nd Grade',
    difficultyRung: 3,
    adultFailRatePct: 72,
    question: 'Which word is ALWAYS spelled "incorrectly" in every single dictionary?',
    options: [
      'Misspelled',
      'Wednesday',
      'The word "Incorrectly"',
      'Rhythm',
    ],
    correctIndex: 2,
    kidPeekNote:
      'Look at the quotation marks! The word "INCORRECTLY" is literally spelled I-N-C-O-R-R-E-C-T-L-Y!',
    kidRoastOnMiss:
      'Hehe! The word "incorrectly" is ALWAYS spelled "incorrectly"!',
    funFact:
      'Classic 2nd-grade wordplay! Children spot literal self-referential riddles twice as fast as adults.',
  },

  // RUNG 4 — 2nd Grade
  {
    id: 'q-pound-feathers',
    subject: 'Science & Nature',
    gradeLevel: '2nd Grade',
    difficultyRung: 4,
    adultFailRatePct: 54,
    question: 'Which weighs more: 1 pound of fluffy goose feathers, or 1 pound of heavy red bricks?',
    options: [
      '1 pound of bricks',
      '1 pound of feathers',
      'They weigh the exact same!',
      'Depends on gravity',
    ],
    correctIndex: 2,
    kidPeekNote:
      '1 pound is 1 pound! The feathers just take up a bigger bag, but they weigh the SAME!',
    kidRoastOnMiss:
      'Wait... you fell for the oldest playground trick in history?! A pound equals a pound!',
    funFact:
      'Both equal exactly 16 ounces (453.6 grams)—only their density and volume differ!',
  },
  {
    id: 'q-octopus-hearts',
    subject: 'Science & Nature',
    gradeLevel: '2nd Grade',
    difficultyRung: 4,
    adultFailRatePct: 62,
    question: 'We humans have 1 heart. How many hearts does a giant Pacific octopus have?',
    options: ['1 heart', '2 hearts', '3 hearts', '8 hearts'],
    correctIndex: 2,
    kidPeekNote:
      'I learned this on Nat Geo Kids! An octopus has 8 arms, 9 brains, and THREE hearts!',
    kidRoastOnMiss:
      'Nope! An octopus has THREE hearts! Two pump blood to the gills and one pumps to the body!',
    funFact:
      'Octopuses have 3 hearts and blue, copper-rich blood that helps them survive in chilly ocean depths.',
  },
  {
    id: 'q-largest-ocean',
    subject: 'World & Space',
    gradeLevel: '2nd Grade',
    difficultyRung: 4,
    adultFailRatePct: 38,
    question: 'What is the largest and deepest ocean on planet Earth?',
    options: [
      'Atlantic Ocean',
      'Indian Ocean',
      'Pacific Ocean',
      'Arctic Ocean',
    ],
    correctIndex: 2,
    kidPeekNote:
      'The PACIFIC Ocean is so gigantic that all the continents could fit inside it!',
    kidRoastOnMiss:
      'Look at my desk globe! The Pacific Ocean covers more than 30% of the entire Earth!',
    funFact:
      'The Pacific Ocean spans over 63 million square miles—larger than all of Earth’s land combined!',
  },

  // RUNG 5 — SAFE HAVEN ($25,000)
  {
    id: 'q-apples-take-away',
    subject: 'Math & Logic',
    gradeLevel: '2nd Grade',
    difficultyRung: 5,
    adultFailRatePct: 83,
    question:
      'There is a bowl on the cafeteria table with 6 shiny red apples. You pick up and take away 4 apples. How many apples do YOU have?',
    options: ['2 apples', '4 apples', '6 apples', '10 apples'],
    correctIndex: 1,
    kidPeekNote:
      'Read the last three words: "How many do YOU have?" If you took 4 apples in your hands, YOU have 4 apples!',
    kidRoastOnMiss:
      'GOTCHA AGAIN! 2 apples are left in the bowl, but YOU took 4 apples—so YOU have 4!',
    funFact:
      '83% of adults answer "2" because they calculate what remains in the bowl instead of what they are holding.',
  },
  {
    id: 'q-caterpillar-change',
    subject: 'Science & Nature',
    gradeLevel: '2nd Grade',
    difficultyRung: 5,
    adultFailRatePct: 34,
    question:
      'What is the big 2nd-grade science word for when a caterpillar transforms into a butterfly inside a chrysalis?',
    options: [
      'Photosynthesis',
      'Metamorphosis',
      'Hibernation',
      'Evaporation',
    ],
    correctIndex: 1,
    kidPeekNote:
      'Plants do photosynthesis! Caterpillars turning into butterflies is META-MOR-PHO-SIS!',
    kidRoastOnMiss:
      'Photosynthesis is how plants eat sunlight! Caterpillars do METAMORPHOSIS!',
    funFact:
      'Inside the chrysalis, a caterpillar actually dissolves most of its tissues and rebuilds itself using "imaginal discs."',
  },
  {
    id: 'q-vowel-count',
    subject: 'Words & Spelling',
    gradeLevel: '2nd Grade',
    difficultyRung: 5,
    adultFailRatePct: 48,
    question:
      'How many total vowels (A, E, I, O, U) are in the word "CAULIFLOWER"?',
    options: ['3 vowels', '4 vowels', '5 vowels', '6 vowels'],
    correctIndex: 2,
    kidPeekNote:
      'Count ’em on your fingers: c-A-U-l-I-f-l-O-w-E-r! A, U, I, O, E—that’s 5 vowels!',
    kidRoastOnMiss:
      'Count slowly! C-A-U-L-I-F-L-O-W-E-R has A, U, I, O, and E—5 vowels!',
    funFact:
      'Cauliflower and "education" are two of the rare everyday words that contain all 5 standard English vowels once!',
  },

  // RUNG 6 — $50,000
  {
    id: 'q-bus-driver',
    subject: 'Playground Riddles',
    gradeLevel: '2nd Grade',
    difficultyRung: 6,
    adultFailRatePct: 86,
    question:
      'IMAGINE YOU are driving a yellow school bus! At Stop 1, 6 kids get on. At Stop 2, 3 kids get off and 5 get on. What color are the bus driver’s eyes?',
    options: [
      'Blue',
      'Hazel',
      'Whatever color YOUR eyes are!',
      'Not enough information',
    ],
    correctIndex: 2,
    kidPeekNote:
      'Look at the very first words: "IMAGINE YOU are driving a yellow school bus!" YOU are the bus driver!',
    kidRoastOnMiss:
      'Bahaha! You were doing bus math when the first sentence literally said YOU are the driver!!',
    funFact:
      'This is the #1 schoolbus riddle worldwide—adults focus so hard on tracking passenger numbers they forget the opening premise.',
  },
  {
    id: 'q-venus-spin',
    subject: 'World & Space',
    gradeLevel: '2nd Grade',
    difficultyRung: 6,
    adultFailRatePct: 69,
    question:
      'Which planet in our Solar System is the HOTTEST planet AND spins backwards (clockwise)?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correctIndex: 1,
    kidPeekNote:
      'Mercury is closest to the Sun, so adults pick it—but VENUS has thick clouds that trap heat, making Venus hotter AND it spins backwards!',
    kidRoastOnMiss:
      'Aha! You picked Mercury because it’s first, right?! Venus is hotter because of its greenhouse atmosphere!',
    funFact:
      'Venus reaches 900°F (475°C)—hot enough to melt lead—and rotates backwards so the Sun rises in the west!',
  },
  {
    id: 'q-quarters-in-3-dollars',
    subject: 'Math & Logic',
    gradeLevel: '2nd Grade',
    difficultyRung: 6,
    adultFailRatePct: 44,
    question:
      'If I want to buy a $3.50 ice cream cone from the lunch truck using only QUARTERS (25¢ coins), how many quarters do I need?',
    options: ['10 quarters', '12 quarters', '14 quarters', '16 quarters'],
    correctIndex: 2,
    kidPeekNote:
      '4 quarters make $1.00! So $3.00 is 12 quarters, plus 2 more quarters for 50 cents = 14 quarters!',
    kidRoastOnMiss:
      'Hey, don’t let the ice cream man shortchange you! 4 × 3 is 12, plus 2 is 14 quarters!',
    funFact:
      'Coin counting in 2nd grade teaches base-25 chunking, a skill adults lose after switching to tap-to-pay cards!',
  },

  // RUNG 7 — $100,000
  {
    id: 'q-towel-riddle',
    subject: 'Playground Riddles',
    gradeLevel: '2nd Grade',
    difficultyRung: 7,
    adultFailRatePct: 58,
    question: 'What household item gets WETTER and wetter the more it DRIES?',
    options: ['A sponge in the ocean', 'A bath towel', 'An ice cube', 'A hair dryer'],
    correctIndex: 1,
    kidPeekNote:
      'When you get out of the bath, your TOWEL dries your skin—and gets wetter the more it dries!',
    kidRoastOnMiss:
      'It’s a bath towel! As it dries you off, it gets wetter!',
    funFact:
      'Double-meaning verbs ("dries" as transitive vs. intransitive) are a favorite 2nd-grade riddle mechanic.',
  },
  {
    id: 'q-shark-bones',
    subject: 'Science & Nature',
    gradeLevel: '2nd Grade',
    difficultyRung: 7,
    adultFailRatePct: 77,
    question: 'How many hard BONES does a Great White Shark have in its entire body?',
    options: ['Zero (0 bones!)', '42 bones', '206 bones', '312 bones'],
    correctIndex: 0,
    kidPeekNote:
      'ZERO!! Sharks don’t have ANY bones! Their whole skeleton is made of squishy cartilage like the tip of your nose!',
    kidRoastOnMiss:
      'SHARK WEEK FAIL! Sharks have ZERO bones—they’re 100% cartilage! Touch your ears, that’s cartilage!',
    funFact:
      'Even a 2,000-pound Great White Shark has 0 bones; its skeleton is pure flexible cartilage, which is lighter than bone and helps it swim faster.',
  },
  {
    id: 'q-continents-count',
    subject: 'World & Space',
    gradeLevel: '2nd Grade',
    difficultyRung: 7,
    adultFailRatePct: 49,
    question: 'Which continent on Earth has the MOST individual countries inside it?',
    options: ['Asia', 'Europe', 'Africa', 'South America'],
    correctIndex: 2,
    kidPeekNote:
      'Asia is the biggest in land size, so grown-ups pick Asia—but AFRICA has 54 countries, more than any other continent!',
    kidRoastOnMiss:
      'Grown-ups always guess Asia! Asia has 48 countries, but Africa has 54!',
    funFact:
      'Africa has 54 recognized sovereign nations, followed by Asia (48) and Europe (44).',
  },

  // RUNG 8 — $250,000
  {
    id: 'q-doctor-apple-math',
    subject: 'Math & Logic',
    gradeLevel: '7-Year-Old Genius',
    difficultyRung: 8,
    adultFailRatePct: 84,
    question:
      'A doctor gives you 3 chewable vitamins and tells you to take 1 every 30 minutes. How many minutes will it take until you eat all 3?',
    options: ['90 minutes', '60 minutes', '45 minutes', '30 minutes'],
    correctIndex: 1,
    kidPeekNote:
      'Don’t do 3 × 30 = 90! You eat Vitamin #1 RIGHT NOW (0 min), Vitamin #2 at 30 min, and Vitamin #3 at 60 min!',
    kidRoastOnMiss:
      'AHA! You picked 90 minutes! You take the FIRST vitamin at minute zero, the second at 30, and the third at 60!',
    funFact:
      'Known in mathematics as the "Fencepost Error"—3 items separated by intervals only have 2 waiting gaps between them!',
  },
  {
    id: 'q-polar-bear-skin',
    subject: 'Science & Nature',
    gradeLevel: '7-Year-Old Genius',
    difficultyRung: 8,
    adultFailRatePct: 76,
    question:
      'Beneath all that fluffy white-looking fur, what color is a Polar Bear’s actual SKIN?',
    options: ['Pink', 'Pure White', 'Jet Black', 'Ice Blue'],
    correctIndex: 2,
    kidPeekNote:
      ' Look at a polar bear’s nose! Their skin is JET BLACK so they can soak up warm sunshine in the freezing Arctic!',
    kidRoastOnMiss:
      'Nope! A polar bear’s skin is JET BLACK, and their fur is actually see-through hollow tubes!',
    funFact:
      'Polar bear fur is translucent (clear) and scatters light to look white, while their black skin absorbs every bit of solar warmth.',
  },
  {
    id: 'q-silent-letter-knight',
    subject: 'Words & Spelling',
    gradeLevel: '2nd Grade',
    difficultyRung: 8,
    adultFailRatePct: 52,
    question:
      'Which of these words has THREE silent letters that you don’t pronounce out loud?',
    options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
    correctIndex: 0,
    kidPeekNote:
      'In K-N-I-G-H-T, you only say "N-I-T"! The K, the G, and the H are all silent—that’s 3 silent letters!',
    kidRoastOnMiss:
      'Sound out K-N-I-G-H-T! The K, G, and H are all taking a nap—3 silent letters!',
    funFact:
      'In Middle English, knights actually pronounced both the "K" and the guttural "GH" before English pronunciation simplified!',
  },

  // RUNG 9 — $500,000
  {
    id: 'q-lily-pad-pond',
    subject: 'Math & Logic',
    gradeLevel: '7-Year-Old Genius',
    difficultyRung: 9,
    adultFailRatePct: 91,
    question:
      'A magic lily pad patch in the school pond DOUBLES in size every single day. If it takes 20 days to cover the WHOLE pond, on what day was the pond HALF covered?',
    options: ['Day 10', 'Day 15', 'Day 18', 'Day 19'],
    correctIndex: 3,
    kidPeekNote:
      'WAIT! Don’t say Day 10! If it DOUBLES every day and is 100% full on Day 20, the day right before (Day 19) it had to be HALF full!',
    kidRoastOnMiss:
      '91% OF ADULTS SAY DAY 10!! 😂 If it doubles every day, half of a full pond is just ONE day earlier—Day 19!!',
    funFact:
      'This question is part of Prof. Shane Frederick’s famous Cognitive Reflection Test (CRT) taught at MIT and Princeton—and kids who work backwards beat adults!',
  },
  {
    id: 'q-strawberry-berries',
    subject: 'Science & Nature',
    gradeLevel: '7-Year-Old Genius',
    difficultyRung: 9,
    adultFailRatePct: 82,
    question:
      'According to plant science (botany), which of these lunchbox fruits is ACTUALLY a true berry?',
    options: ['Strawberry', 'Raspberry', 'Banana', 'Blackberry'],
    correctIndex: 2,
    kidPeekNote:
      'It sounds crazy, but strawberries have seeds on the OUTSIDE so they aren’t berries—a BANANA is a real botanical berry!',
    kidRoastOnMiss:
      'Mind blown, right?! Strawberries and raspberries are NOT berries, but BANANAS (and watermelons!) ARE true berries!',
    funFact:
      'In botany, a true berry grows from one flower with one ovary and has seeds inside the flesh—making bananas, grapes, and tomatoes berries, while strawberries are "accessory fruits"!',
  },

  // RUNG 10 — $1,000,000 SUPREME GENIUS FINALE
  {
    id: 'q-million-bat-ball',
    subject: 'Math & Logic',
    gradeLevel: '7-Year-Old Genius',
    difficultyRung: 10,
    adultFailRatePct: 94,
    question:
      '$1,000,000 FINAL QUESTION: A toy plastic bat and a bouncy ball cost $1.10 in total. The bat costs $1.00 MORE than the ball. How much does the ball cost?',
    options: ['10 cents ($0.10)', '5 cents ($0.05)', '1 cent ($0.01)', '15 cents ($0.15)'],
    correctIndex: 1,
    kidPeekNote:
      'DO NOT PICK 10 CENTS!! If the ball was 10¢ and the bat was $1.00 more ($1.10), together they’d be $1.20! The ball is 5 CENTS and the bat is $1.05 ($1.05 + $0.05 = $1.10)!',
    kidRoastOnMiss:
      'NOOO! You fell for the $1,000,000 10-cent trap!! If the ball is 5¢ and the bat is $1.05, $1.05 is $1.00 more than 5¢ and adds up to $1.10!',
    funFact:
      'Over 50% of Harvard, MIT, and Princeton students answer "10 cents" on their first try! Testing the sum ($0.05 + $1.05 = $1.10) proves why 5 cents is the $1,000,000 answer.',
  },
  {
    id: 'q-million-mary-mom',
    subject: 'Playground Riddles',
    gradeLevel: '7-Year-Old Genius',
    difficultyRung: 10,
    adultFailRatePct: 89,
    question:
      '$1,000,000 FINAL QUESTION: Mary’s mom has 4 daughters. The first three are named April, May, and June. What is the 4th daughter’s name?',
    options: ['July', 'August', 'Mary!', 'Spring'],
    correctIndex: 2,
    kidPeekNote:
      'Read the very first two words of the question: "MARY’S mom"! The 4th daughter is MARY!!',
    kidRoastOnMiss:
      'YOU PICKED JULY?! 😂 It literally says "MARY’S MOM has 4 daughters" in the first two words!! Her name is MARY!',
    funFact:
      'Pattern-completion bias makes adult brains automatically continue the calendar sequence ("April, May, June -> July") while ignoring the subject of the sentence.',
  },
];
