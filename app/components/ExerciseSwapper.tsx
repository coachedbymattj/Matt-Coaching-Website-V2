"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, X, ArrowsLeftRight, ArrowLeft } from "@phosphor-icons/react";
import exercisesData from "@/data/exercises.json";

type Exercise = {
  name: string;
  pattern: string;
  muscle: string;
  equipment: string;
  alternatives: string[];
  category?: string; // optional explicit override
  bodyPart?: string; // optional explicit override
};

type Derived = Exercise & { cat: string | null; bp: string };

const DB = exercisesData as Exercise[];

// Movement categories (browse) and body parts (filter): the requested taxonomy.
const CATEGORIES = [
  "Vertical Press",
  "Horizontal Press",
  "Vertical Pull",
  "Horizontal Pull",
  "Rotation",
  "Cardio",
  "Unilateral Legs",
  "Unilateral Upperbody",
  "Squat",
  "Hinging",
] as const;

const BODY_PARTS = [
  "Chest",
  "Shoulders",
  "Back",
  "Biceps",
  "Triceps",
  "Core/abs",
  "Cardio",
  "Legs",
] as const;

const EQUIPMENT = ["barbell", "dumbbell", "machine", "cable", "bodyweight"] as const;

// Smart-search synonyms (typed token -> canonical term found in the data).
const SYNONYMS: Record<string, string> = {
  abs: "core",
  ab: "core",
  delts: "shoulders",
  delt: "shoulders",
  lats: "back",
  lat: "back",
  pecs: "chest",
  pec: "chest",
  quads: "legs",
  quad: "legs",
  hams: "legs",
  hamstring: "legs",
  hamstrings: "legs",
  glutes: "legs",
  glute: "legs",
  calves: "legs",
  calf: "legs",
  bis: "biceps",
  bi: "biceps",
  tris: "triceps",
  tri: "triceps",
  bodyweight: "bodyweight",
  bw: "bodyweight",
};

// Derive a movement category from the pattern (returns null for isolation/core).
function toCategory(pattern: string): string | null {
  const p = pattern.toLowerCase();
  if (p.includes("rotat")) return "Rotation";
  if (p.includes("cardio") || p.includes("conditioning")) return "Cardio";
  if (p.includes("unilateral") && (p.includes("upper") || p.includes("arm")))
    return "Unilateral Upperbody";
  if (
    p.includes("unilateral") ||
    p.includes("lunge") ||
    p.includes("split") ||
    p.includes("single leg") ||
    p.includes("single-leg")
  )
    return "Unilateral Legs";
  if (p.includes("squat")) return "Squat";
  if (p.includes("hinge") || p.includes("hinging")) return "Hinging";
  if (p.includes("horizontal") && p.includes("push")) return "Horizontal Press";
  if (p.includes("vertical") && p.includes("push")) return "Vertical Press";
  if (p.includes("horizontal") && p.includes("pull")) return "Horizontal Pull";
  if (p.includes("vertical") && p.includes("pull")) return "Vertical Pull";
  return null;
}

// Derive a body part from the muscle (and pattern as a cardio hint).
function toBodyPart(muscle: string, pattern: string): string {
  const m = muscle.toLowerCase();
  if (/chest|pec/.test(m)) return "Chest";
  if (/delt|shoulder/.test(m)) return "Shoulders";
  if (/lat|back|trap|rhomboid/.test(m)) return "Back";
  if (/bicep/.test(m)) return "Biceps";
  if (/tricep/.test(m)) return "Triceps";
  if (/\babs?\b|core|oblique/.test(m)) return "Core/abs";
  if (/cardio|conditioning/.test(m) || /cardio/.test(pattern.toLowerCase()))
    return "Cardio";
  if (/quad|ham|glute|calf|calv|posterior|leg|adduct|abduct|hip/.test(m))
    return "Legs";
  return "Other";
}

const DBX: Derived[] = DB.map((e) => ({
  ...e,
  cat: e.category ?? toCategory(e.pattern),
  bp: e.bodyPart ?? toBodyPart(e.muscle, e.pattern),
}));

