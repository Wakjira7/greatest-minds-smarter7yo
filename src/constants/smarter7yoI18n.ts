import {
  KID_CLASSMATES,
  KidClassmate,
  LadderRung,
  PRIZE_LADDER,
  SubjectCategory,
  TRIVIA_QUESTIONS_7YO,
  TriviaQuestion7Yo,
} from './smarter7yoData';
import { getExpanded2000Questions, LIBRARY2000_COPYRIGHT_WATERMARK } from './smarter7yoLibrary2000';

/**
 * Embedded Digital Copyright & Authorship Watermark for 11-Language Localization Engine.
 */
export const I18N_COPYRIGHT_WATERMARK =
  `Copyright (c) 2026 Wakjira Shewangzaw Dabi | com.wakjira.smarter7yo | 11-Language I18n Engine | ${LIBRARY2000_COPYRIGHT_WATERMARK.slice(-64)}`;

export type AppLanguage =
  | 'en'
  | 'am'
  | 'om'
  | 'har'
  | 'so'
  | 'de'
  | 'ar'
  | 'es'
  | 'fr'
  | 'pt'
  | 'ja';

export interface LanguageOption {
  code: AppLanguage;
  nativeName: string;
  englishName: string;
  flag: string;
  ttsLang: string;
  marketRegion: string;
  storeTitle: string; // <= 30 chars for Google Play Store
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English (Global / US / UK)',
    flag: '🇺🇸',
    ttsLang: 'en-US',
    marketRegion: 'United States, UK, Canada, Australia',
    storeTitle: 'Smarter Than a 7-Year-Old IQ',
  },
  {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish (Spain & LatAm)',
    flag: '🇪🇸',
    ttsLang: 'es-ES',
    marketRegion: 'Spain, United States, Mexico, Latin America',
    storeTitle: '¿Más Listo que un Niño de 7?',
  },
  {
    code: 'fr',
    nativeName: 'Français',
    englishName: 'French (France, Canada & Europe)',
    flag: '🇫🇷',
    ttsLang: 'fr-FR',
    marketRegion: 'France, Belgium, Switzerland, Canada',
    storeTitle: "Plus Malin qu'un Enfant de 7 ?",
  },
  {
    code: 'de',
    nativeName: 'Deutsch',
    englishName: 'German (DACH / Europe)',
    flag: '🇩🇪',
    ttsLang: 'de-DE',
    marketRegion: 'Germany, Austria, Switzerland',
    storeTitle: 'Schlauer als ein 7-Jähriger?',
  },
  {
    code: 'pt',
    nativeName: 'Português',
    englishName: 'Portuguese (Brazil & Portugal)',
    flag: '🇧🇷',
    ttsLang: 'pt-BR',
    marketRegion: 'Portugal, Brazil & Europe',
    storeTitle: 'Mais Esperto que 7 Anos?',
  },
  {
    code: 'ja',
    nativeName: '日本語',
    englishName: 'Japanese (Japan)',
    flag: '🇯🇵',
    ttsLang: 'ja-JP',
    marketRegion: 'Japan',
    storeTitle: '7歳児より賢い？小学生クイズ',
  },
  {
    code: 'ar',
    nativeName: 'العربية',
    englishName: 'Arabic (UAE, Saudi & MENA)',
    flag: '🇸🇦',
    ttsLang: 'ar-SA',
    marketRegion: 'UAE, Saudi Arabia, Qatar, Kuwait & MENA',
    storeTitle: 'هل أنت أذكى من طفل 7 سنوات؟',
  },
  {
    code: 'am',
    nativeName: 'አማርኛ',
    englishName: 'Amharic (Ethiopia)',
    flag: '🇪🇹',
    ttsLang: 'am-ET',
    marketRegion: 'Ethiopia & Global Diaspora',
    storeTitle: 'ከ7 ዓመት ልጅ ይበልጥ ብልህ ነዎት?',
  },
  {
    code: 'om',
    nativeName: 'Afaan Oromoo',
    englishName: 'Oromo (Oromia / Ethiopia & East Africa)',
    flag: '🇪🇹',
    ttsLang: 'om-ET',
    marketRegion: 'Oromia, Ethiopia, Kenya & Global Diaspora',
    storeTitle: 'Mucaa Waggaa 7 Caalaa Gamnaa?',
  },
  {
    code: 'har',
    nativeName: 'ሐረሪ (ጌይ ሲናን / Hadere)',
    englishName: 'Harari / Hadere (Harar, Ethiopia)',
    flag: '🇪🇹',
    ttsLang: 'am-ET',
    marketRegion: 'Harar (Gey), Ethiopia & Global Diaspora',
    storeTitle: 'ከ7 አመት ልጂ ዪበልጢ ጪቅላ ዛላሁ?',
  },
  {
    code: 'so',
    nativeName: 'Soomaali',
    englishName: 'Somali (Horn of Africa & Global)',
    flag: '🇸🇴',
    ttsLang: 'so-SO',
    marketRegion: 'Somalia, Djibouti, Kenya, Ethiopia & Diaspora',
    storeTitle: 'Ma Ka Caqli Badan Tahay 7-Jir?',
  },
];

export interface UiStrings {
  welcomeBadge: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  continueInLang: string;
  changeLanguageBtn: string;
  onboardingFinish: string;
  onboardingPages: [
    { title: string; description: string },
    { title: string; description: string },
    { title: string; description: string },
  ];
  gameShowArena: string;
  appMainTitlePrefix: string;
  appMainTitleHighlight: string;
  playgroundIq: string;
  streak: string;
  rungLabel: string;
  secondsLeft: string;
  vipActive: string;
  plusLifelines: string;
  removeAdsPrice: string;
  honorRollActive: string;
  privacyPolicy: string;
  modeMillionLadder: string;
  modeSpeedBlitz: string;
  modeSubjects: string;
  allSubjects: string;
  chooseDeskPartner: string;
  tapClassmateHint: string;
  hideClassmateBox: string;
  showClassmateBox: string;
  adultsFailThis: string;
  tapChalkboardReadAloud: string;
  peekAtPaper: string;
  copyAnswer: string;
  eraseTwo: string;
  leftCount: string;
  erasedBy: string;
  correctHeadline: string;
  wrongHeadline: string;
  secondGradeSecret: string;
  claimMillionDiploma: string;
  climbToRung: string;
  nextPlaygroundQuestion: string;
  watchAdRevive: string;
  signHumilityPledge: string;
  flunkedOutAt: string;
  flunkModalSub: string;
  officialReportCard: string;
  pledgeQuotePrefix: string;
  pledgeQuoteHighlight: string;
  signedAndConfessed: string;
  tapToSignAndConfess: string;
  watchVideoReviveAt: string;
  copiedScoreCard: string;
  shareReportCard: string;
  newGameBtn: string;
  millionGraduateTitle: string;
  millionGraduateSub: string;
  goldenDiplomaHeader: string;
  playAnotherMillionRun: string;
  schoolStoreTitle: string;
  schoolStoreSub: string;
  watchAdRefillBtn: string;
  oneTimeProTitle: string;
  oneTimeProDesc: string;
  backToChalkboard: string;
  scholarshipLadderTitle: string;
  closeLadder: string;
  todaysStories: string;
  makeDeskPartnerCta: string;
  ageLabel: string;
  proLabel: string;
  tapToHearVoice: string;
  peekSpeechPrefix: string;
  idleSpeechTemplate: string;
  subjects: Record<SubjectCategory, string>;
  grades: Record<TriviaQuestion7Yo['gradeLevel'], string>;
  themes: {
    tv_studio: string;
    chalkboard: string;
    cosmic_arcade: string;
  };
}

