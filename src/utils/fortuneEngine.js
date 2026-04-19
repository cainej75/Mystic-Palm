// ═══════════════════════════════════════════════════════
// MYSTIC FORTUNES — SEED ENGINE v2
// ═══════════════════════════════════════════════════════

import {
  PALM_LIFE_LINES, PALM_HEART_LINES, PALM_HEAD_LINES, PALM_FATE_LINES,
  PALM_GIFTS, PALM_WARNINGS, PALM_PAST_LIVES, PALM_NEAR_FUTURES,
  SOUL_SIGNS, COLORS, PERSONALITY_TRAITS, PERSONALITY_SHADOW,
  INSIGHTS, ALIGNMENT_TEXTS, VERDICTS, STRENGTHS, CHALLENGES,
  getPersonalityOpeners, getLoveReadings, getLifeLineReadings,
  getCareerReadings, getMoneyReadings, getFutureEvents,
  getWarnings, getGifts, getPastLives, getTeasers,
  getGreetings, getSeraphinaOpeners, getSeraphinaSynthesis,
  getSeraphinaWarnings, getSeraphinaClosings,
} from '../data/readings';

export function generateSeed(name, dob) {
  const raw = `${(name||"").toLowerCase().trim()}|${dob?.day||1}|${dob?.month||1}|${dob?.year||1990}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function seededRandom(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    s = s >>> 0;
    return (s >>> 0) / 4294967295;
  };
}

export function seededPick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

export function generatePartnerCompatibility(name1, dob1, name2, dob2) {
  const today = new Date();
  const monthYear = today.getFullYear() * 100 + (today.getMonth() + 1);
  const seedStr = (name1||"").toLowerCase() + (name2||"").toLowerCase() + 
                  (dob1?.year||0) + (dob1?.month||0) + (dob1?.day||0) +
                  (dob2?.year||0) + (dob2?.month||0) + (dob2?.day||0) + monthYear;
  
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed = seed >>> 0;
  }
  
  const rng = seededRandom(seed);
  
  // Score between 75-99
  const scoreVariation = Math.floor(rng() * 25);
  const score = 75 + scoreVariation;

  const insight = seededPick(rng, INSIGHTS);
  const alignment = seededPick(rng, ALIGNMENT_TEXTS);

  return { score, insight, alignment };
}

export function generateFortune(seed, userName, dob) {
  const rng = seededRandom(seed);
  const name = userName || "Seeker";
  const yr = dob?.year || 1990;
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const bMonth = MONTHS[(dob?.month||1)-1];
  const lifeNum = ((seed % 9) + 1);

  // ── Reading arrays (from src/data/readings.js) ──
  const PERSONALITY_OPENERS = getPersonalityOpeners(name, bMonth);
  const LOVE_READINGS        = getLoveReadings(name, bMonth);
  const LIFE_LINE_READINGS   = getLifeLineReadings(name);
  const CAREER_READINGS      = getCareerReadings(name, bMonth, lifeNum);
  const MONEY_READINGS       = getMoneyReadings(name, bMonth, lifeNum);
  const FUTURE_EVENTS        = getFutureEvents(name);
  const WARNINGS             = getWarnings(name);
  const GIFTS                = getGifts(name);
  const PAST_LIVES           = getPastLives(name);
  const TEASERS              = getTeasers(name);
  const GREETINGS            = getGreetings(name);
  const SERAPHINA_OPENERS    = getSeraphinaOpeners(name);
  const SERAPHINA_SYNTHESIS  = getSeraphinaSynthesis(name);
  const SERAPHINA_WARNINGS   = getSeraphinaWarnings(name);
  const SERAPHINA_CLOSINGS   = getSeraphinaClosings(name);

  const personality  = `${seededPick(rng, PERSONALITY_OPENERS)} ${seededPick(rng, PERSONALITY_TRAITS)} ${seededPick(rng, PERSONALITY_SHADOW)}`;
  const love         = seededPick(rng, LOVE_READINGS);
  
  // Each palm line gets its own seeded RNG to ensure unique content
  const lifeLineRng  = seededRandom((seed ^ 0xA5A5A5A5) >>> 0);
  const lifeLine     = seededPick(lifeLineRng, PALM_LIFE_LINES);
  
  const heartLineRng = seededRandom((seed ^ 0xB5B5B5B5) >>> 0);
  const heartLine    = seededPick(heartLineRng, PALM_HEART_LINES);
  
  const headLineRng  = seededRandom((seed ^ 0xC5C5C5C5) >>> 0);
  const headLine     = seededPick(headLineRng, PALM_HEAD_LINES);
  
  const fateLineRng  = seededRandom((seed ^ 0xD5D5D5D5) >>> 0);
  const fateLine     = seededPick(fateLineRng, PALM_FATE_LINES);
  
  const career       = seededPick(rng, CAREER_READINGS);
  const money        = seededPick(rng, MONEY_READINGS);
  
  // Each section gets its own seeded RNG to ensure unique algorithm content
  const warningRng   = seededRandom((seed ^ 0xE5E5E5E5) >>> 0);
  const warning      = seededPick(warningRng, PALM_WARNINGS);
  
  const giftRng      = seededRandom((seed ^ 0xF5F5F5F5) >>> 0);
  const gift         = seededPick(giftRng, PALM_GIFTS);
  
  const pastLifeRng  = seededRandom((seed ^ 0x1A1A1A1A) >>> 0);
  const pastLife     = seededPick(pastLifeRng, PALM_PAST_LIVES);
  
  const nearFutureRng = seededRandom((seed ^ 0x2A2A2A2A) >>> 0);
  const nearFuture   = seededPick(nearFutureRng, PALM_NEAR_FUTURES);
  
  const soulSign     = seededPick(rng, SOUL_SIGNS);
  const luckyColor   = seededPick(rng, COLORS);
  const luckyNumber  = String(lifeNum);
  const teaser       = seededPick(rng, TEASERS);
  const greeting     = seededPick(rng, GREETINGS);

  const sRng = seededRandom((seed ^ 0x3A3A3A3A) >>> 0);
  const seraphina1 = seededPick(sRng, SERAPHINA_OPENERS);
  const seraphina2 = seededPick(sRng, SERAPHINA_SYNTHESIS);
  const seraphina3 = seededPick(sRng, SERAPHINA_WARNINGS);
  const seraphina4 = seededPick(sRng, SERAPHINA_CLOSINGS);
  const fullReading  = `${seraphina1}

${seraphina2}

${seraphina3}

${seraphina4}`;
  return {
    greeting, teaser, personality, love, career, money,
    warning, soulSign, luckyColor, luckyNumber,
    fullReading, pastLife, nearFuture, gift,
    lifeLine, heartLine, headLine, fateLine,
  };
}

export function generateCompatibility(seed1, seed2) {
  const mixed = ((seed1 ^ seed2 ^ Math.imul(seed1, 7) ^ Math.imul(seed2, 13)) >>> 0) || 1;
  const rng = seededRandom(mixed);
  const raw = rng();
  const score = Math.min(99, Math.max(42, Math.round(raw * 50 + 48)));

  const [,verdict,explanation] = VERDICTS.find(([min])=>score>=min);

  return { score, verdict, explanation, strength: seededPick(rng, STRENGTHS), challenge: seededPick(rng, CHALLENGES) };
}

export function generateShareText(reading, score) {
  if (score !== undefined) {
    const rng = seededRandom(score * 1337);
    return seededPick(rng, [
      `We just got ${score}% soul compatibility on Mystic Fortune and I'm not okay about it 🔥`,
      `${score}% compatible according to our palm lines 🔮 the explanation was unsettling`,
      `Mystic Fortune said ${score}%. My hands confirmed what my heart already knew.`,
      `${score}% compatibility. The warning it gave us was painfully accurate. mysticfortunes.app`,
    ]);
  }
  const rng = seededRandom((reading?.luckyNumber||7)*7919);
  return seededPick(rng, [
    `My destiny was revealed... and I wasn't ready for any of it.`,
    `This palm reading said things about me that nobody alive knows. 😶`,
    `I let an AI read my palm and now I can't stop thinking about the warning it gave me.`,
    `Soul Sign: "${reading?.soulSign}" — the accuracy is genuinely unsettling 🔮`,
    `The "gift" section described me so precisely I had to put my phone down.`,
    `Mystic Fortune just told me more about myself than a year of therapy. Genuinely.`,
  ]) + " — Mystic Fortune\nmysticfortunes.app";
}

