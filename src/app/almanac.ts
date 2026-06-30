import {
  AUSPICIOUS_ACTIVITIES,
  BRANCH_ELEMENTS,
  BRANCHES,
  CLASH_ROLES_BY_BRANCH,
  CN_DIGITS,
  ELEMENT_DIRECTIONS,
  ELEMENTS,
  FORTUNE_PALETTE,
  FORTUNES,
  INAUSPICIOUS_ACTIVITIES,
  LUCKY_STARS,
  LUNAR_DAYS,
  LUNAR_MONTHS,
  NOBLE_PEOPLE_BY_STEM,
  OFFICERS,
  PM_QUOTES,
  PROFESSION_PROFILES,
  PROFESSIONS,
  STEM_ELEMENTS,
  STEMS,
  ZODIAC_ANIMALS,
  type Activity,
  type Element,
  type Fortune,
  type Profession,
} from "./almanacData";

export type DailyData = {
  fortune: Fortune;
  fortuneIdx: number;
  luckyGod: string;
  wealthGod: string;
  noble: string;
  clash: string;
  star: string;
  officer: string;
  element: Element;
  auspicious: string[];
  inauspicious: string[];
  quote: string;
};

function seededRng(seed: number) {
  let s = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  return () => {
    s = ((s * 1664525 + 1013904223) & 0xffffffff) >>> 0;
    return s / 0x100000000;
  };
}

export function dateSeed(d: Date) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function daySerial(d: Date) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}

function dayGanzhiIndex(d: Date) {
  return ((daySerial(d) + 10) % 60 + 60) % 60;
}

function monthBranchIndex(d: Date) {
  return (d.getMonth() + 1) % 12;
}

function elementIndex(element: Element) {
  return ELEMENTS.indexOf(element);
}

function generatedElement(element: Element) {
  return ELEMENTS[(elementIndex(element) + 1) % ELEMENTS.length];
}

function controlledElement(element: Element) {
  return ELEMENTS[(elementIndex(element) + 2) % ELEMENTS.length];
}

function isWeekend(d: Date) {
  return d.getDay() === 0 || d.getDay() === 6;
}

function pickFortune(score: number): Fortune {
  if (score >= 32) return "大吉";
  if (score >= 18) return "中吉";
  if (score >= 7) return "小吉";
  if (score >= -6) return "平";
  if (score >= -18) return "小凶";
  return "凶";
}

