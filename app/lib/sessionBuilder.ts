// Session Builder engine (pure, no React).
// Reuses the Exercise Swapper database (data/exercises.json) as the exercise pool,
// then assembles a simple, balanced training week from the user's answers.
//
// Plain-language only: no "hypertrophy", "progressive overload", "RPE", "deficit", etc.

import exercisesData from "@/data/exercises.json";

type DbExercise = {
  name: string;
  pattern: string;
  muscle: string;
  equipment: string;
  alternatives: string[];
};

const DB = exercisesData as DbExercise[];
const byName = new Map(DB.map((e) => [e.name.toLowerCase(), e]));

// ----------------------------------------------------------------------------
// Equipment
// ----------------------------------------------------------------------------

export type CapKey =
  | "barbell"
  | "dumbbell"
  | "bench"
  | "rack"
  | "cable"
  | "machines"
  | "legpress"
  | "legcurlext"
  | "smith"
  | "pullup"
  | "kettlebell"
  | "bands"
  | "bodyweight";

export const EQUIPMENT_OPTIONS: { key: CapKey; label: string }[] = [
  { key: "barbell", label: "Barbell and plates" },
  { key: "dumbbell", label: "Dumbbells" },
  { key: "bench", label: "Adjustable bench" },
  { key: "rack", label: "Squat rack" },
  { key: "cable", label: "Cable machine" },
  { key: "machines", label: "Resistance machines" },
  { key: "legpress", label: "Leg press / hack squat" },
  { key: "legcurlext", label: "Leg curl / leg extension" },
  { key: "smith", label: "Smith machine" },
  { key: "pullup", label: "Pull-up bar" },
  { key: "kettlebell", label: "Kettlebells" },
  { key: "bands", label: "Resistance bands" },
  { key: "bodyweight", label: "Bodyweight only" },
];

export type Caps = Record<CapKey, boolean>;

export function capsFromKeys(keys: string[]): Caps {
  const set = new Set(keys);
  const caps = {} as Caps;
  EQUIPMENT_OPTIONS.forEach(({ key }) => {
    caps[key] = set.has(key);
  });
  caps.bodyweight = true; // always available
  return caps;
}

// Coarse equipment for any exercise name (DB first, then inferred from the name).
function equipmentOf(name: string): string {
  const hit = byName.get(name.toLowerCase());
  if (hit) return hit.equipment;
  const n = name.toLowerCase();
  if (/\bband\b|banded/.test(n)) return "band";
  if (/kettlebell|\bkb\b/.test(n)) return "kettlebell";
  if (/dumbbell|hammer|goblet|arnold|\brdl\b/.test(n)) return "dumbbell";
  if (/barbell|ez-bar|good morning|trap bar/.test(n)) return "barbell";
  if (/smith/.test(n)) return "smith";
  if (/machine|hack|leg press|pulldown|pec deck|leg curl|leg extension/.test(n))
    return "machine";
  if (/cable|crossover|pull-through|pushdown|face pull/.test(n)) return "cable";
  if (
    /push-up|pull-up|chin|dip|nordic|sissy|bridge|leg raise|hanging|captain|assisted|inverted|bodyweight|pike|superman|step-up|reverse lunge|walking lunge|split squat/.test(
      n
    )
  )
    return "bodyweight";
  return "other";
}

// Can the person do this movement with the kit they ticked?
export function canDo(name: string, caps: Caps): boolean {
  const n = name.toLowerCase();
  if (/goblet/.test(n)) return caps.dumbbell || caps.kettlebell;
  const eq = equipmentOf(name);
  switch (eq) {
    case "bodyweight":
      if (/pull-up|chin/.test(n)) return caps.pullup;
      if (/hanging|toes to bar/.test(n)) return caps.pullup;
      if (/inverted row/.test(n)) return caps.pullup || caps.rack || caps.smith;
      return true;
    case "band":
      return caps.bands;
    case "kettlebell":
      return caps.kettlebell || caps.dumbbell;
    case "barbell":
      if (!caps.barbell) return false;
      if (/squat/.test(n)) return caps.rack || caps.smith;
      if (/bench press/.test(n)) return caps.bench;
      if (/hip thrust/.test(n)) return caps.bench;
      return true;
    case "dumbbell":
      if (!caps.dumbbell) return false;
      if (/(incline|seated).*press|bench/.test(n)) return caps.bench;
      return true;
    case "cable":
      return caps.cable;
    case "smith":
      return caps.smith;
    case "machine":
      if (/leg press|hack squat/.test(n)) return caps.legpress;
      if (/leg curl|leg extension/.test(n)) return caps.legcurlext;
      if (/calf/.test(n)) return caps.machines || caps.legpress;
      return caps.machines;
    default:
      return false; // sled, med ball, other: not part of the tick-list
  }
}