export const UI_STRINGS: Record<AppLanguage, UiStrings> = {
  en: {
    welcomeBadge: '🌍 GLOBAL EDITION • 8 LANGUAGES',
    welcomeTitle: 'Choose Your Language',
    welcomeSubtitle:
      'Play the entire game show, questions, hints, and report card in your preferred language.',
    continueInLang: 'Start Playing in English →',
    changeLanguageBtn: '🌐 Language',
    onboardingFinish: '🎒 Enter the Classroom',
    onboardingPages: [
      {
        title: 'Are You Smarter Than a 7-Year-Old?',
        description:
          'Climb 10 rungs of 2nd-grade trick questions — from a $100 gold star to the $1,000,000 Supreme Genius diploma.',
      },
      {
        title: 'Cheat off your classmates',
        description:
          'Leo, Maya, Toby, Chloe & Zane sit next to you. Peek at their paper, copy their answer, or erase two wrong options.',
      },
      {
        title: 'Flunk? Confess it!',
        description:
          'Miss a question and you must sign the Humility Pledge… or ring the recess bell for a second chance.',
      },
    ],
    gameShowArena: '🎒 GAME SHOW ARENA',
    appMainTitlePrefix: 'Are You Smarter Than a',
    appMainTitleHighlight: '7-Year-Old?',
    playgroundIq: 'Playground IQ',
    streak: 'Streak',
    rungLabel: 'RUNG',
    secondsLeft: 's LEFT',
    vipActive: '👑 VIP Active',
    plusLifelines: '⭐ +Lifelines',
    removeAdsPrice: '🛡️ Remove Ads ($3.99)',
    honorRollActive: '👑 Honor Roll Pro Active',
    privacyPolicy: '🔒 Privacy',
    modeMillionLadder: '🏆 $1,000,000 Show Ladder',
    modeSpeedBlitz: '⚡ 60s Recess Blitz',
    modeSubjects: '📚 6 School Subjects',
    allSubjects: '🌟 All Subjects',
    chooseDeskPartner: 'ASK A 7-YEAR-OLD CLASSMATE (TAP TO OPEN):',
    tapClassmateHint: 'Tap any classmate to open their desk & hint',
    hideClassmateBox: '✕ Hide Partner Box',
    showClassmateBox: '🙋 Show Partner Box',
    adultsFailThis: '% of Adults Fail This!',
    tapChalkboardReadAloud: '🔊 Tap chalkboard to hear this question read aloud',
    peekAtPaper: 'Peek at Paper',
    copyAnswer: 'Copy Answer',
    eraseTwo: 'Erase 2 (50/50)',
    leftCount: 'left',
    erasedBy: 'Erased by',
    correctHeadline: '🎉 CORRECT! You & {name} nailed it!',
    wrongHeadline: '🚨 OOF! Outsmarted by a 7-Year-Old!',
    secondGradeSecret: '2nd-Grade Secret:',
    claimMillionDiploma: '🎓 Claim $1,000,000 Genius Diploma! →',
    climbToRung: 'Climb to Rung {rung} ({prize}) →',
    nextPlaygroundQuestion: 'Next Playground Question →',
    watchAdRevive: '🎬 Watch 30s Ad: Ring Recess Bell to Revive!',
    signHumilityPledge: 'Sign Humility Pledge',
    flunkedOutAt: 'FLUNKED OUT AT {prize}!',
    flunkModalSub:
      '{name} (Age 7) is giggling at your desk! Before you leave the classroom, revive or sign the Official Pledge of Humility:',
    officialReportCard: '📜 OFFICIAL 2ND-GRADE REPORT CARD',
    pledgeQuotePrefix: '“I solemnly confess to all my friends that I am ',
    pledgeQuoteHighlight: 'NOT smarter than {name} (Age 7)',
    signedAndConfessed: '✅ Signed & Confessed Out Loud!',
    tapToSignAndConfess: '🎙️ Tap to Sign & Confess Out Loud',
    watchVideoReviveAt: '🎬 Watch 1 Video Ad to REVIVE at {prize}!',
    copiedScoreCard: '✓ Copied Score Card!',
    shareReportCard: '📲 Share Report Card',
    newGameBtn: '🔄 New Game ($100)',
    millionGraduateTitle: '$1,000,000 GENIUS GRADUATE!',
    millionGraduateSub:
      'Unbelievable! You conquered all 10 rungs and proved you ARE Smarter Than a 7-Year-Old!',
    goldenDiplomaHeader: '🏆 GOLDEN HONOR ROLL DIPLOMA',
    playAnotherMillionRun: '🚀 Play Another $1,000,000 Run!',
    schoolStoreTitle: 'School Store & Lifeline Refills',
    schoolStoreSub:
      'Need more cheats from your 7-year-old classmates? Watch a quick video ad or unlock the Honor Roll VIP Pass!',
    watchAdRefillBtn: '🎬 Watch 30s Ad: +2 Peeks, +1 Copy & +2 Erasers (FREE)',
    oneTimeProTitle: '🛡️ One-Time Pro Unlock — $3.99 (No Subscription!)',
    oneTimeProDesc:
      '• Permanently removes all Banner & Interstitial ads\n• UNLIMITED Peek, Copy & 50/50 Chalkboard Eraser lifelines\n• Unlocks Printable Report Card Transcript Exports',
    backToChalkboard: 'Back to Chalkboard',
    scholarshipLadderTitle: '🏆 $1,000,000 Scholarship Ladder',
    closeLadder: 'Close Ladder',
    todaysStories: "📸 Today's Classmate Stories",
    makeDeskPartnerCta: 'Make them my desk partner →',
    ageLabel: 'Age',
    proLabel: 'Pro',
    tapToHearVoice: '🔊 Tap to hear voice!',
    peekSpeechPrefix: '👀 Psst! My paper says:',
    idleSpeechTemplate: '🙋 "{pct}% of grown-ups get this question wrong!"',
    subjects: {
      'Playground Riddles': 'Playground Riddles',
      'Math & Logic': 'Math & Logic',
      'Science & Nature': 'Science & Nature',
      'World & Space': 'World & Space',
      'Words & Spelling': 'Words & Spelling',
      'Everyday Traps': 'Everyday Traps',
    },
    grades: {
      Kindergarten: 'Kindergarten',
      '1st Grade': '1st Grade',
      '2nd Grade': '2nd Grade',
      '7-Year-Old Genius': '7-Year-Old Genius',
    },
    themes: {
      tv_studio: 'Golden TV Studio',
      chalkboard: '2nd Grade Classroom',
      cosmic_arcade: 'Cosmic Recess',
    },
  },
  de: {
    welcomeBadge: '🌍 GLOBALE EDITION • 8 SPRACHEN',
    welcomeTitle: 'Wähle deine Sprache',
    welcomeSubtitle:
      'Spiele die gesamte Quizshow, alle Fragen, Tipps und das Zeugnis perfekt auf Deutsch.',
    continueInLang: 'Auf Deutsch spielen →',
    changeLanguageBtn: '🌐 Sprache',
    onboardingFinish: '🎒 Klassenzimmer betreten',
    onboardingPages: [
      {
        title: 'Bist du schlauer als ein 7-Jähriger?',
        description:
          'Erklimme 10 Stufen voller kniffliger Zweitklässler-Fragen – vom 100 $ Goldstern bis zum 1.000.000 $ Genie-Diplom.',
      },
      {
        title: 'Spicke bei deinen Mitschülern',
        description:
          'Leo, Maya, Toby, Chloe & Zane helfen dir: Spicke auf ihr Blatt, kopiere die Antwort oder wische 2 falsche Antworten weg.',
      },
      {
        title: 'Durchgefallen? Gib es zu!',
        description:
          'Bei einem Fehler musst du den Demuts-Eid unterschreiben … oder die Pausenglocke für eine zweite Chance läuten.',
      },
    ],
    gameShowArena: '🎒 QUIZSHOW-ARENA',
    appMainTitlePrefix: 'Bist du schlauer als ein',
    appMainTitleHighlight: '7-Jähriger?',
    playgroundIq: 'Schulhof-IQ',
    streak: 'Serie',
    rungLabel: 'STUFE',
    secondsLeft: 's ÜBRIG',
    vipActive: '👑 VIP Aktiv',
    plusLifelines: '⭐ +Joker',
    removeAdsPrice: '🛡️ Werbefrei (3,99 $)',
    honorRollActive: '👑 Ehrenliste Pro Aktiv',
    privacyPolicy: '🔒 Datenschutz',
    modeMillionLadder: '🏆 1.000.000 $ Quiz-Leiter',
    modeSpeedBlitz: '⚡ 60s Pausen-Blitz',
    modeSubjects: '📚 6 Schulfächer',
    allSubjects: '🌟 Alle Fächer',
    chooseDeskPartner: 'FRAG EINEN 7-JÄHRIGEN MITSCHÜLER (TIPPEN):',
    tapClassmateHint: 'Tippe auf einen Mitschüler für Hilfe',
    hideClassmateBox: '✕ Mitschüler ausblenden',
    showClassmateBox: '🙋 Mitschüler zeigen',
    adultsFailThis: '% der Erwachsenen scheitern hier!',
    tapChalkboardReadAloud: '🔊 Tippe auf die Tafel, um die Frage vorzulesen',
    peekAtPaper: 'Spicken',
    copyAnswer: 'Abschreiben',
    eraseTwo: '2 Löschen (50/50)',
    leftCount: 'übrig',
    erasedBy: 'Ausgewischt von',
    correctHeadline: '🎉 RICHTIG! Du & {name} habt es geschafft!',
    wrongHeadline: '🚨 AUTSCH! Von einem 7-Jährigen überlistet!',
    secondGradeSecret: 'Zweitklässler-Geheimnis:',
    claimMillionDiploma: '🎓 1.000.000 $ Genie-Diplom abholen! →',
    climbToRung: 'Weiter zu Stufe {rung} ({prize}) →',
    nextPlaygroundQuestion: 'Nächste Schulhof-Frage →',
    watchAdRevive: '🎬 30s Video: Pausenglocke zur Rettung!',
    signHumilityPledge: 'Demuts-Eid leisten',
    flunkedOutAt: 'DURCHGEFALLEN BEI {prize}!',
    flunkModalSub:
      '{name} (7 Jahre) kichert! Bevor du das Klassenzimmer verlässt, rette dich oder unterschreibe den Eid:',
    officialReportCard: '📜 OFFIZIELLES ZWEITKLÄSSLER-ZEUGNIS',
    pledgeQuotePrefix: '„Ich gestehe feierlich vor allen Freunden: Ich bin ',
    pledgeQuoteHighlight: 'NICHT schlauer als {name} (7 Jahre)',
    signedAndConfessed: '✅ Unterschrieben & laut gestanden!',
    tapToSignAndConfess: '🎙️ Tippen zum Unterschreiben & Gestehen',
    watchVideoReviveAt: '🎬 1 Video ansehen & bei {prize} weiterspielen!',
    copiedScoreCard: '✓ Zeugnis kopiert!',
    shareReportCard: '📲 Zeugnis teilen',
    newGameBtn: '🔄 Neues Spiel (100 $)',
    millionGraduateTitle: '1.000.000 $ GENIE-ABSOLVENT!',
    millionGraduateSub:
      'Unglaublich! Du hast alle 10 Stufen gemeistert und bewiesen, dass du schlauer als ein 7-Jähriger bist!',
    goldenDiplomaHeader: '🏆 GOLDENES EHREN-DIPLOM',
    playAnotherMillionRun: '🚀 Noch eine 1.000.000 $ Runde!',
    schoolStoreTitle: 'Schulkiosk & Joker-Nachschub',
    schoolStoreSub:
      'Brauchst du mehr Hilfe von deinen 7-jährigen Mitschülern? Schau ein kurzes Video oder schalte VIP frei!',
    watchAdRefillBtn: '🎬 30s Video: +2 Spicken, +1 Kopie & +2 Schwämme (GRATIS)',
    oneTimeProTitle: '🛡️ Einmaliges Pro-Upgrade — 3,99 $ (Kein Abo!)',
    oneTimeProDesc:
      '• Entfernt dauerhaft alle Banner- & Unterbrecherwerbung\n• UNBEGRENZT Spicken, Abschreiben & 50/50 Tafelwischer\n• Schaltet druckbare Zeugnis-Exporte frei',
    backToChalkboard: 'Zurück zur Tafel',
    scholarshipLadderTitle: '🏆 1.000.000 $ Stipendium-Leiter',
    closeLadder: 'Schließen',
    todaysStories: '📸 Heutige Mitschüler-Storys',
    makeDeskPartnerCta: 'Als Banknachbar wählen →',
    ageLabel: 'Alter',
    proLabel: 'Profi',
    tapToHearVoice: '🔊 Tippen zum Anhören!',
    peekSpeechPrefix: '👀 Psst! Auf meinem Zettel steht:',
    idleSpeechTemplate: '🙋 „{pct}% der Erwachsenen beantworten das falsch!“',
    subjects: {
      'Playground Riddles': 'Schulhof-Rätsel',
      'Math & Logic': 'Mathe & Logik',
      'Science & Nature': 'Natur & Technik',
      'World & Space': 'Welt & Weltraum',
      'Words & Spelling': 'Wörter & Sprache',
      'Everyday Traps': 'Alltags-Fallen',
    },
    grades: {
      Kindergarten: 'Vorschule',
      '1st Grade': '1. Klasse',
      '2nd Grade': '2. Klasse',
      '7-Year-Old Genius': '7-Jähriges Genie',
    },
    themes: {
      tv_studio: 'Goldenes TV-Studio',
      chalkboard: 'Klassenzimmer 2b',
      cosmic_arcade: 'Weltraum-Pause',
    },
  },
  es: {
    welcomeBadge: '🌍 EDICIÓN GLOBAL • 8 IDIOMAS',
    welcomeTitle: 'Elige tu idioma',
    welcomeSubtitle:
      'Juega todo el concurso, preguntas, pistas y boletín de notas perfectamente en español.',
    continueInLang: 'Jugar en Español →',
    changeLanguageBtn: '🌐 Idioma',
    onboardingFinish: '🎒 Entrar al Aula',
    onboardingPages: [
      {
        title: '¿Eres más listo que un niño de 7 años?',
        description:
          'Sube 10 niveles de preguntas trampa de 2.º grado: desde $100 hasta el diploma de Genio Supremo de $1,000,000.',
      },
      {
        title: 'Copia a tus compañeros',
        description:
          'Leo, Maya, Toby, Chloe y Zane se sientan contigo. Mira su hoja, copia su respuesta o borra 2 opciones incorrectas.',
      },
      {
        title: '¿Reprobaste? ¡Confiésalo!',
        description:
          'Si fallas, firma el Juramento de Humildad… o toca la campana del recreo para una segunda oportunidad.',
      },
    ],
    gameShowArena: '🎒 ARENA DEL CONCURSO',
    appMainTitlePrefix: '¿Eres más listo que un',
    appMainTitleHighlight: 'niño de 7 años?',
    playgroundIq: 'IQ Escolar',
    streak: 'Racha',
    rungLabel: 'NIVEL',
    secondsLeft: 's RESTANTES',
    vipActive: '👑 VIP Activo',
    plusLifelines: '⭐ +Comodines',
    removeAdsPrice: '🛡️ Sin Anuncios ($3.99)',
    honorRollActive: '👑 Cuadro de Honor Pro',
    privacyPolicy: '🔒 Privacidad',
    modeMillionLadder: '🏆 Escalera de $1,000,000',
    modeSpeedBlitz: '⚡ Recreo Relámpago 60s',
    modeSubjects: '📚 6 Materias Escolares',
    allSubjects: '🌟 Todas las Materias',
    chooseDeskPartner: 'PREGUNTA A UN COMPAÑERO DE 7 AÑOS (TOCA):',
    tapClassmateHint: 'Toca un compañero para ver su pista',
    hideClassmateBox: '✕ Ocultar Compañero',
    showClassmateBox: '🙋 Mostrar Compañero',
    adultsFailThis: '% de los adultos fallan esto!',
    tapChalkboardReadAloud: '🔊 Toca la pizarra para escuchar la pregunta',
    peekAtPaper: 'Espiar Hoja',
    copyAnswer: 'Copiar Respuesta',
    eraseTwo: 'Borrar 2 (50/50)',
    leftCount: 'disp.',
    erasedBy: 'Borrado por',
    correctHeadline: '🎉 ¡CORRECTO! ¡Tú y {name} acertaron!',
    wrongHeadline: '🚨 ¡UPS! ¡Superado por un niño de 7 años!',
    secondGradeSecret: 'Secreto de 2.º Grado:',
    claimMillionDiploma: '🎓 ¡Reclamar Diploma de $1,000,000! →',
    climbToRung: 'Subir al Nivel {rung} ({prize}) →',
    nextPlaygroundQuestion: 'Siguiente Pregunta →',
    watchAdRevive: '🎬 Ver video 30s: ¡Campana de Recreo para Revivir!',
    signHumilityPledge: 'Firmar Juramento',
    flunkedOutAt: '¡REPROBADO EN {prize}!',
    flunkModalSub:
      '¡{name} (7 años) se ríe en tu pupitre! Antes de salir del aula, revive o firma el Juramento Oficial de Humildad:',
    officialReportCard: '📜 BOLETÍN OFICIAL DE 2.º GRADO',
    pledgeQuotePrefix: '“Confieso solemnemente ante mis amigos que ',
    pledgeQuoteHighlight: 'NO soy más listo que {name} (7 años)',
    signedAndConfessed: '✅ ¡Firmado y Confesado!',
    tapToSignAndConfess: '🎙️ Toca para Firmar y Confesar',
    watchVideoReviveAt: '🎬 ¡Ver 1 Video para REVIVIR en {prize}!',
    copiedScoreCard: '✓ ¡Boletín Copiado!',
    shareReportCard: '📲 Compartir Boletín',
    newGameBtn: '🔄 Nuevo Juego ($100)',
    millionGraduateTitle: '¡GRADUADO GENIO DE $1,000,000!',
    millionGraduateSub:
      '¡Increíble! ¡Superaste los 10 niveles y demostraste que ERES más listo que un niño de 7 años!',
    goldenDiplomaHeader: '🏆 DIPLOMA DORADO DE HONOR',
    playAnotherMillionRun: '🚀 ¡Jugar Otra Partida de $1,000,000!',
    schoolStoreTitle: 'Tienda Escolar y Comodines',
    schoolStoreSub:
      '¿Necesitas más ayuda de tus compañeros de 7 años? ¡Mira un video corto o desbloquea el Pase VIP!',
    watchAdRefillBtn: '🎬 Video 30s: +2 Espiar, +1 Copiar y +2 Borrar (GRATIS)',
    oneTimeProTitle: '🛡️ Desbloqueo Pro Único — $3.99 (¡Sin Suscripción!)',
    oneTimeProDesc:
      '• Elimina todos los anuncios para siempre\n• Comodines ILIMITADOS de Espiar, Copiar y Borrar 50/50\n• Exportación de Boletín de Notas',
    backToChalkboard: 'Volver a la Pizarra',
    scholarshipLadderTitle: '🏆 Escalera de Beca de $1,000,000',
    closeLadder: 'Cerrar',
    todaysStories: '📸 Historias de Compañeros',
    makeDeskPartnerCta: 'Elegir como compañero de pupitre →',
    ageLabel: 'Edad',
    proLabel: 'Pro',
    tapToHearVoice: '🔊 ¡Toca para escuchar!',
    peekSpeechPrefix: '👀 ¡Psst! En mi hoja puse:',
    idleSpeechTemplate: '🙋 "¡El {pct}% de los adultos falla esta pregunta!"',
    subjects: {
      'Playground Riddles': 'Acertijos del Recreo',
      'Math & Logic': 'Mate y Lógica',
      'Science & Nature': 'Ciencia y Naturaleza',
      'World & Space': 'Mundo y Espacio',
      'Words & Spelling': 'Palabras y Ortografía',
      'Everyday Traps': 'Trampas Cotidianas',
    },
    grades: {
      Kindergarten: 'Kínder',
      '1st Grade': '1.º Grado',
      '2nd Grade': '2.º Grado',
      '7-Year-Old Genius': 'Genio de 7 Años',
    },
    themes: {
      tv_studio: 'Estudio TV Dorado',
      chalkboard: 'Aula de 2.º Grado',
      cosmic_arcade: 'Recreo Cósmico',
    },
  },
  fr: {
    welcomeBadge: '🌍 ÉDITION MONDIALE • 8 LANGUES',
    welcomeTitle: 'Choisissez votre langue',
    welcomeSubtitle:
      'Jouez à tout le jeu télévisé, aux questions, indices et bulletin scolaire en français.',
    continueInLang: 'Jouer en Français →',
    changeLanguageBtn: '🌐 Langue',
    onboardingFinish: '🎒 Entrer dans la Classe',
    onboardingPages: [
      {
        title: "Plus malin qu'un enfant de 7 ans ?",
        description:
          'Grimpez les 10 paliers de questions pièges du CE1 — de 100 $ jusqu’au diplôme de Génie Suprême à 1 000 000 $.',
      },
      {
        title: 'Copiez sur vos camarades',
        description:
          'Leo, Maya, Toby, Chloe et Zane sont à côté de vous. Regardez leur copie, copiez leur réponse ou effacez 2 faux choix.',
      },
      {
        title: 'Recalé ? Avouez-le !',
        description:
          'Une erreur et vous devez signer le Serment d’Humilité… ou sonner la cloche de récréation pour une seconde chance.',
      },
    ],
    gameShowArena: '🎒 ARÈNE DU JEU TÉLÉ',
    appMainTitlePrefix: "Plus malin qu'un",
    appMainTitleHighlight: 'enfant de 7 ans ?',
    playgroundIq: 'QI Récré',
    streak: 'Série',
    rungLabel: 'PALIER',
    secondsLeft: 's RESTANTES',
    vipActive: '👑 VIP Actif',
    plusLifelines: '⭐ +Jokers',
    removeAdsPrice: '🛡️ Sans Pub (3,99 $)',
    honorRollActive: '👑 Tableau d’Honneur Pro',
    privacyPolicy: '🔒 Confidentialité',
    modeMillionLadder: '🏆 Échelle à 1 000 000 $',
    modeSpeedBlitz: '⚡ Blitz Récré 60s',
    modeSubjects: '📚 6 Matières Scolaires',
    allSubjects: '🌟 Toutes les Matières',
    chooseDeskPartner: 'DEMANDER À UN CAMARADE DE 7 ANS (TOUCHER) :',
    tapClassmateHint: 'Touchez un camarade pour ouvrir son pupitre',
    hideClassmateBox: '✕ Masquer le Camarade',
    showClassmateBox: '🙋 Afficher le Camarade',
    adultsFailThis: '% des adultes échouent ici !',
    tapChalkboardReadAloud: '🔊 Touchez le tableau pour écouter la question',
    peekAtPaper: 'Coup d’œil',
    copyAnswer: 'Copier',
    eraseTwo: 'Effacer 2 (50/50)',
    leftCount: 'rest.',
    erasedBy: 'Effacé par',
    correctHeadline: '🎉 BRAVO ! Toi et {name} avez trouvé !',
    wrongHeadline: '🚨 OUPS ! Battu par un enfant de 7 ans !',
    secondGradeSecret: 'Secret de CE1 :',
    claimMillionDiploma: '🎓 Réclamer le Diplôme à 1 000 000 $ ! →',
    climbToRung: 'Monter au Palier {rung} ({prize}) →',
    nextPlaygroundQuestion: 'Question Suivante →',
    watchAdRevive: '🎬 Vidéo 30s : Cloche de Récré pour Continuer !',
    signHumilityPledge: 'Signer le Serment',
    flunkedOutAt: 'RECALÉ À {prize} !',
    flunkModalSub:
      '{name} (7 ans) rigole à ton bureau ! Avant de quitter la classe, continue ou signe le Serment d’Humilité :',
    officialReportCard: '📜 BULLETIN OFFICIEL DE CE1',
    pledgeQuotePrefix: '« Je confesse solennellement à tous mes amis que je ne suis ',
    pledgeQuoteHighlight: "PAS plus malin que {name} (7 ans)",
    signedAndConfessed: '✅ Signé et Avoué à Voix Haute !',
    tapToSignAndConfess: '🎙️ Toucher pour Signer et Avouer',
    watchVideoReviveAt: '🎬 Voir 1 Vidéo pour CONTINUER à {prize} !',
    copiedScoreCard: '✓ Bulletin Copié !',
    shareReportCard: '📲 Partager le Bulletin',
    newGameBtn: '🔄 Nouvelle Partie (100 $)',
    millionGraduateTitle: 'DIPLÔMÉ GÉNIE À 1 000 000 $ !',
    millionGraduateSub:
      'Incroyable ! Tu as franchi les 10 paliers et prouvé que tu ES plus malin qu’un enfant de 7 ans !',
    goldenDiplomaHeader: '🏆 DIPLÔME D’HONNEUR EN OR',
    playAnotherMillionRun: '🚀 Rejouer pour 1 000 000 $ !',
    schoolStoreTitle: 'Boutique Scolaire & Jokers',
    schoolStoreSub:
      'Besoin de plus d’indices de tes camarades de 7 ans ? Regarde une courte vidéo ou débloque le Pass VIP !',
    watchAdRefillBtn: '🎬 Vidéo 30s : +2 Coups d’œil, +1 Copie & +2 Effaceurs (GRATUIT)',
    oneTimeProTitle: '🛡️ Déblocage Pro Unique — 3,99 $ (Sans Abonnement !)',
    oneTimeProDesc:
      '• Supprime toutes les publicités définitivement\n• Jokers ILLIMITÉS (Coup d’œil, Copier & Effacer 50/50)\n• Exportation du bulletin scolaire',
    backToChalkboard: 'Retour au Tableau',
    scholarshipLadderTitle: '🏆 Échelle des 1 000 000 $',
    closeLadder: 'Fermer',
    todaysStories: '📸 Stories des Camarades',
    makeDeskPartnerCta: 'Choisir comme voisin de table →',
    ageLabel: 'Âge',
    proLabel: 'Pro',
    tapToHearVoice: '🔊 Toucher pour écouter !',
    peekSpeechPrefix: '👀 Psst ! Sur ma feuille j’ai écrit :',
    idleSpeechTemplate: '🙋 « {pct}% des adultes se trompent à cette question ! »',
    subjects: {
      'Playground Riddles': 'Énigmes de Récré',
      'Math & Logic': 'Maths & Logique',
      'Science & Nature': 'Sciences & Nature',
      'World & Space': 'Monde & Espace',
      'Words & Spelling': 'Mots & Orthographe',
      'Everyday Traps': 'Pièges du Quotidien',
    },
    grades: {
      Kindergarten: 'Maternelle',
      '1st Grade': 'CP (1re année)',
      '2nd Grade': 'CE1 (2e année)',
      '7-Year-Old Genius': 'Génie de 7 Ans',
    },
    themes: {
      tv_studio: 'Studio TV Doré',
      chalkboard: 'Salle de Classe CE1',
      cosmic_arcade: 'Récré Cosmique',
    },
  },
  pt: {
    welcomeBadge: '🌍 EDIÇÃO GLOBAL • 8 IDIOMAS',
    welcomeTitle: 'Escolha seu idioma',
    welcomeSubtitle:
      'Jogue todo o programa de TV, perguntas, dicas e boletim escolar em português.',
    continueInLang: 'Jogar em Português →',
    changeLanguageBtn: '🌐 Idioma',
    onboardingFinish: '🎒 Entrar na Sala de Aula',
    onboardingPages: [
      {
        title: 'Mais esperto que uma criança de 7 anos?',
        description:
          'Suba 10 níveis de pegadinhas da 2ª série — de $100 até o diploma de Gênio Supremo de $1.000.000.',
      },
      {
        title: 'Cole dos seus colegas',
        description:
          'Leo, Maya, Toby, Chloe e Zane sentam ao seu lado. Espie a prova, copie a resposta ou apague 2 opções erradas.',
      },
      {
        title: 'Reprovou? Confesse!',
        description:
          'Se errar, assine o Juramento de Humildade… ou toque o sinal do recreio para uma segunda chance.',
      },
    ],
    gameShowArena: '🎒 ARENA DO SHOW',
    appMainTitlePrefix: 'Você é mais esperto que',
    appMainTitleHighlight: '7 anos de idade?',
    playgroundIq: 'QI Escolar',
    streak: 'Sequência',
    rungLabel: 'NÍVEL',
    secondsLeft: 's RESTANTES',
    vipActive: '👑 VIP Ativo',
    plusLifelines: '⭐ +Ajudas',
    removeAdsPrice: '🛡️ Sem Anúncios ($3.99)',
    honorRollActive: '👑 Quadro de Honra Pro',
    privacyPolicy: '🔒 Privacidade',
    modeMillionLadder: '🏆 Escada de $1.000.000',
    modeSpeedBlitz: '⚡ Blitz do Recreio 60s',
    modeSubjects: '📚 6 Matérias Escolares',
    allSubjects: '🌟 Todas as Matérias',
    chooseDeskPartner: 'PERGUNTE A UM COLEGA DE 7 ANOS (TOQUE):',
    tapClassmateHint: 'Toque em um colega para ver a dica',
    hideClassmateBox: '✕ Ocultar Colega',
    showClassmateBox: '🙋 Mostrar Colega',
    adultsFailThis: '% dos adultos erram isso!',
    tapChalkboardReadAloud: '🔊 Toque no quadro para ouvir a pergunta',
    peekAtPaper: 'Espiar Prova',
    copyAnswer: 'Copiar Resposta',
    eraseTwo: 'Apagar 2 (50/50)',
    leftCount: 'rest.',
    erasedBy: 'Apagado por',
    correctHeadline: '🎉 CORRETO! Você e {name} acertaram!',
    wrongHeadline: '🚨 EITA! Superado por uma criança de 7 anos!',
    secondGradeSecret: 'Segredo da 2ª Série:',
    claimMillionDiploma: '🎓 Receber Diploma de $1.000.000! →',
    climbToRung: 'Subir para o Nível {rung} ({prize}) →',
    nextPlaygroundQuestion: 'Próxima Pergunta →',
    watchAdRevive: '🎬 Vídeo 30s: Sinal do Recreio para Reviver!',
    signHumilityPledge: 'Assinar Juramento',
    flunkedOutAt: 'REPROVADO EM {prize}!',
    flunkModalSub:
      '{name} (7 anos) está rindo na sua carteira! Antes de sair da sala, reviva ou assine o Juramento de Humildade:',
    officialReportCard: '📜 BOLETIM OFICIAL DA 2ª SÉRIE',
    pledgeQuotePrefix: '“Confesso solenemente a todos os meus amigos que ',
    pledgeQuoteHighlight: 'NÃO sou mais esperto que {name} (7 anos)',
    signedAndConfessed: '✅ Assinado e Confessado!',
    tapToSignAndConfess: '🎙️ Toque para Assinar e Confessar',
    watchVideoReviveAt: '🎬 Ver 1 Vídeo para REVIVER em {prize}!',
    copiedScoreCard: '✓ Boletim Copiado!',
    shareReportCard: '📲 Compartilhar Boletim',
    newGameBtn: '🔄 Novo Jogo ($100)',
    millionGraduateTitle: 'FORMADO GÊNIO DE $1.000.000!',
    millionGraduateSub:
      'Incrível! Você venceu todos os 10 níveis e provou que É mais esperto que uma criança de 7 anos!',
    goldenDiplomaHeader: '🏆 DIPLOMA DOURADO DE HONRA',
    playAnotherMillionRun: '🚀 Jogar Outra Rodada de $1.000.000!',
    schoolStoreTitle: 'Cantina Escolar e Ajudas',
    schoolStoreSub:
      'Precisa de mais dicas dos colegas de 7 anos? Assista a um vídeo rápido ou desbloqueie o Passe VIP!',
    watchAdRefillBtn: '🎬 Vídeo 30s: +2 Espiar, +1 Copiar e +2 Apagadores (GRÁTIS)',
    oneTimeProTitle: '🛡️ Desbloqueio Pro Único — $3.99 (Sem Assinatura!)',
    oneTimeProDesc:
      '• Remove todos os anúncios para sempre\n• Ajudas ILIMITADAS (Espiar, Copiar e Apagar 50/50)\n• Exportação do Boletim Escolar',
    backToChalkboard: 'Voltar ao Quadro',
    scholarshipLadderTitle: '🏆 Escada de Bolsa de $1.000.000',
    closeLadder: 'Fechar',
    todaysStories: '📸 Stories dos Colegas',
    makeDeskPartnerCta: 'Escolher como dupla →',
    ageLabel: 'Idade',
    proLabel: 'Pro',
    tapToHearVoice: '🔊 Toque para ouvir!',
    peekSpeechPrefix: '👀 Psiu! No meu caderno está:',
    idleSpeechTemplate: '🙋 "{pct}% dos adultos erram essa pergunta!"',
    subjects: {
      'Playground Riddles': 'Charadas do Recreio',
      'Math & Logic': 'Matemática e Lógica',
      'Science & Nature': 'Ciências e Natureza',
      'World & Space': 'Mundo e Espaço',
      'Words & Spelling': 'Palavras e Ortografia',
      'Everyday Traps': 'Pegadinhas do Dia a Dia',
    },
    grades: {
      Kindergarten: 'Jardim de Infância',
      '1st Grade': '1º Ano',
      '2nd Grade': '2º Ano',
      '7-Year-Old Genius': 'Gênio de 7 Anos',
    },
    themes: {
      tv_studio: 'Estúdio de TV Dourado',
      chalkboard: 'Sala da 2ª Série',
      cosmic_arcade: 'Recreio Cósmico',
    },
  },
  ar: {
    welcomeBadge: '🌍 النسخة العالمية • 8 لغات',
    welcomeTitle: 'اختر لغتك المفضلة',
    welcomeSubtitle:
      'العب البرنامج الكامل والأسئلة والتلميحات والشهادة المدرسية باللغة العربية.',
    continueInLang: 'ابدأ اللعب بالعربية ←',
    changeLanguageBtn: '🌐 اللغة',
    onboardingFinish: '🎒 ادخل الفصل الدراسي',
    onboardingPages: [
      {
        title: 'هل أنت أذكى من طفل عمره 7 سنوات؟',
        description:
          'تسلق 10 مراحل من أسئلة الصف الثاني الذكية — من نجمة الـ 100$ حتى شهادة العبقرية بقيمة 1,000,000$.',
      },
      {
        title: 'استعن بزملائك في الفصل',
        description:
          'ليو ومايا وتوبي وكلوي وزين بجانبك. انظر لورقتهم أو انسخ إجابتهم أو امسح إجابتين خاطئتين.',
      },
      {
        title: 'رسبت؟ اعترف بذلك!',
        description:
          'إذا أخطأت يجب أن توقع تعهد التواضع... أو تقرع جرس الفسحة لفرصة ثانية.',
      },
    ],
    gameShowArena: '🎒 حلبة المسابقة',
    appMainTitlePrefix: 'هل أنت أذكى من',
    appMainTitleHighlight: 'طفل عمره 7 سنوات؟',
    playgroundIq: 'معدل الذكاء',
    streak: 'سلسلة',
    rungLabel: 'مرحلة',
    secondsLeft: 'ث متبقية',
    vipActive: '👑 VIP مفعل',
    plusLifelines: '⭐ +مساعدات',
    removeAdsPrice: '🛡️ إزالة الإعلانات ($3.99)',
    honorRollActive: '👑 لوحة الشرف مفعلة',
    privacyPolicy: '🔒 الخصوصية',
    modeMillionLadder: '🏆 سلم الـ 1,000,000$',
    modeSpeedBlitz: '⚡ تحدي الـ 60 ثانية',
    modeSubjects: '📚 6 مواد دراسية',
    allSubjects: '🌟 جميع المواد',
    chooseDeskPartner: 'اسأل زميلك ذو الـ 7 سنوات (اضغط للفتح):',
    tapClassmateHint: 'اضغط على أي زميل لرؤية تلميحه',
    hideClassmateBox: '✕ إخفاء الزميل',
    showClassmateBox: '🙋 إظهار الزميل',
    adultsFailThis: '% من الكبار يخطئون هنا!',
    tapChalkboardReadAloud: '🔊 اضغط على السبورة لسماع السؤال',
    peekAtPaper: 'نظرة خاطفة',
    copyAnswer: 'نسخ الإجابة',
    eraseTwo: 'مسح إجابتين (50/50)',
    leftCount: 'متبقية',
    erasedBy: 'تم المسح بواسطة',
    correctHeadline: '🎉 إجابة صحيحة! أنت و{name} أبدعتما!',
    wrongHeadline: '🚨 أوه! تفوق عليك طفل عمره 7 سنوات!',
    secondGradeSecret: 'سر الصف الثاني:',
    claimMillionDiploma: '🎓 استلم شهادة الـ 1,000,000$! ←',
    climbToRung: 'انتقل للمرحلة {rung} ({prize}) ←',
    nextPlaygroundQuestion: 'السؤال التالي ←',
    watchAdRevive: '🎬 شاهد فيديو 30ث: جرس الفسحة للمتابعة!',
    signHumilityPledge: 'توقيع تعهد التواضع',
    flunkedOutAt: 'رسبت عند {prize}!',
    flunkModalSub:
      '{name} (7 سنوات) يضحك بجانبك! قبل مغادرة الفصل، تابع بالمشاهدة أو وقع تعهد التواضع:',
    officialReportCard: '📜 شهادة الصف الثاني الرسمية',
    pledgeQuotePrefix: '«أعترف أمام جميع أصدقائي أنني ',
    pledgeQuoteHighlight: 'لست أذكى من {name} (7 سنوات)',
    signedAndConfessed: '✅ تم التوقيع والاعتراف!',
    tapToSignAndConfess: '🎙️ اضغط للتوقيع والاعتراف',
    watchVideoReviveAt: '🎬 شاهد فيديو للمتابعة عند {prize}!',
    copiedScoreCard: '✓ تم نسخ الشهادة!',
    shareReportCard: '📲 مشاركة الشهادة',
    newGameBtn: '🔄 لعبة جديدة ($100)',
    millionGraduateTitle: 'خريج عبقري بمليون دولار!',
    millionGraduateSub:
      'مذهل! لقد اجتزت جميع المراحل الـ 10 وأثبت أنك أذكى من طفل عمره 7 سنوات!',
    goldenDiplomaHeader: '🏆 دبلوم الشرف الذهبي',
    playAnotherMillionRun: '🚀 العب جولة مليون جديدة!',
    schoolStoreTitle: 'متجر المدرسة والمساعدات',
    schoolStoreSub:
      'هل تحتاج إلى مزيد من المساعدات؟ شاهد إعلاناً قصيراً أو افتح باقة VIP!',
    watchAdRefillBtn: '🎬 فيديو 30ث: +2 نظرة، +1 نسخ، +2 مسح (مجاناً)',
    oneTimeProTitle: '🛡️ فتح النسخة الاحترافية مدى الحياة — $3.99',
    oneTimeProDesc:
      '• إزالة جميع الإعلانات للأبد\n• مساعدات غير محدودة في كل سؤال\n• تصدير الشهادة المدرسية',
    backToChalkboard: 'العودة للسبورة',
    scholarshipLadderTitle: '🏆 سلم منحة الـ 1,000,000$',
    closeLadder: 'إغلاق',
    todaysStories: '📸 قصص زملاء الفصل اليوم',
    makeDeskPartnerCta: 'اختره زميلاً لمقعدي ←',
    ageLabel: 'العمر',
    proLabel: 'محترف',
    tapToHearVoice: '🔊 اضغط لسماع الصوت!',
    peekSpeechPrefix: '👀 هس! كتبت في ورقتي:',
    idleSpeechTemplate: '🙋 "{pct}% من الكبار يخطئون في هذا السؤال!"',
    subjects: {
      'Playground Riddles': 'ألغاز الملعب',
      'Math & Logic': 'الرياضيات والمنطق',
      'Science & Nature': 'العلوم والطبيعة',
      'World & Space': 'العالم والفضاء',
      'Words & Spelling': 'الكلمات والإملاء',
      'Everyday Traps': 'خدع يومية',
    },
    grades: {
      Kindergarten: 'الروضة',
      '1st Grade': 'الصف الأول',
      '2nd Grade': 'الصف الثاني',
      '7-Year-Old Genius': 'عبقري الـ 7 سنوات',
    },
    themes: {
      tv_studio: 'الاستوديو الذهبي',
      chalkboard: 'فصل الصف الثاني',
      cosmic_arcade: 'الفسحة الفضائية',
    },
  },
  am: {
    welcomeBadge: '🌍 ዓለም አቀፍ እትም • 8 ቋንቋዎች',
    welcomeTitle: 'ቋንቋዎን ይምረጡ',
    welcomeSubtitle:
      'ሙሉውን የጥያቄ ውድድር፣ ፍንጮች እና የውጤት ካርድ በአማርኛ ይጫወቱ።',
    continueInLang: 'በአማርኛ መጫወት ይጀምሩ →',
    changeLanguageBtn: '🌐 ቋንቋ',
    onboardingFinish: '🎒 ወደ ክፍል ይግቡ',
    onboardingPages: [
      {
        title: 'ከ7 ዓመት ልጅ ይበልጥ ብልህ ነዎት?',
        description:
          '10 የ2ኛ ክፍል ተንኮለኛ ጥያቄዎችን ይውጡ — ከ$100 የወርቅ ኮከብ እስከ $1,000,000 ዲፕሎማ!',
      },
      {
        title: 'ከክፍል ጓደኞችዎ ይኮርጁ',
        description:
          'ሊዮ፣ ማያ፣ ቶቢ፣ ክሎይ እና ዜን አጠገብዎ ተቀምጠዋል። ወረቀታቸውን ይመልከቱ፣ መልس ይቅዱ ወይም 2 የተሳሳቱ ምርጫዎችን ያጥፉ።',
      },
      {
        title: 'ወደቁ? በትህትና ይመስክሩ!',
        description:
          'ጥያቄ ከሳቱ የትህትና ቃል ኪዳን ይፈርሙ… ወይም ለሁለተኛ ዕድል የዕረፍት ደወል ይደውሉ።',
      },
    ],
    gameShowArena: '🎒 የጥያቄ ውድድር መድረክ',
    appMainTitlePrefix: 'ከ7 ዓመት ልጅ ይበልጥ',
    appMainTitleHighlight: 'ብልህ ነዎት?',
    playgroundIq: 'የትምህርት ቤት IQ',
    streak: 'ተከታታይ',
    rungLabel: 'ደረጃ',
    secondsLeft: 'ሰ ቀረው',
    vipActive: '👑 VIP ገቢር',
    plusLifelines: '⭐ +እርዳታዎች',
    removeAdsPrice: '🛡️ ማስታወቂያ አጥፋ ($3.99)',
    honorRollActive: '👑 የክብር መዝገብ Pro',
    privacyPolicy: '🔒 ግላዊነት',
    modeMillionLadder: '🏆 የ$1,000,000 ደረጃ',
    modeSpeedBlitz: '⚡ የ60 ሰከንድ ፈጣን ውድድር',
    modeSubjects: '📚 6 የትምህርት ዓይነቶች',
    allSubjects: '🌟 ሁሉም ትምህርቶች',
    chooseDeskPartner: 'የ7 ዓመት የክፍል ጓደኛ ይጠይቁ (ይጫኑ):',
    tapClassmateHint: 'ፍንጭ ለማግኘት የክፍል ጓደኛ ይጫኑ',
    hideClassmateBox: '✕ ጓደኛን ደብቅ',
    showClassmateBox: '🙋 ጓደኛን አሳይ',
    adultsFailThis: '% አዋቂዎች ይህንን ይሳታሉ!',
    tapChalkboardReadAloud: '🔊 ጥያቄው እንዲነበብ ሰሌዳውን ይጫኑ',
    peekAtPaper: 'ወረቀት እይ',
    copyAnswer: 'መልስ ቅዳ',
    eraseTwo: '2 አጥፋ (50/50)',
    leftCount: 'ቀረ',
    erasedBy: 'የጠፋው በ',
    correctHeadline: '🎉 ትክክል! እርስዎ እና {name} አግኝተውታል!',
    wrongHeadline: '🚨 ኡፍ! የ7 ዓመት ልጅ በልጦዎታል!',
    secondGradeSecret: 'የ2ኛ ክፍል ሚስጥር:',
    claimMillionDiploma: '🎓 የ$1,000,000 ዲፕሎማ ይቀበሉ! →',
    climbToRung: 'ወደ ደረጃ {rung} ({prize}) ይውጡ →',
    nextPlaygroundQuestion: 'ቀጣይ ጥያቄ →',
    watchAdRevive: '🎬 የ30ሰ ቪዲዮ ይመልከቱ፡ ለመቀጠል ደወል ይደውሉ!',
    signHumilityPledge: 'የትህትና ቃል ይፈርሙ',
    flunkedOutAt: 'በ {prize} ወድቀዋል!',
    flunkModalSub:
      '{name} (ዕድሜ 7) እየሳቀ ነው! ከክፍል ከመውጣትዎ በፊት ይቀጥሉ ወይም የትህትና ቃል ኪዳኑን ይፈርሙ፡',
    officialReportCard: '📜 የ2ኛ ክፍል ይፋዊ የውጤት ካርድ',
    pledgeQuotePrefix: '“ለጓደኞቼ ሁሉ በይፋ የምመሰክረው፡ እኔ ',
    pledgeQuoteHighlight: 'ከ{name} (ዕድሜ 7) ይበልጥ ብልህ አይደለሁም',
    signedAndConfessed: '✅ ተፈርሟል እና ተመስክሯል!',
    tapToSignAndConfess: '🎙️ ለመፈረም እና ለመመስከር ይጫኑ',
    watchVideoReviveAt: '🎬 በ {prize} ለመቀጠል 1 ቪዲዮ ይመልከቱ!',
    copiedScoreCard: '✓ የውጤት ካርድ ተቀድቷል!',
    shareReportCard: '📲 የውጤት ካርድ አጋራ',
    newGameBtn: '🔄 አዲስ ጨዋታ ($100)',
    millionGraduateTitle: 'የ$1,000,000 ሊቅ ተመራቂ!',
    millionGraduateSub:
      'ድንቅ ነው! ሁሉንም 10 ደረጃዎች አሸንፈው ከ7 ዓመት ልጅ ይበልጥ ብልህ መሆንዎን አረጋግጠዋል!',
    goldenDiplomaHeader: '🏆 ወርቃማ የክብር ዲፕሎማ',
    playAnotherMillionRun: '🚀 ሌላ የ$1,000,000 ዙር ይጫወቱ!',
    schoolStoreTitle: 'የትምህርት ቤት መደብር እና እርዳታዎች',
    schoolStoreSub:
      'ከ7 ዓመት የክፍል ጓደኞችዎ ተጨማሪ እርዳታ ይፈልጋሉ? አጭር ቪዲዮ ይመልከቱ ወይም VIP ይክፈቱ!',
    watchAdRefillBtn: '🎬 የ30ሰ ቪዲዮ፡ +2 ማየት፣ +1 መቅዳት እና +2 ማጥፊያ (ነፃ)',
    oneTimeProTitle: '🛡️ የአንድ ጊዜ Pro መክፈቻ — $3.99 (ያለ ወርሃዊ ክፍያ!)',
    oneTimeProDesc:
      '• ሁሉንም ማስታወቂያዎች ለዘላለም ያጠፋል\n• ያልተገደበ ወረቀት ማየት፣ መቅዳት እና 50/50 ማጥፊያ\n• የውጤት ካርድ ማውረድ ይከፍታል',
    backToChalkboard: 'ወደ ሰሌዳው ተመለስ',
    scholarshipLadderTitle: '🏆 የ$1,000,000 ስኮላርሺፕ ደረጃ',
    closeLadder: 'ዝጋ',
    todaysStories: '📸 የዛሬ የክፍል ጓደኞች ታሪኮች',
    makeDeskPartnerCta: 'የጠረጴዛ ጓደኛዬ አድርግ →',
    ageLabel: 'ዕድሜ',
    proLabel: 'ሊቅ',
    tapToHearVoice: '🔊 ድምፅ ለመስማት ይጫኑ!',
    peekSpeechPrefix: '👀 ሹክ! በወረቀቴ ላይ የጻፍኩት፡',
    idleSpeechTemplate: '🙋 "{pct}% አዋቂዎች ይህን ጥያቄ ይሳታሉ!"',
    subjects: {
      'Playground Riddles': 'የሜዳ እንቆቅልሾች',
      'Math & Logic': 'ሒሳብ እና አመክንዮ',
      'Science & Nature': 'ሳይንስ እና ተፈጥሮ',
      'World & Space': 'ዓለም እና ጠፈር',
      'Words & Spelling': 'ቃላት እና ፊደል',
      'Everyday Traps': 'የዕለት ተዕለት ወጥመዶች',
    },
    grades: {
      Kindergarten: 'አፀደ ሕፃናት',
      '1st Grade': '1ኛ ክፍል',
      '2nd Grade': '2ኛ ክፍል',
      '7-Year-Old Genius': 'የ7 ዓመት ሊቅ',
    },
    themes: {
      tv_studio: 'ወርቃማ የቲቪ ስቱዲዮ',
      chalkboard: 'የ2ኛ ክፍል መማሪያ',
      cosmic_arcade: 'የጠፈር ዕረፍት',
    },
  },
  ja: {
    welcomeBadge: '🌍 グローバル版 • 8言語対応',
    welcomeTitle: '言語を選択してください',
    welcomeSubtitle:
      'クイズ番組、すべての問題、ヒント、通知表を日本語で楽しめます。',
    continueInLang: '日本語でプレイ開始 →',
    changeLanguageBtn: '🌐 言語',
    onboardingFinish: '🎒 教室に入る',
    onboardingPages: [
      {
        title: 'あなたは7歳児より賢い？',
        description:
          '小学2年生のひっかけ問題10ステージに挑戦！$100から$1,000,000の天才卒業証書を目指そう。',
      },
      {
        title: 'クラスメートの答えをカンニング',
        description:
          'レオ、マヤ、トビー、クロエ、ゼインが隣にいます。ノートを覗く、答えを写す、2択に絞るライフラインが使えます。',
      },
      {
        title: '不正解なら正直に宣言！',
        description:
          '間違えたら謙虚さの誓約書にサイン…または休み時間のベルを鳴らして復活しよう。',
      },
    ],
    gameShowArena: '🎒 クイズショー・アリーナ',
    appMainTitlePrefix: 'あなたは',
    appMainTitleHighlight: '7歳児より賢い？',
    playgroundIq: '校庭IQ',
    streak: '連勝',
    rungLabel: 'ステージ',
    secondsLeft: '秒 残り',
    vipActive: '👑 VIP有効',
    plusLifelines: '⭐ +ライフライン',
    removeAdsPrice: '🛡️ 広告削除 ($3.99)',
    honorRollActive: '👑 優等生Pro有効',
    privacyPolicy: '🔒 プライバシー',
    modeMillionLadder: '🏆 $1,000,000 ラダー',
    modeSpeedBlitz: '⚡ 60秒休み時間ブリッツ',
    modeSubjects: '📚 6つの教科練習',
    allSubjects: '🌟 すべての教科',
    chooseDeskPartner: '7歳のクラスメートに聞く（タップで開く）:',
    tapClassmateHint: 'クラスメートをタップするとヒントが見られます',
    hideClassmateBox: '✕ パートナーを隠す',
    showClassmateBox: '🙋 パートナーを表示',
    adultsFailThis: '%の大人が間違えます！',
    tapChalkboardReadAloud: '🔊 黒板をタップして問題の読み上げを聞く',
    peekAtPaper: 'ノートを覗く',
    copyAnswer: '答えを写す',
    eraseTwo: '2つ消す (50/50)',
    leftCount: '回',
    erasedBy: '消去:',
    correctHeadline: '🎉 大正解！あなたと{name}の勝利！',
    wrongHeadline: '🚨 ざんねん！7歳児に負けちゃった！',
    secondGradeSecret: '小学2年生のヒミツ:',
    claimMillionDiploma: '🎓 $1,000,000 天才卒業証書を受け取る！ →',
    climbToRung: 'ステージ {rung} ({prize}) へ進む →',
    nextPlaygroundQuestion: '次の問題へ →',
    watchAdRevive: '🎬 30秒動画を見て復活ベルを鳴らす！',
    signHumilityPledge: '誓約書にサイン',
    flunkedOutAt: '{prize} で落第！',
    flunkModalSub:
      '{name}（7歳）がクスクス笑っています！教室を出る前に復活するか、誓約書にサインしてください：',
    officialReportCard: '📜 公式 小学2年生の通知表',
    pledgeQuotePrefix: '「私、立派な大人は、友人の前で誓います。私は ',
    pledgeQuoteHighlight: '{name}（7歳）より賢くありません',
    signedAndConfessed: '✅ サイン＆宣誓完了！',
    tapToSignAndConfess: '🎙️ タップしてサイン＆声に出して宣誓',
    watchVideoReviveAt: '🎬 動画を1本見て {prize} で復活！',
    copiedScoreCard: '✓ 通知表をコピーしました！',
    shareReportCard: '📲 通知表をシェア',
    newGameBtn: '🔄 最初から ($100)',
    millionGraduateTitle: '$1,000,000 天才卒業生！',
    millionGraduateSub:
      '信じられない！全10ステージを突破し、7歳児より賢いことを証明しました！',
    goldenDiplomaHeader: '🏆 ゴールデン優等生卒業証書',
    playAnotherMillionRun: '🚀 もう一度 $1,000,000 に挑戦！',
    schoolStoreTitle: '購買部＆ライフライン補充',
    schoolStoreSub:
      '7歳のクラスメートからもっとヒントが欲しい？短い動画を見るかVIPパスを解放しよう！',
    watchAdRefillBtn: '🎬 30秒動画: 覗く+2・写す+1・黒板消し+2 (無料)',
    oneTimeProTitle: '🛡️ 買い切りPro解放 — $3.99 (サブスクなし！)',
    oneTimeProDesc:
      '• バナー＆全画面広告を永久に非表示\n• 覗く・写す・50/50ライフラインが無制限\n• 通知表のエクスポート機能を解放',
    backToChalkboard: '黒板に戻る',
    scholarshipLadderTitle: '🏆 $1,000,000 奨学金ラダー',
    closeLadder: '閉じる',
    todaysStories: '📸 今日のクラスメートストーリー',
    makeDeskPartnerCta: '隣の席のパートナーにする →',
    ageLabel: '年齢',
    proLabel: '名人',
    tapToHearVoice: '🔊 タップして声を聞く！',
    peekSpeechPrefix: '👀 内緒だよ！ぼくのノートにはこう書いたよ：',
    idleSpeechTemplate: '🙋 「大人の{pct}%がこの問題を間違えるんだよ！」',
    subjects: {
      'Playground Riddles': '校庭なぞなぞ',
      'Math & Logic': '算数・ロジック',
      'Science & Nature': '理科・いきもの',
      'World & Space': '世界・宇宙',
      'Words & Spelling': 'ことば・スペル',
      'Everyday Traps': '日常のひっかけ',
    },
    grades: {
      Kindergarten: 'ようちえん',
      '1st Grade': '小学1年生',
      '2nd Grade': '小学2年生',
      '7-Year-Old Genius': '7歳の天才',
    },
    themes: {
      tv_studio: 'ゴールデンTVスタジオ',
      chalkboard: '小学2年生の教室',
      cosmic_arcade: '宇宙の休み時間',
    },
  },
  so: {
    welcomeBadge: '🌍 CAALAMI • 9 LUQADOOD',
    welcomeTitle: 'Dooro Luqaddaada',
    welcomeSubtitle:
      'Ku ciyaar bandhigga oo dhan, su’aalaha, tilmaamaha iyo warbixinta luqadda aad doorbidayso.',
    continueInLang: 'Ku Bilow Af-Soomaali →',
    changeLanguageBtn: '🌐 Luqadda',
    onboardingFinish: '🎒 Gal Fasalka',
    onboardingPages: [
      {
        title: 'Ma Ka Caqli Badan Tahay 7-Jir?',
        description:
          'Fuul 10 درجة oo su’aalo fasalka 2-aad ah — laga bilaabo xiddig dahab ah ($100) ilaa shahaadada $1,000,000.',
      },
      {
        title: 'Kaasho ardayda fasalka',
        description:
          'Leo, Maya, Toby, Chloe & Zane ayaa ku ag fadhiya. Eeg warqaddooda, koobiyeey jawaabta, ama tirtir 2 jawaabood oo khaldan.',
      },
      {
        title: 'Haddii aad dhacdo, qiro!',
        description:
          'Haddii aad su’aal khaladdo waa inaad saxiixdaa Ballanqaadka Is-hoosaysiinta… ama garaac gambaleelka nasashada.',
      },
    ],
    gameShowArena: '🎒 GOOBTA BANDHIGGA TRIVIA',
    appMainTitlePrefix: 'Ma Ka Caqli Badan Tahay',
    appMainTitleHighlight: 'Ilmo 7-Jir Ah?',
    playgroundIq: 'IQ-ga Dugsiga',
    streak: 'Taxane',
    rungLabel: 'HEERKA',
    secondsLeft: 'ilbiriqsi',
    vipActive: '👑 VIP Shaqaynaya',
    plusLifelines: '⭐ +Caawimaad',
    removeAdsPrice: '🛡️ Ka Saar Xayeysiiska ($3.99)',
    honorRollActive: '👑 Honor Roll Pro Wuu Shaqaynayaa',
    privacyPolicy: '🔒 Xog-dhawrka',
    modeMillionLadder: '🏆 Jaranjarada $1,000,000',
    modeSpeedBlitz: '⚡ 60s Tartanka Degdegga',
    modeSubjects: '📚 6 Maaddo Dugsiga',
    allSubjects: '🌟 Dhammaan Maaddooyinka',
    chooseDeskPartner: 'WEYDII ARDAY 7-JIR AH (TAABO SI AAD U FURTO):',
    tapClassmateHint: 'Taabo arday kasta si aad u aragto tilmaantiisa',
    hideClassmateBox: '✕ Qari Sanduuqa Ardayga',
    showClassmateBox: '🙋 Muuji Sanduuqa Ardayga',
    adultsFailThis: '% Dadka Waaweyn Waa Ku Dhacaan!',
    tapChalkboardReadAloud: '🔊 Taabo sabuuradda si laguu akhriyo su’aasha',
    peekAtPaper: 'Eeg Warqadda',
    copyAnswer: 'Koobiyeey Jawaabta',
    eraseTwo: 'Tirtir 2 (50/50)',
    leftCount: 'hadhay',
    erasedBy: 'Waxaa tirtiray',
    correctHeadline: '🎉 WAA SAX! Adiga iyo {name} waad haleesheen!',
    wrongHeadline: '🚨 HAAY! Ilmo 7-jir ah ayaa kaa badiyay!',
    secondGradeSecret: 'Sirta Fasalka 2-aad:',
    claimMillionDiploma: '🎓 Qaado Shahaadada $1,000,000! →',
    climbToRung: 'U Gudub Heerka {rung} ({prize}) →',
    nextPlaygroundQuestion: 'Su’aasha Xigta →',
    watchAdRevive: '🎬 Daawo 30s Xayeysiis: Fursad Labaad!',
    signHumilityPledge: 'Saxiix Ballanqaadka',
    flunkedOutAt: 'WAAD KU DHACDAY HEERKA {prize}!',
    flunkModalSub:
      '{name} (7-jir) ayaa kugu qoslaya! Intaadan fasalka ka bixin, fursad labaad qaado ama saxiix Ballanqaadka:',
    officialReportCard: '📜 WARBIXINTA RASMIGA AH EE FASALKA 2-AAD',
    pledgeQuotePrefix: '“Waxaan si rasmi ah saaxiibaday ugu qiranayaa inaanan ',
    pledgeQuoteHighlight: 'ka caqli badnayn {name} (7-jir)',
    signedAndConfessed: '✅ Waa La Saxiixay Oo La Qirtay!',
    tapToSignAndConfess: '🎙️ Taabo Si Aad U Saxiixdo & U Qirato',
    watchVideoReviveAt: '🎬 Daawo 1 Fiidiyow si aad ugu soo laabato {prize}!',
    copiedScoreCard: '✓ Natiijada Waa La Koobiyeeyay!',
    shareReportCard: '📲 La Wadaag Natiijada',
    newGameBtn: '🔄 Ciyaar Cusub ($100)',
    millionGraduateTitle: 'QALIN-JABIYAHA $1,000,000!',
    millionGraduateSub:
      'Lama rumaysan karo! Waxaad ka gudubtay dhammaan 10-ka heer oo waxaad caddaysay inaad ka caqli badan tahay 7-jir!',
    goldenDiplomaHeader: '🏆 SHAHAADADA DAHABKA AH',
    playAnotherMillionRun: '🚀 Ciyaar Tartan Kale oo $1,000,000 ah!',
    schoolStoreTitle: 'Dukaanka Dugsiga & Caawimaadda',
    schoolStoreSub:
      'Ma u baahan tahay caawimaad dheeraad ah? Daawo xayeysiis gaaban ama fur VIP Pass!',
    watchAdRefillBtn: '🎬 Daawo 30s Fiidiyow: +2 Eegis, +1 Koobi & +2 Tirtir (BILAASH)',
    oneTimeProTitle: '🛡️ Hal-Mar Furasho Pro — $3.99 (Bille Ma Laha!)',
    oneTimeProDesc:
      '• Si joogto ah ayuu u saarayaa dhammaan xayeysiisyada\n• Caawimaad aan xad lahayn (Eeg, Koobi & 50/50)\n• Wuxuu furayaa soo-dejinta shahaadada',
    backToChalkboard: 'Ku Noqo Sabuuradda',
    scholarshipLadderTitle: '🏆 Jaranjarada Abaalmarinta $1,000,000',
    closeLadder: 'Xir Jaranjarada',
    todaysStories: '📸 Sheekooyinka Ardayda Maanta',
    makeDeskPartnerCta: 'Ka dhig saaxiibka kursiga →',
    ageLabel: 'Da’da',
    proLabel: 'Xariif',
    tapToHearVoice: '🔊 Taabo si aad u maqasho codka!',
    peekSpeechPrefix: '👀 Hoos u eeg! Warqaddaydu waxay leedahay:',
    idleSpeechTemplate: '🙋 "{pct}% dadka waaweyn su’aashan way khaldaan!"',
    subjects: {
      'Playground Riddles': 'Halxiraalaha Dugsiga',
      'Math & Logic': 'Xisaab & Maangal',
      'Science & Nature': 'Saynis & Dabeecad',
      'World & Space': 'Adduunka & Hawada Sare',
      'Words & Spelling': 'Erayada & Higgaadda',
      'Everyday Traps': 'Dabinada Maalinlaha',
    },
    grades: {
      Kindergarten: 'Xanaano',
      '1st Grade': 'Fasalka 1-aad',
      '2nd Grade': 'Fasalka 2-aad',
      '7-Year-Old Genius': 'Xariif 7-Jir Ah',
    },
    themes: {
      tv_studio: 'Istuudiyaha Dahabka',
      chalkboard: 'Fasalka 2-aad',
      cosmic_arcade: 'Nasashada Hawada Sare',
    },
  },
  om: {
    welcomeBadge: '🌍 EDITION ADDUNYAA • AFAANOTA 11',
    welcomeTitle: 'Afaan Kee Filadhu',
    welcomeSubtitle:
      'Tapha guutuu, gaaffilee 2,000+, gorsa barattootaa fi waraqaa qabxii Afaan Oromootiin taphadhu.',
    continueInLang: 'Afaan Oromootiin Eegali →',
    changeLanguageBtn: '🌐 Afaan',
    onboardingFinish: '🎒 Kutaa Barnootaa Seeni',
    onboardingPages: [
      {
        title: 'Mucaa Waggaa 7 Caalaa Gamnaa?',
        description:
          'Gaaffilee kutaa 2ffaa sadarkaa 10 qaban yaali — urjii warqee $100 irraa kaasee hanga waraqaa ragaa $1,000,000tti.',
      },
      {
        title: 'Hiriyoota Kutaa Kee Irraa Gargaarsa Gaafadhu',
        description:
          'Leo, Maya, Toby, Chloe fi Zane si bira taa’u. Waraqaa isaanii ilaali, deebii garagalchi, ykn filannoo dogoggoraa 2 haqi.',
      },
      {
        title: 'Yoo Kufte Dhugaa Dubbadhu!',
        description:
          'Gaaffii yoo dogoggorte Waadaa Gad-of-qabummaa mallatteessi… ykn bilbila boqonnaa bilbiluun carraa 2ffaa argadhu.',
      },
    ],
    gameShowArena: '🎒 DIRREE TAPHA GAAFFII FI DEEBII',
    appMainTitlePrefix: 'Ati Mucaa Waggaa 7',
    appMainTitleHighlight: 'Caalaa Gamnaa?',
    playgroundIq: 'IQ Dirree',
    streak: 'Walitti-aansee',
    rungLabel: 'SADARKAA',
    secondsLeft: 's HAFE',
    vipActive: '👑 VIP Hojii Irra Jira',
    plusLifelines: '⭐ +Gargaarsa',
    removeAdsPrice: '🛡️ Beeksisa Haqi ($3.99)',
    honorRollActive: '👑 Honor Roll Pro Hojii Irra Jira',
    privacyPolicy: '🔒 Iccitii',
    modeMillionLadder: '🏆 Sadarkaa $1,000,000',
    modeSpeedBlitz: '⚡ Sekondii 60 Ariifachiisaa',
    modeSubjects: '📚 Gosoota Barnootaa 6',
    allSubjects: '🌟 Barnoota Hunda',
    chooseDeskPartner: 'BARATAA WAGGAA 7 GAAFADHU (BANUUF TUQI):',
    tapClassmateHint: 'Gorsa argachuuf barataa barbaadde tuqi',
    hideClassmateBox: '✕ Sanduuqa Barataa Dhoksi',
    showClassmateBox: '🙋 Sanduuqa Barataa Agarsiisi',
    adultsFailThis: '% Ga’eessotaa Gaaffii Kana Ni Dogoggoru!',
    tapChalkboardReadAloud: '🔊 Gaaffii sagaleedhaan dhaggeeffachuuf gabatee gurraacha tuqi',
    peekAtPaper: 'Waraqaa Ilaali',
    copyAnswer: 'Deebii Garagalchi',
    eraseTwo: '2 Haqi (50/50)',
    leftCount: 'hafe',
    erasedBy: 'Kan haqe:',
    correctHeadline: '🎉 SIRRII DHA! Atii fi {name} argattaniittu!',
    wrongHeadline: '🚨 UUF! Mucaan Waggaa 7 Si Mo’ate! 😂',
    secondGradeSecret: 'Iccitii Kutaa 2ffaa:',
    claimMillionDiploma: '🎓 Waraqaa Ragaa $1,000,000 Fudhadhu! →',
    climbToRung: 'Gara Sadarkaa {rung} ({prize}) Ol Bahi →',
    nextPlaygroundQuestion: 'Gaaffii Itti Aanu →',
    watchAdRevive: '🎬 Viidiyoo 30s Ilaali: Carraa 2ffaa Argadhu!',
    signHumilityPledge: 'Waadaa Mallatteessi',
    flunkedOutAt: 'SADARKAA {prize} IRRATTI KUFTE!',
    flunkModalSub:
      '{name} (Waggaa 7) si kolfaa jira! Kutaa keessaa bahuu kee dura, carraa 2ffaa fudhadhu ykn Waadaa mallatteessi:',
    officialReportCard: '📜 WARAQAA QABXII KUTAA 2FFAA',
    pledgeQuotePrefix: '“Hiriyoota koo hunda duratti dhugaa nan ba’a: ani ',
    pledgeQuoteHighlight: '{name} (Waggaa 7) caalaa gamna MITI',
    signedAndConfessed: '✅ Mallatteeffameera & Sagaleedhaan Himameera!',
    tapToSignAndConfess: '🎙️ Mallatteessuu fi Dubbachuuf Tuqi',
    watchVideoReviveAt: '🎬 {prize} irratti deebi’uuf Viidiyoo 1 Ilaali!',
    copiedScoreCard: '✓ Waraqaan Qabxii Garagalchameera!',
    shareReportCard: '📲 Qabxii Hiriyootaaf Qoodi',
    newGameBtn: '🔄 Tapha Haaraa ($100)',
    millionGraduateTitle: 'EBBIFAMAA HAYYUU $1,000,000!',
    millionGraduateSub:
      'Kan nama dinqisiisu! Sadarkaa 10n ফুরtee mucaa waggaa 7 caalaa gamna ta’uu kee mirkaneessiteetta!',
    goldenDiplomaHeader: '🏆 DIPLOOMAA WARQEE KABAJAA',
    playAnotherMillionRun: '🚀 Marsaa $1,000,000 Biroo Taphadhu!',
    schoolStoreTitle: 'Suuqii Mana Barumsaa & Gargaarsa',
    schoolStoreSub:
      'Hiriyoota kutaa kee waggaa 7 irraa gargaarsa dabalataa barbaaddaa? Viidiyoo gabaabaa ilaali ykn VIP bani!',
    watchAdRefillBtn: '🎬 Viidiyoo 30s: +2 Ilaalcha, +1 Garagalcha & +2 Haqaa (MAALLAQA MALEE)',
    oneTimeProTitle: '🛡️ Al-Tokko Pro Bani — $3.99 (Kaffaltii Ji’aa Hin Qabu!)',
    oneTimeProDesc:
      '• Beeksisoota hunda yeroo hundaaf ni haqa\n• Gargaarsa daangaa hin qabne (Ilaali, Garagalchi & 50/50)\n• Waraqaa qabxii maxxansuu ni bana',
    backToChalkboard: 'Gara Gabatee Gurraachaatti Deebi’i',
    scholarshipLadderTitle: '🏆 Sadarkaa Badhaasa $1,000,000',
    closeLadder: 'Cufi',
    todaysStories: '📸 Seenaa Barattoota Har’aa',
    makeDeskPartnerCta: 'Hiriyaa teessoo koo godhi →',
    ageLabel: 'Umurii',
    proLabel: 'Hayyuu',
    tapToHearVoice: '🔊 Sagalee dhaggeeffachuuf tuqi!',
    peekSpeechPrefix: '👀 Iccitii! Waraqaan koo akkana jedha:',
    idleSpeechTemplate: '🙋 "Ga’eessota keessaa %{pct} gaaffii kana ni dogoggoru!"',
    subjects: {
      'Playground Riddles': 'Hiibboo Dirree',
      'Math & Logic': 'Herrega & Sababa',
      'Science & Nature': 'Saayinsii & Uumama',
      'World & Space': 'Addunyaa & Hawaa',
      'Words & Spelling': 'Jechoota & Qubee',
      'Everyday Traps': 'Kiyyoo Guyyaa Guyyaa',
    },
    grades: {
      Kindergarten: 'Oolmaa Daa’immanii',
      '1st Grade': 'Kutaa 1ffaa',
      '2nd Grade': 'Kutaa 2ffaa',
      '7-Year-Old Genius': 'Hayyuu Waggaa 7',
    },
    themes: {
      tv_studio: 'Istuudiyoo TV Warqee',
      chalkboard: 'Kutaa 2ffaa',
      cosmic_arcade: 'Boqonnaa Hawaa',
    },
  },
  har: {
    welcomeBadge: '🌍 ዓለም አቀፍ • 11 ሉغات (ሐረሪ / ጌይ ሲናን)',
    welcomeTitle: 'ሉغاሁ ምረጡ (Choose Language)',
    welcomeSubtitle:
      'ሙሉእ ጨዋታው፣ 2,000+ ኢትዮጵያዊ ወ ዓለም አቀፍ ጥያቄያች፣ ዋ ሪፖርት ካርዲ በሐረሪ (ጌይ ሲናን / Adare) ተጫወቱ።',
    continueInLang: 'በሐረሪ (ጌይ ሲናን) ጀምሪ →',
    changeLanguageBtn: '🌐 ሉغا (Language)',
    onboardingFinish: '🎒 ወደ መድረሳ ኡስጡ ግባእ',
    onboardingPages: [
      {
        title: 'ከ7 አመት ልጂ ዪበልጢ ጪቅላ ዛላሁ?',
        description:
          '10 ደረጃ የ2ኛ ክፍል ጥያቄያች ውጣእ — ከ$100 ወርቂ ኮከብ እስከ $1,000,000 ዲፕሎማ።',
      },
      {
        title: 'ከክፍል ጓደኛች ኢርዳታ ጠይቂ',
        description:
          'ሊዮ፣ ማያ፣ ቶቢ፣ ክሎኢ ዋ ዜይን አጠገብሁ ይትገበሉ። ወረቀትዚዮ ሑ online ዪታይ፣ መልሲ ቅዳሕ ወይ 2 غلط መልሲ አጥፋእ።',
      },
      {
        title: 'ተሸነፍኩ? እውነት ተናገሪ!',
        description:
          'ጥያቄ ቢትሳሳት የትህትና ቃል ኪዳን ፈርሚ… ወይ የዕረፍት ደወል ደውሊ።',
      },
    ],
    gameShowArena: '🎒 የጥያቄ ዋ መልሲ ሜዳ (ጌይ መድረሳ)',
    appMainTitlePrefix: 'ከ7 አመት ልጂ',
    appMainTitleHighlight: 'ዪበልጢ ብልህ ኢንታሁ?',
    playgroundIq: 'የሜዳ IQ',
    streak: 'ተከታታይ ድል',
    rungLabel: 'ደረጃ',
    secondsLeft: 'ሰ ቀረ',
    vipActive: '👑 VIP ንቁ ኢንታ',
    plusLifelines: '⭐ +ኢርዳታ',
    removeAdsPrice: '🛡️ ማስታወቂያ አጥፋእ ($3.99)',
    honorRollActive: '👑 Honor Roll Pro ንቁ ኢንታ',
    privacyPolicy: '🔒 ሚስጥር',
    modeMillionLadder: '🏆 የ$1,000,000 ደረጃ',
    modeSpeedBlitz: '⚡ የ60 ሰከንድ ፈጣን ውድድር',
    modeSubjects: '📚 6 የትምህርት ዓይነታች',
    allSubjects: '🌟 ሁሉም ትምህርታች',
    chooseDeskPartner: 'የ7 አመት የክፍል ጓደኛ ጠይቂ (ለመክፈት ንካእ):',
    tapClassmateHint: 'ፍንጭ ለማግኘት ማንኛውም ተማሪ ንካእ',
    hideClassmateBox: '✕ የተማሪ ሳጥን ደብቂ',
    showClassmateBox: '🙋 የተማሪ ሳጥን አሳይ',
    adultsFailThis: '% አዋቂያች ይህን ጥያቄ ይሳሳታሉ!',
    tapChalkboardReadAloud: '🔊 ጥያቄው በድምፅ ለመስማት ጥቁር ሰሌዳው ንካእ',
    peekAtPaper: 'ወረቀት እይ',
    copyAnswer: 'መልሲ ቅዳሕ',
    eraseTwo: '2 አጥፋእ (50/50)',
    leftCount: 'ቀረ',
    erasedBy: 'ያጠፋው:',
    correctHeadline: '🎉 ሶፊ (ትክክል)! አሁ ዋ {name} አገኛችሁት!',
    wrongHeadline: '🚨 ኡፍ! የ7 አመት ልጂ አሸነፈሁ! 😂',
    secondGradeSecret: 'የ2ኛ ክፍል ሚስጥር:',
    claimMillionDiploma: '🎓 የ$1,000,000 ዲፕሎማ ውሰዲ! →',
    climbToRung: 'ወደ ደረጃ {rung} ({prize}) ውጣእ →',
    nextPlaygroundQuestion: 'ቀጣይ ጥያቄ →',
    watchAdRevive: '🎬 የ30ሰ ቪዲዮ እይ: ሁለተኛ ዕድል አግኚ!',
    signHumilityPledge: 'ቃል ኪዳን ፈርሚ',
    flunkedOutAt: 'በ{prize} ደረጃ ወደቅሁ!',
    flunkModalSub:
      '{name} (7 አመት) እየሳቀብሁ ኢንታ! ከክፍል ከመውጣትሁ በፊት ሁለተኛ ዕድል ውሰዲ ወይ ቃል ኪዳን ፈርሚ:',
    officialReportCard: '📜 የ2ኛ ክፍል ኦፊሴላዊ የውጤት ካርድ',
    pledgeQuotePrefix: '“በጓደኛቼ ሁሉ ፊት በታማኝነት አምናለሁ፡ አነ ',
    pledgeQuoteHighlight: 'ከ{name} (7 አመት) ዪበልጢ ብልህ አይደለሁም',
    signedAndConfessed: '✅ ተፈርሟል ዋ በድምፅ ተነግሯል!',
    tapToSignAndConfess: '🎙️ ለመፈረም ዋ በድምፅ ለመናገር ንካእ',
    watchVideoReviveAt: '🎬 በ{prize} ለመቀጠል 1 ቪዲዮ እይ!',
    copiedScoreCard: '✓ የውጤት ካርድ ተቀድቷል!',
    shareReportCard: '📲 ውጤት አጋራ',
    newGameBtn: '🔄 ሐዲሽ ጨዋታ ($100)',
    millionGraduateTitle: 'የ$1,000,000 ሊቅ ተመራቂ!',
    millionGraduateSub:
      'ድንቅ ኢንታ! ሁሉም 10 ደረጃያች አሸንፈው ከ7 አመት ልጂ ዪበልጢ ብልህ መሆንሁ አረጋገጥሁ!',
    goldenDiplomaHeader: '🏆 ወርቃማ የክብር ዲፕሎማ',
    playAnotherMillionRun: '🚀 ሌላ የ$1,000,000 ዙር ተጫወቲ!',
    schoolStoreTitle: 'የመድረሳ ሱቅ ዋ ኢርዳታያች',
    schoolStoreSub:
      'ከ7 አመት የክፍል ጓደኛች ተጨማሪ ኢርዳታ ትፈልጋለሁ? አጭር ቪዲዮ እይ ወይ VIP ክፈቲ!',
    watchAdRefillBtn: '🎬 የ30ሰ ቪዲዮ: +2 ማየት፣ +1 መቅዳት ዋ +2 ማጥፊያ (ነፃ)',
    oneTimeProTitle: '🛡️ የአንድ ጊዜ Pro መክፈቻ — $3.99 (ያለ ወርሃዊ ክፍያ!)',
    oneTimeProDesc:
      '• ሁሉም ማስታወቂያያች ለዘላለም ያጠፋል\n• ያልተገደበ ወረቀት ማየት፣ መቅዳት ዋ 50/50 ማጥፊያ\n• የውጤት ካርድ ማውረድ ይከፍታል',
    backToChalkboard: 'ወደ ሰሌዳው ተመለሲ',
    scholarshipLadderTitle: '🏆 የ$1,000,000 ስኮላርሺፕ ደረጃ',
    closeLadder: 'ዝጋእ',
    todaysStories: '📸 የዛሬ የተማሪያች ታሪካች',
    makeDeskPartnerCta: 'የጠረጴዛ ጓደኛዬ አድርጊ →',
    ageLabel: 'ዕድሜ',
    proLabel: 'ሊቅ',
    tapToHearVoice: '🔊 ድምፅ ለመስማት ንካእ!',
    peekSpeechPrefix: '👀 ሹክ! በወረቀቴ ላይ የጻፍኩት:',
    idleSpeechTemplate: '🙋 "{pct}% አዋቂያች ይህን ጥያቄ ይሳሳታሉ!"',
    subjects: {
      'Playground Riddles': 'የሜዳ እንቆቅልشاች',
      'Math & Logic': 'ሒሳብ ዋ አመክንዮ',
      'Science & Nature': 'ሳይንስ ዋ ተፈጥሮ',
      'World & Space': 'ዓለም ዋ ጠፈር',
      'Words & Spelling': 'ቃላት ዋ ፊደል',
      'Everyday Traps': 'የዕለት ወጥመዳች',
    },
    grades: {
      Kindergarten: 'አፀደ ሕፃናት',
      '1st Grade': '1ኛ ክፍል',
      '2nd Grade': '2ኛ ክፍል',
      '7-Year-Old Genius': 'የ7 አመት ሊቅ',
    },
    themes: {
      tv_studio: 'ወርቃማ የቲቪ ስቱዲዮ',
      chalkboard: 'የ2ኛ ክፍል መድረሳ',
      cosmic_arcade: 'የጠፈር ዕረፍት',
    },
  },
};