function sortByScore<T>(items: T[], score: (item: T, index: number) => number) {
  return items
    .map((item, index) => ({ item, score: score(item, index) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

function overlapScore(activityTags: string[], wantedTags: string[]) {
  return activityTags.reduce((sum, tag) => sum + (wantedTags.includes(tag) ? 8 : 0), 0);
}

function activityScore(
  activity: Activity,
  context: {
    element: Element;
    supportElement: Element;
    officerTags: string[];
    officerAvoidTags: string[];
    professionTags: string[];
    professionCautions: string[];
    fortune: Fortune;
    weekday: number;
    rng: () => number;
  },
) {
  let score = 0;
  score += activity.elements.includes(context.element) ? 10 : 0;
  score += activity.elements.includes(context.supportElement) ? 6 : 0;
  score += overlapScore(activity.tags, context.officerTags);
  score -= overlapScore(activity.tags, context.officerAvoidTags);
  score += overlapScore(activity.tags, context.professionTags) * 0.75;
  score -= overlapScore(activity.tags, context.professionCautions) * 0.5;

  if (context.weekday === 1 && activity.tags.includes("planning")) score += 7;
  if (context.weekday === 2 && activity.tags.includes("research")) score += 5;
  if (context.weekday === 3 && activity.tags.includes("analysis")) score += 5;
  if (context.weekday === 4 && activity.tags.includes("alignment")) score += 5;
  if (context.weekday === 5 && activity.tags.includes("review")) score += 6;
  if (context.weekday === 0 || context.weekday === 6) {
    if (activity.tags.includes("deepwork") || activity.tags.includes("cleanup")) score += 8;
    if (activity.tags.includes("alignment") || activity.tags.includes("release")) score -= 9;
  }

  if (context.fortune === "大吉" || context.fortune === "中吉") {
    if (activity.tags.includes("release") || activity.tags.includes("commit")) score += 6;
  }
  if (context.fortune === "小凶" || context.fortune === "凶") {
    score -= (activity.risk ?? 1) * 5;
    if (activity.tags.includes("review") || activity.tags.includes("cleanup")) score += 8;
  }

  return score + context.rng() * 4;
}

export function yearGanzhi(year: number) {
  const i = ((year - 4) % 60 + 60) % 60;
  return STEMS[i % 10] + BRANCHES[i % 12];
}

export function yearZodiac(year: number) {
  const i = ((year - 4) % 12 + 12) % 12;
  return ZODIAC_ANIMALS[i];
}

export function dayGanzhi(d: Date) {
  const i = dayGanzhiIndex(d);
  return STEMS[i % 10] + BRANCHES[i % 12];
}

export function lunarDate(d: Date) {
  const days = daySerial(d);
  const offset = days + 15;
  const lunarDayIdx = ((offset % 30) + 30) % 30;
  const lunarMonthIdx = (((Math.floor(offset / 30)) % 12) + 12) % 12;
  return { month: LUNAR_MONTHS[lunarMonthIdx], day: LUNAR_DAYS[lunarDayIdx] };
}

export function numToChinese(n: number): string {
  if (n < 10) return CN_DIGITS[n];
  if (n < 20) return "十" + (n % 10 === 0 ? "" : CN_DIGITS[n % 10]);
  return CN_DIGITS[Math.floor(n / 10)] + "十" + (n % 10 === 0 ? "" : CN_DIGITS[n % 10]);
}

export function yearToChinese(y: number): string {
  return y.toString().split("").map(c => CN_DIGITS[parseInt(c)]).join("");
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getDailyData(d: Date, profession: Profession = "product"): DailyData {
  const professionIndex = PROFESSIONS.indexOf(profession);
  const profile = PROFESSION_PROFILES[profession];
  const rng = seededRng(dateSeed(d) + professionIndex * 997);
  const ganzhiIndex = dayGanzhiIndex(d);
  const stemIndex = ganzhiIndex % 10;
  const branchIndex = ganzhiIndex % 12;
  const element = STEM_ELEMENTS[stemIndex];
  const branchElement = BRANCH_ELEMENTS[branchIndex];
  const supportElement = generatedElement(element);
  const officer = OFFICERS[((branchIndex - monthBranchIndex(d)) % 12 + 12) % 12];

  let fortuneScore = officer.score;
  fortuneScore += element === branchElement ? 8 : 0;
  fortuneScore += generatedElement(branchElement) === element ? 7 : 0;
  fortuneScore -= controlledElement(branchElement) === element ? 8 : 0;
  fortuneScore += isWeekend(d) ? -5 : 3;
  fortuneScore += d.getDay() === 1 ? 5 : 0;
  fortuneScore += Math.round((rng() - 0.5) * 12);

  const fortune = pickFortune(fortuneScore);
  const fortuneIdx = FORTUNES.indexOf(fortune);
  const directions = ELEMENT_DIRECTIONS[element];
  const luckyGod = directions.lucky;
  const wealthGod = directions.wealth;
  const noblePool = [...profile.noblePeople, ...NOBLE_PEOPLE_BY_STEM];
  const clashPool = [...profile.clashRoles, ...CLASH_ROLES_BY_BRANCH];
  const noble = noblePool[(stemIndex + Math.floor(rng() * profile.noblePeople.length)) % noblePool.length];
  const clash = clashPool[((branchIndex + 6) + Math.floor(rng() * profile.clashRoles.length)) % clashPool.length];
  const starBase = Math.max(0, LUCKY_STARS.length - 1 - fortuneIdx);
  const star = LUCKY_STARS[(starBase + Math.floor(rng() * 3)) % LUCKY_STARS.length];
  const context = {
    element,
    supportElement,
    officerTags: officer.tags,
    officerAvoidTags: officer.avoidTags,
    professionTags: profile.preferredTags,
    professionCautions: profile.cautiousTags,
    fortune,
    weekday: d.getDay(),
    rng,
  };
  const auspCount = fortuneIdx <= 1 ? 7 : fortuneIdx <= 3 ? 6 : 5;
  const inauspCount = fortuneIdx >= 4 ? 6 : fortuneIdx >= 2 ? 5 : 4;

  const auspicious = sortByScore(
    [...AUSPICIOUS_ACTIVITIES],
    activity => activityScore(activity, context),
  ).slice(0, auspCount).map(activity => activity.label);

  const inauspicious = sortByScore(
    [...INAUSPICIOUS_ACTIVITIES],
    activity => {
      const base = activityScore(activity, context);
      const avoidBoost = overlapScore(activity.tags, officer.avoidTags) * 1.2;
      const professionCautionBoost = overlapScore(activity.tags, profile.cautiousTags);
      const riskBoost = (activity.risk ?? 1) * (fortuneIdx >= 4 ? 8 : 4);
      return base + avoidBoost + professionCautionBoost + riskBoost;
    },
  ).slice(0, inauspCount).map(activity => activity.label);
  const quotePool = profession === "product" ? [...profile.quotes, ...PM_QUOTES] : profile.quotes;

  return {
    fortune,
    fortuneIdx,
    luckyGod,
    wealthGod,
    noble,
    clash,
    star,
    officer: officer.name,
    element,
    auspicious,
    inauspicious,
    quote: quotePool[Math.floor(rng() * quotePool.length)],
  };
}

export function fortuneColor(f: Fortune) {
  return FORTUNE_PALETTE[f].seal;
}

export function fortuneDot(f: Fortune) {
  return FORTUNE_PALETTE[f].dot;
}