// ----------------------------------------------------------------------------
// Body part + compound/isolation (for tags, priority placement and rep scheme)
// ----------------------------------------------------------------------------

const EXTRA_BODYPART: Record<string, string> = {
  "incline machine press": "Chest",
  "incline dumbbell press": "Chest",
  "smith machine bench press": "Chest",
  "band chest press": "Chest",
  "push-up": "Chest",
  "pec deck": "Chest",
  "dumbbell fly": "Chest",
  "cable crossover": "Chest",
  "pike push-up": "Shoulders",
  "band shoulder press": "Shoulders",
  "machine shoulder press": "Shoulders",
  "arnold press": "Shoulders",
  "band lateral raise": "Shoulders",
  "cable lateral raise": "Shoulders",
  "machine lateral raise": "Shoulders",
  "reverse pec deck": "Shoulders",
  "cable rear delt fly": "Shoulders",
  "face pull": "Shoulders",
  "band pull-apart": "Shoulders",
  "assisted pull-up": "Back",
  "straight-arm pulldown": "Back",
  "close-grip pulldown": "Back",
  "inverted row": "Back",
  "band row": "Back",
  "machine row": "Back",
  "chest-supported row": "Back",
  "hammer curl": "Biceps",
  "cable curl": "Biceps",
  "ez-bar curl": "Biceps",
  "machine curl": "Biceps",
  "band curl": "Biceps",
  "overhead cable extension": "Triceps",
  "overhead extension": "Triceps",
  dips: "Triceps",
  "close-grip bench press": "Triceps",
  "band pushdown": "Triceps",
  "dumbbell rdl": "Legs",
  "good morning": "Legs",
  "lying leg curl": "Legs",
  "nordic curl": "Legs",
  "glute bridge": "Legs",
  "cable pull-through": "Legs",
  "hip thrust": "Legs",
  "goblet squat": "Legs",
  "smith squat": "Legs",
  "front squat": "Legs",
  "bodyweight squat": "Legs",
  "reverse lunge": "Legs",
  "step-up": "Legs",
  "sissy squat": "Legs",
  "leg press calf raise": "Legs",
  "seated calf raise": "Legs",
};

export function bodyPartOf(name: string): string {
  const hit = byName.get(name.toLowerCase());
  if (hit) {
    const m = hit.muscle.toLowerCase();
    const p = hit.pattern.toLowerCase();
    if (/chest|pec/.test(m)) return "Chest";
    if (/delt|shoulder/.test(m)) return "Shoulders";
    if (/lat|back|trap|rhomboid/.test(m)) return "Back";
    if (/bicep/.test(m)) return "Biceps";
    if (/tricep/.test(m)) return "Triceps";
    if (/\babs?\b|core|oblique/.test(m)) return "Core";
    if (/cardio/.test(m) || /cardio/.test(p)) return "Cardio";
    if (/quad|ham|glute|calf|calv|posterior|leg|adduct|abduct|hip/.test(m))
      return "Legs";
  }
  return EXTRA_BODYPART[name.toLowerCase()] ?? "Other";
}

function isCompound(name: string): boolean {
  const n = name.toLowerCase();
  return !/fly|raise|curl|extension|pushdown|crunch|calf|pec deck|face pull|pull-apart|pull-through|shrug|kickback|sissy/.test(
    n
  );
}

// ----------------------------------------------------------------------------
// Slots and day templates
// ----------------------------------------------------------------------------

type Slot = { role: string; candidates: string[] };

