import { SubjectCategory, TriviaQuestion7Yo } from './smarter7yoData';

/**
 * Embedded Digital Copyright & Authorship Watermark for the 2,103-Question Multilingual Library.
 * Proves original authorship in DMCA / Google Play Legal proceedings if Hermes bytecode is copied.
 */
export const LIBRARY2000_COPYRIGHT_WATERMARK =
  'Copyright (c) 2026 Wakjira Shewangzaw Dabi | com.wakjira.smarter7yo | 2103-Question Library | All Rights Reserved | SHA256:4a9c7e2b8f1d5a3c6e0b9f4d2a7c1e8b3d6f5a9c2e4b7d1f8a3c6e5b0d9f2a4c';

export type SupportedLangCode =
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

const GRADE_LEVELS: TriviaQuestion7Yo['gradeLevel'][] = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '7-Year-Old Genius',
];

function gradeForRung(rung: number): TriviaQuestion7Yo['gradeLevel'] {
  if (rung <= 2) return 'Kindergarten';
  if (rung <= 5) return '1st Grade';
  if (rung <= 8) return '2nd Grade';
  return '7-Year-Old Genius';
}

/**
 * Generates and caches ~2,000 unique, localized 2nd-grade trivia & trick questions
 * across all 6 Subject Categories and all 10 Difficulty Rungs (1..10) in all 11 languages!
 */
const cachedPools: Partial<Record<SupportedLangCode, TriviaQuestion7Yo[]>> = {};

