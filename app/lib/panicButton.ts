import data from "@/data/panic-button.json";

// ---------- Types ----------
export type Goal = "lose" | "maintain" | "gain";
export type Gender = "male" | "female" | "na";
export type Experience = "beginner" | "intermediate" | "experienced";

export type Profile = { goal: Goal; gender: Gender; experience: Experience };

export type Block =
  | { type: "p"; text: string }
  | { type: "label"; label: string; text: string }
  | { type: "goal"; goal: Goal; text: string }
  | { type: "list"; items: string[]; label?: string; ordered?: boolean };

export type Triage = { q: string; femaleOnly?: boolean };

export type FollowUp = { question: string; tips?: boolean; scenario?: string };

export type Scenario = {
  id: string;
  title: string;
  femaleOnly?: boolean;
  keywords: string[];
  triage: Triage[];
  happening: Block[];
  next: Block[];
  avoid: Block[];
  followUp?: FollowUp;
};

export type Category = { id: string; name: string; scenarios: Scenario[] };
export type Tip = { id: string; title: string; text: string };

export const CATEGORIES = data.categories as Category[];
export const TIPS = data.tips as Tip[];
export const SCENARIOS: (Scenario & { category: string })[] = CATEGORIES.flatMap(
  (c) => c.scenarios.map((s) => ({ ...s, category: c.name }))
);
export const byId = (id: string) => SCENARIOS.find((s) => s.id === id) ?? null;

export const GOAL_LABEL: Record<Goal, string> = {
  lose: "Lose fat",
  maintain: "Maintain",
  gain: "Gain muscle",
};
export const GENDER_LABEL: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  na: "Prefer not to say",
};
export const EXPERIENCE_LABEL: Record<Experience, string> = {
  beginner: "Beginner (1-3 yrs)",
  intermediate: "Intermediate (3-6 yrs)",
  experienced: "Experienced (6+ yrs)",
};

// ---------- Personalisation ----------
/** Female-only scenarios are hidden only from users who said Male. */
export const scenarioVisible = (s: Scenario, p: Profile | null) =>
  !s.femaleOnly || p?.gender !== "male";

/** Cycle questions only appear for users who identify as Female. */
export const triageFor = (s: Scenario, p: Profile | null) =>
  s.triage.filter((t) => !t.femaleOnly || p?.gender === "female");

/** Goal-branched blocks show only the user's goal (all of them if unknown). */
export const blocksFor = (blocks: Block[], p: Profile | null) =>
  blocks.filter((b) => b.type !== "goal" || !p || b.goal === p.goal);

export const hasGoalBranch = (s: Scenario) =>
  [...s.happening, ...s.next, ...s.avoid].some((b) => b.type === "goal");

// ---------- Smart search ----------
const STOP = new Set(
  (
    "i im me my mine myself a an the and or but to of in on at for with is am are was were be been " +
    "being have has had ive do does did dont doesnt didnt just so really very feel feeling felt it its " +
    "this that what how why when can cant could should would will get got getting about like too much " +
    "bit lot today yesterday now help need want keep up all some any no not ok okay"
  ).split(" ")
);

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const stem = (w: string) => {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
};

const tokens = (s: string) =>
  normalize(s)
    .split(" ")
    .filter((t) => t && !STOP.has(t))
    .map(stem);

function lev(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[b.length];
}

type Indexed = { s: (typeof SCENARIOS)[number]; phrases: string[]; bag: Set<string> };

const INDEX: Indexed[] = SCENARIOS.map((s) => ({
  s,
  phrases: [s.title, ...s.keywords].map(normalize),
  bag: new Set([s.title, ...s.keywords].flatMap(tokens)),
}));

export type Match = { scenario: (typeof SCENARIOS)[number]; score: number };

/** Score at or above this counts as a confident match. */
export const CONFIDENT = 3;

/**
 * Fuzzy-matches free text ("ate a whole pizza last night") to scenarios.
 * Best whole-phrase hit + per-word hits, with typo tolerance per word.
 */
export function search(query: string, profile: Profile | null, limit = 4): Match[] {
  const nq = ` ${normalize(query)} `;
  const qt = Array.from(new Set(tokens(query)));
  if (nq.trim().length < 2) return [];

  return INDEX.filter((x) => scenarioVisible(x.s, profile))
    .map(({ s, phrases, bag }) => {
      let phrase = 0;
      for (const p of phrases) {
        if (p && nq.includes(` ${p} `)) {
          phrase = Math.max(phrase, 3 + 2 * (p.split(" ").length - 1));
        }
      }
      let word = 0;
      for (const t of qt) {
        if (bag.has(t)) {
          word += 2;
          continue;
        }
        const tol = t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0;
        if (tol === 0) continue;
        for (const b of Array.from(bag)) {
          if (lev(t, b, tol) <= tol) {
            word += 1;
            break;
          }
        }
      }
      return { scenario: s, score: phrase + word };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ---------- Email fallback ----------
export const MATT_EMAIL = "coachedbymattj@gmail.com";

export function buildEmail(opts: {
  query: string;
  scenario: Scenario | null;
  answers: { q: string; a: boolean }[];
  profile: Profile | null;
}) {
  const { query, scenario, answers, profile } = opts;
  const subject = scenario
    ? `Panic Button: ${scenario.title}`
    : "Panic Button: I need a hand";
  const lines = ["Hi Matt,", "", "I used the Panic Button and still need a hand.", ""];
  if (query.trim()) lines.push(`What I searched: "${query.trim()}"`);
  if (scenario) lines.push(`Scenario: ${scenario.title}`);
  if (answers.length) {
    lines.push("", "My answers:");
    answers.forEach(({ q, a }) => lines.push(`- ${q} ${a ? "YES" : "NO"}`));
  }
  if (profile) {
    lines.push(
      "",
      `About me: ${GOAL_LABEL[profile.goal]} · ${GENDER_LABEL[profile.gender]} · ${EXPERIENCE_LABEL[profile.experience]}`
    );
  }
  lines.push("", "Anything else you should know:", "", "");
  const body = lines.join("\r\n");
  return {
    subject,
    body,
    href: `mailto:${MATT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