const SLOT = {
  verticalPull: {
    role: "Vertical pull",
    candidates: [
      "Lat Pulldown",
      "Pull-Up",
      "Assisted Pull-Up",
      "Straight-Arm Pulldown",
      "Inverted Row",
      "Band Row",
    ],
  },
  squat: {
    role: "Squat / leg press",
    candidates: [
      "Leg Press",
      "Hack Squat",
      "Back Squat",
      "Smith Squat",
      "Goblet Squat",
      "Bodyweight Squat",
    ],
  },
  inclinePush: {
    role: "Incline / chest press",
    candidates: [
      "Incline Barbell Bench Press",
      "Incline Machine Press",
      "Incline Dumbbell Press",
      "Machine Chest Press",
      "Dumbbell Bench Press",
      "Barbell Bench Press",
      "Push-Up",
      "Band Chest Press",
    ],
  },
  horizontalPush: {
    role: "Chest press",
    candidates: [
      "Barbell Bench Press",
      "Machine Chest Press",
      "Dumbbell Bench Press",
      "Smith Machine Bench Press",
      "Push-Up",
      "Band Chest Press",
    ],
  },
  hamstring: {
    role: "Hamstrings",
    candidates: [
      "Seated Leg Curl",
      "Lying Leg Curl",
      "Romanian Deadlift",
      "Dumbbell RDL",
      "Glute Bridge",
      "Nordic Curl",
    ],
  },
  hinge: {
    role: "Hip hinge",
    candidates: [
      "Romanian Deadlift",
      "Deadlift",
      "Dumbbell RDL",
      "Hip Thrust",
      "Glute Bridge",
      "Cable Pull-Through",
    ],
  },
  row: {
    role: "Row",
    candidates: [
      "Seated Cable Row",
      "Machine Row",
      "Dumbbell Row",
      "Chest-Supported Row",
      "Barbell Row",
      "Inverted Row",
      "Band Row",
    ],
  },
  row2: {
    role: "Row",
    candidates: [
      "Dumbbell Row",
      "Chest-Supported Row",
      "Machine Row",
      "Seated Cable Row",
      "Barbell Row",
      "Inverted Row",
      "Band Row",
    ],
  },
  chestIso: {
    role: "Chest shaping",
    candidates: ["Cable Fly", "Pec Deck", "Dumbbell Fly", "Cable Crossover", "Push-Up"],
  },
  deltIso: {
    role: "Shoulder shaping",
    candidates: [
      "Lateral Raise",
      "Cable Lateral Raise",
      "Machine Lateral Raise",
      "Band Lateral Raise",
    ],
  },
  verticalPush: {
    role: "Shoulder press",
    candidates: [
      "Machine Shoulder Press",
      "Standing Dumbbell Shoulder Press",
      "Seated Dumbbell Press",
      "Plate Loaded Shoulder Press",
      "Overhead Barbell Press",
      "Seated Barbell Press",
      "Pike Push-Up",
      "Band Shoulder Press",
    ],
  },
  biceps: {
    role: "Biceps",
    candidates: [
      "Dumbbell Curl",
      "Cable Curl",
      "Barbell Curl",
      "EZ-Bar Curl",
      "Hammer Curl",
      "Machine Curl",
      "Band Curl",
    ],
  },
  biceps2: {
    role: "Biceps",
    candidates: [
      "Hammer Curl",
      "Cable Curl",
      "Barbell Curl",
      "Dumbbell Curl",
      "Machine Curl",
      "Band Curl",
    ],
  },
  triceps: {
    role: "Triceps",
    candidates: [
      "Tricep Pushdown",
      "Overhead Cable Extension",
      "Skull Crusher",
      "Dips",
      "Close-Grip Bench Press",
      "Band Pushdown",
    ],
  },
  triceps2: {
    role: "Triceps",
    candidates: [
      "Skull Crusher",
      "Overhead Cable Extension",
      "Tricep Pushdown",
      "Dips",
      "Band Pushdown",
    ],
  },
  rearDelt: {
    role: "Rear shoulders",
    candidates: [
      "Rear Delt Fly",
      "Reverse Pec Deck",
      "Cable Rear Delt Fly",
      "Face Pull",
      "Band Pull-Apart",
    ],
  },
  rearDelt2: {
    role: "Rear shoulders",
    candidates: [
      "Face Pull",
      "Reverse Pec Deck",
      "Cable Rear Delt Fly",
      "Rear Delt Fly",
      "Band Pull-Apart",
    ],
  },
  lunge: {
    role: "Single-leg",
    candidates: ["Bulgarian Split Squat", "Walking Lunge", "Reverse Lunge", "Step-Up"],
  },
  quadIso: {
    role: "Quads",
    candidates: ["Leg Extension", "Sissy Squat", "Goblet Squat"],
  },
  glute: {
    role: "Glutes",
    candidates: ["Hip Thrust", "Glute Bridge", "Cable Pull-Through", "Romanian Deadlift"],
  },
  calf: {
    role: "Calves",
    candidates: ["Standing Calf Raise", "Seated Calf Raise", "Leg Press Calf Raise"],
  },
} satisfies Record<string, Slot>;