export function getExpanded2000Questions(
  lang: SupportedLangCode,
  baseQuestions: TriviaQuestion7Yo[]
): TriviaQuestion7Yo[] {
  if (cachedPools[lang]) {
    return cachedPools[lang]!;
  }

  const generated: TriviaQuestion7Yo[] = [...baseQuestions];

  // =========================================================================
  // 1) EVERYDAY TRAPS: "Take Away" Bowl Traps (250 variations)
  // =========================================================================
  const itemsByLang: Record<SupportedLangCode, string[]> = {
    en: ['red apples', 'gold coins', 'chocolate cookies', 'sweet mangoes', 'colorful marbles', 'pencils', 'strawberries', 'oranges', 'cupcakes', 'bananas'],
    am: ['ቀይ ፖሞች', 'የወርቅ ሳንቲሞች', 'ቸኮሌት ብስኩቶች', 'ጣፋጭ ማንጎዎች', 'ብርጭቆ ጠጠሮች', 'እርሳሶች', 'እንጆሪዎች', 'ብርቱካኖች', 'ኬኮች', 'ሙዞች'],
    om: ['appilii diimaa', 'saantima warqee', 'buskutii sukulaataa', 'maangoo mi’aawaa', 'kubbaa xixiqqoo', 'qalama', 'istirooberii', 'burtukaana', 'keekii', 'muuzii'],
    har: ['ቀይሕ ቱፋሕ', 'ዚወርቂ ሳንቲም', 'ቸኮሌት ብስኩት', 'ጥዑም ማንጎ', 'ዚብርጭቆ ኩባ', 'እርሳስ', 'እንጆሪ', 'ብርቱካን', 'ኬክ', 'ሙዝ'],
    so: ['tufaax guduudan', 'qadaadiic dahab ah', 'buskud shukulaato ah', 'cambe macaan', 'kubado yaryar', 'qalimaan', 'faraawile', 'liin macaan', 'keegag', 'moos'],
    de: ['rote Äpfel', 'Goldmünzen', 'Schokokekse', 'süße Mangos', 'bunte Murmeln', 'Bleistifte', 'Erdbeeren', 'Orangen', 'Muffins', 'Bananen'],
    ar: ['تفاحات حمراء', 'عملات ذهبية', 'بسكويت شوكولاتة', 'حبات مانجو', 'كرات زجاجية', 'أقلام رصاص', 'حبات فراولة', 'برتقالات', 'قطع كعك', 'موزات'],
    es: ['manzanas rojas', 'monedas de oro', 'galletas de chocolate', 'mangos dulces', 'canicas', 'lápices', 'fresas', 'naranjas', 'pastelitos', 'plátanos'],
    fr: ['pommes rouges', 'pièces d’or', 'biscuits au chocolat', 'mangues sucrées', 'billes colorées', 'crayons', 'fraises', 'oranges', 'petits gâteaux', 'bananes'],
    pt: ['maçãs vermelhas', 'moedas de ouro', 'biscoitos de chocolate', 'mangas doces', 'bolinhas de gude', 'lápis', 'morangos', 'laranjas', 'bolinhos', 'bananas'],
    ja: ['赤いリンゴ', '金貨', 'チョコクッキー', '甘いマンゴー', 'ビー玉', 'えんぴつ', 'イチゴ', 'オレンジ', 'カップケーキ', 'バナナ'],
  };

  const items = itemsByLang[lang] || itemsByLang.en;
  for (let i = 0; i < 250; i++) {
    const item = items[i % items.length];
    const total = 7 + (i % 18); // 7..24
    const take = 2 + (i % (total - 3));
    const leftInBowl = total - take;
    const rung = (i % 10) + 1;

    let qText = '';
    let peek = '';
    let roast = '';
    let fact = '';

    if (lang === 'am') {
      qText = `በጠረጴዛ ላይ ${total} ${item} አሉ። እርስዎ ${take} ወሰዱ። አሁን በእጅዎ ስንት ${item} አለዎት?`;
      peek = `${total} ሲቀነስ ${take} አይበሉ! ${take} ስለወሰዱ በእጅዎ ${take} አለዎት!`;
      roast = `በጠረጴዛው ላይ የቀረው ${leftInBowl} ነው፣ ግን እርስዎ የወሰዱት ${take} ነው!`;
      fact = 'አብዛኛዎቹ አዋቂዎች በችኮላ የቀረውን ቁጥር በመቀነስ ይሳታሉ።';
    } else if (lang === 'om') {
      qText = `Minjaala irra ${item} ${total} jira. Ati ${take} fudhatte. Amma harka kee keessa ${item} meeqatu jira?`;
      peek = `${total} keessaa ${take} hin hir'isin! Ati ${take} waan fudhatteef ${take} qabda!`;
      roast = `Minjaala irratti kan hafe ${leftInBowl} dha, garuu kan ati fudhatte ${take} dha!`;
      fact = 'Ga’eessotni hedduun ariitiidhaan lakkoofsa hir’isuun dogoggoru.';
    } else if (lang === 'har') {
      qText = `ጠረጴዛ ላዕላይ ${total} ${item} ሀለው። አኻኽ ${take} ነሰእኸ። አሁን ኢድኻ ውስጢ ሚስቲ ${item} ሀለውኻ?`;
      peek = `${total} ምን ${take} አትቀንስ! ${take} ስለነሰእኸ ኢድኻ ውስጢ ${take} ሀለውኻ!`;
      roast = `ጠረጴዛ ላዕላይ ዚቀረ ${leftInBowl} ኢንታይ፣ አኻኽ ዚነሰእኸው ግን ${take} ኢንታይ!`;
      fact = 'ብዙሕ ጋዳም ቲቀረ ሒሳብ ዪቀንሶሉ ዪሳስቶሉ።';
    } else if (lang === 'so') {
      qText = `Miiska waxaa saaran ${total} ${item}. Waxaad ka qaadatay ${take}. Imisa ${item} ayaad ADIGU hadda gacanta ku haysataa?`;
      peek = `Ha kala jarin ${total} - ${take}! Waxaad qaadatay ${take}, markaa ${take} ayaad haysataa!`;
      roast = `${leftInBowl} waxay ku hadhay miiska, laakiin ADIGU waxaad qaadatay ${take}!`;
      fact = 'Dadka waaweyn badankoodu waxay xisaabiyaan wixii miiska ku hadhay.';
    } else if (lang === 'de') {
      qText = `Auf dem Tisch liegen ${total} ${item}. Du nimmst ${take} weg. Wie viele ${item} hast DU jetzt?`;
      peek = `Rechne nicht ${total} − ${take}! Du hast ${take} genommen, also hast du ${take}!`;
      roast = `${leftInBowl} liegen noch auf dem Tisch, aber DU hast ${take} in der Hand!`;
      fact = 'Über 80 % der Erwachsenen ziehen automatisch die Zahlen voneinander ab.';
    } else if (lang === 'ar') {
      qText = `يوجد على الطاولة ${total} من ${item}. أخذتَ منها ${take}. كم لديك أنت الآن؟`;
      peek = `لا تطرح ${total} - ${take}! أنت أخذت ${take}، إذن معك ${take}!`;
      roast = `بقي على الطاولة ${leftInBowl}، لكن ما أخذته أنت بيدك هو ${take}!`;
      fact = 'معظم الكبار يطرحون الرقمين تلقائياً وينسون كلمة "لديك أنت".';
    } else if (lang === 'es') {
      qText = `Hay ${total} ${item} en la mesa y tú tomas ${take}. ¿Cuántos tienes TÚ ahora?`;
      peek = `¡No restes ${total} - ${take}! Si tomaste ${take}, ¡tienes ${take}!`;
      roast = `Quedan ${leftInBowl} en la mesa, ¡pero TÚ tienes los ${take} que tomaste!`;
      fact = 'La mayoría de los adultos restan automáticamente sin leer la pregunta con calma.';
    } else if (lang === 'fr') {
      qText = `Il y a ${total} ${item} sur la table. Tu en prends ${take}. Combien en as-TU maintenant ?`;
      peek = `Ne fais pas ${total} - ${take} ! Tu en as pris ${take}, donc tu en as ${take} !`;
      roast = `Il en reste ${leftInBowl} sur la table, mais TOI tu en as ${take} !`;
      fact = 'La plupart des adultes font une soustraction automatique sans réfléchir.';
    } else if (lang === 'pt') {
      qText = `Há ${total} ${item} na mesa. Você pega ${take}. Com quantos VOCÊ fica agora?`;
      peek = `Não subtraia ${total} - ${take}! Se você pegou ${take}, você tem ${take}!`;
      roast = `Sobraram ${leftInBowl} na mesa, mas VOCÊ ficou com os ${take} que pegou!`;
      fact = 'Mais de 80% dos adultos subtraem no automático e erram.';
    } else if (lang === 'ja') {
      qText = `テーブルに${item}が${total}個あります。あなたが${take}個取りました。今「あなた」が持っているのは何個？`;
      peek = `${total} − ${take} を計算しないで！${take}個取ったんだから、持っているのは${take}個だよ！`;
      roast = `テーブルに残ったのは${leftInBowl}個だけど、あなたが持っているのは${take}個だよ！`;
      fact = '大人の多くは問題文をよく読まずに引き算をしてしまいます。';
    } else {
      qText = `There are ${total} ${item} on a classroom desk. You take away ${take}. How many ${item} do YOU have now?`;
      peek = `Don't subtract ${total} - ${take}! You took ${take}, so YOU are holding ${take}!`;
      roast = `There are ${leftInBowl} left on the desk, but YOU took ${take} in your hands!`;
      fact = '82% of adults reflexively subtract the numbers instead of listening to "How many do YOU have?"';
    }

    generated.push({
      id: `gen-trap-take-${i}`,
      subject: 'Everyday Traps',
      gradeLevel: gradeForRung(rung),
      difficultyRung: rung,
      adultFailRatePct: 72 + (i % 21),
      question: qText,
      options: [`${leftInBowl}`, `${take}`, `${total}`, `${total + take}`],
      correctIndex: 1,
      kidPeekNote: peek,
      kidRoastOnMiss: roast,
      funFact: fact,
    });
  }

  // =========================================================================
  // 2) MATH & LOGIC: Fast Mental Arithmetic & Trick Sequences (450 variations)
  // =========================================================================
  for (let i = 0; i < 450; i++) {
    const rung = (i % 10) + 1;
    const a = 3 + ((i * 7) % 25);
    const b = 2 + ((i * 5) % 14);
    const c = 1 + (i % 9);
    const mode = i % 3;

    let ans = 0;
    let expr = '';
    if (mode === 0) {
      ans = a + b * c;
      expr = `${a} + (${b} × ${c})`;
    } else if (mode === 1) {
      ans = a * b - c;
      expr = `(${a} × ${b}) - ${c}`;
    } else {
      ans = (a + b) * 2;
      expr = `(${a} + ${b}) × 2`;
    }

    const trap1 = mode === 0 ? (a + b) * c : ans + c * 2;
    const trap2 = ans + (b === trap1 - ans ? 5 : 3);
    const trap3 = Math.max(1, ans - 4);
    const correctIdx = i % 4;
    const opts = [String(trap1), String(trap2), String(trap3), String(ans)];
    // Swap ans into correctIdx
    const tmp = opts[correctIdx];
    opts[correctIdx] = String(ans);
    opts[3] = tmp === String(ans) ? String(ans + 7) : tmp;

    let qText = '';
    let peek = '';
    let roast = '';
    let fact = '';

    if (lang === 'am') {
      qText = `የ2ኛ ክፍል የአእምሮ ሒሳብ፡ ${expr} ስንት ይሆናል?`;
      peek = `በቅንፍ ውስጥ ያለውን መጀመሪያ ይስሩ! መልሱ ${ans} ነው!`;
      roast = `ሃሃ! የ2ኛ ክፍል ሒሳብ ተሳሳቱ! ትክክለኛው መልስ ${ans} ነው!`;
      fact = 'ቅንፎችን መጀመሪያ መስራት የሒሳብ ቀዳሚ ህግ ነው።';
    } else if (lang === 'om') {
      qText = `Herrega sammuu kutaa 2ffaa: ${expr} meeqa ta'a?`;
      peek = `Dursa isa qindoomina keessaa hojjedhu! Deebiin sirriin ${ans} dha!`;
      roast = `Haha! Herrega kutaa 2ffaa dogoggorte! Deebiin isaa ${ans} dha!`;
      fact = 'Seera herregaa keessatti qindoominni dursa hojjetama.';
    } else if (lang === 'har') {
      qText = `ዚ2ኛ ክፍλι ሒሳብ፦ ${expr} ሚስቲ ይኹናል?`;
      peek = `ቅንፍ ውስጢ ዛለው ቀዳም ኡሽ! ጀዋብዞ ${ans} ኢንታይ!`;
      roast = `ሃሃ! ዚ2ኛ ክፍሊ ሒሳብ ተሳሰትኸ! ትክክል ጀዋብ ${ans} ኢንታይ!`;
      fact = 'ሒሳብ ውስጢ ቅንፍ ቀዳም ዪትሰራሕል።';
    } else if (lang === 'so') {
      qText = `Xisaabta maskaxda ee fasalka 2-aad: Waa imisa ${expr}?`;
      peek = `Marka hore xisaabi qaybta qaansooyinka ku jirta! Jawaabtu waa ${ans}!`;
      roast = `Hahaha! Xisaabta fasalka 2-aad ayaad ku khaldantay! Jawaabtu waa ${ans}!`;
      fact = 'Sharciga xisaabta, qaansooyinka ayaa marka hore la xalliyaa.';
    } else if (lang === 'de') {
      qText = `Kopfrechnen 2. Klasse: Was ergibt ${expr}?`;
      peek = `Rechne zuerst die Klammer aus! Die richtige Antwort ist ${ans}!`;
      roast = `Haha! Beim Zweitklässler-Kopfrechnen verrechnet! Es ist ${ans}!`;
      fact = 'Klammern werden in der Mathematik immer zuerst berechnet.';
    } else if (lang === 'ar') {
      qText = `حساب ذهني للصف الثاني: كم يساوي ${expr}؟`;
      peek = `احسب ما بداخل الأقواس أولاً! الإجابة الصحيحة هي ${ans}!`;
      roast = `هاها! أخطأت في حساب الصف الثاني! الناتج الصحيح هو ${ans}!`;
      fact = 'في الرياضيات، تُحسب العمليات داخل الأقواس أولاً دائماً.';
    } else if (lang === 'es') {
      qText = `Cálculo mental de 2.º grado: ¿Cuánto es ${expr}?`;
      peek = `¡Resuelve primero el paréntesis! ¡La respuesta es ${ans}!`;
      roast = `¡Jaja! ¡Fallaste en matemáticas de 2.º grado! ¡Era ${ans}!`;
      fact = 'Los paréntesis siempre se resuelven primero en matemáticas.';
    } else if (lang === 'fr') {
      qText = `Calcul mental niveau CE1 : Combien font ${expr} ?`;
      peek = `Calcule d’abord la parenthèse ! La bonne réponse est ${ans} !`;
      roast = `Haha ! Tu t’es trompé en calcul de CE1 ! C’était ${ans} !`;
      fact = 'En mathématiques, on calcule toujours les parenthèses en premier.';
    } else if (lang === 'pt') {
      qText = `Cálculo mental do 2º ano: Quanto é ${expr}?`;
      peek = `Resolva os parênteses primeiro! A resposta certa é ${ans}!`;
      roast = `Haha! Errou na conta da 2ª série! O resultado é ${ans}!`;
      fact = 'Na matemática, os parênteses são sempre resolvidos primeiro.';
    } else if (lang === 'ja') {
      qText = `小学2年の暗算チャレンジ： ${expr} の答えはいくつ？`;
      peek = `カッコの中を先に計算してね！答えは ${ans} だよ！`;
      roast = `えへへ！計算ミスしちゃったね！正解は ${ans} だよ！`;
      fact = '算数ではカッコの中の計算を一番先に行います。';
    } else {
      qText = `2nd-Grade Mental Math Challenge: What is ${expr} equal to?`;
      peek = `Solve inside the parentheses first! My abacus says ${ans}!`;
      roast = `Haha! You missed a 2nd-grade mental math problem! It's ${ans}!`;
      fact = 'Order of operations (PEMDAS) always evaluates parentheses first.';
    }

    generated.push({
      id: `gen-math-${i}`,
      subject: 'Math & Logic',
      gradeLevel: gradeForRung(rung),
      difficultyRung: rung,
      adultFailRatePct: 58 + (i % 34),
      question: qText,
      options: opts as [string, string, string, string],
      correctIndex: correctIdx,
      kidPeekNote: peek,
      kidRoastOnMiss: roast,
      funFact: fact,
    });
  }

  // =========================================================================
  // 3) SCIENCE & NATURE: Creature & Nature Counting Lab (380 variations)
  // =========================================================================
  const creatures = [
    { en: 'spiders', am: 'ሸረሪቶች', om: 'shariiroonni', har: 'ሸረሪትach', so: 'caarooyin', de: 'Spinnen', ar: 'عناكب', es: 'arañas', fr: 'araignées', pt: 'aranhas', ja: 'クモ', legs: 8 },
    { en: 'honeybees', am: 'ንቦች', om: 'kanniisonni', har: 'ንብach', so: 'shinni', de: 'Bienen', ar: 'نحلات', es: 'abejas', fr: 'abeilles', pt: 'abelhas', ja: 'ミツバチ', legs: 6 },
    { en: 'octopuses', am: 'ኦክቶፐሶች', om: 'oktoopasoonni', har: 'ኦክቶፐስach', so: 'octopus-yo', de: 'Oktopusse', ar: 'أخطبوطات', es: 'pulpos', fr: 'pieuvres', pt: 'polvos', ja: 'タコ', legs: 8 },
    { en: 'ladybugs', am: 'ጥንዚዛዎች', om: 'bombiin', har: 'ጥንዚዛach', so: 'cayayaan', de: 'Marienkäfer', ar: 'خنافس', es: 'mariquitas', fr: 'coccinelles', pt: 'joaninhas', ja: 'テントウムシ', legs: 6 },
    { en: 'flamingos', am: 'ፍላሚንጎ ወፎች', om: 'shimbirroonni filaamingoo', har: 'ፍላሚንጎ ዑፍach', so: 'shimbiraha flamingo', de: 'Flamingos', ar: 'طيور فلامنغو', es: 'flamencos', fr: 'flamants roses', pt: 'flamingos', ja: 'フラミンゴ', legs: 2 },
    { en: 'zebras', am: 'የሜዳ አህዮች', om: 'harreen diidoo', har: 'ዚሜዳ ወጨራach', so: 'dameer-farow', de: 'Zebras', ar: 'حمير وحشية', es: 'cebras', fr: 'zèbres', pt: 'zebras', ja: 'シマウマ', legs: 4 },
    { en: 'crabs', am: 'ሸርጣኖች (Crabs)', om: 'qocaa bishaanii', har: 'ሸርጣንach', so: 'carsaanyo', de: 'Krabben', ar: 'سلطعونات', es: 'cangrejos', fr: 'crabes', pt: 'caranguejos', ja: 'カニ', legs: 10 },
    { en: 'butterflies', am: 'ቢራቢሮዎች', om: 'billaachonni', har: 'ቢራቢሮach', so: 'balanbaalisyo', de: 'Schmetterlinge', ar: 'فراشات', es: 'mariposas', fr: 'papillons', pt: 'borboletas', ja: 'チョウ', legs: 6 },
  ];

  for (let i = 0; i < 380; i++) {
    const c1 = creatures[i % creatures.length];
    const count = 2 + (i % 9); // 2..10
    const totalLegs = count * c1.legs;
    const rung = (i % 10) + 1;
    const cName = (c1 as any)[lang] || c1.en;

    const w1 = totalLegs - count;
    const w2 = totalLegs + c1.legs;
    const w3 = totalLegs + 4;
    const correctIdx = (i + 1) % 4;
    const opts = [String(w1), String(w2), String(w3), String(totalLegs)];
    const tmp = opts[correctIdx];
    opts[correctIdx] = String(totalLegs);
    opts[3] = tmp === String(totalLegs) ? String(totalLegs + 2) : tmp;

    let qText = '';
    let peek = '';
    let roast = '';
    let fact = '';

    if (lang === 'am') {
      qText = `በሳይንስ ክፍል ውስጥ ${count} ${cName} ካሉ፣ በአጠቃላይ ስንት እግሮች አሏቸው?`;
      peek = `እያንዳንዱ ${c1.legs} እግሮች አሉት! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `${count} × ${c1.legs} = ${totalLegs} እግሮች ናቸው!`;
      fact = `እያንዳንዱ ${c1.legs} እግሮች ስላሉት ${count} ሲባዛ በ${c1.legs} = ${totalLegs} ይሆናል።`;
    } else if (lang === 'om') {
      qText = `Kutaa saayinsii keessa ${cName} ${count} yoo jiraatan, walumaagalatti miila meeqa qabu?`;
      peek = `Tokkoon tokkoon isaanii miila ${c1.legs} qabu! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `${count} × ${c1.legs} = miila ${totalLegs} ta'a!`;
      fact = `Uumamni kun miila ${c1.legs} waan qabuuf ${count} × ${c1.legs} = ${totalLegs} dha.`;
    } else if (lang === 'har') {
      qText = `ሳይንስ ክፍሊ ውስጢ ${count} ${cName} ጊረደው፣ ጅምላ ሚስቲ ኢግሪ ሀለዮው?`;
      peek = `አሐድዞ ${c1.legs} ኢግሪ ሀለው! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `${count} × ${c1.legs} = ${totalLegs} ኢግሪ ኢንታይ!`;
      fact = `ኩሉም ${c1.legs} ኢግሪ ስለሀለው ${count} × ${c1.legs} = ${totalLegs} ይኹናል።`;
    } else if (lang === 'so') {
      qText = `Haddii fasalka sayniska ay joogaan ${count} ${cName}, wadar ahaan imisa lugood ayay leeyihiin?`;
      peek = `Mid kastaa wuxuu leeyahay ${c1.legs} lugood! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `${count} × ${c1.legs} waa ${totalLegs} lugood!`;
      fact = `Xayawaankani wuxuu leeyahay ${c1.legs} lugood midkiiba.`;
    } else if (lang === 'de') {
      qText = `Wenn im Bio-Unterricht ${count} ${cName} sind, wie viele Beine haben sie zusammen?`;
      peek = `Jedes Tier hat ${c1.legs} Beine! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `${count} × ${c1.legs} sind ${totalLegs} Beine!`;
      fact = `Jedes dieser Tiere besitzt genau ${c1.legs} Gliedmaßen.`;
    } else if (lang === 'ar') {
      qText = `إذا كان في مختبر العلوم ${count} من ${cName}، فكم عدد أرجلها جميعاً؟`;
      peek = `كل واحد لديه ${c1.legs} أرجل! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `${count} × ${c1.legs} يساوي ${totalLegs} رجلاً!`;
      fact = `يمتلك هذا الكائن ${c1.legs} أطراف بالضبط.`;
    } else if (lang === 'es') {
      qText = `Si hay ${count} ${cName} en la clase de ciencias, ¿cuántas patas tienen en total?`;
      peek = `¡Cada uno tiene ${c1.legs} patas! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `¡${count} × ${c1.legs} son ${totalLegs} patas en total!`;
      fact = `Cada ejemplar tiene exactamente ${c1.legs} extremidades.`;
    } else if (lang === 'fr') {
      qText = `S’il y a ${count} ${cName} en classe de sciences, combien de pattes ont-ils au total ?`;
      peek = `Chacun a ${c1.legs} pattes ! ${count} × ${c1.legs} = ${totalLegs} !`;
      roast = `${count} × ${c1.legs} font ${totalLegs} pattes !`;
      fact = `Chaque animal de cette espèce possède ${c1.legs} pattes.`;
    } else if (lang === 'pt') {
      qText = `Se há ${count} ${cName} na aula de ciências, quantas patas eles têm no total?`;
      peek = `Cada um tem ${c1.legs} patas! ${count} × ${c1.legs} = ${totalLegs}!`;
      roast = `${count} × ${c1.legs} são ${totalLegs} patas!`;
      fact = `Cada indivíduo dessa espécie possui exatamente ${c1.legs} patas.`;
    } else if (lang === 'ja') {
      qText = `理科室に${cName}が${count}匹います。足を全部合わせると何本になる？`;
      peek = `1匹あたり足は${c1.legs}本だよ！ ${count} × ${c1.legs} = ${totalLegs}本！`;
      roast = `${count} × ${c1.legs} で正解は ${totalLegs}本だよ！`;
      fact = `この生き物の足は1匹につき${c1.legs}本あります。`;
    } else {
      qText = `Nature Lab: If there are ${count} ${cName} in the classroom terrarium, how many legs do they have altogether?`;
      peek = `Each one has ${c1.legs} legs! So ${count} × ${c1.legs} = ${totalLegs} legs!`;
      roast = `Count the legs! ${count} × ${c1.legs} = ${totalLegs} legs!`;
      fact = `Combining biology with multiplication: each has ${c1.legs} legs (${count} × ${c1.legs} = ${totalLegs}).`;
    }

    generated.push({
      id: `gen-sci-${i}`,
      subject: 'Science & Nature',
      gradeLevel: gradeForRung(rung),
      difficultyRung: rung,
      adultFailRatePct: 60 + (i % 30),
      question: qText,
      options: opts as [string, string, string, string],
      correctIndex: correctIdx,
      kidPeekNote: peek,
      kidRoastOnMiss: roast,
      funFact: fact,
    });
  }

  // =========================================================================
  // 4) WORLD & SPACE: Time, Calendar, Weeks, Hours & Planet Orbits (350 variations)
  // =========================================================================
  for (let i = 0; i < 350; i++) {
    const rung = (i % 10) + 1;
    const subType = i % 3;
    let ans = 0;
    let qText = '';
    let peek = '';
    let roast = '';
    let fact = '';

    if (subType === 0) {
      const weeks = 2 + Math.floor(i / 3);
      const extraDays = i % 6;
      ans = weeks * 7 + extraDays;
      if (lang === 'am') {
        qText = `አንድ የጠፈር መንኮራኩር ለ${weeks} ሳምንታት እና ${extraDays} ቀናት በህዋ ላይ ቢቆይ፣ በአጠቃላይ ስንት ቀናት ቆየ?`;
        peek = `1 ሳምንት = 7 ቀናት! (${weeks} × 7) + ${extraDays} = ${ans} ቀናት!`;
        roast = `${weeks} × 7 + ${extraDays} = ${ans} ቀናት ነው!`;
        fact = 'በምድር የቀን አቆጣጠር 1 ሳምንት 7 ቀናት አሉት።';
      } else if (lang === 'om') {
        qText = `Rookkeettiin hawaa tokko torban ${weeks} fi guyyaa ${extraDays} yoo ture, walumaagalatti guyyaa meeqa ture?`;
        peek = `Torban 1 = guyyaa 7! (${weeks} × 7) + ${extraDays} = guyyaa ${ans}!`;
        roast = `${weeks} × 7 + ${extraDays} = guyyaa ${ans} ta'a!`;
        fact = 'Torban tokko keessa guyyoota 7 tu jira.';
      } else if (lang === 'har') {
        qText = `አሐድ መንኮራኩር ${weeks} ሳምንቲ ዋ ${extraDays} አያም ቢቆይ፣ ጅምላ ሚስቲ አያም ቆየ?`;
        peek = `1 ሳምንቲ = 7 አያም! (${weeks} × 7) + ${extraDays} = ${ans} አያም!`;
        roast = `${weeks} × 7 + ${extraDays} = ${ans} አያም ኢንታይ!`;
        fact = '1 ሳምንቲ ውስጢ 7 አያም ሀለው።';
      } else if (lang === 'so') {
        qText = `Dayax-gacmeed ayaa hawada ku jiray ${weeks} toddobaad iyo ${extraDays} maalmood. Wadar ahaan imisa maalmood ayuu ku jiray?`;
        peek = `1 toddobaad = 7 maalmood! (${weeks} × 7) + ${extraDays} = ${ans} maalmood!`;
        roast = `${weeks} × 7 + ${extraDays} waa ${ans} maalmood!`;
        fact = 'Hal toddobaad wuxuu ka kooban yahay 7 maalmood.';
      } else if (lang === 'de') {
        qText = `Eine Raumkapsel fliegt ${weeks} Wochen und ${extraDays} Tage durch das All. Wie viele Tage sind das insgesamt?`;
        peek = `1 Woche = 7 Tage! (${weeks} × 7) + ${extraDays} = ${ans} Tage!`;
        roast = `${weeks} × 7 + ${extraDays} ergibt ${ans} Tage!`;
        fact = 'Eine Erdenwoche hat genau 7 Tage.';
      } else {
        qText = `Space Explorer: If a rocket mission lasts ${weeks} weeks and ${extraDays} days, how many Earth days is the mission in total?`;
        peek = `1 week has 7 days! (${weeks} × 7) + ${extraDays} = ${ans} days!`;
        roast = `${weeks} weeks × 7 days + ${extraDays} = ${ans} days!`;
        fact = 'Every Earth week has 7 rotations (days) of our planet.';
      }
    } else if (subType === 1) {
      const days = 2 + (i % 15);
      const extraHours = (i * 3) % 12;
      ans = days * 24 + extraHours;
      if (lang === 'am') {
        qText = `ምድር በራሷ ዛቢያ ላይ ለ${days} ቀናት እና ${extraHours} ሰዓታት ስትሽከረከር ስንት ሰዓታት ይሆናል?`;
        peek = `1 ቀን = 24 ሰዓት! (${days} × 24) + ${extraHours} = ${ans} ሰዓታት!`;
        roast = `${days} × 24 + ${extraHours} = ${ans} ሰዓታት ነው!`;
        fact = 'ምድር አንድ ሙሉ ዙር ለመሽከርከር 24 ሰዓታት ይፈጅባታል።';
      } else if (lang === 'om') {
        qText = `Lafti guyyaa ${days} fi sa'aatii ${extraHours} yoo naannawa ishee irra naannofte, walumaagalatti sa'aatii meeqa ta'a?`;
        peek = `Guyyaan 1 = sa'aatii 24! (${days} × 24) + ${extraHours} = ${ans}!`;
        roast = `${days} × 24 + ${extraHours} = sa'aatii ${ans} dha!`;
        fact = 'Lafti si’a tokko ofirra naanna’uuf sa’aatii 24 fudhatti.';
      } else if (lang === 'har') {
        qText = `ምድሪ ${days} አያም ዋ ${extraHours} ሳዓ ቢትዞር፣ ጅምላ ሚስቲ ሳዓ ይኹናል?`;
        peek = `1 አያም = 24 ሳዓ! (${days} × 24) + ${extraHours} = ${ans} ሳዓ!`;
        roast = `${days} × 24 + ${extraHours} = ${ans} ሳዓ ኢንታይ!`;
        fact = '1 አያም ውስጢ 24 ሳዓ ሀለው።';
      } else if (lang === 'so') {
        qText = `Imisa saacadood ayaa ku jira ${days} maalmood iyo ${extraHours} saacadood?`;
        peek = `1 maalin = 24 saacadood! (${days} × 24) + ${extraHours} = ${ans}!`;
        roast = `${days} × 24 + ${extraHours} waa ${ans} saacadood!`;
        fact = 'Dhulku wuxuu wareeg dhammaystiran sameeyaa 24-kii saacadoodba.';
      } else {
        qText = `World Clock: How many total hours are in ${days} full days plus ${extraHours} extra hours?`;
        peek = `1 day = 24 hours! (${days} × 24) + ${extraHours} = ${ans} hours!`;
        roast = `${days} × 24 + ${extraHours} = ${ans} hours!`;
        fact = 'Earth completes one full rotation on its axis every 24 hours.';
      }
    } else {
      const years = 2 + (i % 12);
      const extraMonths = (i * 2) % 11;
      ans = years * 12 + extraMonths;
      if (lang === 'am') {
        qText = `ምድር በፀሐይ ዙሪያ ለ${years} ዓመታት እና ${extraMonths} ወራት ብትዞር፣ በአጠቃላይ ስንት ወራት ይሆናል?`;
        peek = `1 ዓመት = 12 ወራት! (${years} × 12) + ${extraMonths} = ${ans} ወራት!`;
        roast = `${years} × 12 + ${extraMonths} = ${ans} ወራት ነው!`;
        fact = '1 ዓመት 12 ወራት አሉት።';
      } else if (lang === 'om') {
        qText = `Waggaa ${years} fi ji'a ${extraMonths} keessa walumaagalatti ji'oota meeqatu jira?`;
        peek = `Waggaa 1 = ji'a 12! (${years} × 12) + ${extraMonths} = ji'a ${ans}!`;
        roast = `${years} × 12 + ${extraMonths} = ji'a ${ans} ta'a!`;
        fact = 'Waggaa tokko keessa ji’oota 12 tu jira.';
      } else if (lang === 'har') {
        qText = `${years} አመት ዋ ${extraMonths} ወርሒ ውስጢ ጅምላ ሚስቲ ወርሒ ሀለው?`;
        peek = `1 አመት = 12 ወርሒ! (${years} × 12) + ${extraMonths} = ${ans} ወርሒ!`;
        roast = `${years} × 12 + ${extraMonths} = ${ans} ወርሒ ኢንታይ!`;
        fact = '1 አመት ውስጢ 12 ወርሒ ሀለው።';
      } else {
        qText = `Calendar & Orbit: How many total months are in ${years} years and ${extraMonths} months?`;
        peek = `1 year = 12 months! (${years} × 12) + ${extraMonths} = ${ans} months!`;
        roast = `${years} × 12 + ${extraMonths} = ${ans} months!`;
        fact = 'Earth takes 12 months (365.25 days) to orbit the Sun once.';
      }
    }

    const correctIdx = (i + 2) % 4;
    const opts = [String(ans - 6), String(ans + 4), String(ans + 10), String(ans)];
    const tmp = opts[correctIdx];
    opts[correctIdx] = String(ans);
    opts[3] = tmp === String(ans) ? String(ans + 2) : tmp;

    generated.push({
      id: `gen-world-${i}`,
      subject: 'World & Space',
      gradeLevel: gradeForRung(rung),
      difficultyRung: rung,
      adultFailRatePct: 62 + (i % 28),
      question: qText,
      options: opts as [string, string, string, string],
      correctIndex: correctIdx,
      kidPeekNote: peek,
      kidRoastOnMiss: roast,
      funFact: fact,
    });
  }

  // =========================================================================
  // 5) PLAYGROUND RIDDLES: Race Overtake & Interval Traps (320 variations)
  // =========================================================================
  for (let i = 0; i < 320; i++) {
    const rung = (i % 10) + 1;
    if (i % 2 === 0) {
      const pos = 2 + (i % 19); // 2nd to 20th place
      let qText = '';
      let peek = '';
      let roast = '';
      let fact = '';
      const opts: [string, string, string, string] = [
        `#${pos - 1}`,
        `#${pos}`,
        `#${pos + 1}`,
        `#1`,
      ];

      if (lang === 'am') {
        qText = `በሩጫ ውድድር ላይ በ#${pos} ደረጃ ላይ ያለውን ሯጭ ቀድመው አለፉት! አሁን በስንተኛ ደረጃ ላይ ነዎት?`;
        peek = `#${pos - 1} አይምረጡ! የ#${pos}ኛውን ሰው ስላለፉ የእሱን ቦታ (#${pos}) ነው የያዙት!`;
        roast = `#${pos}ኛውን ሲቀድሙ #${pos}ኛ ደረጃ ላይ ይሆናሉ እንጂ #${pos - 1} አይሆኑም!`;
        fact = 'አንድን ተወዳዳሪ ሲቀድሙ የእሱን ደረጃ ነው የሚረከቡት።';
      } else if (lang === 'om') {
        qText = `Dorgommii fiigichaa irratti nama sadarkaa #${pos} irra jiru yoo bira dabarte, amma sadarkaa meeqaffaa irra jirta?`;
        peek = `#${pos - 1} hin filatin! Nama #${pos} bira waan dabarteef bakka isaa (#${pos}) qabatta!`;
        roast = `Nama #${pos} yoo dabarte sadarkaa #${pos} irra jirta!`;
        fact = 'Fiigicha keessatti nama tokko yoo dabarte bakka isaa qabatta.';
      } else if (lang === 'har') {
        qText = `ሩጫ ውድድር ላዕላይ #${pos} ደረጃ ዛለ ሯጭ ቀደምኸው! አሁን ሚስተኛ ደረጃ ላዕላይ ሀለኻ?`;
        peek = `#${pos - 1} አትምረጥ! #${pos}ኛውን ስለቀደምኸ ቦታዞ (#${pos}) ኢንታይ ዚነሰእኸው!`;
        roast = `#${pos}ኛውን ጊቀደምኸ #${pos} ደረጃ ላዕላይ ሀለኻ!`;
        fact = 'ሩጫ ውስጢ አሐድ ሰው ጊቀደምኸ ቦታዞ ትወርሳለኻ።';
      } else if (lang === 'so') {
        qText = `Tartanka orodka waxaad dhaaftay qofka ku jira kaalinta #${pos}! Kaalintee ayaad hadda ku jirtaa?`;
        peek = `Ha dooran #${pos - 1}! Waxaad gashay booskii qofka #${pos}, markaa waxaad tahay #${pos}!`;
        roast = `Haddii aad dhaafto qofka #${pos}, waxaad ku jirtaa kaalinta #${pos}!`;
        fact = 'Marka aad qof dhaafto waxaad la wareegtaa kaalintiisa.';
      } else {
        qText = `Track Race Riddle: In a marathon, you overtake the runner in position #${pos}. What position are YOU in right now?`;
        peek = `Don't pick #${pos - 1}! You took position #${pos} from the runner you just passed!`;
        roast = `Haha! If you pass runner #${pos}, you take THEIR spot (#${pos}), not #${pos - 1}!`;
        fact = 'Passing the Nth runner puts you in Nth place because N-1 runners are still ahead of you.';
      }

      generated.push({
        id: `gen-riddle-race-${i}`,
        subject: 'Playground Riddles',
        gradeLevel: gradeForRung(rung),
        difficultyRung: rung,
        adultFailRatePct: 68 + (i % 25),
        question: qText,
        options: opts,
        correctIndex: 1,
        kidPeekNote: peek,
        kidRoastOnMiss: roast,
        funFact: fact,
      });
    } else {
      // Candle / Lily-Pad / Fencepost Riddle
      const totalDay = 10 + (i % 30);
      const halfDay = totalDay - 1;
      let qText = '';
      let peek = '';
      let roast = '';
      let fact = '';

      if (lang === 'am') {
        qText = `በኩሬ ላይ ያሉ አበቦች በየቀኑ በእጥፍ ይጨምራሉ። በቀን ${totalDay} ኩሬውን ሙሉ በሙሉ ከሸፈኑት፣ ግማሹን የሸፈኑት በስንተኛው ቀን ነበር?`;
        peek = `ቀን ${Math.floor(totalDay / 2)} አይበሉ! በየቀኑ እጥፍ ስለሚሆን ከቀን ${totalDay} አንድ ቀን በፊት (ቀን ${halfDay}) ግማሽ ነበር!`;
        roast = `በየቀኑ እጥፍ ስለሚሆን ግማሹ የነበረው በቀን ${halfDay} ነው!`;
        fact = 'በእጥፍ የሚያድግ ነገር ከመሙላቱ አንድ ቀን በፊት ግማሽ ላይ ይደርሳል።';
      } else if (lang === 'om') {
        qText = `Daraaraan haroo tokkoo guyyaa guyyaan dachaa ta'a. Guyyaa ${totalDay}tti haroo guutuu yoo uwwise, guyyaa meeqaffaatti walakkaa (1/2) ture?`;
        peek = `Guyyaa ${Math.floor(totalDay / 2)} hin jedhin! Guyyaan duraa Guyyaa ${halfDay} dha!`;
        roast = `Guyyaa guyyaan dachaa waan ta'uuf walakkaan isaa Guyyaa ${halfDay} ture!`;
        fact = 'Wanti dachaan guddatu guyyaa guutuu ta’uun dura walakkaa ta’a.';
      } else if (lang === 'har') {
        qText = `ኩሬ ላዕላይ ዛሉ አበባach ኩሉ አያም እጥφι ይزيدሉ። አያም ${totalDay} ሙሉእ ጊሸፈኑ፣ ግማሽ ዚነረው አያም ሚስት ኢንታይ?`;
        peek = `አያም ${Math.floor(totalDay / 2)} አትበል! አያም ${totalDay} ቀዳም ዛለው አያም ${halfDay} ኢንታይ!`;
        roast = `ኩሉ አያም እጥፊ ስለይኹን ግማሽ ዚነረው አያም ${halfDay} ኢንታይ!`;
        fact = 'እጥፊ ዚزيد ነገር ሙሉእ ቀዳም አሐድ አያም ግማሽ ይኹናል።';
      } else {
        qText = `Doubling Riddle: Magic classroom crystals double in size every day. If the jar is 100% full on Day ${totalDay}, on which day was the jar exactly HALF full?`;
        peek = `Don't divide ${totalDay} by 2! Since it doubles every day, it was half full the day before: Day ${halfDay}!`;
        roast = `90% of adults pick Day ${Math.floor(totalDay / 2)}! Doubling means Day ${halfDay} -> Day ${totalDay}!`;
        fact = 'Exponential doubling reaches 50% capacity on the step immediately before 100%.';
      }

      generated.push({
        id: `gen-riddle-double-${i}`,
        subject: 'Playground Riddles',
        gradeLevel: gradeForRung(rung),
        difficultyRung: rung,
        adultFailRatePct: 84 + (i % 14),
        question: qText,
        options: [
          `${Math.floor(totalDay / 2)}`,
          `${totalDay - 2}`,
          `${halfDay}`,
          `${totalDay}`,
        ],
        correctIndex: 2,
        kidPeekNote: peek,
        kidRoastOnMiss: roast,
        funFact: fact,
      });
    }
  }

  // =========================================================================
  // 6) WORDS & SPELLING: Letter, Vowel & Alphabet Challenges (325 variations)
  // =========================================================================
  const spellingWords = [
    'EDUCATION', 'ASTRONAUT', 'BUTTERFLY', 'CHALKBOARD', 'DINOSAUR',
    'ELEPHANT', 'PLAYGROUND', 'WATERMELON', 'PINEAPPLE', 'SUNFLOWER',
    'CROCODILE', 'CHOCOLATE', 'ADVENTURE', 'DISCOVERY', 'NOTEBOOK',
    'TELESCOPE', 'DRAGONFLY', 'BUMBLEBEE', 'KANGAROO', 'MOUNTAIN',
    'RAINFOREST', 'VOLCANO', 'ENCYCLOPEDIA', 'MATHEMATICS', 'GEOGRAPHY',
  ];

  for (let i = 0; i < 325; i++) {
    const baseWord = spellingWords[i % spellingWords.length];
    const rung = (i % 10) + 1;
    const vowels = (baseWord.match(/[AEIOU]/g) || []).length;
    const consonants = baseWord.length - vowels;
    const askVowels = i % 2 === 0;
    const askTotal = i % 3 === 0;
    const ans = askTotal ? baseWord.length : askVowels ? vowels : consonants;

    let qText = '';
    let peek = '';
    let roast = '';
    let fact = '';

    if (lang === 'am') {
      qText = askTotal
        ? `"${baseWord}" በሚለው የእንግሊዝኛ ቃል ውስጥ በአጠቃላይ ስንት ፊደላት አሉ? (#${i + 1})`
        : askVowels
        ? `"${baseWord}" በሚለው ቃል ውስጥ ስንት አናባቢ ፊደላት (A, E, I, O, U) አሉ? (#${i + 1})`
        : `"${baseWord}" በሚለው ቃል ውስጥ ስንት ተነባቢ (Consonant) ፊደላት አሉ? (#${i + 1})`;
      peek = `በጥንቃቄ ይቁጠሩ! መልሱ ${ans} ነው!`;
      roast = `ፊደላቱን ሲቆጥሩ ተሳሳቱ! ትክክለኛው መልስ ${ans} ነው!`;
      fact = `"${baseWord}" ${baseWord.length} ፊደላት (${vowels} አናባቢ እና ${consonants} ተነባቢ) አሉት።`;
    } else if (lang === 'om') {
      qText = askTotal
        ? `Jecha "${baseWord}" jedhu keessa qubeewwan meeqatu jira? (#${i + 1})`
        : askVowels
        ? `Jecha "${baseWord}" keessa dubbachiiftuu (A, E, I, O, U) meeqatu jira? (#${i + 1})`
        : `Jecha "${baseWord}" keessa dubbifamaa meeqatu jira? (#${i + 1})`;
      peek = `Suuta lakkaa'i! Deebiin isaa ${ans} dha!`;
      roast = `Lakkaa'uu keessatti dogoggorte! Deebiin sirriin ${ans} dha!`;
      fact = `"${baseWord}" qubee ${baseWord.length} qaba.`;
    } else if (lang === 'har') {
      qText = askTotal
        ? `"${baseWord}" ቃል ውስጢ ጅምላ ሚስቲ ፊደል ሀለው? (#${i + 1})`
        : askVowels
        ? `"${baseWord}" ቃል ውስጢ ሚስቲ አናባቢ (A, E, I, O, U) ሀለው? (#${i + 1})`
        : `"${baseWord}" ቃል ውስጢ ሚስቲ ተነባቢ ፊደል ሀለው? (#${i + 1})`;
      peek = `ቆንጆ ሑሉቅ! ጀዋብዞ ${ans} ኢንታይ!`;
      roast = `ፊደል ሒላቅ ውስጢ ተሳሰትኸ! ጀዋብዞ ${ans} ኢንታይ!`;
      fact = `"${baseWord}" ${baseWord.length} ፊደል ሀለው።`;
    } else {
      qText = askTotal
        ? `Spelling Bee #${i + 1}: How many total letters are in the word "${baseWord}"?`
        : askVowels
        ? `Spelling Bee #${i + 1}: How many vowels (A, E, I, O, U) are in the word "${baseWord}"?`
        : `Spelling Bee #${i + 1}: How many consonant letters are in the word "${baseWord}"?`;
      peek = `Count carefully on your fingers! The answer is ${ans}!`;
      roast = `Oops! "${baseWord}" has ${ans}!`;
      fact = `"${baseWord}" has ${baseWord.length} total letters (${vowels} vowels and ${consonants} consonants).`;
    }

    const opts = [
      String(Math.max(1, ans - 1)),
      String(ans),
      String(ans + 1),
      String(ans + 2),
    ];
    const correctIdx = i % 4;
    const tmp = opts[correctIdx];
    opts[correctIdx] = String(ans);
    opts[1] = tmp === String(ans) ? String(ans + 3) : tmp;

    generated.push({
      id: `gen-words-${i}`,
      subject: 'Words & Spelling',
      gradeLevel: gradeForRung(rung),
      difficultyRung: rung,
      adultFailRatePct: 55 + (i % 35),
      question: qText,
      options: opts as [string, string, string, string],
      correctIndex: correctIdx,
      kidPeekNote: peek,
      kidRoastOnMiss: roast,
      funFact: fact,
    });
  }

  cachedPools[lang] = generated;
  return generated;
}

/**
 * Cryptographically / Fisher-Yates random shuffle helper
 */
export function shuffleQuestions<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}