type QuestionTranslation = Pick<
  TriviaQuestion7Yo,
  'question' | 'options' | 'kidPeekNote' | 'kidRoastOnMiss' | 'funFact'
>;

const QUESTION_TRANSLATIONS: Partial<
  Record<AppLanguage, Record<string, QuestionTranslation>>
> = {
  de: {
    'q-race-2nd': {
      question:
        'Du läufst bei einem Schulhof-Rennen und überholst die Person auf dem 2. Platz! Auf welchem Platz bist du jetzt?',
      options: ['1. Platz', '2. Platz', '3. Platz', 'Gleichauf mit Platz 1'],
      kidPeekNote:
        'Warte! Nimm nicht Platz 1! Wenn du den Zweiten überholst, nimmst du SEINEN Platz ein – du bist also auf dem 2. Platz!',
      kidRoastOnMiss:
        'Haha! Wenn du den 2. Platz überholst, ist der 1. Platz immer noch vor dir! Du bist Zweiter!',
      funFact:
        'Über 65 % der Erwachsenen rufen unter Zeitdruck sofort „1. Platz“, während Kinder sich die Läufer bildlich vorstellen!',
    },
    'q-paint-mix': {
      question:
        'Wenn du im Kunstunterricht GELBE und BLAUE Farbe zusammenmischst, welche Farbe erhältst du?',
      options: ['Lila', 'Orange', 'Grün', 'Braun'],
      kidPeekNote: 'Gelb + Blau ergibt GRÜN wie Gras! Rot + Blau ergibt Lila!',
      kidRoastOnMiss:
        'Hast du im Kindergarten nie mit Fingerfarben gemalt?! Gelb und Blau ergibt GRÜN!',
      funFact:
        'Gelb und Blau sind subtraktive Grundfarben, die gemischt grünes Licht reflektieren.',
    },
    'q-spider-legs': {
      question: 'Wie viele Beine hat eine Spinne?',
      options: ['6 Beine', '8 Beine', '10 Beine', '12 Beine'],
      kidPeekNote:
        'Insekten haben 6 Beine, aber Spinnen sind Spinnentiere – sie haben 8 Beine!',
      kidRoastOnMiss: 'Zähl nach! Spinnen haben 8 Krabbelbeine! Käfer haben 6!',
      funFact:
        'Alle Spinnentiere (Spinnen, Skorpione) haben 8 Beine, während Insekten immer 6 haben.',
    },
    'q-months-28': {
      question: 'Wie viele Monate im Jahr haben 28 Tage?',
      options: [
        'Nur 1 (Februar)',
        '2 Monate',
        '6 Monate',
        'Alle 12 Monate!',
      ],
      kidPeekNote:
        'Psst! Das ist eine Fangfrage! JEDER Monat hat mindestens 28 Tage – alle 12 Monate!',
      kidRoastOnMiss:
        'ERWISCHT!! Du hast Februar gewählt, oder?! Jeder einzelne Monat hat einen 28. Tag!',
      funFact:
        'Fast 4 von 5 Erwachsenen tippen sofort auf „Nur 1 (Februar)“, weil ihr Gehirn „genau 28 Tage“ liest.',
    },
    'q-farmer-sheep': {
      question:
        'Ein Bauer hat 17 flauschige Schafe. Ein Gewitter zieht auf und ALLE AUSSER 9 laufen weg! Wie viele Schafe hat der Bauer noch?',
      options: ['8 Schafe', '9 Schafe', '17 Schafe', '26 Schafe'],
      kidPeekNote:
        'Rechne nicht 17 - 9! Lies genau: „ALLE AUSSER 9“ liefen weg – also sind 9 geblieben!',
      kidRoastOnMiss:
        'Bahaha! Du hast 17 minus 9 = 8 gerechnet, stimmt’s?! „Alle außer 9“ heißt, dass 9 Schafe noch da sind!',
      funFact:
        'Erwachsene ziehen automatisch Zahlen voneinander ab, während Kinder genau auf die Geschichte hören!',
    },
    'q-stop-sign': {
      question:
        'Ein rotes STOPP-Schild an der Straße ist ein Achteck (Oktogon). Wie viele Ecken/Seiten hat es?',
      options: ['6 Seiten', '7 Seiten', '8 Seiten', '10 Seiten'],
      kidPeekNote:
        'Denk an einen OKTO-pus mit 8 Armen! Ein OKTO-gon hat 8 Seiten!',
      kidRoastOnMiss:
        'Du fährst jeden Tag an Stoppschildern vorbei und wusstest nicht, dass es 8 Seiten hat?!',
      funFact:
        'Okto stammt vom griechischen Wort für Acht – genau wie beim Oktopus!',
    },
    'q-rooster-egg': {
      question:
        'Ein Hahn sitzt genau auf der Spitze eines Scheunendachs und schaut nach Norden. Der Wind weht nach Westen. Wenn der Hahn ein Ei legt, wohin rollt es?',
      options: [
        'Nach Westen mit dem Wind',
        'Nach Osten gegen den Wind',
        'Nach Süden die Ziegel hinunter',
        'Nirgendwohin – Hähne legen keine Eier!',
      ],
      kidPeekNote: 'Hehehe! Hähne sind MÄNNLICHE Hühner! Nur HENNEN legen Eier!',
      kidRoastOnMiss:
        'BWAHAHA! Du hast die Windrichtung für einen HAHN berechnet?! Hähne legen doch keine Eier!!',
      funFact:
        'Unwichtige Physik-Details („Wind nach Westen“) lenken Erwachsene davon ab, dass es ein Hahn ist.',
    },
    'q-flying-mammal': {
      question:
        'Welches dieser Tiere ist das EINZIGE Säugetier der Welt, das wirklich aktiv fliegen kann?',
      options: ['Flughörnchen', 'Fledermaus', 'Strauß', 'Papageientaucher'],
      kidPeekNote:
        'Flughörnchen gleiten nur! Fledermäuse haben Fell, trinken als Babys Milch und fliegen wirklich!',
      kidRoastOnMiss:
        'Flughörnchen segeln nur von Baum zu Baum! FLEDERMÄUSE sind die einzigen fliegenden Säugetiere!',
      funFact:
        'Fledermäuse machen rund 20 % aller Säugetierarten auf der Erde aus.',
    },
    'q-spell-incorrectly': {
      question:
        'Welches Wort wird in jedem deutschen Wörterbuch IMMER „falsch“ geschrieben?',
      options: ['Missverständnis', 'Mittwoch', 'Das Wort „falsch“', 'Rhythmus'],
      kidPeekNote:
        'Schau auf die Anführungszeichen! Das Wort „FALSCH“ wird buchstäblich f-a-l-s-c-h geschrieben!',
      kidRoastOnMiss:
        'Hehe! Das Wort „falsch“ wird natürlich immer „falsch“ geschrieben!',
      funFact:
        'Klassisches Zweitklässler-Wortspiel! Kinder erkennen solche Sprachrätsel doppelt so schnell wie Erwachsene.',
    },
    'q-pound-feathers': {
      question:
        'Was wiegt mehr: 1 Kilo flauschige Gänsefedern oder 1 Kilo schwere rote Ziegelsteine?',
      options: [
        '1 Kilo Ziegelsteine',
        '1 Kilo Federn',
        'Beide wiegen exakt gleich viel!',
        'Hängt von der Schwerkraft ab',
      ],
      kidPeekNote:
        '1 Kilo ist 1 Kilo! Die Federn brauchen nur einen größeren Sack, aber sie wiegen GLEICH VIEL!',
      kidRoastOnMiss:
        'Bist du wirklich auf den ältesten Schulhof-Trick der Welt reingefallen?! Ein Kilo bleibt ein Kilo!',
      funFact:
        'Beide wiegen exakt 1.000 Gramm – nur ihre Dichte und ihr Volumen unterscheiden sich!',
    },
    'q-octopus-hearts': {
      question:
        'Wir Menschen haben 1 Herz. Wie viele Herzen hat ein Riesenpazifikkrake (Oktopus)?',
      options: ['1 Herz', '2 Herzen', '3 Herzen', '8 Herzen'],
      kidPeekNote:
        'Ein Oktopus hat 8 Arme, 9 Gehirne und DREI Herzen!',
      kidRoastOnMiss:
        'Falsch! Ein Oktopus hat DREI Herzen! Zwei pumpen Blut zu den Kiemen und eines durch den Körper!',
      funFact:
        'Kraken haben 3 Herzen und blaues Blut, das ihnen in kalten Tiefseegewässern hilft.',
    },
    'q-largest-ocean': {
      question: 'Welcher ist der größte und tiefste Ozean auf dem Planeten Erde?',
      options: [
        'Atlantischer Ozean',
        'Indischer Ozean',
        'Pazifischer Ozean',
        'Arktischer Ozean',
      ],
      kidPeekNote:
        'Der PAZIFIK ist so gigantisch, dass alle Kontinente der Erde hineinpassen würden!',
      kidRoastOnMiss:
        'Schau auf meinen Globus! Der Pazifische Ozean bedeckt über 30 % der gesamten Erde!',
      funFact:
        'Der Pazifische Ozean ist größer als alle Landflächen der Erde zusammen!',
    },
    'q-apples-take-away': {
      question:
        'Auf dem Tisch steht eine Schale mit 6 roten Äpfeln. Du nimmst 4 Äpfel weg. Wie viele Äpfel hast DU jetzt?',
      options: ['2 Äpfel', '4 Äpfel', '6 Äpfel', '10 Äpfel'],
      kidPeekNote:
        'Lies genau: „Wie viele Äpfel hast DU?“ Wenn du 4 Äpfel nimmst, hältst DU 4 Äpfel in der Hand!',
      kidRoastOnMiss:
        'SCHON WIEDER ERWISCHT! 2 liegen noch in der Schale, aber DU hast 4 genommen – also hast DU 4!',
      funFact:
        '83 % der Erwachsenen antworten „2“, weil sie automatisch berechnen, was in der Schale übrig bleibt.',
    },
    'q-caterpillar-change': {
      question:
        'Wie heißt das Fachwort dafür, wenn sich eine Raupe im Kokon in einen Schmetterling verwandelt?',
      options: ['Fotosynthese', 'Metamorphose', 'Winterschlaf', 'Verdunstung'],
      kidPeekNote:
        'Pflanzen machen Fotosynthese! Wenn Raupen zu Schmetterlingen werden, heißt das META-MOR-PHO-SE!',
      kidRoastOnMiss:
        'Fotosynthese machen Pflanzen mit Sonnenlicht! Bei Raupen heißt das METAMORPHOSE!',
      funFact:
        'Im Kokon baut sich der Körper der Raupe komplett neu zu einem Schmetterling um.',
    },
    'q-vowel-count': {
      question:
        'Wie viele Vokale (A, E, I, O, U) stecken insgesamt im englischen Wort „CAULIFLOWER“ (Blumenkohl)?',
      options: ['3 Vokale', '4 Vokale', '5 Vokale', '6 Vokale'],
      kidPeekNote:
        'Zähl an den Fingern mit: c-A-U-l-I-f-l-O-w-E-r! A, U, I, O, E – das sind 5 Vokale!',
      kidRoastOnMiss:
        'Langsam zählen! C-A-U-L-I-F-L-O-W-E-R enthält A, U, I, O und E – 5 Vokale!',
      funFact:
        '„Cauliflower“ enthält jeden der 5 englischen Standardvokale genau einmal!',
    },
    'q-bus-driver': {
      question:
        'STELL DIR VOR, DU fährst einen gelben Schulbus! Bei Stopp 1 steigen 6 Kinder ein. Bei Stopp 2 steigen 3 aus und 5 ein. Welche Augenfarbe hat der Busfahrer?',
      options: [
        'Blau',
        'Braun-Grün',
        'Deine eigene Augenfarbe!',
        'Nicht genug Informationen',
      ],
      kidPeekNote:
        'Lies die allerersten Wörter: „STELL DIR VOR, DU fährst einen Schulbus!“ DU bist der Busfahrer!',
      kidRoastOnMiss:
        'Bahaha! Du hast Fahrgäste gezählt, obwohl im ersten Satz steht, dass DU der Fahrer bist!!',
      funFact:
        'Das berühmteste Schulbus-Rätsel der Welt – Erwachsene konzentrieren sich so sehr auf die Zahlen, dass sie den ersten Satz vergessen.',
    },
    'q-venus-spin': {
      question:
        'Welcher Planet in unserem Sonnensystem ist der HEISSESTE Planet UND dreht sich rückwärts (im Uhrzeigersinn)?',
      options: ['Merkur', 'Venus', 'Mars', 'Jupiter'],
      kidPeekNote:
        'Merkur ist zwar näher an der Sonne, aber die VENUS speichert mit ihren dichten Wolken viel mehr Hitze!',
      kidRoastOnMiss:
        'Aha! Du hast Merkur gewählt, weil er der erste Planet ist, oder?! Die Venus ist durch den Treibhauseffekt heißer!',
      funFact:
        'Auf der Venus herrschen rund 475 °C – heiß genug, um Blei zu schmelzen – und die Sonne geht dort im Westen auf!',
    },
    'q-quarters-in-3-dollars': {
      question:
        'Wenn du ein Eis für 3,50 $ nur mit Vierteldollar-Münzen (25 Cent) bezahlen willst, wie viele Münzen brauchst du?',
      options: ['10 Münzen', '12 Münzen', '14 Münzen', '16 Münzen'],
      kidPeekNote:
        '4 Münzen sind 1,00 $! Also sind 3,00 $ = 12 Münzen, plus 2 Münzen für 50 Cent = 14 Münzen!',
      kidRoastOnMiss:
        '4 × 3 ist 12, plus 2 für die 50 Cent macht 14 Münzen!',
      funFact:
        'Kopfrechnen mit Münzen trainiert das Rechnen in 25er-Schritten.',
    },
    'q-towel-riddle': {
      question:
        'Welcher Gegenstand im Badezimmer wird immer NASSER, je mehr er TROCKNET?',
      options: [
        'Ein Schwamm im Meer',
        'Ein Badehandtuch',
        'Ein Eiswürfel',
        'Ein Föhn',
      ],
      kidPeekNote:
        'Wenn du aus der Dusche kommst, trocknet dein HANDTUCH deine Haut – und wird dabei selbst immer nasser!',
      kidRoastOnMiss:
        'Es ist das Badehandtuch! Während es dich abtrocknet, wird es nasser!',
      funFact:
        'Doppeldeutige Verben („trocknen“) sind der Klassiker unter den Zweitklässler-Rätseln.',
    },
    'q-shark-bones': {
      question: 'Wie viele harte KNOCHEN hat ein Weißer Hai in seinem gesamten Körper?',
      options: ['Null (0 Knochen!)', '42 Knochen', '206 Knochen', '312 Knochen'],
      kidPeekNote:
        'NULL!! Haie haben überhaupt keine Knochen! Ihr ganzes Skelett besteht aus biegsamem Knorpel wie deine Nasenspitze!',
      kidRoastOnMiss:
        'Haie haben NULL Knochen – sie bestehen zu 100 % aus Knorpel wie deine Ohrmuschel!',
      funFact:
        'Selbst ein tonnenschwerer Weißer Hai hat 0 Knochen; sein leichtes Knorpelskelett macht ihn im Wasser extrem wendig.',
    },
    'q-continents-count': {
      question: 'Welcher Kontinent der Erde hat die MEISTEN einzelnen Länder?',
      options: ['Asien', 'Europa', 'Afrika', 'Südamerika'],
      kidPeekNote:
        'Asien hat zwar die größte Fläche, aber AFRIKA hat 54 Länder – mehr als jeder andere Kontinent!',
      kidRoastOnMiss:
        'Erwachsene tippen immer auf Asien! Asien hat 48 Länder, aber Afrika hat 54!',
      funFact:
        'Afrika besteht aus 54 anerkannten Staaten, gefolgt von Asien (48) und Europa (44).',
    },
    'q-doctor-apple-math': {
      question:
        'Ein Arzt gibt dir 3 Kautabletten und sagt, du sollst alle 30 Minuten 1 nehmen. Wie viele Minuten dauert es, bis du alle 3 genommen hast?',
      options: ['90 Minuten', '60 Minuten', '45 Minuten', '30 Minuten'],
      kidPeekNote:
        'Rechne nicht 3 × 30 = 90! Du nimmst Tablette #1 SOFORT (0 Min.), #2 nach 30 Min. und #3 nach 60 Min.!',
      kidRoastOnMiss:
        'AHA! Du hast 90 Minuten gewählt! Die erste nimmst du bei Minute 0, die zweite bei 30 und die dritte bei 60!',
      funFact:
        'Bekannt als „Zaunpfahl-Problem“: Zwischen 3 Zeitpunkten liegen nur 2 Warte-Intervalle!',
    },
    'q-polar-bear-skin': {
      question:
        'Welche Farbe hat die echte Haut eines Eisbären unter seinem weißen Fell?',
      options: ['Rosa', 'Schneeweiß', 'Tiefschwarz', 'Eisblau'],
      kidPeekNote:
        'Schau auf die Nase eines Eisbären! Seine Haut ist TIEFSCHWARZ, damit sie die Sonnenwärme in der Arktis speichert!',
      kidRoastOnMiss:
        'Falsch! Die Haut eines Eisbären ist TIEFSCHWARZ, und seine Haare sind eigentlich durchsichtig!',
      funFact:
        'Eisbärenfell ist farblos und hohl; die schwarze Haut darunter nimmt jedes bisschen Sonnenwärme auf.',
    },
    'q-silent-letter-knight': {
      question:
        'Welches dieser englischen Wörter hat DREI stumme Buchstaben, die man beim Sprechen nicht hört?',
      options: ['KNIGHT (Ritter)', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote:
        'Bei K-N-I-G-H-T spricht man nur „N-AI-T“! Das K, das G und das H sind alle stumm – 3 stumme Buchstaben!',
      kidRoastOnMiss:
        'Sprich K-N-I-G-H-T laut aus! K, G und H machen ein Nickerchen – 3 stumme Buchstaben!',
      funFact:
        'Im Mittelenglischen wurden das „K“ und das „GH“ in „Knight“ tatsächlich noch wie im deutschen Wort „Knecht“ ausgesprochen!',
    },
    'q-lily-pad-pond': {
      question:
        'Seerosen auf einem Schulteich VERDOPPELN ihre Fläche jeden Tag. Wenn es 20 Tage dauert, bis der GANZE Teich bedeckt ist, an welchem Tag war er HALB bedeckt?',
      options: ['Tag 10', 'Tag 15', 'Tag 18', 'Tag 19'],
      kidPeekNote:
        'HALT! Sag nicht Tag 10! Wenn es sich jeden Tag verdoppelt und an Tag 20 voll ist, war es genau einen Tag vorher (Tag 19) halb voll!',
      kidRoastOnMiss:
        '91 % DER ERWACHSENEN SAGEN TAG 10!! 😂 Wenn es sich täglich verdoppelt, war die Hälfte genau EINEN Tag vor Tag 20 erreicht – an Tag 19!!',
      funFact:
        'Diese berühmte Frage stammt aus dem Cognitive Reflection Test (CRT) der Universitäten MIT und Princeton!',
    },
    'q-strawberry-berries': {
      question:
        'Welche dieser Früchte aus der Pausenbrotdose ist laut Pflanzenkunde (Botanik) WIRKLICH eine echte Beere?',
      options: ['Erdbeere', 'Himbeere', 'Banane', 'Brombeere'],
      kidPeekNote:
        'Klingt verrückt, aber Erdbeeren haben ihre Samen außen – eine BANANE ist botanisch gesehen eine echte Beere!',
      kidRoastOnMiss:
        'Verrückt, oder?! Erdbeeren und Himbeeren sind gar keine echten Beeren, aber BANANEN (und Tomaten!) schon!',
      funFact:
        'In der Botanik zählen Bananen, Trauben und Tomaten zu den echten Beeren, während Erdbeeren „Sammelnussfrüchte“ sind!',
    },
    'q-million-bat-ball': {
      question:
        '1.000.000 $ FINALE: Ein Spielzeugschläger und ein Ball kosten zusammen 1,10 $. Der Schläger kostet 1,00 $ MEHR als der Ball. Wie viel kostet der Ball?',
      options: ['10 Cent (0,10 $)', '5 Cent (0,05 $)', '1 Cent (0,01 $)', '15 Cent (0,15 $)'],
      kidPeekNote:
        'NIMM NICHT 10 CENT!! Wäre der Ball 10¢, müsste der Schläger 1,10 $ kosten (zusammen 1,20 $)! Der Ball kostet 5 CENT und der Schläger 1,05 $ (1,05 $ + 0,05 $ = 1,10 $)!',
      kidRoastOnMiss:
        'NEIIIN! Du bist in die 1.000.000-Dollar-10-Cent-Falle getappt!! 5 Cent + 1,05 $ ergibt 1,10 $!',
      funFact:
        'Über 50 % der Studenten in Harvard und am MIT antworten beim ersten Versuch „10 Cent“! Nur 5 Cent + 1,05 $ ergibt 1,10 $.',
    },
    'q-million-mary-mom': {
      question:
        '1.000.000 $ FINALE: Marias Mutter hat 4 Töchter. Die ersten drei heißen April, Mai und Juni. Wie heißt die 4. Tochter?',
      options: ['Juli', 'August', 'Maria!', 'Frühling'],
      kidPeekNote:
        'Lies die allerersten zwei Wörter der Frage: „MARIAS Mutter“! Die 4. Tochter heißt natürlich MARIA!!',
      kidRoastOnMiss:
        'DU HAST JULI GEWÄHLT?! 😂 In den ersten zwei Wörtern steht buchstäblich „MARIAS MUTTER hat 4 Töchter“!! Sie heißt MARIA!',
      funFact:
        'Das erwachsene Gehirn setzt automatisch die Monatsreihe („April, Mai, Juni -> Juli“) fort und übersieht den Namen am Satzanfang.',
    },
  },
  es: {
    'q-race-2nd': {
      question:
        'Estás corriendo en una carrera escolar y adelantas a la persona que va en 2.º lugar. ¿En qué lugar estás ahora mismo?',
      options: ['1.º lugar', '2.º lugar', '3.º lugar', 'Empatado en 1.º'],
      kidPeekNote:
        '¡Espera! ¡No elijas 1.º! Si pasas al corredor en 2.º lugar, tomas SU puesto, ¡así que estás en 2.º lugar!',
      kidRoastOnMiss:
        '¡Jaja! ¡Si pasaste al 2.º lugar, el del 1.º lugar SIGUE delante de ti! ¡Estás en 2.º!',
      funFact:
        'Más del 65 % de los adultos responden "1.º lugar" bajo presión de tiempo.',
    },
    'q-paint-mix': {
      question:
        'En la clase de arte, si mezclas pintura AMARILLA y pintura AZUL, ¿qué color obtienes?',
      options: ['Morado', 'Naranja', 'Verde', 'Marrón'],
      kidPeekNote: '¡Amarillo + Azul hace VERDE como el pasto!',
      kidRoastOnMiss: '¡Amarillo y azul forman el color VERDE!',
      funFact: 'El amarillo y el azul son pigmentos primarios que al mezclarse reflejan luz verde.',
    },
    'q-spider-legs': {
      question: '¿Cuántas patas tiene una araña?',
      options: ['6 patas', '8 patas', '10 patas', '12 patas'],
      kidPeekNote: 'Los insectos tienen 6 patas, ¡pero las arañas tienen 8 patas!',
      kidRoastOnMiss: '¡Cuéntalas! ¡Las arañas tienen 8 patas!',
      funFact: 'Todos los arácnidos tienen 8 patas, mientras que los insectos tienen 6.',
    },
    'q-months-28': {
      question: '¿Cuántos meses del año tienen 28 días?',
      options: ['Solo 1 (Febrero)', '2 meses', '6 meses', '¡Los 12 meses!'],
      kidPeekNote: '¡Es una trampa! TODOS los 12 meses tienen al menos 28 días.',
      kidRoastOnMiss: '¡CAÍSTE! ¡Elegiste febrero, verdad?! ¡Todos los 12 meses tienen un día 28!',
      funFact: '4 de cada 5 adultos eligen "Solo 1 (Febrero)" sin pensar que todos los meses llegan al día 28.',
    },
    'q-farmer-sheep': {
      question:
        'Un granjero tiene 17 ovejas. Llega una tormenta y TODAS MENOS 9 se escapan. ¿Cuántas ovejas le quedan al granjero?',
      options: ['8 ovejas', '9 ovejas', '17 ovejas', '26 ovejas'],
      kidPeekNote: '¡No restes 17 - 9! "TODAS MENOS 9" significa que 9 se quedaron.',
      kidRoastOnMiss: '¡Hiciste 17 menos 9 = 8! "¡Todas menos 9" significa que quedan 9 ovejas!',
      funFact: 'Los adultos restan automáticamente cuando ven dos números en un problema.',
    },
    'q-stop-sign': {
      question: 'Una señal roja de PARE / STOP es un octágono. ¿Cuántos lados tiene?',
      options: ['6 lados', '7 lados', '8 lados', '10 lados'],
      kidPeekNote: '¡Un OCTÁ-gono tiene 8 lados!',
      kidRoastOnMiss: '¡Un octágono siempre tiene 8 lados!',
      funFact: 'Octa viene del griego "okto", que significa ocho.',
    },
    'q-rooster-egg': {
      question:
        'Un gallo está en la punta del techo de un granero mirando al norte. El viento sopla hacia el oeste. Si el gallo pone un huevo, ¿hacia dónde rueda?',
      options: [
        'Hacia el oeste con el viento',
        'Hacia el este contra el viento',
        'Hacia el sur por las tejas',
        '¡A ningún lado: los gallos no ponen huevos!',
      ],
      kidPeekNote: '¡Jajaja! ¡Los gallos son machos! ¡Solo las GALLINAS ponen huevos!',
      kidRoastOnMiss: '¡Estabas calculando el viento para un GALLO! ¡Los gallos no ponen huevos!',
      funFact: 'Los detalles de física distraen a los adultos de la palabra "gallo".',
    },
    'q-flying-mammal': {
      question: '¿Cuál de estos animales es el ÚNICO mamífero del mundo que puede volar de verdad?',
      options: ['Ardilla voladora', 'Murciélago', 'Avestruz', 'Frailecillo'],
      kidPeekNote: 'Las ardillas voladoras solo planean. ¡Los MURCIÉLAGOS sí vuelan!',
      kidRoastOnMiss: '¡Los murciélagos son los únicos mamíferos que vuelan de verdad!',
      funFact: 'Los murciélagos representan cerca del 20 % de todas las especies de mamíferos.',
    },
    'q-spell-incorrectly': {
      question: '¿Qué palabra está SIEMPRE escrita "incorrectamente" en el diccionario?',
      options: ['Error', 'Miércoles', 'La palabra "Incorrectamente"', 'Ritmo'],
      kidPeekNote: '¡Mira las comillas! ¡La palabra "INCORRECTAMENTE" se escribe así!',
      kidRoastOnMiss: '¡La palabra "incorrectamente" siempre se escribe "incorrectamente"!',
      funFact: '¡Juego de palabras clásico de primaria!',
    },
    'q-pound-feathers': {
      question: '¿Qué pesa más: 1 kilo de plumas de ganso o 1 kilo de ladrillos rojos?',
      options: [
        '1 kilo de ladrillos',
        '1 kilo de plumas',
        '¡Pesan exactamente lo mismo!',
        'Depende de la gravedad',
      ],
      kidPeekNote: '¡1 kilo es 1 kilo! ¡Pesan exactamente lo mismo!',
      kidRoastOnMiss: '¡Caíste en la trampa más vieja del recreo! ¡1 kilo pesa 1 kilo!',
      funFact: 'Ambos pesan exactamente 1.000 gramos; solo cambia su volumen.',
    },
    'q-octopus-hearts': {
      question: 'Los humanos tenemos 1 corazón. ¿Cuántos corazones tiene un pulpo gigante?',
      options: ['1 corazón', '2 corazones', '3 corazones', '8 corazones'],
      kidPeekNote: '¡Un pulpo tiene 8 brazos, 9 cerebros y TRES corazones!',
      kidRoastOnMiss: '¡El pulpo tiene TRES corazones!',
      funFact: 'Los pulpos tienen 3 corazones y sangre azul rica en cobre.',
    },
    'q-largest-ocean': {
      question: '¿Cuál es el océano más grande y profundo del planeta Tierra?',
      options: ['Océano Atlántico', 'Océano Índico', 'Océano Pacífico', 'Océano Ártico'],
      kidPeekNote: '¡El Océano PACÍFICO es el más grande del mundo!',
      kidRoastOnMiss: '¡El Océano Pacífico cubre más del 30 % de toda la Tierra!',
      funFact: 'El Pacífico es más grande que todos los continentes juntos.',
    },
    'q-apples-take-away': {
      question:
        'Hay un tazón con 6 manzanas rojas. Tomas y te llevas 4 manzanas. ¿Cuántas manzanas tienes TÚ?',
      options: ['2 manzanas', '4 manzanas', '6 manzanas', '10 manzanas'],
      kidPeekNote: 'Si tomaste 4 manzanas en tus manos, ¡TÚ tienes 4 manzanas!',
      kidRoastOnMiss: '¡Quedan 2 en el tazón, pero TÚ te llevaste 4, así que tienes 4!',
      funFact: 'El 83 % de los adultos responde "2" pensando en el tazón y no en sus manos.',
    },
    'q-caterpillar-change': {
      question:
        '¿Cuál es la palabra científica cuando una oruga se transforma en mariposa dentro de su crisálida?',
      options: ['Fotosíntesis', 'Metamorfosis', 'Hibernación', 'Evaporación'],
      kidPeekNote: '¡Las orugas hacen META-MOR-FO-SIS!',
      kidRoastOnMiss: '¡La transformación de oruga a mariposa se llama METAMORFOSIS!',
      funFact: 'Dentro de la crisálida, la oruga reconstruye su cuerpo por completo.',
    },
    'q-vowel-count': {
      question: '¿Cuántas vocales diferentes (A, E, I, O, U) tiene la palabra "MURCIÉLAGO"?',
      options: ['3 vocales', '4 vocales', '5 vocales', '6 vocales'],
      kidPeekNote: '¡M-U-R-C-I-É-L-A-G-O tiene las 5 vocales: U, I, E, A, O!',
      kidRoastOnMiss: '¡Murciélago tiene las 5 vocales: A, E, I, O, U!',
      funFact: '¡"Murciélago" y "Cauliflower" contienen las 5 vocales una sola vez!',
    },
    'q-bus-driver': {
      question:
        '¡IMAGINA QUE TÚ conduces un autobús escolar! En la parada 1 suben 6 niños. En la parada 2 bajan 3 y suben 5. ¿De qué color son los ojos del conductor?',
      options: ['Azules', 'Verdes', '¡Del color de TUS ojos!', 'Falta información'],
      kidPeekNote: '¡Las primeras palabras dicen "IMAGINA QUE TÚ conduces"! ¡TÚ eres el conductor!',
      kidRoastOnMiss: '¡Estabas sumando pasajeros y olvidaste que TÚ eres el conductor!',
      funFact: 'El acertijo de autobús escolar más famoso del mundo.',
    },
    'q-venus-spin': {
      question: '¿Qué planeta de nuestro Sistema Solar es el MÁS CALIENTE y además gira al revés?',
      options: ['Mercurio', 'Venus', 'Marte', 'Júpiter'],
      kidPeekNote: '¡VENUS tiene nubes densas que atrapan el calor y es más caliente que Mercurio!',
      kidRoastOnMiss: '¡Venus es el planeta más caliente por su efecto invernadero!',
      funFact: 'Venus alcanza los 475 °C y gira en sentido horario.',
    },
    'q-quarters-in-3-dollars': {
      question:
        'Si quiero comprar un helado de $3.50 usando solo monedas de 25 centavos (quarters), ¿cuántas monedas necesito?',
      options: ['10 monedas', '12 monedas', '14 monedas', '16 monedas'],
      kidPeekNote: '4 monedas hacen $1.00. ¡Así que $3.00 son 12 monedas + 2 más = 14 monedas!',
      kidRoastOnMiss: '¡4 × 3 es 12, más 2 monedas por los 50 centavos son 14!',
      funFact: 'Contar monedas de 25 centavos entrena el cálculo mental rápido.',
    },
    'q-towel-riddle': {
      question: '¿Qué objeto del hogar se MOJA más y más cuanto más SECA?',
      options: ['Una esponja en el mar', 'Una toalla de baño', 'Un cubo de hielo', 'Un secador'],
      kidPeekNote: '¡Tu TOALLA seca tu cuerpo y se moja cada vez más!',
      kidRoastOnMiss: '¡Es la toalla de baño!',
      funFact: 'Un clásico juego de palabras entre "secar" y "mojarse".',
    },
    'q-shark-bones': {
      question: '¿Cuántos HUESOS duros tiene un gran tiburón blanco en todo su cuerpo?',
      options: ['¡Cero (0 huesos)!', '42 huesos', '206 huesos', '312 huesos'],
      kidPeekNote: '¡CERO! ¡El esqueleto de los tiburones está hecho de cartílago!',
      kidRoastOnMiss: '¡Los tiburones tienen CERO huesos, son 100 % cartílago!',
      funFact: 'El esqueleto de cartílago es ligero y flexible para nadar rápido.',
    },
    'q-continents-count': {
      question: '¿Qué continente de la Tierra tiene la MAYOR cantidad de países?',
      options: ['Asia', 'Europa', 'África', 'América del Sur'],
      kidPeekNote: '¡ÁFRICA tiene 54 países, más que cualquier otro continente!',
      kidRoastOnMiss: '¡Asia tiene 48 países, pero África tiene 54!',
      funFact: 'África cuenta con 54 naciones soberanas reconocidas.',
    },
    'q-doctor-apple-math': {
      question:
        'Un médico te da 3 vitaminas masticables y te dice que tomes 1 cada 30 minutos. ¿Cuántos minutos tardarás en tomarte las 3?',
      options: ['90 minutos', '60 minutos', '45 minutos', '30 minutos'],
      kidPeekNote: '¡Tomas la #1 AHORA (minuto 0), la #2 a los 30 min y la #3 a los 60 min!',
      kidRoastOnMiss: '¡No son 90 minutos! ¡La primera se toma en el minuto cero, así que son 60 minutos!',
      funFact: 'Entre 3 vitaminas solo hay 2 intervalos de espera de 30 minutos.',
    },
    'q-polar-bear-skin': {
      question: 'Debajo de su pelaje blanco, ¿de qué color es la PIEL real de un oso polar?',
      options: ['Rosa', 'Blanca', 'Negra azabache', 'Azul hielo'],
      kidPeekNote: '¡Su piel es NEGRA para absorber el calor del sol en el Ártico!',
      kidRoastOnMiss: '¡La piel del oso polar es completamente NEGRA!',
      funFact: 'El pelaje es translúcido y su piel negra absorbe la radiación solar.',
    },
    'q-silent-letter-knight': {
      question: '¿Cuál de estas palabras en inglés tiene TRES letras mudas al pronunciarse?',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: '¡En K-N-I-G-H-T, la K, la G y la H son mudas (3 letras mudas)!',
      kidRoastOnMiss: '¡En KNIGHT no se pronuncian ni la K, ni la G, ni la H!',
      funFact: 'En el inglés medieval sí se pronunciaban esas consonantes.',
    },
    'q-lily-pad-pond': {
      question:
        'Los nenúfares de un estanque DUPLICAN su tamaño cada día. Si tardan 20 días en cubrir TODO el estanque, ¿en qué día estaba a la MITAD?',
      options: ['Día 10', 'Día 15', 'Día 18', 'Día 19'],
      kidPeekNote: '¡Si se duplica cada día y el día 20 está lleno, el día anterior (Día 19) estaba a la mitad!',
      kidRoastOnMiss: '¡El 91 % dice Día 10! ¡Pero si se duplica cada día, la mitad fue en el Día 19!',
      funFact: 'Pregunta famosa del Test de Reflexión Cognitiva (CRT) de MIT y Princeton.',
    },
    'q-strawberry-berries': {
      question: 'Según la botánica, ¿cuál de estas frutas es REALMENTE una baya verdadera?',
      options: ['Fresa', 'Frambuesa', 'Plátano (Banana)', 'Mora'],
      kidPeekNote: '¡Las fresas tienen semillas por fuera; el PLÁTANO sí es una baya botánica!',
      kidRoastOnMiss: '¡En botánica, los plátanos (y los tomates) son bayas verdaderas!',
      funFact: 'Una baya verdadera tiene sus semillas dentro de la pulpa.',
    },
    'q-million-bat-ball': {
      question:
        'PREGUNTA FINAL DE $1,000,000: Un bate y una pelota cuestan $1.10 en total. El bate cuesta $1.00 MÁS que la pelota. ¿Cuánto cuesta la pelota?',
      options: ['10 centavos ($0.10)', '5 centavos ($0.05)', '1 centavo ($0.01)', '15 centavos ($0.15)'],
      kidPeekNote:
        '¡NO ELIJAS 10 CENTAVOS! ¡La pelota cuesta 5 CENTAVOS y el bate $1.05 ($1.05 + $0.05 = $1.10)!',
      kidRoastOnMiss:
        '¡Caíste en la trampa de los 10 centavos! ¡5 centavos + $1.05 suma $1.10!',
      funFact: 'Más del 50 % de los estudiantes universitarios responden "10 centavos" en su primer intento.',
    },
    'q-million-mary-mom': {
      question:
        'PREGUNTA FINAL DE $1,000,000: La mamá de María tiene 4 hijas. Las tres primeras se llaman Abril, Mayo y Junio. ¿Cómo se llama la 4.ª hija?',
      options: ['Julio', 'Agosto', '¡María!', 'Primavera'],
      kidPeekNote: '¡Lee las primeras palabras: "La mamá de MARÍA"! ¡La 4.ª hija es MARÍA!',
      kidRoastOnMiss: '¡¿ELEGISTE JULIO?! 😂 ¡Dice "La mamá de MARÍA"! ¡Se llama MARÍA!',
      funFact: 'El cerebro adulto sigue la secuencia del calendario e ignora el inicio de la frase.',
    },
  },
  fr: {
    'q-race-2nd': {
      question:
        'Tu cours dans une course à l’école et tu dépasses la personne en 2e position ! À quelle place es-tu maintenant ?',
      options: ['1re place', '2e place', '3e place', 'Ex æquo en 1re'],
      kidPeekNote:
        'Attends ! Ne choisis pas la 1re place ! Si tu dépasses le 2e, tu prends SA place — tu es donc 2e !',
      kidRoastOnMiss:
        'Haha ! Si tu dépasses le 2e, la personne en 1re place est toujours devant toi ! Tu es 2e !',
      funFact:
        'Plus de 65 % des adultes répondent « 1re place » sous la pression du chronomètre !',
    },
    'q-paint-mix': {
      question:
        'En cours d’arts plastiques, si tu mélanges de la peinture JAUNE et de la peinture BLEUE, quelle couleur obtiens-tu ?',
      options: ['Violet', 'Orange', 'Vert', 'Marron'],
      kidPeekNote: 'Jaune + Bleu donne du VERT comme l’herbe !',
      kidRoastOnMiss: 'Tu n’as jamais fait de peinture en maternelle ?! Jaune + Bleu = VERT !',
      funFact: 'Le jaune et le bleu sont des couleurs primaires qui donnent du vert une fois mélangées.',
    },
    'q-spider-legs': {
      question: 'Combien de pattes a une araignée ?',
      options: ['6 pattes', '8 pattes', '10 pattes', '12 pattes'],
      kidPeekNote: 'Les insectes ont 6 pattes, mais les araignées en ont 8 !',
      kidRoastOnMiss: 'Compte-les ! Les araignées ont 8 pattes !',
      funFact: 'Tous les arachnides ont 8 pattes, tandis que les insectes en ont 6.',
    },
    'q-months-28': {
      question: 'Combien de mois dans l’année ont 28 jours ?',
      options: ['Un seul (Février)', '2 mois', '6 mois', 'Les 12 mois !'],
      kidPeekNote: 'C’est un piège ! TOUS les 12 mois ont au moins 28 jours !',
      kidRoastOnMiss: 'PIÉGÉ ! Tu as choisi février, hein ?! Tous les 12 mois ont un 28e jour !',
      funFact: '4 adultes sur 5 choisissent « Février » car leur cerveau ajoute le mot « exactement ».',
    },
    'q-farmer-sheep': {
      question:
        'Un fermier a 17 moutons. Un orage éclate et TOUS SAUF 9 s’enfuient ! Combien de moutons reste-t-il au fermier ?',
      options: ['8 moutons', '9 moutons', '17 moutons', '26 moutons'],
      kidPeekNote: 'Ne fais pas 17 - 9 ! « TOUS SAUF 9 » veut dire qu’il en reste 9 !',
      kidRoastOnMiss: 'Tu as fait 17 moins 9 = 8 ! « Tous sauf 9 » signifie que 9 moutons sont restés !',
      funFact: 'Les adultes soustraient par réflexe dès qu’ils voient deux nombres.',
    },
    'q-stop-sign': {
      question: 'Un panneau STOP rouge est un octogone. Combien de côtés possède-t-il ?',
      options: ['6 côtés', '7 côtés', '8 côtés', '10 côtés'],
      kidPeekNote: 'Un OCTO-gone a 8 côtés !',
      kidRoastOnMiss: 'Tu vois des panneaux STOP tous les jours : un octogone a 8 côtés !',
      funFact: 'Octo vient du grec ancien signifiant huit.',
    },
    'q-rooster-egg': {
      question:
        'Un coq est perché tout en haut du toit d’une grange face au nord. Le vent souffle vers l’ouest. Si le coq pond un œuf, de quel côté roule-t-il ?',
      options: [
        'Vers l’ouest avec le vent',
        'Vers l’est contre le vent',
        'Vers le sud sur les tuiles',
        'Nulle part — les coqs ne pondent pas d’œufs !',
      ],
      kidPeekNote: 'Hahaha ! Les coqs sont des garçons ! Seules les POULES pondent des œufs !',
      kidRoastOnMiss: 'Tu calculais le vent pour un COQ ?! Les coqs ne pondent pas d’œufs !',
      funFact: 'Les détails sur le vent détournent l’attention des adultes du mot « coq ».',
    },
    'q-flying-mammal': {
      question: 'Lequel de ces animaux est le SEUL mammifère au monde capable de vraiment voler ?',
      options: ['Écureuil volant', 'Chauve-souris', 'Autruche', 'Macareux'],
      kidPeekNote: 'L’écureuil volant ne fait que planer ! La CHAUVE-SOURIS vole vraiment !',
      kidRoastOnMiss: 'Les chauves-souris sont les seuls mammifères capables d’un vol battu !',
      funFact: 'Les chauves-souris représentent environ 20 % de toutes les espèces de mammifères.',
    },
    'q-spell-incorrectly': {
      question: 'Quel mot est TOUJOURS écrit « incorrectement » dans le dictionnaire ?',
      options: ['Erreur', 'Mercredi', 'Le mot « Incorrectement »', 'Rythme'],
      kidPeekNote: 'Regarde les guillemets ! Le mot « INCORRECTEMENT » s’écrit littéralement comme ça !',
      kidRoastOnMiss: 'Le mot « incorrectement » est toujours écrit « incorrectement » !',
      funFact: 'Un jeu de mots classique de cour de récréation !',
    },
    'q-pound-feathers': {
      question: 'Qu’est-ce qui est le plus lourd : 1 kilo de plumes d’oie ou 1 kilo de briques rouges ?',
      options: [
        '1 kilo de briques',
        '1 kilo de plumes',
        'Ils pèsent exactement le même poids !',
        'Cela dépend de la gravité',
      ],
      kidPeekNote: '1 kilo reste 1 kilo ! Ils ont exactement le même poids !',
      kidRoastOnMiss: 'Tu es tombé dans le plus vieux piège du monde ! 1 kilo = 1 kilo !',
      funFact: 'Les deux pèsent exactement 1 000 grammes, seul leur volume change.',
    },
    'q-octopus-hearts': {
      question: 'Les humains ont 1 cœur. Combien de cœurs possède une pieuvre géante (poulpe) ?',
      options: ['1 cœur', '2 cœurs', '3 cœurs', '8 cœurs'],
      kidPeekNote: 'Une pieuvre a 8 bras, 9 cerveaux et TROIS cœurs !',
      kidRoastOnMiss: 'Une pieuvre a TROIS cœurs !',
      funFact: 'Les pieuvres ont 3 cœurs et du sang bleu riche en cuivre.',
    },
    'q-largest-ocean': {
      question: 'Quel est l’océan le plus grand et le plus profond de la planète Terre ?',
      options: ['Océan Atlantique', 'Océan Indien', 'Océan Pacifique', 'Océan Arctique'],
      kidPeekNote: 'L’océan PACIFIQUE est si immense que tous les continents pourraient y tenir !',
      kidRoastOnMiss: 'L’océan Pacifique couvre plus de 30 % de toute la surface de la Terre !',
      funFact: 'Le Pacifique est plus vaste que toutes les terres émergées réunies.',
    },
    'q-apples-take-away': {
      question:
        'Il y a un bol contenant 6 pommes rouges. Tu prends et emportes 4 pommes. Combien de pommes as-TU maintenant ?',
      options: ['2 pommes', '4 pommes', '6 pommes', '10 pommes'],
      kidPeekNote: 'Si tu as pris 4 pommes dans tes mains, TU as 4 pommes !',
      kidRoastOnMiss: 'Il en reste 2 dans le bol, mais TOI tu en as pris 4, donc tu en as 4 !',
      funFact: '83 % des adultes répondent « 2 » en calculant ce qui reste dans le bol.',
    },
    'q-caterpillar-change': {
      question:
        'Quel est le mot scientifique lorsqu’une chenille se transforme en papillon dans sa chrysalide ?',
      options: ['Photosynthèse', 'Métamorphose', 'Hibernation', 'Évaporation'],
      kidPeekNote: 'Quand la chenille devient papillon, c’est la MÉTA-MOR-PHOSE !',
      kidRoastOnMiss: 'La transformation de la chenille en papillon s’appelle la MÉTAMORPHOSE !',
      funFact: 'Dans sa chrysalide, la chenille reconstruit entièrement son corps.',
    },
    'q-vowel-count': {
      question: 'Combien de voyelles (A, E, I, O, U) y a-t-il au total dans le mot « OISEAU » ?',
      options: ['3 voyelles', '4 voyelles', '5 voyelles', '6 voyelles'],
      kidPeekNote: 'Compte les lettres : O-I-S-E-A-U ! O, I, E, A, U — ça fait 5 voyelles !',
      kidRoastOnMiss: 'O-I-S-E-A-U contient 5 voyelles (O, I, E, A, U) !',
      funFact: '« Oiseau » est le plus petit mot français contenant 5 voyelles différentes !',
    },
    'q-bus-driver': {
      question:
        'IMAGINE QUE TU conduis un bus scolaire ! Au 1er arrêt, 6 enfants montent. Au 2e arrêt, 3 descendent et 5 montent. De quelle couleur sont les yeux du chauffeur ?',
      options: ['Bleus', 'Noisette', 'De la couleur de TES yeux !', 'Pas assez d’infos'],
      kidPeekNote: 'Relis les premiers mots : « IMAGINE QUE TU conduis » ! C’est TOI le chauffeur !',
      kidRoastOnMiss: 'Tu comptais les passagers alors que c’est TOI le chauffeur du bus !',
      funFact: 'L’énigme de bus scolaire la plus célèbre au monde !',
    },
    'q-venus-spin': {
      question:
        'Quelle planète de notre système solaire est la PLUS CHAUDE et tourne à l’envers ?',
      options: ['Mercure', 'Vénus', 'Mars', 'Jupiter'],
      kidPeekNote: 'VÉNUS retient toute la chaleur sous ses nuages épais : elle est plus chaude que Mercure !',
      kidRoastOnMiss: 'C’est Vénus ! Son effet de serre la rend plus brûlante que Mercure !',
      funFact: 'Il fait environ 475 °C sur Vénus et le Soleil s’y lève à l’ouest.',
    },
    'q-quarters-in-3-dollars': {
      question:
        'Pour payer une glace à 3,50 $ uniquement avec des pièces de 25 centimes, combien de pièces faut-il ?',
      options: ['10 pièces', '12 pièces', '14 pièces', '16 pièces'],
      kidPeekNote: '4 pièces font 1,00 $. Donc 3,00 $ = 12 pièces + 2 pièces pour 50¢ = 14 pièces !',
      kidRoastOnMiss: '4 × 3 = 12, plus 2 pièces pour les 50 centimes = 14 pièces !',
      funFact: 'Compter par tranches de 25 est un excellent exercice de calcul mental.',
    },
    'q-towel-riddle': {
      question: 'Quel objet de la maison devient de plus en plus MOUILLÉ à mesure qu’il SÈCHE ?',
      options: ['Une éponge dans la mer', 'Une serviette de bain', 'Un glaçon', 'Un sèche-cheveux'],
      kidPeekNote: 'Ta SERVIETTE DE BAIN te sèche après la douche et devient mouillée !',
      kidRoastOnMiss: 'C’est la serviette de bain ! Plus elle te sèche, plus elle est mouillée !',
      funFact: 'Un grand classique des devinettes d’école primaire.',
    },
    'q-shark-bones': {
      question: 'Combien d’OS durs un grand requin blanc possède-t-il dans tout son corps ?',
      options: ['Zéro (0 os !)', '42 os', '206 os', '312 os'],
      kidPeekNote: 'ZÉRO ! Les requins n’ont aucun os, leur squelette est en cartilage !',
      kidRoastOnMiss: 'Les requins ont ZÉRO os — uniquement du cartilage souple !',
      funFact: 'Le cartilage léger permet aux requins de nager vite et avec agilité.',
    },
    'q-continents-count': {
      question: 'Quel continent de la Terre compte le PLUS grand nombre de pays ?',
      options: ['Asie', 'Europe', 'Afrique', 'Amérique du Sud'],
      kidPeekNote: 'L’AFRIQUE compte 54 pays — plus que tout autre continent !',
      kidRoastOnMiss: 'L’Asie a 48 pays, mais l’Afrique en a 54 !',
      funFact: 'L’Afrique rassemble 54 États souverains reconnus.',
    },
    'q-doctor-apple-math': {
      question:
        'Un médecin te donne 3 vitamines et te dit d’en prendre 1 toutes les 30 minutes. Combien de minutes faut-il pour prendre les 3 ?',
      options: ['90 minutes', '60 minutes', '45 minutes', '30 minutes'],
      kidPeekNote: 'Tu prends la 1re MAINTENANT (0 min), la 2e à 30 min et la 3e à 60 min !',
      kidRoastOnMiss: 'Pas 90 minutes ! La 1re se prend à 0 min, la 2e à 30 min et la 3e à 60 min !',
      funFact: 'Entre 3 prises, il n’y a que 2 intervalles d’attente de 30 minutes.',
    },
    'q-polar-bear-skin': {
      question: 'Sous sa fourrure blanche, de quelle couleur est la PEAU d’un ours polaire ?',
      options: ['Rose', 'Blanche', 'Noire', 'Bleu glacier'],
      kidPeekNote: 'Sa peau est NOIRE pour absorber la chaleur du soleil dans l’Arctique !',
      kidRoastOnMiss: 'La peau de l’ours polaire est complètement NOIRE !',
      funFact: 'Les poils de l’ours polaire sont translucides et sa peau noire capte la chaleur.',
    },
    'q-silent-letter-knight': {
      question: 'Lequel de ces mots anglais comporte TROIS lettres muettes quand on le prononce ?',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'Dans K-N-I-G-H-T, le K, le G et le H sont muets (3 lettres muettes) !',
      kidRoastOnMiss: 'Dans KNIGHT, on n’entend ni le K, ni le G, ni le H !',
      funFact: 'En moyen anglais, toutes ces lettres étaient autrefois prononcées.',
    },
    'q-lily-pad-pond': {
      question:
        'Des nénuphars sur un étang DOUBLENT de surface chaque jour. S’il faut 20 jours pour couvrir TOUT l’étang, quel jour était-il couvert à MOITIÉ ?',
      options: ['Jour 10', 'Jour 15', 'Jour 18', 'Jour 19'],
      kidPeekNote: 'S’il double chaque jour et est plein le Jour 20, il était à moitié plein la veille : le Jour 19 !',
      kidRoastOnMiss: '91 % des adultes disent Jour 10 ! Mais puisqu’il double chaque jour, la moitié était au Jour 19 !',
      funFact: 'Question célèbre du test de réflexion cognitive (CRT) du MIT et de Princeton.',
    },
    'q-strawberry-berries': {
      question: 'Selon la botanique, lequel de ces fruits est VRAIMENT une baie ?',
      options: ['Fraise', 'Framboise', 'Banane', 'Mûre'],
      kidPeekNote: 'Les fraises ont leurs graines à l’extérieur — la BANANE est une vraie baie botanique !',
      kidRoastOnMiss: 'En botanique, la banane est une vraie baie, contrairement à la fraise !',
      funFact: 'Les bananes, les raisins et les tomates sont de vraies baies botaniques.',
    },
    'q-million-bat-ball': {
      question:
        'FINALE À 1 000 000 $ : Une batte et une balle coûtent 1,10 $ au total. La batte coûte 1,00 $ DE PLUS que la balle. Combien coûte la balle ?',
      options: ['10 centimes (0,10 $)', '5 centimes (0,05 $)', '1 centime (0,01 $)', '15 centimes (0,15 $)'],
      kidPeekNote:
        'NE CHOISIS PAS 10 CENTIMES ! La balle coûte 5 CENTIMES et la batte 1,05 $ (1,05 $ + 0,05 $ = 1,10 $) !',
      kidRoastOnMiss:
        'Tu es tombé dans le piège à 10 centimes ! 5 centimes + 1,05 $ = 1,10 $ !',
      funFact: 'Plus de 50 % des étudiants de Harvard et du MIT répondent « 10 centimes » au premier essai.',
    },
    'q-million-mary-mom': {
      question:
        'FINALE À 1 000 000 $ : La maman de Marie a 4 filles. Les trois premières s’appellent Avril, Mai et Juin. Comment s’appelle la 4e fille ?',
      options: ['Juillet', 'Août', 'Marie !', 'Printemps'],
      kidPeekNote: 'Lis les premiers mots : « La maman de MARIE » ! La 4e fille s’appelle MARIE !',
      kidRoastOnMiss: 'TU AS CHOISI JUILLET ?! 😂 C’est la maman de MARIE ! Elle s’appelle MARIE !',
      funFact: 'Le cerveau adulte suit la suite des mois et oublie le prénom donné au début.',
    },
  },
  pt: {
    'q-race-2nd': {
      question:
        'Você está correndo em uma corrida na escola e ultrapassa a pessoa em 2º lugar! Em que lugar você está agora?',
      options: ['1º lugar', '2º lugar', '3º lugar', 'Empatado em 1º'],
      kidPeekNote: 'Espere! Se você ultrapassa o 2º colocado, você assume o lugar DELE — então está em 2º lugar!',
      kidRoastOnMiss: 'Haha! Se você passou o 2º lugar, o 1º ainda está na sua frente! Você está em 2º!',
      funFact: 'Mais de 65% dos adultos respondem "1º lugar" sob pressão do tempo!',
    },
    'q-paint-mix': {
      question: 'Na aula de artes, se você misturar tinta AMARELA e tinta AZUL, que cor aparece?',
      options: ['Roxo', 'Laranja', 'Verde', 'Marrom'],
      kidPeekNote: 'Amarelo + Azul dá VERDE como a grama!',
      kidRoastOnMiss: 'Amarelo com azul sempre dá VERDE!',
      funFact: 'Amarelo e azul são cores primárias subtrativas que formam o verde.',
    },
    'q-spider-legs': {
      question: 'Quantas patas tem uma aranha?',
      options: ['6 patas', '8 patas', '10 patas', '12 patas'],
      kidPeekNote: 'Insetos têm 6 patas, mas aranhas têm 8 patas!',
      kidRoastOnMiss: 'Conte! As aranhas têm 8 patas!',
      funFact: 'Todos os aracnídeos possuem 8 patas, enquanto os insetos possuem 6.',
    },
    'q-months-28': {
      question: 'Quantos meses do ano têm 28 dias?',
      options: ['Apenas 1 (Fevereiro)', '2 meses', '6 meses', 'Todos os 12 meses!'],
      kidPeekNote: 'É pegadinha! TODOS os 12 meses têm pelo menos 28 dias!',
      kidRoastOnMiss: 'CAIU! Você escolheu fevereiro, né?! Todos os 12 meses têm o dia 28!',
      funFact: '4 em cada 5 adultos marcam "Fevereiro" sem notar que todos os meses têm 28 dias.',
    },
    'q-farmer-sheep': {
      question:
        'Um fazendeiro tem 17 ovelhas. Uma tempestade chega e TODAS MENOS 9 fogem! Quantas ovelhas sobraram?',
      options: ['8 ovelhas', '9 ovelhas', '17 ovelhas', '26 ovelhas'],
      kidPeekNote: 'Não faça 17 - 9! "TODAS MENOS 9" significa que 9 ficaram!',
      kidRoastOnMiss: 'Você fez 17 menos 9 = 8! "Todas menos 9" quer dizer que sobraram 9 ovelhas!',
      funFact: 'Adultos subtraem no automático quando veem dois números.',
    },
    'q-stop-sign': {
      question: 'Uma placa vermelha de PARE é um octógono. Quantos lados ela tem?',
      options: ['6 lados', '7 lados', '8 lados', '10 lados'],
      kidPeekNote: 'Um OCTÓ-gono tem 8 lados!',
      kidRoastOnMiss: 'Um octógono sempre tem 8 lados!',
      funFact: 'Octo vem do grego para o número oito.',
    },
    'q-rooster-egg': {
      question:
        'Um galo está bem no topo do telhado olhando para o norte. O vento sopra para o oeste. Se o galo botar um ovo, para que lado ele rola?',
      options: [
        'Para o oeste com o vento',
        'Para o leste contra o vento',
        'Para o sul pelas telhas',
        'Para lugar nenhum — galos não botam ovos!',
      ],
      kidPeekNote: 'Hahaha! Galos são machos! Só as GALINHAS botam ovos!',
      kidRoastOnMiss: 'Você estava calculando o vento para um GALO?! Galos não botam ovos!',
      funFact: 'Os detalhes sobre o vento distraem os adultos da palavra "galo".',
    },
    'q-flying-mammal': {
      question: 'Qual destes animais é o ÚNICO mamífero do mundo que realmente pode voar?',
      options: ['Esquilo-voador', 'Morcego', 'Avestruz', 'Papagaio-do-mar'],
      kidPeekNote: 'Esquilos-voadores só planam! Os MORCEGOS voam de verdade!',
      kidRoastOnMiss: 'Os morcegos são os únicos mamíferos capazes de voar de verdade!',
      funFact: 'Os morcegos representam cerca de 20% de todas as espécies de mamíferos.',
    },
    'q-spell-incorrectly': {
      question: 'Qual palavra está SEMPRE escrita "errado" no dicionário?',
      options: ['Exceção', 'Quarta-feira', 'A palavra "Errado"', 'Ritmo'],
      kidPeekNote: 'Olhe as aspas! A palavra "ERRADO" se escreve literalmente "errado"!',
      kidRoastOnMiss: 'A palavra "errado" sempre é escrita "errado"!',
      funFact: 'Uma charada clássica da 2ª série!',
    },
    'q-pound-feathers': {
      question: 'O que pesa mais: 1 quilo de penas de ganso ou 1 quilo de tijolos vermelhos?',
      options: [
        '1 quilo de tijolos',
        '1 quilo de penas',
        'Eles têm exatamente o mesmo peso!',
        'Depende da gravidade',
      ],
      kidPeekNote: '1 quilo é 1 quilo! Os dois têm exatamente o mesmo peso!',
      kidRoastOnMiss: 'Caiu na pegadinha mais antiga da escola! 1 quilo pesa 1 quilo!',
      funFact: 'Ambos pesam 1.000 gramas; apenas o volume é diferente.',
    },
    'q-octopus-hearts': {
      question: 'Os humanos têm 1 coração. Quantos corações tem um polvo-gigante?',
      options: ['1 coração', '2 corações', '3 corações', '8 corações'],
      kidPeekNote: 'Um polvo tem 8 tentáculos, 9 cérebros e TRÊS corações!',
      kidRoastOnMiss: 'O polvo tem TRÊS corações!',
      funFact: 'Polvos têm 3 corações e sangue azul.',
    },
    'q-largest-ocean': {
      question: 'Qual é o maior e mais profundo oceano do planeta Terra?',
      options: ['Oceano Atlântico', 'Oceano Índico', 'Oceano Pacífico', 'Oceano Ártico'],
      kidPeekNote: 'O Oceano PACÍFICO é tão gigante que caberiam todos os continentes nele!',
      kidRoastOnMiss: 'O Oceano Pacífico cobre mais de 30% de toda a Terra!',
      funFact: 'O Pacífico é maior do que todas as áreas de terra firme juntas.',
    },
    'q-apples-take-away': {
      question:
        'Há uma tigela com 6 maçãs vermelhas. Você pega e leva 4 maçãs. Com quantas maçãs VOCÊ ficou?',
      options: ['2 maçãs', '4 maçãs', '6 maçãs', '10 maçãs'],
      kidPeekNote: 'Se você pegou 4 maçãs, VOCÊ tem 4 maçãs na mão!',
      kidRoastOnMiss: 'Ficaram 2 na tigela, mas VOCÊ pegou 4, então você tem 4!',
      funFact: '83% dos adultos respondem "2" pensando na tigela.',
    },
    'q-caterpillar-change': {
      question:
        'Qual é o nome científico quando uma lagarta se transforma em borboleta dentro do casulo?',
      options: ['Fotossíntese', 'Metamorfose', 'Hibernação', 'Evaporação'],
      kidPeekNote: 'A transformação da lagarta em borboleta se chama META-MOR-FOSE!',
      kidRoastOnMiss: 'Plantas fazem fotossíntese; lagartas fazem METAMORFOSE!',
      funFact: 'Dentro da crisálida, a lagarta reconstrói todo o seu corpo.',
    },
    'q-vowel-count': {
      question: 'Quantas vogais (A, E, I, O, U) existem no total na palavra em inglês "CAULIFLOWER"?',
      options: ['3 vogais', '4 vogais', '5 vogais', '6 vogais'],
      kidPeekNote: 'Conte: c-A-U-l-I-f-l-O-w-E-r! A, U, I, O, E — são 5 vogais!',
      kidRoastOnMiss: 'C-A-U-L-I-F-L-O-W-E-R tem todas as 5 vogais!',
      funFact: '"Cauliflower" contém cada uma das 5 vogais exatamente uma vez.',
    },
    'q-bus-driver': {
      question:
        'IMAGINE QUE VOCÊ está dirigindo um ônibus escolar! Na parada 1 entram 6 crianças. Na parada 2 descem 3 e entram 5. Qual é a cor dos olhos do motorista?',
      options: ['Azuis', 'Castanhos', 'A cor dos SEUS olhos!', 'Faltam dados'],
      kidPeekNote: 'Leia o começo: "IMAGINE QUE VOCÊ está dirigindo"! VOCÊ é o motorista!',
      kidRoastOnMiss: 'Você ficou somando passageiros e esqueceu que VOCÊ é o motorista!',
      funFact: 'A charada do motorista de ônibus mais famosa do mundo.',
    },
    'q-venus-spin': {
      question: 'Qual planeta do Sistema Solar é o MAIS QUENTE e ainda gira ao contrário?',
      options: ['Mercúrio', 'Vênus', 'Marte', 'Júpiter'],
      kidPeekNote: 'VÊNUS tem nuvens grossas que prendem o calor e é mais quente que Mercúrio!',
      kidRoastOnMiss: 'Vênus é o planeta mais quente por causa do efeito estufa!',
      funFact: 'Vênus chega a 475 °C e gira no sentido horário.',
    },
    'q-quarters-in-3-dollars': {
      question:
        'Para comprar um sorvete de $3.50 usando apenas moedas de 25 centavos, de quantas moedas você precisa?',
      options: ['10 moedas', '12 moedas', '14 moedas', '16 moedas'],
      kidPeekNote: '4 moedas = $1.00. Então $3.00 = 12 moedas + 2 moedas = 14 moedas!',
      kidRoastOnMiss: '4 × 3 = 12, mais 2 moedas para 50 centavos = 14 moedas!',
      funFact: 'Contar moedas de 25 centavos exercita a multiplicação rápida.',
    },
    'q-towel-riddle': {
      question: 'Qual objeto da casa fica cada vez mais MOLHADO quanto mais ele SECA?',
      options: ['Uma esponja no mar', 'Uma toalha de banho', 'Um cubo de gelo', 'Um secador'],
      kidPeekNote: 'Sua TOALHA DE BANHO seca você e vai ficando molhada!',
      kidRoastOnMiss: 'É a toalha de banho!',
      funFact: 'Clássica charada de duplo sentido do verbo secar.',
    },
    'q-shark-bones': {
      question: 'Quantos OSSOS duros um tubarão-branco tem no corpo inteiro?',
      options: ['Zero (0 ossos!)', '42 ossos', '206 ossos', '312 ossos'],
      kidPeekNote: 'ZERO! Tubarões não têm ossos, o esqueleto deles é de cartilagem!',
      kidRoastOnMiss: 'Tubarões têm ZERO ossos — são 100% cartilagem!',
      funFact: 'O esqueleto de cartilagem deixa o tubarão leve e ágil na água.',
    },
    'q-continents-count': {
      question: 'Qual continente da Terra tem o MAIOR número de países?',
      options: ['Ásia', 'Europa', 'África', 'América do Sul'],
      kidPeekNote: 'A ÁFRICA tem 54 países — mais do que qualquer outro continente!',
      kidRoastOnMiss: 'A Ásia tem 48 países, mas a África tem 54!',
      funFact: 'A África possui 54 nações soberanas reconhecidas.',
    },
    'q-doctor-apple-math': {
      question:
        'Um médico te dá 3 vitaminas e diz para tomar 1 a cada 30 minutos. Quantos minutos levará para tomar todas as 3?',
      options: ['90 minutos', '60 minutos', '45 minutos', '30 minutos'],
      kidPeekNote: 'Você toma a #1 AGORA (0 min), a #2 aos 30 min e a #3 aos 60 min!',
      kidRoastOnMiss: 'Não são 90 minutos! A primeira você toma no minuto 0, então leva 60 minutos!',
      funFact: 'Entre 3 vitaminas existem apenas 2 intervalos de 30 minutos.',
    },
    'q-polar-bear-skin': {
      question: 'Debaixo do pelo branco, qual é a cor da PELE real de um urso-polar?',
      options: ['Rosa', 'Branca', 'Preta', 'Azul'],
      kidPeekNote: 'A pele do urso-polar é PRETA para absorver o calor do sol no Ártico!',
      kidRoastOnMiss: 'A pele do urso-polar é totalmente PRETA!',
      funFact: 'Os pelos são transparentes e a pele preta retém o calor solar.',
    },
    'q-silent-letter-knight': {
      question: 'Qual destas palavras em inglês tem TRÊS letras mudas na pronúncia?',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'Em K-N-I-G-H-T, o K, o G e o H são mudos (3 letras mudas)!',
      kidRoastOnMiss: 'Em KNIGHT não pronunciamos o K, o G nem o H!',
      funFact: 'No inglês medieval, todas essas consoantes eram pronunciadas.',
    },
    'q-lily-pad-pond': {
      question:
        'Vitórias-régias em um lago DOBRAM de tamanho a cada dia. Se levam 20 dias para cobrir TODO o lago, em que dia ele estava na METADE?',
      options: ['Dia 10', 'Dia 15', 'Dia 18', 'Dia 19'],
      kidPeekNote: 'Se dobra todo dia e fica cheio no Dia 20, estava na metade um dia antes: Dia 19!',
      kidRoastOnMiss: '91% dizem Dia 10! Mas como dobra todo dia, a metade foi no Dia 19!',
      funFact: 'Pergunta famosa do Teste de Reflexão Cognitiva (CRT) de MIT e Princeton.',
    },
    'q-strawberry-berries': {
      question: 'Segundo a botânica, qual destas frutas é REALMENTE uma baga (berry) verdadeira?',
      options: ['Morango', 'Framboesa', 'Banana', 'Amora'],
      kidPeekNote: 'Morangos têm sementes por fora — a BANANA é uma baga botânica verdadeira!',
      kidRoastOnMiss: 'Na botânica, bananas e tomates são bagas verdadeiras, e morangos não!',
      funFact: 'Bagas botânicas possuem sementes abrigadas dentro da polpa.',
    },
    'q-million-bat-ball': {
      question:
        'FINAL DE $1.000.000: Um taco e uma bola custam juntos $1.10. O taco custa $1.00 A MAIS que a bola. Quanto custa a bola?',
      options: ['10 centavos ($0.10)', '5 centavos ($0.05)', '1 centavo ($0.01)', '15 centavos ($0.15)'],
      kidPeekNote:
        'NÃO ESCOLHA 10 CENTAVOS! A bola custa 5 CENTAVOS e o taco $1.05 ($1.05 + $0.05 = $1.10)!',
      kidRoastOnMiss:
        'Caiu na armadilha dos 10 centavos! 5 centavos + $1.05 = $1.10!',
      funFact: 'Mais de 50% dos universitários respondem "10 centavos" na primeira tentativa.',
    },
    'q-million-mary-mom': {
      question:
        'FINAL DE $1.000.000: A mãe da Maria tem 4 filhas. As três primeiras se chamam Abril, Maio e Junho. Qual é o nome da 4ª filha?',
      options: ['Julho', 'Agosto', 'Maria!', 'Primavera'],
      kidPeekNote: 'Leia o comecinho: "A mãe da MARIA"! A 4ª filha é a MARIA!',
      kidRoastOnMiss: 'VOCÊ ESCOLHEU JULHO?! 😂 Diz "A mãe da MARIA"! O nome dela é MARIA!',
      funFact: 'O cérebro adulto segue os meses do calendário e esquece o começo da frase.',
    },
  },
  ar: {
    'q-race-2nd': {
      question:
        'أنت تركض في سباق مدرسي وتجاوزت الشخص الذي في المركز الثاني! في أي مركز أنت الآن؟',
      options: ['المركز الأول', 'المركز الثاني', 'المركز الثالث', 'متعادل في الأول'],
      kidPeekNote: 'انتبه! إذا تجاوزت صاحب المركز الثاني فأنت تأخذ مكانه — إذن أنت في المركز الثاني!',
      kidRoastOnMiss: 'هاها! إذا تجاوزت الثاني فإن صاحب المركز الأول ما زال أمامك! أنت في المركز الثاني!',
      funFact: 'أكثر من 65% من الكبار يتسرعون ويختارون المركز الأول!',
    },
    'q-paint-mix': {
      question: 'في حصة الفنون، إذا خلطت اللون الأصفر مع اللون الأزرق، ما اللون الناتج؟',
      options: ['بنفسجي', 'برتقالي', 'أخضر', 'بني'],
      kidPeekNote: 'أصفر + أزرق يعطي اللون الأخضر مثل العشب!',
      kidRoastOnMiss: 'الأصفر مع الأزرق يعطي اللون الأخضر!',
      funFact: 'الأصفر والأزرق من الألوان الأساسية التي تنتج الأخضر عند مزجها.',
    },
    'q-spider-legs': {
      question: 'كم عدد أرجل العنكبوت؟',
      options: ['6 أرجل', '8 أرجل', '10 أرجل', '12 رجلاً'],
      kidPeekNote: 'الحشرات لها 6 أرجل، لكن العناكب لها 8 أرجل!',
      kidRoastOnMiss: 'عدّها! العناكب لها 8 أرجل!',
      funFact: 'جميع العنكبيات تمتلك 8 أرجل بينما الحشرات تمتلك 6.',
    },
    'q-months-28': {
      question: 'كم شهراً في السنة يحتوي على 28 يوماً؟',
      options: ['شهر واحد فقط (فبراير)', 'شهران', '6 أشهر', 'جميع الـ 12 شهراً!'],
      kidPeekNote: 'سؤال خادع! جميع الأشهر الـ 12 فيها 28 يوماً على الأقل!',
      kidRoastOnMiss: 'وقعت في الفخ! اخترت فبراير أليس كذلك؟ كل شهور السنة فيها يوم 28!',
      funFact: '4 من كل 5 بالغين يختارون فبراير لأنهم يفترضون كلمة "فقط".',
    },
    'q-farmer-sheep': {
      question:
        'لدى مزارع 17 خروفاً. هبت عاصفة فهربت كلها ما عدا 9! كم خروفاً بقي لدى المزارع؟',
      options: ['8 خراف', '9 خراف', '17 خروفاً', '26 خروفاً'],
      kidPeekNote: 'لا تطرح 17 - 9! جملة "ما عدا 9" تعني أن 9 خراف بقيت!',
      kidRoastOnMiss: 'حسبت 17 ناقص 9 = 8! "كلها ما عدا 9" تعني أنه بقي 9 خراف!',
      funFact: 'يقوم الكبار بالطرح تلقائياً عند رؤية رقمين في السؤال.',
    },
    'q-stop-sign': {
      question: 'إشارة "قف" (STOP) الحمراء ثمانية الأضلاع. كم ضلعاً لها؟',
      options: ['6 أضلاع', '7 أضلاع', '8 أضلاع', '10 أضلاع'],
      kidPeekNote: 'المضلع الثماني له 8 أضلاع!',
      kidRoastOnMiss: 'إشارة قف لها 8 أضلاع!',
      funFact: 'الشكل الثماني مميز عالمياً لإشارات التوقف.',
    },
    'q-rooster-egg': {
      question:
        'يقف ديك على قمة سقف حظيرة متجهاً نحو الشمال، والرياح تهب غرباً. إذا باض الديك بيضة، في أي اتجاه تتدحرج؟',
      options: [
        'غرباً مع الرياح',
        'شرقاً عكس الرياح',
        'جنوباً على السقف',
        'لا تتدحرج — الديك لا يبيض!',
      ],
      kidPeekNote: 'هاهاها! الديك ذكر! الدجاجات فقط هي التي تبيض!',
      kidRoastOnMiss: 'هل كنت تحسب اتجاه الرياح من أجل ديك؟! الديك لا يبيض!',
      funFact: 'تفاصيل الرياح والاتجاهات تشتت انتباه الكبار عن كلمة "ديك".',
    },
    'q-flying-mammal': {
      question: 'أي من هذه الحيوانات هو الثديي الوحيد في العالم القادر على الطيران الحقيقي؟',
      options: ['السنجاب الطائر', 'الخفاش', 'النعامة', 'طائر البفن'],
      kidPeekNote: 'السنجاب الطائر ينزلق فقط في الهواء، أما الخفاش فيطير حقاً!',
      kidRoastOnMiss: 'الخفاش هو الحيوان الثديي الوحيد الذي يطير بجناحيه!',
      funFact: 'تشكل الخفافيش حوالي 20% من جميع أنواع الثدييات على الأرض.',
    },
    'q-spell-incorrectly': {
      question: 'ما هي الكلمة التي تُكتب دائماً "خطأ" في القاموس؟',
      options: ['مشكلة', 'الأربعاء', 'كلمة "خطأ"', 'إيقاع'],
      kidPeekNote: 'انظر إلى علامات التنصيص! كلمة "خطأ" تُكتب حرفياً خ-ط-أ!',
      kidRoastOnMiss: 'كلمة "خطأ" تُكتب دائماً "خطأ"!',
      funFact: 'لغز لغوي كلاسيكي يتفوق فيه الأطفال على الكبار.',
    },
    'q-pound-feathers': {
      question: 'أيهما أثقل وزناً: كيلو من ريش الإوز أم كيلو من الطوب الأحمر؟',
      options: ['كيلو الطوب', 'كيلو الريش', 'لهما نفس الوزن تماماً!', 'يعتمد على الجاذبية'],
      kidPeekNote: 'الكيلو هو كيلو! كلاهما يزن نفس الوزن تماماً!',
      kidRoastOnMiss: 'وقعت في أقدم خدعة مدرسية! الكيلو يساوي كيلو!',
      funFact: 'كلاهما يزن 1000 غرام بالضبط، والفرق في الحجم والكثافة فقط.',
    },
    'q-octopus-hearts': {
      question: 'الإنسان لديه قلب واحد. كم قلباً يمتلك الأخطبوط العملاق؟',
      options: ['قلب واحد', 'قلبان', '3 قلوب', '8 قلوب'],
      kidPeekNote: 'الأخطبوط لديه 8 أذرع و9 أدمغة و3 قلوب!',
      kidRoastOnMiss: 'الأخطبوط يمتلك ثلاثة قلوب!',
      funFact: 'للأخطبوط 3 قلوب ودم أزرق يساعده في أعماق المحيط الباردة.',
    },
    'q-largest-ocean': {
      question: 'ما هو أكبر وأعمق محيط على كوكب الأرض؟',
      options: ['المحيط الأطلسي', 'المحيط الهندي', 'المحيط الهادئ', 'المحيط المتجمد الشمالي'],
      kidPeekNote: 'المحيط الهادئ هو الأكبر والأعمق على الإطلاق!',
      kidRoastOnMiss: 'المحيط الهادئ يغطي أكثر من 30% من سطح الأرض!',
      funFact: 'مساحة المحيط الهادئ أكبر من مساحة جميع القارات مجتمعة.',
    },
    'q-apples-take-away': {
      question: 'هناك وعاء فيه 6 تفاحات حمراء. أخذتَ أنت 4 تفاحات. كم تفاحة لديك أنت الآن؟',
      options: ['تفاحتان', '4 تفاحات', '6 تفاحات', '10 تفاحات'],
      kidPeekNote: 'إذا أخذت 4 تفاحات بيديك، فلديك أنت 4 تفاحات!',
      kidRoastOnMiss: 'بقي 2 في الوعاء، لكنك أنت أخذت 4 تفاحات إذن معك 4!',
      funFact: '83% من الكبار يجيبون "2" لأنهم يحسبون ما بقي في الوعاء.',
    },
    'q-caterpillar-change': {
      question: 'ما هو المصطلح العلمي لتحول اليرقة إلى فراشة داخل الشرنقة؟',
      options: ['البناء الضوئي', 'التحول الكامل (Metamorphosis)', 'البيات الشتوي', 'التبخر'],
      kidPeekNote: 'النباتات تقوم بالبناء الضوئي، أما اليرقة فتمر بعملية التحول!',
      kidRoastOnMiss: 'تحول اليرقة إلى فراشة يسمى التحول (Metamorphosis)!',
      funFact: 'داخل الشرنقة تعيد اليرقة بناء جسمها بالكامل لتصبح فراشة.',
    },
    'q-vowel-count': {
      question: 'كم عدد حروف العلة الإنجليزية (A, E, I, O, U) الموجودة في كلمة "CAULIFLOWER"؟',
      options: ['3 حروف', '4 حروف', '5 حروف', '6 حروف'],
      kidPeekNote: 'عدّها: A, U, I, O, E — فيها جميع حروف العلة الـ 5!',
      kidRoastOnMiss: 'كلمة CAULIFLOWER تحتوي على حروف العلة الخمسة كلها!',
      funFact: 'تحتوي هذه الكلمة على كل حرف علة إنجليزي مرة واحدة بالضبط.',
    },
    'q-bus-driver': {
      question:
        'تخيل أنك تقود حافلة مدرسية! في المحطة الأولى صعد 6 أطفال، وفي الثانية نزل 3 وصعد 5. ما هو لون عيني السائق؟',
      options: ['أزرق', 'عسلي', 'نفس لون عينيك أنت!', 'المعلومات غير كافية'],
      kidPeekNote: 'اقرأ أول كلمة: "تخيل أنك تقود"! أنت هو السائق!',
      kidRoastOnMiss: 'كنت تحسب الركاب ونسيت أنك أنت سائق الحافلة!',
      funFact: 'أشهر لغز مدرسي يختبر التركيز والانتباه لبداية الجملة.',
    },
    'q-venus-spin': {
      question: 'أي كوكب في مجموعتنا الشمسية هو الأشد حرارة ويدور عكس اتجاه الكواكب الأخرى؟',
      options: ['عطارد', 'الزهرة', 'المريخ', 'المشتري'],
      kidPeekNote: 'كوكب الزهرة يحبس الحرارة بغلافه الجوي الكثيف فهو أسخن من عطارد!',
      kidRoastOnMiss: 'الزهرة هو الكوكب الأسخن بسبب الاحتباس الحراري القوي!',
      funFact: 'تصل حرارة سطح الزهرة إلى 475 درجة مئوية وتشرق الشمس فيه من الغرب.',
    },
    'q-quarters-in-3-dollars': {
      question: 'إذا أردت شراء مثلجات بسعر 3.50$ باستخدام عملات ربع الدولار (25 سنتاً)، كم عملة تحتاج؟',
      options: ['10 عملات', '12 عملة', '14 عملة', '16 عملة'],
      kidPeekNote: '4 أرباع = دولار واحد. إذن 3 دولارات = 12 عملة + عملتين للنصف دولار = 14 عملة!',
      kidRoastOnMiss: '4 × 3 = 12، زائد عملتين لنصف الدولار = 14 عملة!',
      funFact: 'الحساب بالعملات المعدنية يقوي مهارات الضرب الذهني السريع.',
    },
    'q-towel-riddle': {
      question: 'ما هو الشيء الذي يزداد بللاً كلما قام بالتجفيف أكثر؟',
      options: ['إسفنجة في البحر', 'منشفة الحمام', 'مكعب ثلج', 'مجفف الشعر'],
      kidPeekNote: 'منشفة الحمام تجفف جسمك وتبتل هي بالماء!',
      kidRoastOnMiss: 'إنها منشفة الحمام!',
      funFact: 'لغز كلاسيكي يعتمد على التلاعب اللفظي بفعل التجفيف.',
    },
    'q-shark-bones': {
      question: 'كم عظمة صلبة توجد في جسم القرش الأبيض الكبير؟',
      options: ['صفر (0 عظام!)', '42 عظمة', '206 عظمات', '312 عظمة'],
      kidPeekNote: 'صفر! أسماك القرش لا تملك عظاماً صلبة بل غضاريف مرنة!',
      kidRoastOnMiss: 'القروش لديها صفر عظام — هيكلها كله من الغضروف!',
      funFact: 'الهيكل الغضروفي الخفيف يمنح القرش سرعة ومرونة عالية في السباحة.',
    },
    'q-continents-count': {
      question: 'أي قارة في العالم تضم أكبر عدد من الدول؟',
      options: ['آسيا', 'أوروبا', 'أفريقيا', 'أمريكا الجنوبية'],
      kidPeekNote: 'قارة أفريقيا تضم 54 دولة — أكثر من أي قارة أخرى!',
      kidRoastOnMiss: 'آسيا فيها 48 دولة، بينما أفريقيا فيها 54 دولة!',
      funFact: 'تضم أفريقيا 54 دولة مستقلة معترفاً بها.',
    },
    'q-doctor-apple-math': {
      question:
        'أعطاك الطبيب 3 حبات فيتامين وقال لك خذ حبة كل 30 دقيقة. كم دقيقة ستستغرق لتناول الحبات الثلاث؟',
      options: ['90 دقيقة', '60 دقيقة', '45 دقيقة', '30 دقيقة'],
      kidPeekNote: 'تأخذ الأولى الآن (دقيقة 0)، والثانية بعد 30 دقيقة، والثالثة بعد 60 دقيقة!',
      kidRoastOnMiss: 'ليست 90 دقيقة! لأنك تأخذ الحبة الأولى فوراً عند الدقيقة صفر، فتحتاج 60 دقيقة فقط!',
      funFact: 'بين 3 حبات توجد فترتا انتظار فقط مدة كل منهما 30 دقيقة.',
    },
    'q-polar-bear-skin': {
      question: 'تحت الفرو الأبيض، ما هو لون جلد الدب القطبي الحقيقي؟',
      options: ['وردي', 'أبيض', 'أسود فاحم', 'أزرق ثلجي'],
      kidPeekNote: 'جلد الدب القطبي أسود ليمتص حرارة الشمس في القطب المتجمد!',
      kidRoastOnMiss: 'جلد الدب القطبي أسود تماماً!',
      funFact: 'فرو الدب القطبي شفاف ومجوف بينما جلده الأسود يمتص الدفء.',
    },
    'q-silent-letter-knight': {
      question: 'أي من هذه الكلمات الإنجليزية تحتوي على 3 حروف صامتة لا تُنطق؟',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'في كلمة K-N-I-G-H-T الحروف K وG وH كلها صامتة!',
      kidRoastOnMiss: 'كلمة KNIGHT فيها 3 حروف صامتة هي K وG وH!',
      funFact: 'في الإنجليزية القديمة كانت هذه الحروف تُنطق قديماً.',
    },
    'q-lily-pad-pond': {
      question:
        'يتضاعف حجم زهور اللوتس في بركة كل يوم. إذا استغرقت 20 يوماً لتغطية البركة كاملة، في أي يوم كانت تغطي نصف البركة؟',
      options: ['اليوم 10', 'اليوم 15', 'اليوم 18', 'اليوم 19'],
      kidPeekNote: 'إذا كانت تتضاعف كل يوم واكتملت في اليوم 20، فقد كانت في النصف قبلها بيوم واحد: اليوم 19!',
      kidRoastOnMiss: '91% يقولون اليوم 10! لكن بما أنها تتضاعف يومياً فالنصف كان في اليوم 19!',
      funFact: 'سؤال شهير من اختبار الانعكاس المعرفي (CRT) في جامعتي MIT وبرينستون.',
    },
    'q-strawberry-berries': {
      question: 'حسب علم النبات، أي من هذه الفواكه يُعتبر "توتاً حقيقياً" (True Berry)؟',
      options: ['الفراولة', 'التوت الأحمر', 'الموز', 'التوت الأسود'],
      kidPeekNote: 'الفراولة بذورها في الخارج، أما الموز فهو توت نباتي حقيقي!',
      kidRoastOnMiss: 'علمياً، الموز والطماطم من التوتيات الحقيقية وليست الفراولة!',
      funFact: 'في علم النبات يصنف الموز والعنب والطماطم كثمار توتية حقيقية.',
    },
    'q-million-bat-ball': {
      question:
        'سؤال المليون دولار: مضرب وكرة سعرهما معاً 1.10$. المضرب أغلى من الكرة بـ 1.00$. كم سعر الكرة؟',
      options: ['10 سنتات (0.10$)', '5 سنتات (0.05$)', 'سنت واحد (0.01$)', '15 سنتاً (0.15$)'],
      kidPeekNote:
        'لا تختر 10 سنتات! الكرة سعرها 5 سنتات والمضرب 1.05$ (1.05$ + 0.05$ = 1.10$)!',
      kidRoastOnMiss: 'وقعت في فخ الـ 10 سنتات! 5 سنتات + 1.05$ = 1.10$!',
      funFact: 'أكثر من نصف طلاب الجامعات يخطئون في هذا السؤال عند المحاولة الأولى.',
    },
    'q-million-mary-mom': {
      question:
        'سؤال المليون دولار: والدة مريم لديها 4 بنات: نيسان، أيار، وحزيران. ما اسم الابنة الرابعة؟',
      options: ['تموز', 'آب', 'مريم!', 'ربيع'],
      kidPeekNote: 'اقرأ أول كلمتين: "والدة مريم"! الابنة الرابعة هي مريم!',
      kidRoastOnMiss: 'اخترتَ تموز؟! 😂 السؤال يقول "والدة مريم"! اسمها مريم!',
      funFact: 'يتبع دماغ الكبار تسلسل الأشهر وينسى الاسم المذكور في بداية الجملة.',
    },
  },
  am: {
    'q-race-2nd': {
      question: 'በትምህርት ቤት የሩጫ ውድድር ላይ 2ኛ ደረጃ ላይ ያለውን ሰው ቀድመው አለፉት! አሁን በስንተኛ ደረጃ ላይ ነዎት?',
      options: ['1ኛ ደረጃ', '2ኛ ደረጃ', '3ኛ ደረጃ', 'ከ1ኛው ጋር እኩል'],
      kidPeekNote: 'ቆይ! 1ኛ አይምረጡ! 2ኛውን ሰው ሲቀድሙ የእሱን ቦታ ነው የሚይዙት — ስለዚህ 2ኛ ነዎት!',
      kidRoastOnMiss: 'ሃሃ! 2ኛውን ካለፉ 1ኛው ሰው አሁንም ከፊትዎ ነው! 2ኛ ደረጃ ላይ ነዎት!',
      funFact: 'ከ65% በላይ አዋቂዎች በችኮላ "1ኛ ደረጃ" ብለው ይሳታሉ!',
    },
    'q-paint-mix': {
      question: 'በሥዕል ክፍለ ጊዜ ቢጫ እና ሰማያዊ ቀለም ቢቀላቅሉ ምን ዓይነት ቀለም ይፈጠራል?',
      options: ['ወይን ጠጅ', 'ብርቱካናማ', 'አረንጓዴ', 'ቡናማ'],
      kidPeekNote: 'ቢጫ + ሰማያዊ እንደ ሣር አረንጓዴ ይሆናል!',
      kidRoastOnMiss: 'ቢጫ እና ሰማያዊ ሲቀላቀሉ አረንጓዴ ይሰጣሉ!',
      funFact: 'ቢጫ እና ሰማያዊ መሠረታዊ ቀለሞች ሲዋሃዱ አረንጓዴ ብርሃን ያንጸባርቃሉ።',
    },
    'q-spider-legs': {
      question: 'ሸረሪት ስንት እግሮች አሏት?',
      options: ['6 እግሮች', '8 እግሮች', '10 እግሮች', '12 እግሮች'],
      kidPeekNote: 'ነፍሳት 6 እግር አላቸው፣ ሸረሪቶች ግን 8 እግሮች አሏቸው!',
      kidRoastOnMiss: 'ይቁጠሩ! ሸረሪቶች 8 እግሮች አሏቸው!',
      funFact: 'ሁሉም የሸረሪት ዝርያዎች 8 እግሮች ሲኖሯቸው ነፍሳት ግን 6 አሏቸው።',
    },
    'q-months-28': {
      question: 'በዓመት ውስጥ ስንት ወራት 28 ቀናት አሏቸው?',
      options: ['1 ብቻ (የካቲት/February)', '2 ወራት', '6 ወራት', 'ሁሉም 12 ወራት!'],
      kidPeekNote: 'ወጥመድ ነው! ሁሉም 12 ወራት ቢያንስ 28 ቀናት አሏቸው!',
      kidRoastOnMiss: 'ተያዙ! ፌብሩዋሪን መረጡ አይደል?! ሁሉም 12 ወራት 28ኛ ቀን አላቸው!',
      funFact: 'ከ5 አዋቂዎች 4ቱ "1 ብቻ" ብለው ይመልሳሉ።',
    },
    'q-farmer-sheep': {
      question: 'አንድ ገበሬ 17 በጎች ነበሩት። ማዕበል መጥቶ ከ9 በስተቀር ሁሉም ጠፉ! ገበሬው ስንት በጎች ቀሩት?',
      options: ['8 በጎች', '9 በጎች', '17 በጎች', '26 በጎች'],
      kidPeekNote: '17 - 9 አይቀንሱ! "ከ9 በስተቀር ሁሉም ጠፉ" ማለት 9 ቀሩ ማለት ነው!',
      kidRoastOnMiss: '17 ሲቀነስ 9 = 8 አሉ አይደል?! "ከ9 በስተቀር" ማለት 9 በጎች ቀርተዋል ማለት ነው!',
      funFact: 'አዋቂዎች ሁለት ቁጥሮችን ሲያዩ ወዲያውኑ መቀነስ ይጀምራሉ።',
    },
    'q-stop-sign': {
      question: 'ቀይ የ"ቁም" (STOP) የመንገድ ምልክት ባለ ስምንት ጎን (Octagon) ነው። ስንት ጎኖች አሉት?',
      options: ['6 ጎኖች', '7 ጎኖች', '8 ጎኖች', '10 ጎኖች'],
      kidPeekNote: 'ኦክታጎን (Octagon) 8 ጎኖች አሉት!',
      kidRoastOnMiss: 'የቁም ምልክት 8 ጎኖች አሉት!',
      funFact: 'ኦክቶ (Octo) ከግሪክ የመጣ ሲሆን ስምንት ማለት ነው።',
    },
    'q-rooster-egg': {
      question:
        'አንድ አውራ ዶሮ በጎተራ ጣሪያ ጫፍ ላይ ወደ ሰሜን ዞሮ ተቀምጧል። ነፋሱ ወደ ምዕራብ ይነፍሳል። አውራ ዶሮው እንቁላል ቢጥል ወዴት ይንከባለላል?',
      options: ['ወደ ምዕራብ ከነፋሱ ጋር', 'ወደ ምሥራቅ', 'ወደ ደቡብ', 'የትም አይሄድም — አውራ ዶሮ እንቁላል አይጥልም!'],
      kidPeekNote: 'ሃሃሃ! አውራ ዶሮ ወንድ ነው! እንቁላል የምትጥለው ሴቷ ዶሮ ብቻ ናት!',
      kidRoastOnMiss: 'ለአውራ ዶሮ የነፋስ አቅጣጫ እያሰቡ ነበር?! አውራ ዶሮ እንቁላል አይጥልም!',
      funFact: 'የነፋሱ አቅጣጫ ዝርዝር አዋቂዎች "አውራ ዶሮ" የሚለውን ቃል እንዲረሱ ያደርጋል።',
    },
    'q-flying-mammal': {
      question: 'ከእነዚህ እንስሳት ውስጥ በእውነት መብረር የሚችለው ብቸኛው አጥቢ እንስሳ የትኛው ነው?',
      options: ['በራሪ ሽኮኮ', 'የሌሊት ወፍ (Bat)', 'ሰጎን', 'พัฟን ወፍ'],
      kidPeekNote: 'የሌሊት ወፍ ብቸኛዋ በራሪ አጥቢ እንስሳ ናት!',
      kidRoastOnMiss: 'በእውነት መብረር የሚችሉት አጥቢ እንስሳት የሌሊት ወፎች ብቻ ናቸው!',
      funFact: 'የሌሊት ወፎች ከዓለም አጥቢ እንስሳት ዝርያዎች 20% ያህሉን ይይዛሉ።',
    },
    'q-spell-incorrectly': {
      question: 'በእንግሊዝኛ መዝገበ ቃላት ውስጥ ሁልጊዜ "INCORRECTLY" ተብሎ የሚጻፈው ቃል የትኛው ነው?',
      options: ['Misspelled', 'Wednesday', 'የሚለው ቃል "Incorrectly"', 'Rhythm'],
      kidPeekNote: 'ጥቅሱን ይመልከቱ! "INCORRECTLY" የሚለው ቃል ራሱ እንደዚያ ነው የሚጻፈው!',
      kidRoastOnMiss: '"Incorrectly" የሚለው ቃል ሁልጊዜም እንደዚያው ይጻፋል!',
      funFact: 'የ2ኛ ክፍል ተማሪዎች የሚወዱት የቃላት ጨዋታ!',
    },
    'q-pound-feathers': {
      question: 'የትኛው ይከብዳል፡ 1 ኪሎ የዳክዬ ላባ ወይስ 1 ኪሎ ቀይ ጡብ?',
      options: ['1 ኪሎ ጡብ', '1 ኪሎ ላባ', 'ሁለቱም ክብደታቸው እኩል ነው!', 'እንደ ስበት ይለያያል'],
      kidPeekNote: '1 ኪሎ ምንጊዜም 1 ኪሎ ነው! ክብደታቸው እኩል ነው!',
      kidRoastOnMiss: 'ሁለቱም 1 ኪሎ ናቸው — ክብደታቸው እኩል ነው!',
      funFact: 'ሁለቱም ልክ 1,000 ግራም ይመዝናሉ፤ የሚለያየው መጠናቸው ብቻ ነው።',
    },
    'q-octopus-hearts': {
      question: 'የሰው ልጅ 1 ልብ አለው። ግዙፉ ኦክቶፐስ (Octopus) ስንት ልቦች አሉት?',
      options: ['1 ልብ', '2 ልቦች', '3 ልቦች', '8 ልቦች'],
      kidPeekNote: 'ኦክቶፐስ 8 እጆች፣ 9 አንጎሎች እና 3 ልቦች አሉት!',
      kidRoastOnMiss: 'ኦክቶፐስ ሦስት ልቦች አሉት!',
      funFact: 'ኦክቶፐሶች 3 ልቦች እና ሰማያዊ ደም አሏቸው።',
    },
    'q-largest-ocean': {
      question: 'በምድር ላይ ትልቁ እና ጥልቁ ውቅያኖስ የትኛው ነው?',
      options: ['አትላንቲክ ውቅያኖስ', 'ሕንድ ውቅያኖስ', 'ፓሲፊክ ውቅያኖስ', 'አርክቲክ ውቅያኖስ'],
      kidPeekNote: 'ፓሲፊክ ውቅያኖስ ከሁሉም አህጉራት ድምር ይበልጣል!',
      kidRoastOnMiss: 'ፓሲፊክ ውቅያኖስ የምድርን 30% በላይ ይሸፍናል!',
      funFact: 'ፓሲፊክ ውቅያኖስ በምድር ላይ ካሉ የየብስ ክፍሎች ሁሉ ይበልጣል።',
    },
    'q-apples-take-away': {
      question: 'ሳህን ውስጥ 6 ቀይ التفاح (ፖም) አሉ። እርስዎ 4 ፖም ወሰዱ። አሁን እርስዎ ስንት ፖም አለዎት?',
      options: ['2 ፖም', '4 ፖም', '6 ፖም', '10 ፖም'],
      kidPeekNote: '4 ፖም ከወሰዱ በእጅዎ 4 ፖም አለዎት!',
      kidRoastOnMiss: 'ሳህኑ ውስጥ 2 ቀረ፣ ግን እርስዎ የወሰዱት 4 ስለሆነ 4 አለዎት!',
      funFact: '83% አዋቂዎች በሳህኑ ውስጥ የቀረውን በማሰብ "2" ብለው ይሳታሉ።',
    },
    'q-caterpillar-change': {
      question: 'አባ ጨጓሬ ወደ ቢራቢሮ የሚቀየርበት ሳይንሳዊ ሂደት ምን ይባላል?',
      options: ['ፎቶሲንተሲስ', 'ሜታሞርፎሲስ (Metamorphosis)', 'ሃይበርኔሽን', 'ትነት'],
      kidPeekNote: 'አባ ጨጓሬ ወደ ቢራቢሮ ሲቀየር ሜታሞርፎሲስ ይባላል!',
      kidRoastOnMiss: 'ፎቶሲንተሲስ የዕፅዋት ነው! የቢራቢሮ ለውጥ ሜታሞርፎሲስ ይባላል!',
      funFact: 'አባ ጨጓሬ በሽፋኑ ውስጥ ሰውነቱን ሙሉ በሙሉ ወደ ቢራቢሮ ይለውጣል።',
    },
    'q-vowel-count': {
      question: '"CAULIFLOWER" በሚለው የእንግሊዝኛ ቃል ውስጥ ስንት አናባቢ ፊደላት (A, E, I, O, U) አሉ?',
      options: ['3 አናባቢ', '4 አናባቢ', '5 አናባቢ', '6 አናባቢ'],
      kidPeekNote: 'ይቁጠሩ፡ A, U, I, O, E — 5 አናባቢዎች አሉት!',
      kidRoastOnMiss: 'CAULIFLOWER አምስቱንም አናባቢዎች ይዟል!',
      funFact: 'ይህ ቃል አምስቱንም የእንግሊዝኛ አናባቢዎች አንድ ጊዜ ይዟል።',
    },
    'q-bus-driver': {
      question:
        'እርስዎ የትምህርት ቤት አውቶቡስ እየነዱ ነው እንበል! በ1ኛው ፌርማታ 6 ልጆች ወጡ። በ2ኛው 3 ወርደው 5 ወጡ። የሹፌሩ ዓይን ቀለም ምንድን ነው?',
      options: ['ሰማያዊ', 'ቡናማ', 'የእርስዎ የዓይን ቀለም!', 'መረጃው አይበቃም'],
      kidPeekNote: 'የመጀመሪያውን ቃል ያንብቡ፡ "እርስዎ አውቶቡስ እየነዱ ነው"! ሹፌሩ እርስዎ ነዎት!',
      kidRoastOnMiss: 'ተሳፋሪዎችን ሲቆጥሩ ሹፌሩ እርስዎ መሆንዎን ረሱ!',
      funFact: 'በዓለም ላይ በጣም ታዋቂው የትምህርት ቤት አውቶቡስ እንቆቅልሽ።',
    },
    'q-venus-spin': {
      question: 'በሥርዓተ ፀሐይ ውስጥ በጣም ሞቃታማው እና ወደ ኋላ የሚሽከረከረው ፕላኔት የትኛው ነው?',
      options: ['ሜርኩሪ', 'ቬነስ (Venus)', 'ማርስ', 'ጁፒተር'],
      kidPeekNote: 'ቬነስ ጥቅጥቅ ያለ ደመና ስላላት ከሜርኩሪ ይበልጥ ሞቃት ናት!',
      kidRoastOnMiss: 'በሙቀት አማቂ ጋዞች ምክንያት በጣም ሞቃታማዋ ፕላኔት ቬነስ ናት!',
      funFact: 'የቬነስ ሙቀት 475°C ይደርሳል፤ ፀሐይም በምዕራብ ትወጣለች።',
    },
    'q-quarters-in-3-dollars': {
      question: 'የ$3.50 አይስክሬም በ25 ሳንቲም ሳንቲሞች (Quarters) ብቻ ለመግዛት ስንት ሳንቲሞች ያስፈልጋሉ?',
      options: ['10 ሳንቲሞች', '12 ሳንቲሞች', '14 ሳንቲሞች', '16 ሳንቲሞች'],
      kidPeekNote: '4 ሳንቲም = $1.00። ስለዚህ $3.00 = 12 ሳንቲም + 2 ሳንቲም ለ50¢ = 14 ሳንቲሞች!',
      kidRoastOnMiss: '4 × 3 = 12፣ ሲደመር 2 = 14 ሳንቲሞች!',
      funFact: 'በ25 ሳንቲም መቁጠር ፈጣን የአእምሮ ሒሳብን ያዳብራል።',
    },
    'q-towel-riddle': {
      question: 'ሌላውን ነገር ባደረቀ ቁጥር ራሱ እየረጠበ የሚሄደው የቤት ውስጥ ዕቃ ምንድን ነው?',
      options: ['የባሕር ስፖንጅ', 'የገላ ፎጣ', 'የበረዶ ኩብ', 'የፀጉር ማድረቂያ'],
      kidPeekNote: 'ፎጣ ሰውነትዎን ሲያደርቅ ራሱ እየረጠበ ይሄዳል!',
      kidRoastOnMiss: 'መልሱ የገላ ፎጣ ነው!',
      funFact: 'ታዋቂ የ2ኛ ክፍል እንቆቅልሽ።',
    },
    'q-shark-bones': {
      question: 'አንድ ትልቅ ነጭ ሻርክ በሰውነቱ ውስጥ ስንት ጠንካራ አጥንቶች አሉት?',
      options: ['ዜሮ (0 አጥንት!)', '42 አጥንቶች', '206 አጥንቶች', '312 አጥንቶች'],
      kidPeekNote: 'ዜሮ! የሻርክ አፅም ሙሉ በሙሉ ከለስላሳ ልም አጥንት (Cartilage) የተሠራ ነው!',
      kidRoastOnMiss: 'ሻርኮች 0 አጥንት አላቸው — 100% ልም አጥንት (Cartilage) ናቸው!',
      funFact: 'ቀላል የልም አጥንት አፅም ሻርኮች በፍጥነት እንዲዋኙ ይረዳቸዋል።',
    },
    'q-continents-count': {
      question: 'በምድር ላይ በጣም ብዙ ሀገራት ያሉት አህጉር የትኛው ነው?',
      options: ['እስያ', 'አውሮፓ', 'አፍሪካ', 'ደቡብ አሜሪካ'],
      kidPeekNote: 'አፍሪካ 54 ሀገራት አሏት — ከማንኛውም አህጉር ይበልጣል!',
      kidRoastOnMiss: 'እስያ 48 ሀገራት ስትኖራት አፍሪካ ግን 54 ሀገራት አሏት!',
      funFact: 'አፍሪካ 54 ሉዓላዊ ሀገራትን ይዛለች።',
    },
    'q-doctor-apple-math': {
      question:
        'ሐኪም 3 የቫይታሚን እንክብሎችን ሰጥቶ በየ30 ደቂቃው 1 ይውሰዱ አለዎት። ሦስቱንም ለመውሰድ ስንት ደቂቃ ይፈጃል?',
      options: ['90 ደቂቃ', '60 ደቂቃ', '45 ደቂቃ', '30 ደቂቃ'],
      kidPeekNote: '1ኛውን አሁን (0 ደቂቃ)፣ 2ኛውን በ30 ደቂቃ፣ 3ኛውን በ60 ደቂቃ ይወስዳሉ!',
      kidRoastOnMiss: '90 ደቂቃ አይደለም! የመጀመሪያውን ወዲያውኑ ስለሚወስዱ 60 ደቂቃ ብቻ ይፈጃል!',
      funFact: 'በ3 እንክብሎች መካከል ሁለት የ30 ደቂቃ የጥበቃ ጊዜያት ብቻ አሉ።',
    },
    'q-polar-bear-skin': {
      question: 'ከነጭ ፀጉሩ ስር የዋልታ ድብ (Polar Bear) ትክክለኛ የቆዳ ቀለም ምንድን ነው?',
      options: ['ሮዝ', 'ነጭ', 'ጥቁር', 'ሰማያዊ'],
      kidPeekNote: 'የፀሐይ ሙቀትን ለመሳብ የዋልታ ድብ ቆዳ ጥቁር ነው!',
      kidRoastOnMiss: 'የዋልታ ድብ ቆዳ ሙሉ በሙሉ ጥቁር ነው!',
      funFact: 'ፀጉሩ ብርሃን የሚያሳልፍ ሲሆን ጥቁሩ ቆዳው ሙቀት ይይዛል።',
    },
    'q-silent-letter-knight': {
      question: 'ከእነዚህ የእንግሊዝኛ ቃላት ውስጥ ሲነበብ 3 የማይሰሙ (Silent) ፊደላት ያሉት የትኛው ነው?',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'በ K-N-I-G-H-T ውስጥ K፣ G እና H አይነበቡም (3 ድምፅ አልባ ፊደላት)!',
      kidRoastOnMiss: 'KNIGHT ውስጥ K፣ G እና H አይሰሙም!',
      funFact: 'በጥንት እንግሊዝኛ እነዚህ ፊደላት ይነበቡ ነበር።',
    },
    'q-lily-pad-pond': {
      question:
        'በኩሬ ላይ ያሉ አበቦች በየቀኑ በእጥፍ ይጨምራሉ። ሙሉውን ኩሬ ለመሸፈን 20 ቀን ከፈጀ፣ ግማሹን የሸፈኑት በስንተኛው ቀን ነበር?',
      options: ['ቀን 10', 'ቀን 15', 'ቀን 18', 'ቀን 19'],
      kidPeekNote: 'በየቀኑ በእጥፍ የሚጨምር ከሆነ በ20ኛው ቀን ከመሙላቱ አንድ ቀን በፊት (ቀን 19) ግማሽ ነበር!',
      kidRoastOnMiss: '91% ሰዎች ቀን 10 ይላሉ! ግን በየቀኑ እጥፍ ስለሚሆን ግማሹ የነበረው በቀን 19 ነው!',
      funFact: 'በMIT እና Princeton ዩኒቨርሲቲዎች የታወቀ የአስተሳሰብ ጥያቄ።',
    },
    'q-strawberry-berries': {
      question: 'በዕፅዋት ሳይንስ መሠረት ከእነዚህ ፍራፍሬዎች ውስጥ እውነተኛ "ቤሪ" (True Berry) የሆነው የትኛው ነው?',
      options: ['እንጆሪ (Strawberry)', 'ራስพቤሪ', 'ሙዝ (Banana)', 'ብላክቤሪ'],
      kidPeekNote: 'እንጆሪ ዘሩ በውጭ ነው — ሙዝ ግን በሳይንስ እውነተኛ ቤሪ ነው!',
      kidRoastOnMiss: 'በሳይንስ ሙዝ እና ቲማቲም እውነተኛ ቤሪ ናቸው!',
      funFact: 'እውነተኛ ቤሪዎች ዘራቸው በውስጣቸው ይገኛል።',
    },
    'q-million-bat-ball': {
      question:
        'የ$1,000,000 የመጨረሻ ጥያቄ፡ አንድ መጫወቻ ዱላ እና ኳስ በአንድ ላይ $1.10 ያወጣሉ። ዱላው ከኳሷ በ$1.00 ይበልጣል። የኳሷ ዋጋ ስንት ነው?',
      options: ['10 ሳንቲም ($0.10)', '5 ሳንቲም ($0.05)', '1 ሳንቲም ($0.01)', '15 ሳንቲም ($0.15)'],
      kidPeekNote:
        '10 ሳንቲም አይምረጡ! ኳሷ 5 ሳንቲም ስትሆን ዱላው $1.05 ነው ($1.05 + $0.05 = $1.10)!',
      kidRoastOnMiss: 'በ10 ሳንቲም ወጥመድ ውስጥ ወደቁ! 5 ሳንቲም + $1.05 = $1.10!',
      funFact: 'ከ50% በላይ የዩኒቨርሲቲ ተማሪዎች በመጀመሪያ ሙከራ "10 ሳንቲም" ብለው ይሳታሉ።',
    },
    'q-million-mary-mom': {
      question:
        'የ$1,000,000 የመጨረሻ ጥያቄ፡ የሜሪ እናት 4 ሴት ልጆች አሏት። የመጀመሪያዎቹ ሦስቱ ኤፕሪል፣ ሜይ እና ጁን ይባላሉ። የ4ኛዋ ልጅ ስም ማን ይባላል?',
      options: ['ጁላይ', 'ኦገስት', 'ሜሪ!', 'ስፕሪንግ'],
      kidPeekNote: 'የመጀመሪያዎቹን ቃላት ያንብቡ፡ "የሜሪ እናት"! 4ኛዋ ልጅ ሜሪ ናት!',
      kidRoastOnMiss: 'ጁላይ መረጡ?! 😂 "የሜሪ እናት" ይላል እኮ! ስሟ ሜሪ ነው!',
      funFact: 'የአዋቂዎች አእምሮ የወራትን ተከታታይነት በመከተል መጀመሪያ የተጠቀሰውን ስም ይረሳል።',
    },
  },
  ja: {
    'q-race-2nd': {
      question:
        '学校のかけっこで走っていて、2位の人を追い抜きました！今あなたは何位ですか？',
      options: ['1位', '2位', '3位', '同率1位'],
      kidPeekNote:
        '待って！1位を選ばないで！2位の人を抜いたらその人の場所に入るから、今は2位だよ！',
      kidRoastOnMiss:
        'あはは！2位の人を抜いても、1位の人はまだ前を走ってるよ！正解は2位！',
      funFact: '大人の65%以上が制限時間のプレッシャーで「1位」と答えてしまいます。',
    },
    'q-paint-mix': {
      question: '図工の時間に「きいろ」と「あお」の絵の具を混ぜると、何色になりますか？',
      options: ['むらさき', 'オレンジ', 'みどり', 'ちゃいろ'],
      kidPeekNote: '黄色＋青は、草と同じ「みどり」になるよ！',
      kidRoastOnMiss: '黄色と青を混ぜたら「みどり」だよ！',
      funFact: '黄色と青は色の三原色（減法混色）で、混ぜると緑の光を反射します。',
    },
    'q-spider-legs': {
      question: 'クモの足は全部で何本ありますか？',
      options: ['6本', '8本', '10本', '12本'],
      kidPeekNote: '昆虫の足は6本だけど、クモは8本だよ！',
      kidRoastOnMiss: '数えてみて！クモの足は8本だよ！',
      funFact: '昆虫は6本足ですが、クモやサソリなどのクモ綱はすべて8本足です。',
    },
    'q-months-28': {
      question: '1年（12か月）のうち、「28日」がある月はいくつありますか？',
      options: ['1つだけ（2月）', '2か月', '6か月', '12か月すべて！'],
      kidPeekNote: 'ひっかけ問題だよ！どの月にも必ず「28日」はあるから、12か月すべて！',
      kidRoastOnMiss: 'ひっかかったね！2月を選んだでしょ？どの月にも28日はあるよ！',
      funFact: '大人の5人に4人が「ちょうど28日」と勝手に思い込んで「2月」を選びます。',
    },
    'q-farmer-sheep': {
      question:
        '牧場に17匹のヒツジがいます。嵐が来て「9匹をのぞいて全部」逃げてしまいました！残ったヒツジは何匹？',
      options: ['8匹', '9匹', '17匹', '26匹'],
      kidPeekNote: '17 - 9 を計算しないで！「9匹をのぞいて全部逃げた」から、残ったのは9匹だよ！',
      kidRoastOnMiss: '17ひく9で8匹にしちゃった？！「9匹をのぞいて」だから9匹残ってるよ！',
      funFact: '大人は数字を2つ見ると反射的に引き算をしてしまいます。',
    },
    'q-stop-sign': {
      question: '海外の赤い「STOP（止まれ）」標識は八角形（オクタゴン）です。辺はいくつありますか？',
      options: ['6つ', '7つ', '8つ', '10個'],
      kidPeekNote: 'オクトパス（タコ）の足が8本なのと同じで、オクタゴンは8つの辺があるよ！',
      kidRoastOnMiss: '八角形（オクタゴン）の辺は8つだよ！',
      funFact: 'Octa（オクタ）はギリシャ語で8を意味します。',
    },
    'q-rooster-egg': {
      question:
        'オンドリが納屋の屋根のてっぺんで北を向いています。風は西へ吹いています。オンドリが卵を産んだら、どっちへ転がる？',
      options: [
        '風に乗って西へ',
        '風に逆らって東へ',
        '屋根瓦に沿って南へ',
        'どこにも転がらない（オンドリは卵を産まない！）',
      ],
      kidPeekNote: 'えへへ！オンドリは男の子のニワトリだよ！卵を産むのはメンドリだけ！',
      kidRoastOnMiss: 'オンドリの風向きを計算してたの？！オンドリは卵を産まないよ！！',
      funFact: '方角や風向きの情報に気を取られて「オンドリ」を見落とす古典的ひっかけ問題です。',
    },
    'q-flying-mammal': {
      question: '次の動物のうち、自分の翼で本当に空を飛べる唯一の哺乳類はどれ？',
      options: ['モモンガ', 'コウモリ', 'ダチョウ', 'ツノメドリ'],
      kidPeekNote: 'モモンガは滑空するだけ！本当に羽ばたいて飛べる哺乳類はコウモリだけだよ！',
      kidRoastOnMiss: 'コウモリが世界で唯一、自力で空を飛べる哺乳類だよ！',
      funFact: 'コウモリは地球上の全哺乳類種の約20%を占めています。',
    },
    'q-spell-incorrectly': {
      question: '英語の辞書で、つづりが常に「INCORRECTLY（間違って）」と書かれている単語はどれ？',
      options: ['Misspelled', 'Wednesday', '「Incorrectly」という単語', 'Rhythm'],
      kidPeekNote: 'カギカッコを見て！「Incorrectly」という単語は文字通りそうつづるよ！',
      kidRoastOnMiss: '「Incorrectly」という単語は、辞書でも常に「Incorrectly」と書かれているよ！',
      funFact: '小学2年生の定番ことば遊びクイズです。',
    },
    'q-pound-feathers': {
      question: 'ガチョウのふわふわの羽1キロと、赤いレンガ1キロ、どっちが重い？',
      options: ['レンガ1キロ', '羽1キロ', 'まったく同じ重さ！', '重力による'],
      kidPeekNote: '1キロは1キロ！どちらもまったく同じ重さだよ！',
      kidRoastOnMiss: '世界で一番有名なひっかけ問題に引っかかったね！1キロは同じ1キロだよ！',
      funFact: 'どちらも正確に1,000グラムで、体積（大きさ）だけが違います。',
    },
    'q-octopus-hearts': {
      question: '人間の心臓は1つですが、ミズダコ（タコ）には心臓がいくつありますか？',
      options: ['1つ', '2つ', '3つ', '8つ'],
      kidPeekNote: 'タコには足が8本、脳が9つ、そして心臓が3つあるんだよ！',
      kidRoastOnMiss: 'タコの心臓は3つだよ！',
      funFact: 'タコには3つの心臓があり、銅を含む青い血液が流れています。',
    },
    'q-largest-ocean': {
      question: '地球上で最も大きく、最も深い海（大洋）はどれ？',
      options: ['大西洋', 'インド洋', '太平洋', '北極海'],
      kidPeekNote: '太平洋は地球のすべての大陸がすっぽり入るほど大きいんだよ！',
      kidRoastOnMiss: '太平洋は地球全体の表面積の30%以上を占めているよ！',
      funFact: '太平洋は地球上のすべての陸地を合わせた面積よりも広いです。',
    },
    'q-apples-take-away': {
      question: 'ボウルに赤いリンゴが6個入っています。あなたが4個取りました。今あなたが持っているリンゴは何個？',
      options: ['2個', '4個', '6個', '10個'],
      kidPeekNote: 'あなたが4個手に取ったんだから、あなたが持っているのは4個だよ！',
      kidRoastOnMiss: 'ボウルに残ったのは2個だけど、あなたが取ったのは4個だから4個持っているよ！',
      funFact: '大人の83%がボウルの残りを計算して「2個」と答えてしまいます。',
    },
    'q-caterpillar-change': {
      question: 'あおむし（幼虫）がサナギの中でチョウに変わることを理科の言葉で何という？',
      options: ['光合成（Photosynthesis）', '変態（Metamorphosis）', '冬眠（Hibernation）', '蒸発（Evaporation）'],
      kidPeekNote: '植物は光合成！あおむしがチョウに変わるのは「変態（メタモルフォーゼ）」だよ！',
      kidRoastOnMiss: '幼虫がチョウに姿を変えることは「変態（Metamorphosis）」というよ！',
      funFact: 'サナギの中で幼虫の体は一度分解され、チョウの体に作り変えられます。',
    },
    'q-vowel-count': {
      question: '英語の「CAULIFLOWER（カリフラワー）」という単語には母音（A, E, I, O, U）が全部でいくつある？',
      options: ['3つ', '4つ', '5つ', '6つ'],
      kidPeekNote: '指で数えてみて：c-A-U-l-I-f-l-O-w-E-r！A, U, I, O, Eの5つ全部入っているよ！',
      kidRoastOnMiss: 'C-A-U-L-I-F-L-O-W-E-R には5つの母音が1つずつ入っているよ！',
      funFact: 'Cauliflowerには英語の5つの母音すべてが1回ずつ含まれています。',
    },
    'q-bus-driver': {
      question:
        '「あなたが」黄色いスクールバスを運転していると想像してください！最初のバス停で6人乗り、次のバス停で3人降りて5人乗りました。運転手の目の色は？',
      options: ['青色', '茶色', 'あなた自身の目の色！', '情報不足'],
      kidPeekNote: '最初の文を読んで！「あなたがバスを運転している」から、運転手はあなただよ！',
      kidRoastOnMiss: '乗客の数を一生懸命計算して、自分が運転手だってことを忘れちゃったね！',
      funFact: '世界中で知られるスクールバスの注意力テストです。',
    },
    'q-venus-spin': {
      question: '太陽系で最も温度が高く、しかも逆向き（時計回り）に自転している惑星はどれ？',
      options: ['水星', '金星', '火星', '木星'],
      kidPeekNote: '水星の方が太陽に近いけど、分厚い雲で熱を閉じ込める「金星」の方が熱いんだよ！',
      kidRoastOnMiss: '温室効果で太陽系いちばん熱い惑星は「金星」だよ！',
      funFact: '金星の表面温度は約475℃に達し、太陽が西から昇って東へ沈みます。',
    },
    'q-quarters-in-3-dollars': {
      question: '25セント硬貨（クォーター）だけで$3.50のアイスクリームを買うには、硬貨が何枚必要？',
      options: ['10枚', '12枚', '14枚', '16枚'],
      kidPeekNote: '4枚で$1.00だから、$3.00で12枚＋50セント分の2枚＝14枚だよ！',
      kidRoastOnMiss: '4×3＝12枚に、50セント分の2枚を足して14枚だよ！',
      funFact: '25セント硬貨の計算は暗算力のトレーニングに最適です。',
    },
    'q-towel-riddle': {
      question: '乾かせば乾かすほど、どんどん濡れていくお風呂場のアイテムなーんだ？',
      options: ['海のスポンジ', 'バスタオル', '氷', 'ドライヤー'],
      kidPeekNote: 'お風呂上がりに体を乾かすと、バスタオル自身はどんどん濡れていくよ！',
      kidRoastOnMiss: '正解はバスタオル！体を乾かすほど濡れるよね！',
      funFact: '「乾かす」という言葉の意味を使った有名ななぞなぞです。',
    },
    'q-shark-bones': {
      question: 'ホホジロザメの体には、硬い「骨（ボーン）」が全部で何本ある？',
      options: ['ゼロ（0本！）', '42本', '206本', '312本'],
      kidPeekNote: 'ゼロだよ！サメには硬い骨が1本もなくて、全部やわらかい「軟骨」でできているんだ！',
      kidRoastOnMiss: 'サメの硬い骨は0本！全身が軟骨でできている軟骨魚類だよ！',
      funFact: '軽くてしなやかな軟骨のおかげで、サメは海の中を素早く泳ぐことができます。',
    },
    'q-continents-count': {
      question: '地球の大陸の中で、国の数が一番多い大陸はどれ？',
      options: ['アジア', 'ヨーロッパ', 'アフリカ', '南アメリカ'],
      kidPeekNote: '面積が一番広いのはアジアだけど、国の数が一番多いのは54か国あるアフリカだよ！',
      kidRoastOnMiss: 'アジアは48か国、アフリカは54か国でアフリカが一番多いんだよ！',
      funFact: 'アフリカには54の独立国があり、全大陸で最多です。',
    },
    'q-doctor-apple-math': {
      question:
        'お医者さんにビタミン剤を3粒もらい、「30分ごとに1粒ずつ飲んでね」と言われました。3粒すべて飲み終わるのに何分かかりますか？',
      options: ['90分', '60分', '45分', '30分'],
      kidPeekNote: '3×30＝90分にしないで！1粒目は「今すぐ（0分）」、2粒目は30分後、3粒目は60分後だよ！',
      kidRoastOnMiss: '90分じゃないよ！1粒目を0分で飲むから、60分で全部飲み終わるよ！',
      funFact: '植木算と同じで、3回のタイミングの間には待ち時間が2回（60分）しかありません。',
    },
    'q-polar-bear-skin': {
      question: 'ホッキョクグマ（シロクマ）の白い毛の下にある「地肌（皮膚）」は何色？',
      options: ['ピンク色', '真っ白', '真っ黒', 'アイスブルー'],
      kidPeekNote: '北極で太陽の熱をしっかり吸収するために、シロクマの肌は「真っ黒」なんだよ！',
      kidRoastOnMiss: 'シロクマの毛は透明で、その下の皮膚は真っ黒なんだよ！',
      funFact: '透明で中空の毛が光を通し、黒い皮膚が太陽の熱を吸収して体温を保ちます。',
    },
    'q-silent-letter-knight': {
      question: '次の英単語のうち、発音しない「サイレント文字（黙字）」が3つもあるのはどれ？',
      options: ['KNIGHT（騎士）', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'K-N-I-G-H-T は「ナイト」と読むから、KとGとHの3つが発音されないよ！',
      kidRoastOnMiss: 'KNIGHT の K・G・H はどれも読まない3つのサイレント文字だよ！',
      funFact: '中世の英語では K や GH の音も実際に発音されていました。',
    },
    'q-lily-pad-pond': {
      question:
        '池のスイレンの葉は毎日2倍に増えます。20日目に池全体が葉でいっぱいになったとすると、池の「半分」だったのは何日目？',
      options: ['10日目', '15日目', '18日目', '19日目'],
      kidPeekNote: '10日目って言わないで！毎日2倍になって20日目に満杯なら、半分だったのはその前日の「19日目」だよ！',
      kidRoastOnMiss: '大人の91%が10日目って答えちゃう！毎日2倍になるから、20日目の前日の「19日目」が正解！',
      funFact: 'MITやプリンストン大学の認知反射テスト（CRT）で出題される有名な問題です。',
    },
    'q-strawberry-berries': {
      question: '植物学（理科）の分類で、この中で本当に「ベリー（漿果）」の仲間なのはどれ？',
      options: ['イチゴ', 'ラズベリー', 'バナナ', 'ブラックベリー'],
      kidPeekNote: 'イチゴのツブツブは外側にあるけど、実は「バナナ」が植物学上の本物のベリーなんだよ！',
      kidRoastOnMiss: 'びっくりだよね！植物学ではイチゴではなくバナナやトマトが本物のベリーなんだ！',
      funFact: '植物学の定義では、バナナ・ブドウ・トマトが本物のベリー（漿果）に分類されます。',
    },
    'q-million-bat-ball': {
      question:
        '$1,000,000 最終問題：おもちゃのバットとボールの合計は$1.10です。バットはボールより$1.00高いです。ボールの値段はいくら？',
      options: ['10セント ($0.10)', '5セント ($0.05)', '1セント ($0.01)', '15セント ($0.15)'],
      kidPeekNote:
        '10セントを選ばないで！！ボールが5セント、バットが$1.05なら、差が$1.00で合計が$1.10になるよ！',
      kidRoastOnMiss:
        '10セントのワナに引っかかったね！5セント＋$1.05＝$1.10が正解だよ！',
      funFact: 'ハーバード大学やMITの学生の半数以上が最初に「10セント」と間違える世界的に有名な問題です。',
    },
    'q-million-mary-mom': {
      question:
        '$1,000,000 最終問題：メアリーのお母さんには4人の娘がいます。上の3人はエイプリル、メイ、ジューン。では4人目の娘の名前は？',
      options: ['ジュライ（7月）', 'オーガスト（8月）', 'メアリー！', 'スプリング'],
      kidPeekNote: '最初の言葉を読んで！「メアリーのお母さん」って書いてあるから4人目はメアリーだよ！',
      kidRoastOnMiss: 'ジュライを選んだの？！😂 最初に「メアリーのお母さん」って書いてあるよ！正解はメアリー！',
      funFact: '大人の脳は4月・5月・6月のパターンに引っ張られて問題文の最初を忘れてしまいます。',
    },
  },
  so: {
    'q-race-2nd': {
      question:
        'Waxaad ku jirtaa tartanka orodka dugsiga waxaadna dhaaftay qofka ku jira kaalinta 2-aad! Kaalintee ayaad hadda ku jirtaa?',
      options: ['Kaalinta 1-aad', 'Kaalinta 2-aad', 'Kaalinta 3-aad', 'Barbaro kaalinta 1-aad'],
      kidPeekNote:
        'Sug! Ha dooran kaalinta 1-aad! Haddii aad dhaafto qofka 2-aad waxaad gashay booskiisa — markaa waxaad tahay kaalinta 2-aad!',
      kidRoastOnMiss:
        'Hahaha! Haddii aad dhaafto qofka 2-aad, qofka 1-aad weli wuu kaa horreeyaa! Waxaad ku jirtaa kaalinta 2-aad!',
      funFact:
        'In ka badan 65% dadka waaweyn waxay si degdeg ah u doortaan "Kaalinta 1-aad"!',
    },
    'q-paint-mix': {
      question:
        'Haddii aad isku qasto rinjiga JAALLAHA ah iyo kan BULUUGGA ah, midabkee ayaa soo baxaya?',
      options: ['Guduud/Buni', 'Oranji', 'Cagaar (Green)', 'Bunni'],
      kidPeekNote: 'Jaalle + Buluug waxay noqdaan CAGAAR sida cowska oo kale!',
      kidRoastOnMiss: 'Jaalle iyo Buluug markii la isku daro waxay noqdaan CAGAAR!',
      funFact: 'Jaallaha iyo buluuggu waa midabyo aasaasi ah oo marka la isku qaso soo saara cagaar.',
    },
    'q-spider-legs': {
      question: 'Imisa lugood ayay leedahay caaradu (Spider)?',
      options: ['6 lugood', '8 lugood', '10 lugood', '12 lugood'],
      kidPeekNote: 'Cayayaanku waxay leeyihiin 6 lugood, laakiin caaradu waxay leedahay 8 lugood!',
      kidRoastOnMiss: 'Tiri! Caaradu waxay leedahay 8 lugood!',
      funFact: 'Dhammaan noocyada caaradu waxay leeyihiin 8 lugood.',
    },
    'q-months-28': {
      question: 'Imisa bilood oo sanadka ka mid ah ayaa leh 28 maalmood?',
      options: ['1 bil oo keliya (Febraayo)', '2 bilood', '6 bilood', 'Dhammaan 12-ka bilood!'],
      kidPeekNote: 'Waa dabin! Bil KASTA waxay leedahay ugu yaraan 28 maalmood — dhammaan 12-ka bilood!',
      kidRoastOnMiss: 'Waa lagugu qabtay! Ma Febraayo ayaad dooratay?! Dhammaan 12-ka bilood waxay leeyihiin maalinta 28-aad!',
      funFact: '4 ka mid ah 5-tii qof ee waaweynba waxay ku khaldamaan "1 bil oo keliya".',
    },
    'q-farmer-sheep': {
      question:
        'Beeraley ayaa lahaa 17 ido ah. Duufaan ayaa timid, dhammaantoodna way baxsadeen marka laga reebo 9! Imisa ido ah ayaa u soo hadhay?',
      options: ['8 ido ah', '9 ido ah', '17 ido ah', '26 ido ah'],
      kidPeekNote: 'Ha kala jarin 17 - 9! "Marka laga reebo 9" macnaheedu waa 9 ido ah ayaa baaqi u ah!',
      kidRoastOnMiss: 'Ma 17 - 9 = 8 ayaad xisaabisay?! "Marka laga reebo 9" waxay lajeeddaa 9 ayaa u hadhay!',
      funFact: 'Dadka waaweyn isla markiiba waxay bilaabaan inay kala jaraan laba lambar marka ay arkaan.',
    },
    'q-stop-sign': {
      question: 'Calaamadda guduudan ee waddada "STOP" waa Octagon. Imisa dhinac ayay leedahay?',
      options: ['6 dhinac', '7 dhinac', '8 dhinac', '10 dhinac'],
      kidPeekNote: 'Octagon waxay leedahay 8 dhinac (sida Octopus oo leh 8 gacmood)!',
      kidRoastOnMiss: 'Calaamadda STOP waxay leedahay 8 dhinac!',
      funFact: 'Octo waxay ka timid af-Giriig oo macnaheedu yahay siddeed (8).',
    },
    'q-rooster-egg': {
      question:
        'Diiq (Rooster) ayaa saaran saqafka kore ee guriga isagoo u jeeda Waqooyi. Dabayshu waxay u socotaa Galbeed. Dhankee ayay ukuntu u duulaysaa haddii uu ukun dhalo?',
      options: ['Dhanka Galbeed', 'Dhanka Bari', 'Dhanka Koonfur', 'Meelna — diiqu ukun ma dhalo!'],
      kidPeekNote: 'Hahaha! Diiqu waa lab (nin)! Doorada (dheddigga) oo keliya ayaa ukun dhasha!',
      kidRoastOnMiss: 'Ma dabaysha ayaad xisaabinaysay?! Diiqu ukun ma dhalo!',
      funFact: 'Faahfaahinta jihada dabayshu waxay dadka waaweyn illowsiisaa ereyga "Diiq".',
    },
    'q-flying-mammal': {
      question: 'Xayawaankee ayaa ah naasaleyda (Mammal) keliya ee si dhab ah u duuli karta?',
      options: ['Dabagaalle duula', 'Fiidmeerta (Bat)', 'Gorayada', 'Shimbirta Puffin'],
      kidPeekNote: 'Fiidmeertu waa naasaleyda keliya ee si dhab ah baalal ugu duusha!',
      kidRoastOnMiss: 'Fiidmeerta oo keliya ayaa ah naasaley si dhab ah u duusha!',
      funFact: 'Fiidmeeruhu waxay ka yihiin ku dhawaad 20% dhammaan noocyada naasaleyda adduunka.',
    },
    'q-spell-incorrectly': {
      question: 'Eraygee ku jira qaamuuska Ingiriisiga ayaa had iyo jeer loo qoraa "INCORRECTLY"?',
      options: ['Misspelled', 'Wednesday', 'Erayga "Incorrectly"', 'Rhythm'],
      kidPeekNote: 'Eeg xigashada! Erayga "INCORRECTLY" laftiisa ayaa sidaas loo qoraa!',
      kidRoastOnMiss: 'Erayga "Incorrectly" had iyo jeer waxaa loo qoraa "Incorrectly"!',
      funFact: 'Halxiraale caan ah oo ay jecel yihiin ardayda fasalka 2-aad.',
    },
    'q-pound-feathers': {
      question: 'Midkee ayaa culus: 1 kiilo oo baalasha shimbiraha ah mise 1 kiilo oo leben guduudan ah?',
      options: ['1 kiilo oo leben ah', '1 kiilo oo baalal ah', 'Labaduba waa isku miisaan!', 'Waxay ku xiran tahay cufisjiidadka'],
      kidPeekNote: '1 kiilo waa uun 1 kiilo! Labaduba waa isku miisaan!',
      kidRoastOnMiss: 'Labaduba waa 1 kiilo — miisaankoodu waa isku mid!',
      funFact: 'Labaduba waa 1,000 garaam; mugga oo keliya ayaa kala weyn.',
    },
    'q-octopus-hearts': {
      question: 'Aadanuhu wuxuu leeyahay 1 wadne. Imisa wadne ayay leedahay Octopus-ku (farماugo)?',
      options: ['1 wadne', '2 wadne', '3 wadne', '8 wadne'],
      kidPeekNote: 'Octopus-ku wuxuu leeyahay 8 gacmood, 9 maskaxood iyo 3 wadne!',
      kidRoastOnMiss: 'Octopus-ku wuxuu leeyahay SADDEX (3) wadne!',
      funFact: 'Octopus-ku wuxuu leeyahay 3 wadne iyo dhiig buluug ah.',
    },
    'q-largest-ocean': {
      question: 'Waa tee badweynta ugu weyn uguna qoto dheer meeraha Dhulka?',
      options: ['Badweynta Atlaantik', 'Badweynta Hindiya', 'Badweynta Baasifigga (Pacific)', 'Badweynta Arktik'],
      kidPeekNote: 'Badweynta Baasifigga ayaa ka weyn dhammaan qaaradaha adduunka oo la isku daray!',
      kidRoastOnMiss: 'Badweynta Baasifigga waxay dabooshaa in ka badan 30% oogada Dhulka!',
      funFact: 'Badweynta Baasifigga waa badda ugu weyn uguna qoto dheer adduunka.',
    },
    'q-apples-take-away': {
      question: 'Waxaa saxan kuugu jira 6 tufaax oo guduudan. Waxaad ka qaadatay 4 tufaax. Imisa tufaax ayaad ADIGU hadda haysataa?',
      options: ['2 tufaax', '4 tufaax', '6 tufaax', '10 tufaax'],
      kidPeekNote: 'Haddii aad qaadatay 4 tufaax, waxaad gacantaada ku haysataa 4 tufaax!',
      kidRoastOnMiss: '2 waxay ku hadhay saxanka, laakiin ADIGU waxaad qaadatay 4 tufaax!',
      funFact: '83% dadka waaweyn waxay ku khaldamaan "2" sababtoo ah waxay xisaabiyaan wixii saxanka ku hadhay.',
    },
    'q-caterpillar-change': {
      question: 'Maxaa lagu magacaabaa habka sayniska ee diirato (Caterpillar) isugu beddesho balanbaalis (Butterfly)?',
      options: ['Photosynthesis', 'Metamorphosis (Is-beddel)', 'Hibernation', 'Evaporation'],
      kidPeekNote: 'Marka diiratadu isku beddesho balanbaalis waxaa la yiraahdaa Metamorphosis!',
      kidRoastOnMiss: 'Photosynthesis waa dhirta! Is-beddelka balanbaalistu waa Metamorphosis!',
      funFact: 'Diiratadu waxay gashaa chrysalis si ay ugu soo baxdo balanbaalis qurux badan.',
    },
    'q-vowel-count': {
      question: 'Imisa shaqal (A, E, I, O, U) ayaa ku jira erayga Ingiriisiga ah ee "CAULIFLOWER"?',
      options: ['3 shaqal', '4 shaqal', '5 shaqal', '6 shaqal'],
      kidPeekNote: 'Tiri: A, U, I, O, E — dhammaan 5-ta shaqal way ku jiraan!',
      kidRoastOnMiss: 'CAULIFLOWER waxaa ku jira dhammaan 5-ta shaqal (A, U, I, O, E)!',
      funFact: 'CAULIFLOWER waa mid ka mid ah erayada kooban ee leh dhammaan 5-ta shaqal hal mar.',
    },
    'q-bus-driver': {
      question:
        'Bal qiyaas ADIGU waxaad waddaa baska dugsiga! Joogsiga 1-aad 6 carruur ah ayaa soo koray. Joogsiga 2-aad 3 ayaa degay, 5-na way soo koreen. Waa maxay midabka indhaha darawalka basku?',
      options: ['Buluug', 'Bunni', 'Midabka indhahaaga!', 'Xogtu kuma filna'],
      kidPeekNote: 'Akhri bilowga su’aasha: "ADIGU waxaad waddaa baska"! Darawalku waa ADIGA!',
      kidRoastOnMiss: 'Rakaabka ayaad tirinaysay oo waxaad illowday in darawalku yahay ADIGA!',
      funFact: 'Halxiraalaha baska dugsiga ee ugu caansan adduunka.',
    },
    'q-venus-spin': {
      question: 'Meerahee ku jira bah-qorraxeedkeenna ayaa ugu kulul isla markaana gadaal-gadaal u wareega?',
      options: ['Mercury', 'Venus (Xiddigta Waaberi)', 'Mars', 'Jupiter'],
      kidPeekNote: 'Venus waxay leedahay daruuro qaro weyn oo kulaylka xabbisa, markaa way ka kulushahay Mercury!',
      kidRoastOnMiss: 'Meeraha ugu kulul waa Venus sababtoo ah gaaska cufan ee kulaylka haya!',
      funFact: 'Heerkulka Venus wuxuu gaaraa 475°C, qorraxdeeduna waxay ka soo baxdaa galbeedka.',
    },
    'q-quarters-in-3-dollars': {
      question: 'Haddii aad ku iibsato jalaato $3.50 ah adigoo isticmaalaya shilimaad 25-senti (Quarters) oo keliya, imisa xabbo ayaad u baahan tahay?',
      options: ['10 xabbo', '12 xabbo', '14 xabbo', '16 xabbo'],
      kidPeekNote: '4 xabbo = $1.00. Markaa $3.00 = 12 xabbo, lagu daray 2 xabbo oo 50¢ ah = 14 xabbo!',
      kidRoastOnMiss: '4 × 3 = 12, lagu daray 2 = 14 xabbo!',
      funFact: 'Xisaabinta shilimaadku waxay kobcisaa xisaabta maskaxda ee degdegga ah.',
    },
    'q-towel-riddle': {
      question: 'Shaygee guriga yaalla ayaa sii qoya mar kasta oo uu wax kale qallajiyo?',
      options: ['Isbuunyo', 'Shukumaan (Tuwaal)', 'Baraf', 'Qallajiyaha timaha'],
      kidPeekNote: 'Shukumaanku wuxuu nuugaa biyaha markuu ku qallajinayo, markaa isagu wuu sii qoyaa!',
      kidRoastOnMiss: 'Jawaabtu waa shukumaan (tuwaal)!',
      funFact: 'Halxiraale qadiimi ah oo carruurtu si fudud u xalliyaan.',
    },
    'q-shark-bones': {
      question: 'Imisa lafood oo adag ayaa ku jira jirka libaax-badeedka weyn (Great White Shark)?',
      options: ['Eber (0 lafood!)', '42 lafood', '206 lafood', '312 lafood'],
      kidPeekNote: 'EBER! Jirka libaax-badeedku wuxuu ka samaysan yahay carjaw (Cartilage) jilicsan oo keliya!',
      kidRoastOnMiss: 'Libaax-badeedku ma laha wax lafo ah (0) — waa 100% carjaw!',
      funFact: 'Carjawda fudud waxay ka caawisaa libaax-badeedka inuu si dheereeya u dabaasho.',
    },
    'q-continents-count': {
      question: 'Qaaraddee adduunka ugu dalal (wadamo) badan?',
      options: ['Aasiya', 'Yurub', 'Afrika', 'Koonfurta Ameerika'],
      kidPeekNote: 'Afrika waxay leedahay 54 waddan — waana qaaradda ugu waddamada badan adduunka!',
      kidRoastOnMiss: 'Aasiya waa uun 48 waddan, laakiin Afrika waxay leedahay 54 waddan!',
      funFact: 'Afrika waxay ka kooban tahay 54 dal oo madax-bannaan.',
    },
    'q-doctor-apple-math': {
      question:
        'Dhakhtar ayaa ku siiyay 3 kiniin oo fiitamiin ah wuxuuna ku yiri qaado 1 kiniin 30-kii daqiiqaba. Imisa daqiiqo ayay kugu qaadanaysaa inaad dhammayso?',
      options: ['90 daqiiqo', '60 daqiiqo', '45 daqiiqo', '30 daqiiqo'],
      kidPeekNote: 'Kiniinka 1-aad hadda qaado (0 daqiiqo), kan 2-aad 30 daqiiqo kadib, kan 3-aadna 60 daqiiqo kadib!',
      kidRoastOnMiss: 'Ma aha 90 daqiiqo! Kan 1-aad isla hadda ayaad liqaysaa, markaa waa 60 daqiiqo oo keliya!',
      funFact: 'Saddex kiniin waxay leeyihiin laba waqti oo 30-daqiiqo ah oo u dhexeeya.',
    },
    'q-polar-bear-skin': {
      question: 'Dharka cad ee dhogorta ah hoostiisa, waa maxay midabka dhabta ah ee maqaarka orso-barafeedka (Polar Bear)?',
      options: ['Casuus (Pink)', 'Caddaan', 'Madow (Black)', 'Buluug'],
      kidPeekNote: 'Maqaarka orso-barafeedku waa MADOW si uu u nuugo kulaylka qorraxda!',
      kidRoastOnMiss: 'Maqaarka orso-barafeedku waa madow dhab ah!',
      funFact: 'Dhogorta hufan waxay gudbisaa iftiinka halka maqaarka madow uu qabto kulaylka.',
    },
    'q-silent-letter-knight': {
      question: 'Eraygee Ingiriisi ah ayaa leh 3 xaraf oo aamusan (Silent letters) marka lagu dhawaaqayo?',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'Gudaha K-N-I-G-H-T, xarfaha K, G iyo H lama akhriyo (3 xaraf oo aamusan)!',
      kidRoastOnMiss: 'Erayga KNIGHT wuxuu leeyahay 3 xaraf oo aan lagu dhawaaqin: K, G iyo H!',
      funFact: 'Boqolaal sano ka hor Ingiriisigii hore xarfahaas waa lagu dhawaaqi jiray.',
    },
    'q-lily-pad-pond': {
      question:
        'Caleemaha biyaha dul sabbeeya ee harada waxay labanlaabmaan maalin kasta. Haddii ay 20 maalmood ku qaadato inay harada oo dhan daboolaan, maalintee ayay haradu KALA BAR (1/2) ahayd?',
      options: ['Maalinta 10-aad', 'Maalinta 15-aad', 'Maalinta 18-aad', 'Maalinta 19-aad'],
      kidPeekNote: 'Ha dhihin Maalinta 10-aad! Maadaama ay maalin kasta labanlaabmaan, maalinta ka horraysa 20 waa Maalinta 19-aad!',
      kidRoastOnMiss: '91% dadka waaweyn waxay yiraahdaan Maalinta 10-aad! Jawaabta saxda ahi waa Maalinta 19-aad!',
      funFact: 'Tani waa mid ka mid ah su’aalaha caanka ah ee MIT iyo Princeton Cognitive Reflection Test.',
    },
    'q-strawberry-berries': {
      question: 'Sida cilmiga dhirta (Botany) uu qabo, midkee ka mid ah mirahan ayaa ah "Berry" dhab ah?',
      options: ['Strawberry (Faraawile)', 'Raspberry', 'Moos (Banana)', 'Blackberry'],
      kidPeekNote: 'Iniinyaha faraawiluhu waxay ku yaalliin bannaanka, laakiin MOOSKU waa "Berry" cilmi ahaan!',
      kidRoastOnMiss: 'Cilmi ahaan, MOOSKA iyo yaanyada ayaa ah "Berries" dhab ah ee ma aha faraawilaha!',
      funFact: 'Cilmiga dhirta, mooska, canabka iyo yaanyadu waa berries dhab ah.',
    },
    'q-million-bat-ball': {
      question:
        'SU’AASHA $1,000,000: Ul iyo kubbad waxay wada joogaan $1.10. Ushu waxay kubbadda ka qaalisan tahay $1.00. Waa imisa qiimaha kubbaddu?',
      options: ['10 senti ($0.10)', '5 senti ($0.05)', '1 senti ($0.01)', '15 senti ($0.15)'],
      kidPeekNote:
        'HA DOORAN 10 SENTI! Kubbaddu waa 5 senti ($0.05) ushuna waa $1.05 ($1.05 + $0.05 = $1.10)!',
      kidRoastOnMiss: 'Waxaad ku dhacday dabinkii 10-ka senti! 5 senti + $1.05 = $1.10!',
      funFact: 'In ka badan kala bar ardayda jaamacadaha Harvard iyo MIT way ku khaldamaan markay degdegaan.',
    },
    'q-million-mary-mom': {
      question:
        'SU’AASHA $1,000,000: Maryan hooyadeed waxay dhashay 4 gabdhood: Abriil, Maajo, iyo Juun. Waa maxay magaca gabadha 4-aad?',
      options: ['Luulyo (July)', 'Agoosto', 'Maryan!', 'Gu’'],
      kidPeekNote: 'Akhri labada eray ee ugu horreeya: "Maryan hooyadeed"! Gabadha 4-aad waa Maryan!',
      kidRoastOnMiss: 'Ma Luulyo ayaad dooratay?! 😂 Su’aashu waxay leedahay "Maryan hooyadeed"! Waa Maryan!',
      funFact: 'Maskaxda dadka waaweyn waxay raacdaa taxanaha bilaha waxayna illowdaa magaca bilowga.',
    },
  },
  om: {
    'q-race-2nd': {
      question:
        'Dorgommii fiigichaa dirree mana barumsaa keessatti nama sadarkaa 2ffaa irra jiru yoo darbite, amma sadarkaa meeqaffaa irra jirta?',
      options: ['Sadarkaa 1ffaa', 'Sadarkaa 2ffaa', 'Sadarkaa 3ffaa', 'Sadarkaa 1ffaa waliin qixxee'],
      kidPeekNote: 'Sadarkaa 1ffaa hin filatin! Nama 2ffaa yoo darbite bakka isaa fudhatta — kanaafuu 2ffaa dha!',
      kidRoastOnMiss: 'Hahaha! Nama 2ffaa darbite malee nama 1ffaa hin darbine! Ammas sadarkaa 2ffaa irra jirta!',
      funFact: 'Ga’eessonni %65 ariitiidhaan "Sadarkaa 1ffaa" jedhanii dogoggoru!',
    },
    'q-months-28': {
      question: 'Ji’oota waggaa 12 keessaa ji’oota meeqatu guyyoota 28 qaba?',
      options: ['Ji’a 1 qofa (Guraandhala)', 'Ji’oota 2', 'Ji’oota 6', 'Ji’oota 12-nuu (Hunda!)'],
      kidPeekNote: 'Ji’oonni 12-nuu guyyoota 28 ni qabu! Guraandhalli 28tti dhaabbata malee hundi 28 ni darbu!',
      kidRoastOnMiss: 'Hahaha! Ji’oonni hundi (12-nuu) guyyaa 28ffaa ni qabu!',
      funFact: 'Gaaffiin kun "guyyoota 28 QOFA" hin jenne!',
    },
    'q-spiders-legs': {
      question: 'Ilbiisonni (Insects) miila 6 qabu. Sarariitiin (Spider) garuu miila meeqa qabdi?',
      options: ['Miila 6', 'Miila 8', 'Miila 10', 'Miila 12'],
      kidPeekNote: 'Sarariitiin garee Arachnid jedhamti — miila 8 qabdi (gama tokkoon 4, gama biraan 4)!',
      kidRoastOnMiss: 'Sarariitiin ilbiisa miti! Miila 8 qabdi!',
      funFact: 'Sarariitiin garee Arachnid keessatti ramadamti.',
    },
    'q-primary-paint': {
      question: 'Kutaa aartii keessatti halluu Diimaa fi Keelloo walitti yoo makte halluu kam uumu?',
      options: ['Magariisa', 'Burtukaana (Orange)', 'amala Dhiilgee (Purple)', 'Magaala'],
      kidPeekNote: 'Diimaa + Keelloo = Burtukaana (Orange)!',
      kidRoastOnMiss: 'Diimaa fi Cuquliisatu Dhiilgee uuma! Diimaa + Keelloo = Burtukaana!',
      funFact: 'Halluuwwan bu’uuraa sadan Diimaa, Keelloo fi Cuquliisa dha.',
    },
    'q-rooster-egg': {
      question:
        'Kormaan lukkuu (Rooster) bantii mana qonnaan bulaa qara ta’e irra taa’ee hanqaaquu (bupphaa) buuse. Gama kamiin konkolaata?',
      options: ['Gara Bitaa', 'Gara Mirgaa', 'Gama qilleensaa', 'Kormaan lukkuu hanqaaquu hin buusu!'],
      kidPeekNote: 'Kormaan lukkuu dhiira dha! Lukkuu dhaltuu qofatu hanqaaquu buusa!',
      kidRoastOnMiss: 'Hahaha! Kormaan lukkuu hanqaaquu hin buusu! 🐓😂',
      funFact: 'Ga’eessonni waa’ee bantii manaa fi qilleensaa yaaduudhaan kiyyoo kana keessatti kufu.',
    },
    'q-ice-steam': {
      question: 'Cabbii yoo baqsite bishaan ta’a. Bishaan yoo danfiste maal ta’a?',
      options: ['Cabbii gogaa', 'Hurka bishaanii (Steam)', 'Oksijiinii qofa', 'Haawwii'],
      kidPeekNote: 'Bishaan yoo danfu gara gaazii (Hurka / Steam) tti jijjiirama!',
      kidRoastOnMiss: 'Bishaan danfe hurka (Steam) ta’a!',
      funFact: 'Bishaan boca 3 qaba: Jajjaboo (Cabbii), Dhangala’aa (Bishaan) fi Gaazii (Hurka).',
    },
    'q-feathers-bricks': {
      question: 'Kamtu caalaa ulfaata: Baallii simbiraa kiilogiraama 1 moo Dhagaa suphee kiilogiraama 1?',
      options: ['Dhagaa suphee kg 1', 'Baallii kg 1', 'Lamaanuu ulfaatina walqixa qabu!', 'Qilleensa irratti hundaa’a'],
      kidPeekNote: 'Kiilogiraamni 1 yeroo hunda kiilogiraama 1 dha! Ulfaatinni isaanii walqixa!',
      kidRoastOnMiss: 'Hahaha! Lamaanuu kiilogiraama 1 dha — ulfaatinni isaanii walqixa!',
      funFact: 'Baalliin bakka guddaa qabata malee kg 1 fi kg 1 walqixa.',
    },
    'q-alphabet-left': {
      question: 'Qubee Ingiliffaa 26 keessaa qubeen E fi T yoo deeman qubee meeqatu hafa?',
      options: ['Qubee 24', 'Qubee 21', 'Qubee 25', 'Qubee 20'],
      kidPeekNote: '26 - 2 = Qubee 24!',
      kidRoastOnMiss: '26 keessaa 2 yoo hir’iste 24 ta’a!',
      funFact: 'Qubeen Afaan Ingiliffaa 26 dha.',
    },
    'q-chameleon-color': {
      question: 'Gaararraan (Chameleon) sababa guddaa maaliif halluu isaa jijjiira?',
      options: [
        'Bakka hunda waliin wal-fakkeessuuf qofa',
        'Miira isaa ibsuu fi hoo’ina qaamaa to’achuuf',
        'Halluu nyaata nyaatee',
        'Dukkana keessatti ifuuf',
      ],
      kidPeekNote: 'Saayinsii kutaa 2ffaa: Gaararraan miira isaa ibsuu fi hoo’ina to’achuuf halluu jijjiira!',
      kidRoastOnMiss: 'Dhokachuuf qofa miti! Miiraa fi hoo’ina qaamaa to’achuuf halluu jijjiira!',
      funFact: 'Gaararraan gogaa isaa keessaa nanocrystals fayyadamuun ifa calaqqisiisa.',
    },
    'q-hole-dirt': {
      question:
        'Boolla dalgee meetira 2, dheerina meetira 3 fi gadi fageenya meetira 2 qabu yoo qotte, boolla sana keessa biyyoo hammamiitu jira?',
      options: ['Meetira kiyuubii 12', 'Meetira kiyuubii 6', 'Homaa (0) — boolla waan ta’eef!', 'Meetira kiyuubii 8'],
      kidPeekNote: 'Herrega hin hojjetin! Boolli qotame keessi isaa duwwaa dha — biyyoon 0!',
      kidRoastOnMiss: '2 × 3 × 2 baay’istee? 😂 Boolli keessi isaa biyyoo hin qabu (0)!',
      funFact: 'Ga’eessonni lakkoofsota yeroo argan battaluma baay’isuu jalqabu.',
    },
    'q-camel-hump': {
      question: 'Gaalli (Camel) dalluu (Hump) dugda isaa irra jiru keessatti maal kuufata?',
      options: ['Bishaan qabbanaa’aa', 'Cooma (Fat) — anniisaaf', 'Cirraacha', 'Qilleensa'],
      kidPeekNote: 'Bishaan miti! Gaalli dalluu isaa keessatti COOMA (Fat) kuufata!',
      kidRoastOnMiss: 'Bishaan hin kuufatu! Dalluu gaalaa keessa cooma (Fat) tu jira!',
      funFact: 'Gaalli dalluu tokko keessatti cooma hanga kg 36 kuufachuu danda’a.',
    },
    'q-planets-sun': {
      question: 'Sirna Biiftuu keenya keessaa Pilaaneetiin Biiftuutti dhihoo sadarkaa 3ffaa irra jirtu kam?',
      options: ['Maarsii', 'Veenaas', 'Lafa (Earth)', 'Meerkurii'],
      kidPeekNote: '1ffaa Meerkurii, 2ffaa Veenaas, 3ffaa LAFA (Earth) — bakka nuti jiraannu!',
      kidRoastOnMiss: 'Pilaaneetiin 3ffaan LAFA (Earth) dha!',
      funFact: 'Lafti Biiftuu irraa kiilomeetira miliyoona 150 fagaatti.',
    },
    'q-candles-lit': {
      question:
        'Dungoo (Candles) 7 tu boba’aa jira. Qilleensi dungoo 3 dhaamse. Dungoo meeqatu xumura irratti hafa?',
      options: ['Dungoo 4', 'Dungoo 3', 'Dungoo 7', 'Dungoo 0'],
      kidPeekNote: '4n boba’aa jiran baqatanii dhumu! 3n dhaaman garuu achuma hafu — kanaafuu 3!',
      kidRoastOnMiss: '4n boba’an baqatanii dhumu, 3n dhaaman qofatu hafa!',
      funFact: 'Hiibboo qormaata yaadaa beekamaa dha.',
    },
    'q-largest-ocean': {
      question: 'Garba (Ocean) guddaa fi gadi fagoo addunyaa keenyaa kam?',
      options: ['Garba Atilaantiik', 'Garba Hindii', 'Garba Paasifiik (Pacific)', 'Garba Arktiik'],
      kidPeekNote: 'Garbi Paasifiik ardiiwwan addunyaa hunda caalaa bal’aa dha!',
      kidRoastOnMiss: 'Garbi Paasifiik fuula Lafaa %30 ol uwwisa!',
      funFact: 'Garbi Paasifiik garba hunda caalaa guddaa fi gadi fagoo dha.',
    },
    'q-apples-take-away': {
      question: 'Saahnii keessa poomii diimaa 6 tu jira. Poomii 4 fudhatte. Amma ATI poomii meeqa qabda?',
      options: ['Poomii 2', 'Poomii 4', 'Poomii 6', 'Poomii 10'],
      kidPeekNote: 'Poomii 4 waan fudhatteef harka kee keessa poomii 4 tu jira!',
      kidRoastOnMiss: '2 saahnii keessatti hafe, ATI garuu 4 fudhatte!',
      funFact: 'Ga’eessonni %83 "2" jedhanii dogoggoru.',
    },
    'q-caterpillar-change': {
      question: 'Raammoon (Caterpillar) gara Billaachaatti (Butterfly) yeroo jijjiiramu adeemsi saayinsii maal jedhama?',
      options: ['Photosynthesis', 'Metamorphosis (Jijjiirama bocaa)', 'Hibernation', 'Evaporation'],
      kidPeekNote: 'Jijjiiramni raammoo gara billaachaatti Metamorphosis jedhama!',
      kidRoastOnMiss: 'Photosynthesis kan biqiltootaati! Kan billaachaa Metamorphosis dha!',
      funFact: 'Raammoon billaacha bareedaa ta’uuf chrysalis keessa seena.',
    },
    'q-vowel-count': {
      question: 'Jechi Ingiliffaa "CAULIFLOWER" jedhu dubbachiiftuu (A, E, I, O, U) meeqa of keessaa qaba?',
      options: ['Dubbachiiftuu 3', 'Dubbachiiftuu 4', 'Dubbachiiftuu 5', 'Dubbachiiftuu 6'],
      kidPeekNote: 'Lakkaa’i: A, U, I, O, E — dubbachiiftuu 5-nuu of keessaa qaba!',
      kidRoastOnMiss: 'CAULIFLOWER dubbachiiftuu 5-nuu (A, U, I, O, E) qaba!',
      funFact: 'CAULIFLOWER dubbachiiftuu shananuu al-tokko qaba.',
    },
    'q-bus-driver': {
      question:
        'Mee yaadi: ATI konkolaachisaa atoobisii mana barumsaati! Dhaabbata 1ffaa irratti ijoolleen 6 yaabbatan. 2ffaa irratti 3 bu’anii 5 yaabbatan. Halluun ija konkolaachisaa atoobisichaa maal?',
      options: ['Cuquliisa', 'Magaala (Brown)', 'Halluu ija KEETII!', 'Odeeffannoon hin gahu'],
      kidPeekNote: 'Jalqaba gaaffichaa dubbisi: "ATI konkolaachisaa atoobisiiti"! Konkolaachisaan SI’I!',
      kidRoastOnMiss: 'Imaltoota lakkaa’aa turtee konkolaachisaan SI ta’uu irraanfatte! 😂',
      funFact: 'Hiibboo atoobisii mana barumsaa addunyaa irratti beekamaa.',
    },
    'q-venus-spin': {
      question: 'Pilaaneetiin Sirna Biiftuu keenya keessaa hunda caalaa hoo’ituu fi gara duubaatti naannoftu kam?',
      options: ['Meerkurii', 'Veenaas (Bakkalcha)', 'Maarsii', 'Juupitaar'],
      kidPeekNote: 'Veenaas duumessa furdaa hoo’a qabatu waan qabduuf Meerkurii caalaa hoo’iti!',
      kidRoastOnMiss: 'Pilaaneetiin hunda caalaa hoo’itu Veenaas (Bakkalcha) dha!',
      funFact: 'Hoo’inni Veenaas 475°C ga’a.',
    },
    'q-quarters-in-3-dollars': {
      question: 'Saantima 25 (Quarters) qofaan ayiskiriimii $3.50 bituuf saantima 25 meeqa si barbaachisa?',
      options: ['10', '12', '14', '16'],
      kidPeekNote: '4 = $1.00. Kanaafuu $3.00 = 12, dabalataan $0.50 = 2. Walumaagalatti 14!',
      kidRoastOnMiss: '4 × 3 = 12, dabalataan 2 = 14!',
      funFact: 'Herregni saantimaa sammuu saffisiisa.',
    },
    'q-towel-riddle': {
      question: 'Wantoota biroo yeroo gogsu ofii isaatii ammoo kan caalaa jiidhu maal?',
      options: ['Ispoonjii', 'Fooxaa (Towel)', 'Cabbii', 'meeshaa rifeensa gogsu'],
      kidPeekNote: 'Fooxaan (Towel) bishaan qaama kee irraa yeroo gogsu ofii isaatii ni jiidha!',
      kidRoastOnMiss: 'Deebiin isaa Fooxaa (Towel) dha!',
      funFact: 'Hiibboo ijoolleen jaallatan.',
    },
    'q-shark-bones': {
      question: 'Qaama Qurxummii Shaarkii Adii Guddaa (Great White Shark) keessa lafee jajjaboo meeqatu jira?',
      options: ['Zeeroo (Lafee 0!)', 'Lafee 42', 'Lafee 206', 'Lafee 312'],
      kidPeekNote: 'ZEEROO (0)! Qaamni shaarkii morgaa (Cartilage) lallaafaa irraa ijaarame!',
      kidRoastOnMiss: 'Shaarkiin lafee tokko illee hin qabu (0) — morgaa (Cartilage) qofa!',
      funFact: 'Morgaan salphaan shaarkiin saffisaan akka daaku gargaara.',
    },
    'q-continents-count': {
      question: 'Ardiiwwan addunyaa keessaa ardiin biyyoota (Countries) baay’ee qabdu kam?',
      options: ['Eeshiyaa', 'Awurooppaa', 'Afrikaa', 'Ameerikaa Kibbaa'],
      kidPeekNote: 'Afrikaan biyyoota 54 qabdi — ardii hunda caalaa biyyoota baay’ee qabdi!',
      kidRoastOnMiss: 'Eeshiyaan biyyoota 48 qabdi, Afrikaan garuu biyyoota 54 qabdi!',
      funFact: 'Afrikaan biyyoota walaba 54 qabdi.',
    },
    'q-doctor-apple-math': {
      question:
        'Doktarri kiniinii vitaaminii 3 siif kennee daqiiqaa 30-30n 1 liqimsi siin jedhe. Hunda fixuuf daqiiqaa meeqa fudhata?',
      options: ['Daqiiqaa 90', 'Daqiiqaa 60', 'Daqiiqaa 45', 'Daqiiqaa 30'],
      kidPeekNote: '1ffaa amma (daqiiqaa 0), 2ffaa daqiiqaa 30 booda, 3ffaa daqiiqaa 60 booda!',
      kidRoastOnMiss: 'Daqiiqaa 90 miti! Kan 1ffaa amma waan liqimsituuf daqiiqaa 60 qofa fudhata!',
      funFact: 'Kiniinii 3 gidduu garaagarummaa yeroo 2 qofatu jira.',
    },
    'q-polar-bear-skin': {
      question: 'Rifeensa adii jala, halluun gogaa Amaaketa Cabbii (Polar Bear) maal?',
      options: ['Diimaa laafaa (Pink)', 'Adii', 'Gurraacha (Black)', 'Cuquliisa'],
      kidPeekNote: 'Gogaan Polar Bear hoo’a Biiftuu xuuxuuf GURRAACHA (Black) dha!',
      kidRoastOnMiss: 'Gogaan Polar Bear gurraacha dha!',
      funFact: 'Gogaan gurraachi hoo’a aduu qabata.',
    },
    'q-silent-letter-knight': {
      question: 'Jecha Ingiliffaa kamtu yeroo dubbifamu qubeewwan sagalee hin qabne (Silent letters) 3 qaba?',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'K-N-I-G-H-T keessatti K, G fi H hin dubbifaman (qubee 3)!',
      kidRoastOnMiss: 'KNIGHT keessatti K, G fi H sagalee hin qaban!',
      funFact: 'Ingiliffa durii keessatti qubeewwan kun ni dubbifamu turan.',
    },
    'q-lily-pad-pond': {
      question:
        'Baalli bishaan irraa guyyaa guyyaan dachaa (×2) guddata. Haroo guutuu uwwisuuf guyyaa 20 yoo fudhate, guyyaa meeqaffaa irratti haroon WALAKKAA (1/2) ture?',
      options: ['Guyyaa 10ffaa', 'Guyyaa 15ffaa', 'Guyyaa 18ffaa', 'Guyyaa 19ffaa'],
      kidPeekNote: 'Guyyaa 10ffaa hin jedhin! Guyyaan 20 dura jiru Guyyaa 19ffaa dha!',
      kidRoastOnMiss: 'Ga’eessonni %91 Guyyaa 10ffaa jedhu! Deebiin sirriin Guyyaa 19ffaa dha!',
      funFact: 'Gaaffii beekamaa Cognitive Reflection Test.',
    },
    'q-strawberry-berries': {
      question: 'Saayinsii biqiltootaa (Botany) irratti hundaa’uun, kuduraa fi muduraa kana keessaa kamtu "Berry" dhugaa dha?',
      options: ['Istiroobeerii (Strawberry)', 'Raaspbeerii', 'Muuzii (Banana)', 'Bilaakbeerii'],
      kidPeekNote: 'Saayinsiidhaan MUUZIIN (Banana) Berry dhugaa dha!',
      kidRoastOnMiss: 'Istiroobeerii miti! Saayinsiidhaan Muuziitu Berry dhugaa dha!',
      funFact: 'Muuzii, burtukaanaa fi timaatimni saayinsiidhaan Berry jedhamu.',
    },
    'q-million-bat-ball': {
      question:
        'GAAFFII $1,000,000: Ulee fi kubbaan walitti $1.10 baasu. Uleen kubbaa caalaa $1.00 miyaawa. Gatii kubbaa meeqa?',
      options: ['Saantima 10 ($0.10)', 'Saantima 5 ($0.05)', 'Saantima 1 ($0.01)', 'Saantima 15 ($0.15)'],
      kidPeekNote: 'Saantima 10 hin filatin! Kubbaan $0.05 + Uleen $1.05 = $1.10!',
      kidRoastOnMiss: 'Kiyyoo saantima 10 keessatti kufte! $0.05 + $1.05 = $1.10!',
      funFact: 'Barattoota Harvard fi MIT walakkaa oltu gaaffii kana dogoggora.',
    },
    'q-million-mary-mom': {
      question:
        'GAAFFII $1,000,000: Haati Maariyaam ijoollee dubaraa 4 qabdi: Ebla, Caamsaa fi Waxabajjii. Maqaan mucaa 4ffaa eenyu?',
      options: ['Adoolessa (July)', 'Hagayya', 'Maariyaam!', 'Birraa'],
      kidPeekNote: 'Jechoota jalqabaa dubbisi: "Haati Maariyaam"! Mucaan 4ffaan Maariyaam dha!',
      kidRoastOnMiss: 'Adoolessa filattee?! 😂 Gaaffichi "Haati Maariyaam" jedha! Maariyaam dha!',
      funFact: 'Sammuun ga’eessotaa tartiiba ji’ootaa hordofuun maqaa jalqabaa irraanfata.',
    },
  },
  har: {
    'q-race-2nd': {
      question:
        'በመድረሳ ሩጫ ውድድር 2ኛ ደረጃ ዛለ ሰው ቢትቀድመው፣ አሁን ስንተኛ ደረጃ ላይ ኢንታሁ?',
      options: ['1ኛ ደረጃ', '2ኛ ደረጃ', '3ኛ ደረጃ', 'ከ1ኛ ጋር እኩል'],
      kidPeekNote: '1ኛ አትምረጢ! 2ኛው ሰው ስትቀድመው የሱን ቦታ ትወስዳለሁ — ስለዚህ 2ኛ ኢንታሁ!',
      kidRoastOnMiss: 'ሃሃሃ! 2ኛው ቀደምከው እንጂ 1ኛው አልቀደምከውም! አሁንም 2ኛ ደረጃ ላይ ኢንታሁ!',
      funFact: 'ከ65% በላይ አዋቂያች በፍጥነት "1ኛ ደረጃ" ብለው ይሳሳታሉ!',
    },
    'q-months-28': {
      question: 'ከዓመቱ 12 ወራች ኡስጡ ስንት ወራች 28 ቀናት አላቸው?',
      options: ['1 ወር ብቻ (የካቲት)', '2 ወራች', '6 ወራች', 'ሁሉም 12 ወራች!'],
      kidPeekNote: 'ሁሉም 12 ወራች 28 ቀን አላቸው! የካቲት በ28 ይቆማል እንጂ ሁሉም ወራች 28 አላቸው!',
      kidRoastOnMiss: 'ሃሃሃ! ሁሉም 12 ወራች 28ኛ ቀን አላቸው!',
      funFact: 'ጥያቄው "28 ቀናት ብቻ" አላለም!',
    },
    'q-spiders-legs': {
      question: 'ነፍሳት (Insects) 6 እግር አላቸው። ሸረሪት (Spider) ግን ስንት እግር አላት?',
      options: ['6 እግር', '8 እግር', '10 እግር', '12 እግር'],
      kidPeekNote: 'ሸረሪት አራክኒድ (Arachnid) ኢንታ — 8 እግር አላት!',
      kidRoastOnMiss: 'ሸረሪት 8 እግር አላት!',
      funFact: 'ሸረሪቶች 8 እግር አላቸው።',
    },
    'q-primary-paint': {
      question: 'በሥዕል ክፍል ቀይ ዋ ቢጫ ቀለም ብትቀላቅል ምን ቀለም ይሰጣል?',
      options: ['አረንጓዴ', 'ብርቱካናማ (Orange)', 'ወይን ጠጅ', 'ቡናማ'],
      kidPeekNote: 'ቀይ + ቢጫ = ብርቱካናማ (Orange)!',
      kidRoastOnMiss: 'ቀይ + ቢጫ = ብርቱካናማ ኢንታ!',
      funFact: 'ሦስቱ መሠረታዊ ቀለማት ቀይ፣ ቢጫ ዋ ሰማያዊ ናቸው።',
    },
    'q-rooster-egg': {
      question: 'አውራ ዶሮ (Rooster) በሾለ ጣሪያ ላይ ሆኖ እንቁላል ቢጥል፣ ወደ የትኛው አቅጣጫ ይንከባለላል?',
      options: ['ወደ ግራ', 'ወደ ቀኝ', 'ወደ ነፋሱ', 'አውራ ዶሮ እንቁላል አይጥልም!'],
      kidPeekNote: 'አውራ ዶሮ ወንድ ኢንታ! እንቁላል አይጥልም!',
      kidRoastOnMiss: 'ሃሃሃ! አውራ ዶሮ እንቁላል አይጥልም! 🐓😂',
      funFact: 'አዋቂያች ስለ ጣሪያው ቅርጽ ሲያስቡ ወጥመዱ ውስጥ ይገባሉ።',
    },
    'q-ice-steam': {
      question: 'በረዶ ሲቀልጥ ውኃ ይሆናል። ውኃ ሲፈላ ምን ይሆናል?',
      options: ['ደረቅ በረዶ', 'እንፋሎት (Steam)', 'ኦክስጅን ብቻ', 'አረፋ'],
      kidPeekNote: 'ውኃ ሲፈላ ወደ ጋዝ (እንፋሎት / Steam) ይቀየራል!',
      kidRoastOnMiss: 'የፈላ ውኃ እንፋሎት (Steam) ይሆናል!',
      funFact: 'ውኃ 3 ሁኔታዎች አሉት፡ ጠጣር፣ ፈሳሽ ዋ ጋዝ።',
    },
    'q-feathers-bricks': {
      question: 'የቱ ይበልጥ ይከብዳል፡ 1 ኪሎ ግራም ላባ ወይስ 1 ኪሎ ግራም ጡብ (ድንጋይ)?',
      options: ['1 ኪሎ ጡብ', '1 ኪሎ ላባ', 'ሁለቱም እኩል ይመዝናሉ!', 'እንደ አየሩ ይለያያል'],
      kidPeekNote: '1 ኪሎ ግራም ሁልጊዜ 1 ኪሎ ግራም ኢንታ! ሁለቱም እኩል ናቸው!',
      kidRoastOnMiss: 'ሃሃሃ! ሁለቱም 1 ኪሎ ግራም ናቸው — ክብደታቸው እኩል ኢንታ!',
      funFact: '1 ኪሎ ላባ ዋ 1 ኪሎ ጡብ እኩል ይመዝናሉ።',
    },
    'q-alphabet-left': {
      question: 'ከ26 የእንግሊዝኛ ፊደላት E ዋ T ቢሄዱ ስንት ፊደላት ይቀራሉ?',
      options: ['24 ፊደላት', '21 ፊደላት', '25 ፊደላት', '20 ፊደላት'],
      kidPeekNote: '26 ሲቀነስ 2 = 24 ፊደላት!',
      kidRoastOnMiss: '26 - 2 = 24 ፊደላት!',
      funFact: 'የእንግሊዝኛ አልፋቤት 26 ፊደላት አሉት።',
    },
    'q-chameleon-color': {
      question: 'እስስት (Chameleon) ቀለሟን የምትቀይርበት ዋና ምክንያት ምንድን ኢንታ?',
      options: [
        'ለመደበቅ ብቻ',
        'ስሜቷን ለመግለጽ ዋ የሰውነት ሙቀቷን ለመቆጣጠር',
        'በበላችው ምግብ',
        'በጨለማ ለማብራት',
      ],
      kidPeekNote: 'እስስት ስሜቷን ለመግለጽ ዋ ሙቀቷን ለመቆጣጠር ቀለም ትቀይራለች!',
      kidRoastOnMiss: 'ለመደበቅ ብቻ አይደለም! ስሜት ዋ ሙቀት ለመቆጣጠር ኢንታ!',
      funFact: 'እስስቶች በቆዳቸው ውስጥ ያሉ ናኖ-ክሪስታሎችን ይጠቀማሉ።',
    },
    'q-hole-dirt': {
      question: '2 ሜትር ስፋት፣ 3 ሜትር ርዝመት ዋ 2 ሜትር ጥልቀት ያለው ጉድጓድ ብትቆፍር፣ ጉድጓዱ ኡስጡ ምን ያህል አፈር አለ?',
      options: ['12 ኩቢክ ሜትር', '6 ኩቢክ ሜትር', 'ምንም (0) — ጉድጓድ ስለሆነ!', '8 ኩቢክ ሜትር'],
      kidPeekNote: 'ሒሳብ አትስራ! ጉድጓድ ባዶ ኢንታ — አፈር የለውም (0)!',
      kidRoastOnMiss: '2 × 3 × 2 አባዛህ?! 😂 ጉድጓድ ኡስጡ አፈር የለውም (0)!',
      funFact: 'አዋቂያች ቁጥሮችን ሲያዩ ወዲያውኑ ማባዛት ይጀምራሉ።',
    },
    'q-camel-hump': {
      question: 'ግመል (Camel) በሻኛው (Hump) ኡስጡ ምን ያከማቻል?',
      options: ['ቀዝቃዛ ውኃ', 'ስብ (Fat) — ለኃይል', 'አሸዋ', 'አየር'],
      kidPeekNote: 'ውኃ አይደለም! ግመል በሻኛው ኡስጡ ስብ (Fat) ያከማቻል!',
      kidRoastOnMiss: 'ውኃ አይደለም! የግመል ሻኛ በስብ (Fat) የተሞላ ኢንታ!',
      funFact: 'ግመል እስከ 36 ኪሎ ግራም ስብ በሻኛው ውስጥ ያከማቻል።',
    },
    'q-planets-sun': {
      question: 'ከፀሐይ በ3ኛ ደረጃ ላይ የምትገኘው ፕላኔት የትኛዋ ኢንታ?',
      options: ['ማርስ', 'ቬነስ', 'ምድር (Earth)', 'ሜርኩሪ'],
      kidPeekNote: '1ኛ ሜርኩሪ፣ 2ኛ ቬነስ፣ 3ኛ ምድር (Earth)!',
      kidRoastOnMiss: 'ከፀሐይ 3ኛዋ ፕላኔት ምድር (Earth) ኢንታ!',
      funFact: 'ምድር ከፀሐይ 150 ሚሊዮን ኪ.ሜ ርቃ ትገኛለች።',
    },
    'q-candles-lit': {
      question: '7 የሚበሩ ሻማዎች ነበሩ። ነፋስ 3ቱን አጠፋቸው። በመጨረሻ ስንት ሻማዎች ይቀራሉ?',
      options: ['4 ሻማዎች', '3 ሻማዎች', '7 ሻማዎች', '0 ሻማዎች'],
      kidPeekNote: '4ቱ የሚበሩት ቀልጠው ያልቃሉ! 3ቱ የጠፉት ግን አይቀልጡም — ስለዚህ 3 ይቀራሉ!',
      kidRoastOnMiss: '4ቱ የሚበሩት ቀልጠው ያልቃሉ፣ 3ቱ የጠፉት ብቻ ይቀራሉ!',
      funFact: 'ክላሲክ የ2ኛ ክፍል እንቆቅልሽ።',
    },
    'q-largest-ocean': {
      question: 'በዓለም ላይ ትልቁ ዋ ጥልቁ ውቅያኖስ የቱ ኢንታ?',
      options: ['አትላንቲክ ውቅያኖስ', 'ህንድ ውቅያኖስ', 'ፓስፊክ ውቅያኖስ (Pacific)', 'አርክቲክ ውቅያኖስ'],
      kidPeekNote: 'ፓስፊክ ውቅያኖስ ከሁሉም አህጉራት ድምር ይበልጣል!',
      kidRoastOnMiss: 'ትልቁ ውቅያኖስ ፓስፊክ ውቅያኖስ ኢንታ!',
      funFact: 'ፓስፊክ ውቅያኖስ ከምድር ገጽ 30% በላይ ይሸፍናል።',
    },
    'q-apples-take-away': {
      question: 'በሳህን ላይ 6 ቀይ ፖሞች አሉ። 4ቱን ወሰድክ። አሁን አሁ ስንት ፖሞች አሉህ?',
      options: ['2 ፖሞች', '4 ፖሞች', '6 ፖሞች', '10 ፖሞች'],
      kidPeekNote: '4 ፖሞች ስለወሰድክ በእጅህ 4 ፖሞች አሉህ!',
      kidRoastOnMiss: '2 በሳህኑ ላይ ቀሩ፣ አሁ ግን 4 ወሰድክ!',
      funFact: '83% አዋቂያች "2" ብለው ይሳሳታሉ።',
    },
    'q-caterpillar-change': {
      question: 'አባጨጓሬ (Caterpillar) ወደ ቢራቢሮ (Butterfly) የሚቀየርበት ሂደት ምን ይባላል?',
      options: ['Photosynthesis', 'Metamorphosis (ሜታሞርፎሲስ)', 'Hibernation', 'Evaporation'],
      kidPeekNote: 'የቢራቢሮ ለውጥ Metamorphosis ይባላል!',
      kidRoastOnMiss: 'Photosynthesis የተክሎች ኢንታ! የቢራቢሮው Metamorphosis ይባላል!',
      funFact: 'አባጨጓሬ ወደ ውብ ቢራቢሮ ይቀየራል።',
    },
    'q-vowel-count': {
      question: '"CAULIFLOWER" በሚለው የእንግሊዝኛ ቃል ኡስጡ ስንት አናባቢ ፊደላት (A, E, I, O, U) አሉ?',
      options: ['3 አናባቢዎች', '4 አናባቢዎች', '5 አናባቢዎች', '6 አናባቢዎች'],
      kidPeekNote: 'ቁጠሪ: A, U, I, O, E — 5ቱም አናባቢዎች አሉበት!',
      kidRoastOnMiss: 'CAULIFLOWER 5ቱንም አናባቢዎች (A, U, I, O, E) ይዟል!',
      funFact: 'CAULIFLOWER አምስቱንም አናባቢዎች አንድ ጊዜ ይዟል።',
    },
    'q-bus-driver': {
      question:
        'አሁ የትምህርት ቤት አውቶቡስ ሹፌር ኢንታሁ! በ1ኛው ፌርማታ 6 ልጆች ወጡ። በ2ኛው 3 ወረዱ ዋ 5 ወጡ። የአውቶቡሱ ሹፌር የዓይን ቀለም ምንድን ኢንታ?',
      options: ['ሰማያዊ', 'ቡናማ', 'የአሁ የዓይን ቀለም!', 'መረጃው አይበቃም'],
      kidPeekNote: 'መጀመሪያው አንብቢ: "አሁ የአውቶቡስ ሹፌር ኢንታሁ"! ሹፌሩ አሁ ኢንታሁ!',
      kidRoastOnMiss: 'ተሳፋሪዎች ስትቆጥር ሹፌሩ አሁ መሆንሁ ረሳህ! 😂',
      funFact: 'በዓለም የታወቀ የአውቶቡስ እንቆቅልሽ።',
    },
    'q-venus-spin': {
      question: 'በሥርዓተ ፀሐይ ኡስጡ በጣም ሞቃቷ ዋ ወደ ኋላ የምትሽከረከረው ፕላኔት የትኛዋ ኢንታ?',
      options: ['ሜርኩሪ', 'ቬነስ (Venus)', 'ማርስ', 'ጁፒተር'],
      kidPeekNote: 'ቬነስ ወፍራም ደመና ስላላት ከሜርኩሪ በላይ ትሞቃለች!',
      kidRoastOnMiss: 'በጣም ሞቃቷ ፕላኔት ቬነስ (Venus) ኢንታ!',
      funFact: 'የቬነስ ሙቀት 475°C ይደርሳል።',
    },
    'q-quarters-in-3-dollars': {
      question: 'በ25 ሳንቲም (Quarters) ብቻ የ$3.50 አይስክሬም ለመግዛት ስንት ሳንቲሞች ያስፈልጉሃል?',
      options: ['10', '12', '14', '16'],
      kidPeekNote: '4 × 3 = 12፣ ሲደመር 2 = 14 ሳንቲሞች!',
      kidRoastOnMiss: '4 × 3 = 12፣ ሲደመር 2 = 14!',
      funFact: 'የሳንቲም ሒሳብ አእምሮን ያፋጥናል።',
    },
    'q-towel-riddle': {
      question: 'ሌሎች ነገሮችን በሚያደርቅበት ጊዜ እሱ ግን እየረጠበ የሚሄድ ምንድን ኢንታ?',
      options: ['ስፖንጅ', 'ፎጣ (Towel)', 'በረዶ', 'የፀጉር ማድረቂያ'],
      kidPeekNote: 'ፎጣ (Towel) ውኃ ሲያደርቅ እሱ ይረጥባል!',
      kidRoastOnMiss: 'መልሱ ፎጣ (Towel) ኢንታ!',
      funFact: 'ልጆች ወዲያውኑ የሚመልሱት እንቆቅልሽ።',
    },
    'q-shark-bones': {
      question: 'በታላቁ ነጭ ሻርክ (Great White Shark) ሰውነት ኡስጡ ስንት ጠንካራ አጥንቶች አሉ?',
      options: ['ዜሮ (0 አጥንት!)', '42 አጥንቶች', '206 አጥንቶች', '312 አጥንቶች'],
      kidPeekNote: 'ዜሮ (0)! የሻርክ ሰውነት ከለስላሳ ለምፅ (Cartilage) የተሠራ ኢንታ!',
      kidRoastOnMiss: 'ሻርክ ምንም አጥንት የለውም (0) — ለምፅ (Cartilage) ብቻ ኢንታ!',
      funFact: 'ለምፅ ሻርኮች በፍጥነት እንዲዋኙ ይረዳቸዋል።',
    },
    'q-continents-count': {
      question: 'ከዓለም አህጉራት በጣም ብዙ ሀገራት ያሏት አህጉር የትኛዋ ኢንታ?',
      options: ['እስያ', 'አውሮፓ', 'አፍሪካ', 'ደቡብ አሜሪካ'],
      kidPeekNote: 'አፍሪካ 54 ሀገራት አሏት — ከሁሉም አህጉራት ትበልጣለች!',
      kidRoastOnMiss: 'እስያ 48 ሀገራት አሏት፣ አፍሪካ ግን 54 ሀገራት አሏት!',
      funFact: 'አፍሪካ 54 ነፃ ሀገራት አሏት።',
    },
    'q-doctor-apple-math': {
      question: 'ሐኪም 3 ኪኒን ሰጥቶህ በየ30 ደቂቃው 1 ኪኒን ዋጥ አለህ። ሦስቱንም ለመጨረስ ስንት ደቂቃ ይፈጃል?',
      options: ['90 ደቂቃ', '60 ደቂቃ', '45 ደቂቃ', '30 ደቂቃ'],
      kidPeekNote: '1ኛውን አሁን (0 ደቂቃ)፣ 2ኛውን በ30 ደቂቃ፣ 3ኛውን በ60 ደቂቃ!',
      kidRoastOnMiss: '90 ደቂቃ አይደለም! 1ኛውን አሁን ስለምትውطው 60 ደቂቃ ብቻ ይፈጃል!',
      funFact: 'በ3 ኪኒኖች መካከል 2 የ30-ደቂቃ ክፍተቶች ብቻ አሉ።',
    },
    'q-polar-bear-skin': {
      question: 'ከነጭ ፀጉሩ ሥር፣ የዋልታ ድብ (Polar Bear) የቆዳ ቀለም ምንድን ኢንታ?',
      options: ['ሮዝ (Pink)', 'ነጭ', 'ጥቁር (Black)', 'ሰማያዊ'],
      kidPeekNote: 'የዋልታ ድብ ቆዳ የፀሐይ ሙቀት ለመሳብ ጥቁር (Black) ኢንታ!',
      kidRoastOnMiss: 'የዋልታ ድብ ቆዳ ጥቁር ኢንታ!',
      funFact: 'ጥቁር ቆዳ የፀሐይ ሙቀትን ይይዛል።',
    },
    'q-silent-letter-knight': {
      question: 'የትኛው የእንግሊዝኛ ቃል ሲነበብ 3 የማይነበቡ ፊደላት (Silent letters) አሉት?',
      options: ['KNIGHT', 'ISLAND', 'CASTLE', 'WEDNESDAY'],
      kidPeekNote: 'በ K-N-I-G-H-T ኡስጡ K, G ዋ H አይነበቡም!',
      kidRoastOnMiss: 'KNIGHT 3 የማይነበቡ ፊደላት (K, G, H) አሉት!',
      funFact: 'በጥንት እንግሊዝኛ እነዚህ ፊደላት ይነበቡ ነበር።',
    },
    'q-lily-pad-pond': {
      question: 'በኩሬ ላይ ያለ ቅጠል በየቀኑ እጥፍ (×2) ያድጋል። ኩሬውን ለመሙላት 20 ቀን ቢፈጅ፣ በስንተኛው ቀን ግማሽ (1/2) ነበር?',
      options: ['በ10ኛው ቀን', 'በ15ኛው ቀን', 'በ18ኛው ቀን', 'በ19ኛው ቀን'],
      kidPeekNote: '10ኛው ቀን አትበሊ! በየቀኑ እጥፍ ስለሚሆን ከ20 በፊት ያለው 19ኛው ቀን ኢንታ!',
      kidRoastOnMiss: '91% አዋቂያች 10ኛው ቀን ይላሉ! ትክክለኛው መልስ 19ኛው ቀን ኢንታ!',
      funFact: 'ታዋቂው የMIT ዋ Princeton Cognitive Reflection Test ጥያቄ።',
    },
    'q-strawberry-berries': {
      question: 'በዕፅዋት ሳይንስ (Botany) መሠረት የቱ እውነተኛ "Berry" ኢንታ?',
      options: ['እንጆሪ (Strawberry)', 'ራስፕ베ሪ', 'ሙዝ (Banana)', 'ብላክቤሪ'],
      kidPeekNote: 'በሳይንስ ሙዝ (Banana) እውነተኛ Berry ኢንታ!',
      kidRoastOnMiss: 'እንጆሪ አይደለም! በሳይንስ ሙዝ እውነተኛ Berry ኢንታ!',
      funFact: 'በዕፅዋት ሳይንስ ሙዝ፣ ወይን ዋ ቲማቲም Berry ናቸው።',
    },
    'q-million-bat-ball': {
      question: 'የ$1,000,000 ጥያቄ: ዱላ ዋ ኳስ በአንድ ላይ $1.10 ያወጣሉ። ዱላው ከኳሷ በ$1.00 ይበልጣል። ኳሷ ስንት ኢንታ?',
      options: ['10 ሳንቲም ($0.10)', '5 ሳንቲም ($0.05)', '1 ሳንቲም ($0.01)', '15 ሳንቲም ($0.15)'],
      kidPeekNote: '10 ሳንቲም አትምረጢ! ኳሷ 5 ሳንቲም ($0.05) + ዱላው $1.05 = $1.10!',
      kidRoastOnMiss: 'በ10 ሳንቲም ወጥመድ ወደቅሁ! 5 ሳንቲም + $1.05 = $1.10!',
      funFact: 'ከግማሽ በላይ የHarvard ዋ MIT ተማሪዎች በፍጥነት ሲመልሱ ይሳሳታሉ።',
    },
    'q-million-mary-mom': {
      question: 'የ$1,000,000 ጥያቄ: የማርያም እናት 4 ሴት ልጆች አሏት፡ ኤፕሪል፣ ሜይ ዋ ጁን። የ4ኛዋ ልጅ ስም ማን ኢንታ?',
      options: ['ጁላይ (July)', 'ኦገስት', 'ማርያም!', 'ሜይ'],
      kidPeekNote: 'የመጀመሪያዎቹን ቃላት አንብቢ: "የማርያም እናት"! 4ኛዋ ልጅ ማርያም ኢንታ!',
      kidRoastOnMiss: 'ጁላይ አልክ?! 😂 ጥያቄው "የማርያም እናት" ይላል! ማርያም ኢንታ!',
      funFact: 'የአዋቂያች አእምሮ የወራትን ተከታታይነት ሲከተል የመጀመሪያውን ስም ይረሳል።',
    },
  },
};

export function getLocalizedQuestions(lang: AppLanguage): TriviaQuestion7Yo[] {
  const dict = QUESTION_TRANSLATIONS[lang];
  const baseLocalized = !dict
    ? TRIVIA_QUESTIONS_7YO
    : TRIVIA_QUESTIONS_7YO.map((q) => {
        const t = dict[q.id];
        if (!t) return q;
        return {
          ...q,
          question: t.question,
          options: t.options,
          kidPeekNote: t.kidPeekNote,
          kidRoastOnMiss: t.kidRoastOnMiss,
          funFact: t.funFact,
        };
      });
  return getExpanded2000Questions(lang, baseLocalized);
}

export function getLocalizedLadder(lang: AppLanguage): LadderRung[] {
  if (lang === 'en') return PRIZE_LADDER;
  const titles: Partial<Record<AppLanguage, string[]>> = {
    de: [
      'Vorschul-Goldstern',
      '1. Klasse Fingerfarben-Profi',
      'Pausenhof-Hüpfspiel-Champ',
      'Buchstabier-Finalist',
      'SICHERER HAFEN: 2. Klasse Profi',
      'Schul-Vulkan-Gewinner',
      'Hausaufgaben-Kapitän',
      'Ehrenliste des Direktors',
      '7-Jähriges Mathe-Wunderkind',
      'SUPREME 7-JÄHRIGES GENIE',
    ],
    es: [
      'Estrella de Kínder',
      'Pro de Pintura de 1.º',
      'Campeón de Rayuela',
      'Finalista de Ortografía',
      'ZONA SEGURA: Graduado de 2.º',
      'Ganador Feria de Ciencias',
      'Capitán de Tareas',
      'Cuadro de Honor del Director',
      'Prodigio de 7 Años',
      'GENIO SUPREMO DE 7 AÑOS',
    ],
    fr: [
      'Étoile d’Or Maternelle',
      'Pro de Peinture CP',
      'Champion de Marelle',
      'Finaliste d’Orthographe',
      'PALIER SÛR : Certifié CE1',
      'Gagnant Fête des Sciences',
      'Capitaine des Devoirs',
      'Tableau d’Honneur du Directeur',
      'Prodige des Olympiades (7 ans)',
      'GÉNIE SUPRÊME DE 7 ANS',
    ],
    pt: [
      'Estrela do Jardim',
      'Mestre da Pintura 1º Ano',
      'Campeão de Amarelinha',
      'Finalista de Soletração',
      'PORTO SEGURO: Aprovado 2º Ano',
      'Vencedor da Feira de Ciências',
      'Capitão do Dever de Casa',
      'Quadro de Honra da Diretora',
      'Prodígio de 7 Anos',
      'GÊNIO SUPREMO DE 7 ANOS',
    ],
    ar: [
      'نجمة الروضة الذهبية',
      'محترف الرسم - الصف الأول',
      'بطل ساحة اللعب',
      'نهائي مسابقة الإملاء',
      'محطة آمنة: طالب صف ثاني معتمد',
      'بطل معرض العلوم',
      'قائد نادي الواجبات',
      'لوحة شرف المدير',
      'أعجوبة الأولمبياد (7 سنوات)',
      'العبقري الأعلى بعمر 7 سنوات',
    ],
    am: [
      'የአፀደ ሕፃናት የወርቅ ኮከብ',
      'የ1ኛ ክፍል የሥዕል ባለሙያ',
      'የዕረፍት ጨዋታ ሻምፒዮን',
      'የፊደል ውድድር ተወዳዳሪ',
      'አስተማማኝ ደረጃ፡ የ2ኛ ክፍል ተማሪ',
      'የሳይንስ ትርኢት አሸናፊ',
      'የቤት ሥራ ክለብ አምበል',
      'የርዕሰ መምህሩ የክብር መዝገብ',
      'የ7 ዓመት ኦሊምፒያድ ሊቅ',
      'የ7 ዓመት ታላቅ ሊቅ (SUPREME GENIUS)',
    ],
    om: [
      'Urjii Warqee Oolmaa Daa’immanii',
      'Ogeessa Fakkii Kutaa 1ffaa',
      'Shaampiyoonaa Tapha Boqonnaa',
      'Dorgomaa Qubee Xumuraa',
      'BAKKA AMansiisaa: Barataa Kutaa 2ffaa',
      'Mo’ataa Agarsiisa Saayinsii',
      'Ajajaa Gumii Hojii Manaa',
      'Galmee Kabajaa Hoogganaa Mana Barumsaa',
      'Hayyuu Olompikii Waggaa 7',
      'HAYYUU OLAANAA WAGGAA 7 (SUPREME GENIUS)',
    ],
    har: [
      'የአፀደ ሕፃናት የወርቂ ኮከብ',
      'የ1ኛ ክፍል የሥዕል ባለሙያ',
      'የዕረፍት ጨዋታ ሻምፒዮን',
      'የፊደል ውድድር ተወዳዳሪ',
      'አስተማማኝ ደረጃ፡ የ2ኛ ክፍል ተማሪ',
      'የሳይንስ ትርኢት አሸናፊ',
      'የቤት ሥራ ክለብ አምበል',
      'የመድረሳው የክብር መዝገብ',
      'የ7 አመት ኦሊምፒያድ ሊቅ',
      'የ7 አመት ታላቅ ሊቅ (SUPREME GENIUS)',
    ],
    ja: [
      'ようちえんゴールドスター',
      '小学1年おえかきプロ',
      '休み時間けんけんぱ王者',
      'スペリング大会ファイナリスト',
      'セーフヘイブン：小学2年認定',
      '理科コンテスト優勝',
      '宿題クラブキャプテン',
      '校長先生の優等生リスト',
      '7歳オリンピアード神童',
      '7歳の最高天才（SUPREME GENIUS）',
    ],
    so: [
      'Xiddigta Dahabka Xanaanada',
      'Xariifka Rinjiyeynta Fasalka 1-aad',
      'Horyaalka Ciyaarta Nasashada',
      'Tartamaha Higgaadda Erayada',
      'GOOB AAMIN AH: Arday Fasalka 2-aad',
      'Guuleystaha Bandhigga Sayniska',
      'Kabtanka Naadiga Casharrada',
      'Liiska Sharafka Maamulaha',
      'Mucjisada Xisaabta 7-Jirka',
      'CAQLI-BADNAHA UGU SARREEYA EE 7-JIR',
    ],
  };
  const list = titles[lang];
  if (!list) return PRIZE_LADDER;
  return PRIZE_LADDER.map((r, idx) => ({
    ...r,
    gradeTitle: list[idx] || r.gradeTitle,
  }));
}

export function getLocalizedClassmates(lang: AppLanguage): KidClassmate[] {
  if (lang === 'en') return KID_CLASSMATES;
  const ui = UI_STRINGS[lang];
  const cheersByLang: Partial<Record<AppLanguage, string[]>> = {
    de: [
      'BOMBE!! 🧮✨ Du hast wie ein Zweitklässler-Genie gerechnet!',
      'High-Five! Mein Rechenrahmen sagt: 100 % RICHTIG!',
      'Juhu!! Wir holen uns den 1.000.000-$-Goldstern!',
    ],
    es: [
      '¡¡GENIAL!! 🧮✨ ¡Lo resolviste como un genio de 2.º grado!',
      '¡Choca esos cinco! ¡100 % CORRECTO!',
      '¡¡SÍ!! ¡Vamos directo al premio de $1,000,000!',
    ],
    fr: [
      'BRAVO !! 🧮✨ Tu as trouvé comme un vrai génie de CE1 !',
      'Tape-m’en cinq ! C’est 100 % CORRECT !',
      'OUAIS !! En route vers le diplôme à 1 000 000 $ !',
    ],
    pt: [
      'BOA!! 🧮✨ Você acertou igual um gênio da 2ª série!',
      'Toca aqui! 100% CORRETO!',
      'ISSO!! Rumo ao prêmio de $1.000.000!',
    ],
    ar: [
      'رائع!! 🧮✨ لقد حللتها مثل عبقري الصف الثاني!',
      'إجابة صحيحة 100%!',
      'يا سلام!! نحن نقترب من جائزة الـ 1,000,000$!',
    ],
    am: [
      'ድንቅ ነው!! 🧮✨ እንደ 2ኛ ክፍል ሊቅ መለሱት!',
      '100% ትክክል ነዎት!',
      'ጎበዝ!! ወደ $1,000,000 ሽልማት እየገሰገስን ነው!',
    ],
    om: [
      'BAAY’EE GAARII!! 🧮✨ Akka hayyuu kutaa 2ffaatti deebiste!',
      'Harka rukuti! %100 SIRRII DHA!',
      'GOOTA!! Gara badhaasa $1,000,000tti deemaa jirra!',
    ],
    har: [
      'ድንቅ ኢንታ!! 🧮✨ እንደ 2ኛ ክፍል ሊቅ መለስከው!',
      '100% ሶፊ (ትክክል) ኢንታሁ!',
      'ጎበዝ!! ወደ $1,000,000 ሽልማት እየሄድን ኢንታ!',
    ],
    ja: [
      'すごい！！🧮✨ 小学2年生の天才みたいに解けたね！',
      'ハイタッチ！100%大正解だよ！',
      'やったー！！$1,000,000の卒業証書まであと少し！',
    ],
    so: [
      'WAW!! 🧮✨ Waxaad u xallisay sida xariif fasalka 2-aad ah!',
      'Gacan-qaad! Jawaabtaadu waa 100% SAX!',
      'HAA!! Waxaan ku soconnaa abaalmarinta $1,000,000!',
    ],
  };
  const roastsByLang: Partial<Record<AppLanguage, string[]>> = {
    de: [
      'Hehehe! Selbst mein kleiner Bruder im Kindergarten wusste das! 😜',
      'Ups! Du bist voll in die Erwachsenen-Denkfalle getappt!',
    ],
    es: [
      '¡Jajaja! ¡Hasta mi hermanito de kínder se sabía esa! 😜',
      '¡Ups! ¡Caíste redondito en la trampa para adultos!',
    ],
    fr: [
      'Hahaha ! Même en maternelle on connaît cette réponse ! 😜',
      'Oups ! Tu es tombé en plein dans le piège pour adultes !',
    ],
    pt: [
      'Hahaha! Até no jardim de infância todo mundo sabe essa! 😜',
      'Eita! Você caiu direitinho na pegadinha para adultos!',
    ],
    ar: [
      'هاهاها! حتى طفل الروضة يعرف هذه الإجابة! 😜',
      'أوه! لقد وقعت في الفخ المخصص للكبار!',
    ],
    am: [
      'ሃሃሃ! የአፀደ ሕፃናት ተማሪም ይህንን ያውቀዋል! 😜',
      'ኡፍ! ለአዋቂዎች በተዘጋጀው ወጥመድ ውስጥ ወደቁ!',
    ],
    om: [
      'Hahaha! Mucaan oolmaa daa’immanii illee deebii kana beeka! 😂😜',
      'Uuf! Kiyyoo ga’eessotaaf qophaa’e keessatti kufte! Hahaha!',
    ],
    har: [
      'ሃሃሃ! የአፀደ ሕፃናት ልጂም ይህን ያውቃል! 😂😜',
      'ኡፍ! ለአዋቂያች በተዘጋጀው ወጥመድ ውስጥ ወደቅሁ! ሃሃሃ!',
    ],
    ja: [
      'えへへ！ようちえんの子でも知ってる問題だよ！😜',
      'おっと！大人が引っかかるワナに見事にハマっちゃったね！',
    ],
    so: [
      'Hahaha! Xitaa ilmaha xanaanada dhigta wuu yaqaannaa jawaabtan! 😜',
      'Haay! Waxaad ku dhacday dabinkii dadka waaweyn!',
    ],
  };
  const greetingsByLang: Partial<Record<AppLanguage, string>> = {
    de: '„Erwachsene denken viel zu kompliziert! Schau einfach auf mein Heft!“',
    es: '«¡Los adultos piensan demasiado! ¡Solo mira mi cuaderno si te atascas!»',
    fr: '« Les adultes compliquent tout ! Regarde ma feuille si tu bloques ! »',
    pt: '“Os adultos complicam tudo! Espie meu caderno se precisar de ajuda!”',
    ar: '«الكبار يعقدون الأسئلة السهلة! انظر إلى ورقتي إذا احتجت للمساعدة!»',
    am: '“አዋቂዎች ቀላል ጥያቄዎችን ያወሳስባሉ! ከከበደዎት የእኔን ወረቀት ይመልከቱ!”',
    om: '“Ga’eessonni gaaffii salphaa wal-xaxaa godhu! Yoo si rakkise waraqaa koo ilaali!”',
    har: '“አዋቂያች ቀላል ጥያቄው ያወሳስባሉ! ቢከብድሁ ወረቀቴ እይ!”',
    ja: '「大人は難しく考えすぎ！困ったらぼくのノートを覗いてね！」',
    so: '“Dadka waaweyn aad bay u adkeeyaan su’aalaha fudud! Eeg warqaddayda haddii aad ku dhegto!”',
  };
  return KID_CLASSMATES.map((kid) => ({
    ...kid,
    grade: `${ui.grades['2nd Grade']} • ${ui.subjects[kid.favoriteSubject]}`,
    greetingQuote: greetingsByLang[lang] || kid.greetingQuote,
    correctCheers: cheersByLang[lang] || kid.correctCheers,
    wrongRoasts: roastsByLang[lang] || kid.wrongRoasts,
  }));
}