// ---- swap helpers ----
function inferEquipment(name: string): string {
  const n = name.toLowerCase();
  if (/dumbbell|hammer|goblet|arnold|\brdl\b/.test(n)) return "dumbbell";
  if (/barbell|ez-bar|good morning|trap bar/.test(n)) return "barbell";
  if (/machine|smith|hack|leg press|pulldown|pec deck/.test(n)) return "machine";
  if (/cable|crossover|pull-through|pushdown|face pull/.test(n)) return "cable";
  if (/push-up|pull-up|dip|nordic|sissy|bridge|leg raise|hanging|captain|assisted/.test(n))
    return "bodyweight";
  return "other";
}

type Alt = {
  name: string;
  muscle: string;
  pattern: string;
  equipment: string;
};

function buildAlternatives(parent: Derived): Alt[] {
  return parent.alternatives.map((name) => {
    const found = DB.find((e) => e.name.toLowerCase() === name.toLowerCase());
    return {
      name,
      muscle: found?.muscle ?? parent.muscle,
      pattern: found?.pattern ?? parent.pattern,
      equipment: found?.equipment ?? inferEquipment(name),
    };
  });
}

function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
        accent ? "bg-ember/10 text-ember-deep" : "bg-ink-100 text-ink-600"
      }`}
    >
      {children}
    </span>
  );
}

function Chip({
  active,
  muted,
  count,
  onClick,
  children,
}: {
  active: boolean;
  muted?: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
        active
          ? "bg-ink-900 text-canvas"
          : `border hairline ${muted ? "text-ink-300" : "text-ink-600 hover:bg-ink-100"}`
      }`}
    >
      {children}
      {typeof count === "number" && count > 0 && (
        <span className="ml-1.5 font-mono text-[10px] opacity-60">{count}</span>
      )}
    </button>
  );
}