export function getZodiac(birthDate) {
  if (!birthDate || !birthDate.day || !birthDate.month) return null;
  const d = birthDate.day, m = birthDate.month;
  if ((m===1&&d>=20)||(m===2&&d<=18)) return {sign:'Aquarius',    emoji:'🏺'};
  if ((m===2&&d>=19)||(m===3&&d<=20)) return {sign:'Pisces',      emoji:'🐟'};
  if ((m===3&&d>=21)||(m===4&&d<=19)) return {sign:'Aries',       emoji:'🐏'};
  if ((m===4&&d>=20)||(m===5&&d<=20)) return {sign:'Taurus',      emoji:'🐂'};
  if ((m===5&&d>=21)||(m===6&&d<=20)) return {sign:'Gemini',      emoji:'👯'};
  if ((m===6&&d>=21)||(m===7&&d<=22)) return {sign:'Cancer',      emoji:'🦀'};
  if ((m===7&&d>=23)||(m===8&&d<=22)) return {sign:'Leo',         emoji:'🦁'};
  if ((m===8&&d>=23)||(m===9&&d<=22)) return {sign:'Virgo',       emoji:'🌾'};
  if ((m===9&&d>=23)||(m===10&&d<=22))return {sign:'Libra',       emoji:'⚖️'};
  if ((m===10&&d>=23)||(m===11&&d<=21))return{sign:'Scorpio',     emoji:'🦂'};
  if ((m===11&&d>=22)||(m===12&&d<=21))return{sign:'Sagittarius', emoji:'🏹'};
  return {sign:'Capricorn', emoji:'🐐'};
}