// Each template is a list of superset groups; ~7 exercises grouped 2 + 2 + 3.
const TEMPLATES: Record<string, Slot[][]> = {
  "Full Body": [
    [SLOT.verticalPull, SLOT.squat],
    [SLOT.inclinePush, SLOT.hamstring],
    [SLOT.row, SLOT.chestIso, SLOT.deltIso],
  ],
  Upper: [
    [SLOT.horizontalPush, SLOT.verticalPull],
    [SLOT.verticalPush, SLOT.row2],
    [SLOT.chestIso, SLOT.biceps, SLOT.triceps],
  ],
  Lower: [
    [SLOT.squat, SLOT.hinge],
    [SLOT.lunge, SLOT.hamstring],
    [SLOT.quadIso, SLOT.glute, SLOT.calf],
  ],
  Push: [
    [SLOT.horizontalPush, SLOT.verticalPush],
    [SLOT.inclinePush, SLOT.triceps],
    [SLOT.chestIso, SLOT.deltIso, SLOT.triceps2],
  ],
  Pull: [
    [SLOT.verticalPull, SLOT.rearDelt],
    [SLOT.row, SLOT.biceps],
    [SLOT.row2, SLOT.biceps2, SLOT.rearDelt2],
  ],
};

// ----------------------------------------------------------------------------
// Day plan (frequency + chosen split -> ordered session types)
// ----------------------------------------------------------------------------

export type SplitKey = "fb" | "ul" | "ppl";

export const SPLIT_LABELS: Record<SplitKey, string> = {
  fb: "Full Body",
  ul: "Upper / Lower",
  ppl: "Push / Pull / Legs",
};

export function splitOptions(freq: number): SplitKey[] {
  if (freq <= 2) return ["fb"];
  return ["fb", "ul", "ppl"];
}

export function defaultSplit(freq: number): SplitKey {
  if (freq <= 3) return "fb";
  if (freq === 4) return "ul";
  return "ppl";
}

export function dayPlan(freq: number, split: SplitKey): string[] {
  const FB = "Full Body";
  if (freq <= 2 || split === "fb") return Array(freq).fill(FB);
  if (split === "ul") {
    if (freq === 3) return ["Upper", "Lower", FB];
    if (freq === 4) return ["Upper", "Lower", "Upper", "Lower"];
    if (freq === 5) return ["Upper", "Lower", "Upper", "Lower", FB];
    return ["Upper", "Lower", "Upper", "Lower", "Upper", "Lower"];
  }
  // ppl
  if (freq === 3) return ["Push", "Pull", "Legs"];
  if (freq === 4) return ["Push", "Pull", "Legs", FB];
  if (freq === 5) return ["Upper", "Lower", "Push", "Pull", "Legs"];
  return ["Push", "Pull", "Legs", "Push", "Pull", "Legs"];
}

// ----------------------------------------------------------------------------
// Build
// ----------------------------------------------------------------------------

export type Experience = "beginner" | "experienced";
export type Goal = "fatloss" | "muscle" | "maintain";
export type Priority =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "glutes"
  | "overall";

export type BuiltExercise = {
  name: string;
  role: string;
  bodyPart: string;
  compound: boolean;
  reps: string;
  sets: number;
  candidates: string[]; // same-role pool, for swapping
};

export type Finisher = { name: string; detail: string; note: string };

export type BuiltDay = {
  label: string;
  type: string;
  groups: BuiltExercise[][];
  finisher: Finisher | null;
};

export type BuildInput = {
  freq: number;
  goal: Goal;
  priority: Priority;
  experience: Experience;
  split: SplitKey;
  capKeys: string[];
  excluded: string[]; // ticked names + free-text fragments
};

export type Program = {
  meta: BuildInput;
  days: BuiltDay[];
};

function isExcluded(name: string, excluded: string[]): boolean {
  const n = name.toLowerCase();
  return excluded.some((x) => {
    const t = x.trim().toLowerCase();
    return t.length > 0 && n.includes(t);
  });
}

export function swapOptions(
  current: string,
  candidates: string[],
  caps: Caps,
  excluded: string[]
): string[] {
  const db = byName.get(current.toLowerCase());
  const pool = [...(db?.alternatives ?? []), ...candidates];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of pool) {
    const key = c.toLowerCase();
    if (key === current.toLowerCase() || seen.has(key)) continue;
    if (isExcluded(c, excluded)) continue;
    if (!canDo(c, caps)) continue;
    seen.add(key);
    out.push(c);
    if (out.length >= 6) break;
  }
  return out;
}