export function ExerciseSwapper() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [bodyPart, setBodyPart] = useState<string | null>(null);
  const [selected, setSelected] = useState<Derived | null>(null);
  const [equipFilter, setEquipFilter] = useState<string[]>([]);

  const q = query.trim().toLowerCase();

  const catCounts = useMemo(() => {
    const c: Record<string, number> = {};
    DBX.forEach((e) => {
      if (e.cat) c[e.cat] = (c[e.cat] || 0) + 1;
    });
    return c;
  }, []);

  const bpCounts = useMemo(() => {
    const c: Record<string, number> = {};
    DBX.forEach((e) => {
      c[e.bp] = (c[e.bp] || 0) + 1;
    });
    return c;
  }, []);

  const results = useMemo(() => {
    const tokens = q
      ? q.split(/\s+/).filter(Boolean).map((t) => SYNONYMS[t] ?? t)
      : [];
    return DBX.filter((e) => {
      if (category && e.cat !== category) return false;
      if (bodyPart && e.bp !== bodyPart) return false;
      if (tokens.length === 0) return true;
      const hay = [
        e.name,
        e.muscle,
        e.pattern,
        e.equipment,
        e.cat ?? "",
        e.bp,
        e.alternatives.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [q, category, bodyPart]);

  const anyFilter = !!(q || category || bodyPart);
  const noResults = anyFilter && results.length === 0;

  const closest = useMemo(() => {
    if (!noResults || !q) return [];
    return [...DBX]
      .map((e) => ({ e, d: lev(q, e.name.toLowerCase()) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map((x) => x.e);
  }, [noResults, q]);

  const alternatives = useMemo(
    () => (selected ? buildAlternatives(selected) : []),
    [selected]
  );
  const filteredAlts = useMemo(
    () =>
      equipFilter.length === 0
        ? alternatives
        : alternatives.filter((a) => equipFilter.includes(a.equipment)),
    [alternatives, equipFilter]
  );

  function selectEx(e: Derived) {
    setSelected(e);
    setEquipFilter([]);
  }
  function clearFilters() {
    setQuery("");
    setCategory(null);
    setBodyPart(null);
  }
  function toggleEquip(eq: string) {
    setEquipFilter((prev) =>
      prev.includes(eq) ? prev.filter((x) => x !== eq) : [...prev, eq]
    );
  }

  const labelClass =
    "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";

  // ---------- SWAPS VIEW ----------
  if (selected) {
    return (
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft size={12} weight="bold" />
          Back to library
        </button>

        <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-6 text-canvas shadow-diffusion md:p-8">
          <div className="pointer-events-none absolute inset-0 speed-stripes" />
          <div className="relative">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
              <ArrowsLeftRight size={14} weight="bold" />
              Swaps for
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-5xl">
              {selected.name}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-canvas/80">
                {selected.bp}
              </span>
              {selected.cat && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-canvas/80">
                  {selected.cat}
                </span>
              )}
              <span className="rounded-full bg-ember/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ember-soft">
                {selected.equipment}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={labelClass}>Filter by equipment you have</span>
            {equipFilter.length > 0 && (
              <button
                type="button"
                onClick={() => setEquipFilter([])}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-deep transition hover:text-ember"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {EQUIPMENT.map((eq) => (
              <Chip
                key={eq}
                active={equipFilter.includes(eq)}
                onClick={() => toggleEquip(eq)}
              >
                {eq}
              </Chip>
            ))}
          </div>
        </div>

        {filteredAlts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAlts.map((alt) => (
              <div
                key={alt.name}
                className="flex flex-col gap-3 rounded-4xl border hairline bg-white p-5 shadow-diffusion-sm"
              >
                <div className="font-display text-lg font-semibold uppercase leading-tight tracking-[0.01em] text-ink-900">
                  {alt.name}
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Tag>{alt.muscle}</Tag>
                  <Tag>{alt.pattern}</Tag>
                  {alt.equipment !== "other" && <Tag accent>{alt.equipment}</Tag>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-4xl border hairline bg-ink-50/60 p-6 text-center">
            <p className="text-sm leading-relaxed text-ink-600">
              No swaps on that equipment. Clear the filter to see all
              alternatives.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ---------- BROWSE VIEW ----------
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-5xl border hairline bg-white p-6 shadow-diffusion-sm md:p-8">
        {/* smart search */}
        <label htmlFor="ex-search" className={labelClass}>
          Smart search
        </label>
        <div className="relative mt-2">
          <MagnifyingGlass
            size={18}
            weight="bold"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            id="ex-search"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Try a name, muscle or kit, e.g. chest, dumbbell press, abs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border hairline bg-canvas py-3 pl-11 pr-11 text-base text-ink-900 outline-none transition focus:border-ember/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>

        {/* categories (replace popular) */}
        <div className="mt-6">
          <div className={labelClass}>Browse by category</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                active={category === cat}
                muted={!catCounts[cat]}
                count={catCounts[cat]}
                onClick={() => setCategory(category === cat ? null : cat)}
              >
                {cat}
              </Chip>
            ))}
          </div>
        </div>

        {/* body part filter */}
        <div className="mt-6">
          <div className={labelClass}>Filter by body part</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {BODY_PARTS.map((bp) => (
              <Chip
                key={bp}
                active={bodyPart === bp}
                muted={!bpCounts[bp]}
                count={bpCounts[bp]}
                onClick={() => setBodyPart(bodyPart === bp ? null : bp)}
              >
                {bp}
              </Chip>
            ))}
          </div>
        </div>

        {anyFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ember-deep transition hover:text-ember"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* results */}
      {results.length > 0 ? (
        <div>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            {results.length} exercise{results.length === 1 ? "" : "s"}
            {category ? ` · ${category}` : ""}
            {bodyPart ? ` · ${bodyPart}` : ""}
          </div>
          <div className="max-h-[560px] overflow-auto pr-1">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((e) => (
                <button
                  key={e.name}
                  type="button"
                  onClick={() => selectEx(e)}
                  className="flex flex-col gap-2.5 rounded-2xl border hairline bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-diffusion-sm"
                >
                  <span className="font-display text-base font-semibold uppercase leading-tight tracking-[0.01em] text-ink-900">
                    {e.name}
                  </span>
                  <span className="mt-auto flex flex-wrap gap-1.5">
                    <Tag>{e.bp}</Tag>
                    <Tag accent>{e.equipment}</Tag>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : noResults ? (
        <div className="rounded-5xl border hairline bg-white p-6 shadow-diffusion-sm md:p-8">
          {q ? (
            <>
              <p className="text-sm leading-relaxed text-ink-600">
                Not in the list yet. Try a similar name or pick by muscle group.
              </p>
              {closest.length > 0 && (
                <>
                  <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                    Closest matches
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {closest.map((e) => (
                      <button
                        key={e.name}
                        type="button"
                        onClick={() => selectEx(e)}
                        className="rounded-full border hairline px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 transition hover:border-ember/40 hover:text-ink-900"
                      >
                        {e.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ink-600">
              Nothing in {category || bodyPart} yet. The library is still
              growing, check back soon.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