// Beginner: everything 10-12. Experienced: first four compounds 6-8, rest 12-15.
export function applyReps(groups: BuiltExercise[][], experience: Experience) {
  let heavy = 0;
  groups.flat().forEach((ex) => {
    ex.sets = 3;
    if (experience === "beginner") {
      ex.reps = "10-12";
    } else if (ex.compound && heavy < 4) {
      ex.reps = "6-8";
      heavy += 1;
    } else {
      ex.reps = "12-15";
    }
  });
}

function placePriorityFirst(groups: BuiltExercise[][], priority: Priority) {
  if (priority === "overall" || groups.length === 0 || groups[0].length === 0)
    return;
  const matches = (ex: BuiltExercise): boolean => {
    const n = ex.name.toLowerCase();
    if (priority === "arms") return ex.bodyPart === "Biceps" || ex.bodyPart === "Triceps";
    if (priority === "glutes")
      return /glute|hip thrust|bridge|pull-through/.test(n);
    const map: Record<string, string> = {
      chest: "Chest",
      back: "Back",
      shoulders: "Shoulders",
      legs: "Legs",
    };
    return ex.bodyPart === map[priority];
  };

  const flat = groups.flat();
  const target = flat.find(matches);
  if (!target || target === groups[0][0]) return;

  let ti = -1;
  let tj = -1;
  groups.forEach((g, i) =>
    g.forEach((e, j) => {
      if (e === target) {
        ti = i;
        tj = j;
      }
    })
  );
  if (ti < 0) return;
  const tmp = groups[0][0];
  groups[0][0] = groups[ti][tj];
  groups[ti][tj] = tmp;
}

function buildFinisher(caps: Caps): Finisher {
  if (caps.machines) {
    return {
      name: "Ski Erg, rower or bike",
      detail: "Go hard for 10 seconds, then easy for 50 seconds. Repeat 5 times.",
      note: "No cardio machine free? A fast incline treadmill walk for 8 minutes works too.",
    };
  }
  return {
    name: "Burpee intervals",
    detail: "Go hard for 10 seconds, then easy for 50 seconds. Repeat 5 times.",
    note: "Keep moving in the easy window instead of fully stopping.",
  };
}

function buildDay(label: string, type: string, input: BuildInput, caps: Caps): BuiltDay {
  const template = TEMPLATES[type === "Legs" ? "Lower" : type] ?? TEMPLATES["Full Body"];
  const used = new Set<string>();
  const groups: BuiltExercise[][] = [];

  for (const groupSpec of template) {
    const group: BuiltExercise[] = [];
    for (const slot of groupSpec) {
      const pick = slot.candidates.find(
        (c) =>
          !used.has(c.toLowerCase()) &&
          !isExcluded(c, input.excluded) &&
          canDo(c, caps)
      );
      if (!pick) continue;
      used.add(pick.toLowerCase());
      group.push({
        name: pick,
        role: slot.role,
        bodyPart: bodyPartOf(pick),
        compound: isCompound(pick),
        reps: "",
        sets: 3,
        candidates: slot.candidates,
      });
    }
    if (group.length) groups.push(group);
  }

  placePriorityFirst(groups, input.priority);
  applyReps(groups, input.experience);

  return {
    label,
    type,
    groups,
    finisher: input.goal === "fatloss" ? buildFinisher(caps) : null,
  };
}

export function buildProgram(input: BuildInput): Program {
  const caps = capsFromKeys(input.capKeys);
  const plan = dayPlan(input.freq, input.split);
  const days = plan.map((type, i) => buildDay(`Day ${i + 1}`, type, input, caps));
  return { meta: input, days };
}

// Used after a manual swap: refresh tags + rep scheme for one edited day.
export function refreshDay(day: BuiltDay, experience: Experience): BuiltDay {
  day.groups.forEach((g) =>
    g.forEach((ex) => {
      ex.bodyPart = bodyPartOf(ex.name);
      ex.compound = isCompound(ex.name);
    })
  );
  applyReps(day.groups, experience);
  return day;
}

// Searchable list of database names (for the "exercises you can't do" step).
export const ALL_EXERCISE_NAMES = DB.map((e) => e.name).sort((a, b) =>
  a.localeCompare(b)
);
