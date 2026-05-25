"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  Check,
  MagnifyingGlass,
  X,
  Lightning,
  LockSimple,
  InstagramLogo,
} from "@phosphor-icons/react";

const INSTAGRAM_URL = "https://instagram.com/coachedbymattj";
import {
  buildProgram,
  capsFromKeys,
  defaultSplit,
  dayPlan,
  refreshDay,
  swapOptions,
  splitOptions,
  ALL_EXERCISE_NAMES,
  EQUIPMENT_OPTIONS,
  SPLIT_LABELS,
  type BuildInput,
  type BuiltExercise,
  type Goal,
  type Experience,
  type Priority,
  type Program,
  type SplitKey,
} from "../lib/sessionBuilder";
import {
  subscribeEmail,
  isValidEmail,
  cleanMailchimpMessage,
} from "../lib/mailchimpClient";

const STORE_PLAN = "cbmj_sb_plan";
const STORE_LAST = "cbmj_sb_last";
const STORE_UNLOCKED = "cbmj_sb_unlocked";
const WEEK = 7 * 24 * 60 * 60 * 1000;

const GOALS: { key: Goal; label: string; sub: string }[] = [
  { key: "fatloss", label: "Lose fat", sub: "Lean down and feel lighter." },
  { key: "muscle", label: "Build muscle", sub: "Add shape and strength." },
  { key: "maintain", label: "Stay the same", sub: "Hold your shape and stay fit." },
];

const PRIORITIES: { key: Priority; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "back", label: "Back" },
  { key: "shoulders", label: "Shoulders" },
  { key: "arms", label: "Arms" },
  { key: "legs", label: "Legs" },
  { key: "glutes", label: "Glutes" },
  { key: "overall", label: "Overall" },
];

const label = "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";

// ---------------------------------------------------------------------------

export function SessionBuilder() {
  const reduce = useReducedMotion();

  // wizard answers
  const [stepIdx, setStepIdx] = useState(0);
  const [freq, setFreq] = useState<number | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [equip, setEquip] = useState<Set<string>>(new Set());
  const [cantText, setCantText] = useState("");
  const [cantPicked, setCantPicked] = useState<Set<string>>(new Set());
  const [cantSearch, setCantSearch] = useState("");
  const [experience, setExperience] = useState<Experience | null>(null);
  const [split, setSplit] = useState<SplitKey>("fb");

  // result
  const [program, setProgram] = useState<Program | null>(null);
  const [supersets, setSupersets] = useState(true);
  const [swapKey, setSwapKey] = useState<string | null>(null);
  const [unlocksAt, setUnlocksAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // email gate
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Restore a saved, already-unlocked session + cooldown on mount (client-only).
  useEffect(() => {
    try {
      const last = Number(localStorage.getItem(STORE_LAST) || 0);
      const saved = localStorage.getItem(STORE_PLAN);
      const unl = localStorage.getItem(STORE_UNLOCKED) === "1";
      if (last && saved && unl && Date.now() - last < WEEK) {
        setProgram(JSON.parse(saved) as Program);
        setUnlocked(true);
        setUnlocksAt(last + WEEK);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Tick once a minute so the countdown stays live.
  useEffect(() => {
    if (!unlocksAt) return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [unlocksAt]);

  const locked = unlocksAt != null && now < unlocksAt;

  const steps = useMemo(() => {
    const base = ["freq", "goal", "priority", "equip", "cant", "experience"];
    return (freq ?? 0) >= 3 ? [...base, "split"] : base;
  }, [freq]);

  const step = steps[stepIdx];
  const total = steps.length;
  const canNext =
    (step === "freq" && freq != null) ||
    (step === "goal" && goal != null) ||
    (step === "priority" && priority != null) ||
    step === "equip" ||
    step === "cant" ||
    (step === "experience" && experience != null) ||
    step === "split";

  function next() {
    if (stepIdx < total - 1) {
      setStepIdx((i) => i + 1);
    } else {
      generate();
    }
  }
  function back() {
    setStepIdx((i) => Math.max(0, i - 1));
  }

  function generate() {
    if (freq == null || goal == null || priority == null || experience == null) return;
    const excluded = [
      ...Array.from(cantPicked),
      ...cantText
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 3),
    ];
    const input: BuildInput = {
      freq,
      goal,
      priority,
      experience,
      split: (freq >= 3 ? split : "fb") as SplitKey,
      capKeys: Array.from(equip),
      excluded,
    };
    // Build it now, but keep it behind the email gate until they unlock.
    setProgram(buildProgram(input));
    setSwapKey(null);
    setUnlocked(false);
    setEmail("");
    setStatusMsg("");
  }

  // Capture the email (Mailchimp), then reveal the session and start the cooldown.
  async function handleUnlock() {
    if (!isValidEmail(email)) {
      setStatusMsg("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    setStatusMsg("");
    try {
      const res = await subscribeEmail(email);
      if (res.result !== "success") {
        const clean = cleanMailchimpMessage(res.msg);
        setStatusMsg(
          clean
            ? `${clean} Your session is unlocked below anyway.`
            : "You're already on the list, session unlocked below."
        );
      }
    } catch {
      setStatusMsg(
        "Couldn't reach the mailing list right now, but your session is unlocked below."
      );
    } finally {
      setSubmitting(false);
      const ts = Date.now();
      setUnlocked(true);
      setUnlocksAt(ts + WEEK);
      setNow(ts);
      try {
        if (program) localStorage.setItem(STORE_PLAN, JSON.stringify(program));
        localStorage.setItem(STORE_LAST, String(ts));
        localStorage.setItem(STORE_UNLOCKED, "1");
      } catch {
        /* ignore */
      }
    }
  }

  function startOver() {
    setProgram(null);
    setStepIdx(0);
    setFreq(null);
    setGoal(null);
    setPriority(null);
    setEquip(new Set());
    setCantPicked(new Set());
    setCantText("");
    setExperience(null);
    setSplit("fb");
    setUnlocked(false);
    setEmail("");
    setStatusMsg("");
    setUnlocksAt(null);
  }

  function persist(p: Program) {
    try {
      localStorage.setItem(STORE_PLAN, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  }

  function doSwap(dayIdx: number, gIdx: number, eIdx: number, newName: string) {
    setProgram((prev) => {
      if (!prev) return prev;
      const copy: Program = JSON.parse(JSON.stringify(prev));
      copy.days[dayIdx].groups[gIdx][eIdx].name = newName;
      refreshDay(copy.days[dayIdx], copy.meta.experience);
      persist(copy);
      return copy;
    });
    setSwapKey(null);
  }

  // ----- RESULT VIEW -----
  if (program) {
    return (
      <ProgramView
        program={program}
        supersets={supersets}
        setSupersets={setSupersets}
        swapKey={swapKey}
        setSwapKey={setSwapKey}
        onSwap={doSwap}
        locked={locked}
        unlocksAt={unlocksAt}
        now={now}
        onStartOver={startOver}
        unlocked={unlocked}
        email={email}
        setEmail={setEmail}
        submitting={submitting}
        statusMsg={statusMsg}
        onUnlock={handleUnlock}
      />
    );
  }

  // ----- WIZARD VIEW -----
  const pct = Math.round(((stepIdx + 1) / total) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* progress */}
      <div>
        <div className="flex items-center justify-between">
          <span className={label}>
            Step {stepIdx + 1} of {total}
          </span>
          <span className={label}>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-ember transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <motion.div
        key={step}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-5xl border hairline bg-white p-6 shadow-diffusion-sm md:p-8"
      >
        {step === "freq" && (
          <Question
            title="How many days a week can you train?"
            help="Pick what you can realistically commit to most weeks."
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((d) => (
                <OptionButton
                  key={d}
                  active={freq === d}
                  onClick={() => {
                    setFreq(d);
                    setSplit(defaultSplit(d));
                  }}
                >
                  <span className="font-display text-3xl font-bold">{d}</span>
                </OptionButton>
              ))}
            </div>

            {(freq === 5 || freq === 6) && (
              <div className="mt-5 rounded-2xl border border-ember/30 bg-ember/5 p-4">
                <p className="text-sm leading-relaxed text-ink-700">
                  {freq} days a week is a big commitment. Most people get further
                  with fewer, harder sessions they can actually stick to, week in,
                  week out.
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-start gap-2 text-sm font-semibold text-ember-deep transition hover:text-ember"
                >
                  <InstagramLogo size={16} weight="bold" className="mt-0.5 flex-none" />
                  Not sure? No stress. Message me on Instagram and I&apos;ll help you
                  figure out the right number of days for you.
                </a>
              </div>
            )}
          </Question>
        )}

        {step === "goal" && (
          <Question title="What is your main goal right now?">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {GOALS.map((g) => (
                <OptionButton
                  key={g.key}
                  active={goal === g.key}
                  onClick={() => setGoal(g.key)}
                  tall
                >
                  <span className="font-display text-xl font-bold uppercase">
                    {g.label}
                  </span>
                  <span className="mt-1 text-xs font-normal normal-case text-ink-500">
                    {g.sub}
                  </span>
                </OptionButton>
              ))}
            </div>
          </Question>
        )}

        {step === "priority" && (
          <Question
            title="Which area do you most want to develop?"
            help="We put one move for this area first in every session that trains it."
          >
            <div className="flex flex-wrap gap-2.5">
              {PRIORITIES.map((p) => (
                <Pill
                  key={p.key}
                  active={priority === p.key}
                  onClick={() => setPriority(p.key)}
                >
                  {p.label}
                </Pill>
              ))}
            </div>
          </Question>
        )}

        {step === "equip" && (
          <Question
            title="What can you train with?"
            help="Tick everything you can use. Leave it all unticked if it is just you and your bodyweight."
          >
            {(() => {
              const allOn = EQUIPMENT_OPTIONS.every((o) => equip.has(o.key));
              return (
                <button
                  type="button"
                  onClick={() =>
                    setEquip(
                      allOn ? new Set() : new Set(EQUIPMENT_OPTIONS.map((o) => o.key))
                    )
                  }
                  className={`mb-3 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.06em] transition ${
                    allOn
                      ? "border-ember/60 bg-ember/10 text-ember-deep"
                      : "hairline text-ink-700 hover:bg-ink-50"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 flex-none place-items-center rounded-md border transition ${
                      allOn ? "border-ember bg-ember text-white" : "border-ink-300"
                    }`}
                  >
                    {allOn && <Check size={13} weight="bold" />}
                  </span>
                  Yes to all (full gym)
                </button>
              );
            })()}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {EQUIPMENT_OPTIONS.map((opt) => {
                const on = equip.has(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() =>
                      setEquip((prev) => {
                        const n = new Set(prev);
                        n.has(opt.key) ? n.delete(opt.key) : n.add(opt.key);
                        return n;
                      })
                    }
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      on
                        ? "border-ember/50 bg-ember/5 text-ink-900"
                        : "hairline text-ink-600 hover:bg-ink-50"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 flex-none place-items-center rounded-md border transition ${
                        on ? "border-ember bg-ember text-white" : "border-ink-300"
                      }`}
                    >
                      {on && <Check size={13} weight="bold" />}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </Question>
        )}

        {step === "cant" && (
          <Question
            title="Anything you cannot or would rather not do?"
            help="Optional. We leave these out and offer alternatives. Search the list or type your own."
          >
            <CantPicker
              search={cantSearch}
              setSearch={setCantSearch}
              picked={cantPicked}
              setPicked={setCantPicked}
              text={cantText}
              setText={setCantText}
            />
          </Question>
        )}

        {step === "experience" && (
          <Question title="How would you describe yourself?">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionButton
                active={experience === "beginner"}
                onClick={() => setExperience("beginner")}
                tall
              >
                <span className="font-display text-xl font-bold uppercase">
                  Pretty new to this
                </span>
                <span className="mt-1 text-xs font-normal normal-case text-ink-500">
                  We keep the reps simple while you learn the moves.
                </span>
              </OptionButton>
              <OptionButton
                active={experience === "experienced"}
                onClick={() => setExperience("experienced")}
                tall
              >
                <span className="font-display text-xl font-bold uppercase">
                  Trained for a while
                </span>
                <span className="mt-1 text-xs font-normal normal-case text-ink-500">
                  We push a bit harder on your main lifts.
                </span>
              </OptionButton>
            </div>
          </Question>
        )}

        {step === "split" && freq != null && (
          <Question
            title="How should we split your week?"
            help="Full Body trains everything each day. The others spread it out."
          >
            <div className="flex flex-col gap-3">
              {splitOptions(freq).map((s) => {
                const days = dayPlan(freq, s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSplit(s)}
                    className={`rounded-2xl border px-5 py-4 text-left transition ${
                      split === s
                        ? "border-ember/50 bg-ember/5"
                        : "hairline hover:bg-ink-50"
                    }`}
                  >
                    <div className="font-display text-lg font-bold uppercase text-ink-900">
                      {SPLIT_LABELS[s]}
                    </div>
                    <div className="mt-1 text-xs text-ink-500">
                      {days.map((d, i) => `Day ${i + 1}: ${d}`).join("  ·  ")}
                    </div>
                  </button>
                );
              })}
            </div>
          </Question>
        )}
      </motion.div>

      {/* nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={stepIdx === 0}
          className="inline-flex items-center gap-2 rounded-full border hairline px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-700 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={15} weight="bold" />
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canNext}
          className="btn-ember inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stepIdx === total - 1 ? "Build my session" : "Next"}
          <ArrowRight size={15} weight="bold" />
        </button>
      </div>

      <p className="text-center text-xs text-ink-400">
        One free session every 7 days, unlocked with your email. A starting point,
        not personal coaching.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result view
// ---------------------------------------------------------------------------

function ProgramView({
  program,
  supersets,
  setSupersets,
  swapKey,
  setSwapKey,
  onSwap,
  locked,
  unlocksAt,
  now,
  onStartOver,
  unlocked,
  email,
  setEmail,
  submitting,
  statusMsg,
  onUnlock,
}: {
  program: Program;
  supersets: boolean;
  setSupersets: (v: boolean) => void;
  swapKey: string | null;
  setSwapKey: (v: string | null) => void;
  onSwap: (d: number, g: number, e: number, name: string) => void;
  locked: boolean;
  unlocksAt: number | null;
  now: number;
  onStartOver: () => void;
  unlocked: boolean;
  email: string;
  setEmail: (v: string) => void;
  submitting: boolean;
  statusMsg: string;
  onUnlock: () => void;
}) {
  const reduce = useReducedMotion();
  const caps = useMemo(
    () => capsFromKeys(program.meta.capKeys),
    [program.meta.capKeys]
  );

  // Only ever show one session: day 1 of the plan their answers imply.
  const session = program.days[0];

  // Plain-language coaching notes. Full Body uses the upper/lower pair method
  // (short rest, slow lowering); other days use normal rest.
  const methodNotes = (
    session.method === "gbc"
      ? [
          supersets
            ? "Work in pairs: one set of the top move (A1), then straight into the move below it (A2). Pairing an upper-body move with a lower-body one lets each area rest while the other works."
            : null,
          "Keep rest short: 30 to 60 seconds between the two paired moves and between sets.",
          "Lower every weight slowly, around 3 to 4 seconds, and stay in control. No bouncing or dropping.",
        ]
      : [
          supersets
            ? "Moves grouped together are done back to back, then you rest."
            : "Do all the sets of one move, then move on to the next.",
          "Do the big compound lifts first while you are fresh, then the smaller isolation moves.",
          "Push each set to within 1 to 2 reps of failure. Stop when your form would break.",
          "Try to beat last time: add a rep or a little weight whenever you can.",
          "Use a full stretch and a full range of motion on every rep.",
          "Rest longer on the big lifts (about 2 to 3 minutes) and less on the smaller moves (about 60 to 90 seconds).",
          "Pick moves that load the muscle in a good stretched position with smooth, steady resistance.",
          "Across the week, aim to train each muscle about twice, with roughly 10 to 20 hard sets per muscle in total.",
        ]
  ).filter((n): n is string => Boolean(n));

  return (
    <div className="flex flex-col gap-6">
      {/* summary */}
      <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-6 text-canvas shadow-diffusion md:p-8">
        <div className="pointer-events-none absolute inset-0 speed-stripes" />
        <div className="relative">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
            <Lightning size={14} weight="fill" />
            Your session
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-5xl">
            {session.type} session
          </h2>
          {program.days.length > 1 && (
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-canvas/70">
              The first session from a {program.days.length}-day{" "}
              {SPLIT_LABELS[program.meta.split]} week. Coaching builds out the rest.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <DarkTag>
              {program.meta.goal === "fatloss"
                ? "Lose fat"
                : program.meta.goal === "muscle"
                  ? "Build muscle"
                  : "Stay the same"}
            </DarkTag>
            {program.meta.priority !== "overall" && (
              <DarkTag>Focus: {program.meta.priority}</DarkTag>
            )}
            <DarkTag>
              {program.meta.experience === "beginner"
                ? "New to training"
                : "Experienced"}
            </DarkTag>
          </div>
        </div>
      </div>

      {/* email gate */}
      {!unlocked ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.05 }}
          className="rounded-5xl border border-ember/30 bg-white p-6 shadow-ember-glow md:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ember/10 text-ember-deep">
              <LockSimple size={18} weight="bold" />
            </span>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-semibold uppercase leading-none tracking-[0.01em] text-ink-900">
                Unlock your session
              </h3>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-600">
                Pop your email in and your full session opens up below, every move,
                with sets and reps.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onUnlock();
                  }}
                  className="w-full flex-1 rounded-full border hairline bg-canvas px-5 py-3 text-base text-ink-900 outline-none transition focus:border-ember/50"
                  aria-label="Email address"
                />
                <button
                  type="button"
                  onClick={onUnlock}
                  disabled={submitting}
                  className="btn-ember inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Unlock my session"}
                  {!submitting && <ArrowRight size={16} weight="bold" />}
                </button>
              </div>

              {statusMsg && (
                <p className="mt-3 text-xs leading-snug text-ember-deep" aria-live="polite">
                  {statusMsg}
                </p>
              )}

              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                One email when there's something worth saying · unsubscribe anytime
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* focus note */}
          <div className="rounded-4xl border hairline bg-ember/5 p-5 md:p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ember-deep">
              For every exercise, in this order
            </div>
            <ol className="mt-3 grid grid-cols-1 gap-2 text-sm text-ink-700 sm:grid-cols-2">
              {[
                "Move through the full range",
                "Keep your technique clean",
                "Feel the right muscle working",
                "Then add weight",
              ].map((t, i) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-ink-900 font-mono text-[11px] text-canvas">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          {/* how to run it */}
          <div className="rounded-4xl border hairline bg-white p-5 shadow-diffusion-sm md:p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              How to run it
            </div>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-ink-700">
              {methodNotes.map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-ember" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSupersets(!supersets)}
              className="inline-flex items-center gap-2 rounded-full border hairline px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-700 transition hover:bg-ink-100"
            >
              <ArrowsClockwise size={14} weight="bold" />
              {supersets ? "Switch to straight sets" : "Switch to supersets"}
            </button>
            <span className={label}>
              {supersets
                ? "Supersets: do paired moves back to back"
                : "Straight sets: finish all sets of one move first"}
            </span>
          </div>

          {/* the one session */}
          <div className="rounded-5xl border hairline bg-white p-5 shadow-diffusion-sm md:p-7">
            <div className="flex items-baseline justify-between gap-3 border-b hairline pb-4">
              <h3 className="font-display text-2xl font-bold uppercase tracking-[0.01em] text-ink-900">
                Your session
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ember-deep">
                {session.type}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {session.groups.map((group, gi) =>
                supersets ? (
                  <SupersetGroup
                    key={gi}
                    group={group}
                    letter={String.fromCharCode(65 + gi)}
                    single={group.length === 1}
                    dayIdx={0}
                    gIdx={gi}
                    caps={caps}
                    excluded={program.meta.excluded}
                    swapKey={swapKey}
                    setSwapKey={setSwapKey}
                    onSwap={onSwap}
                  />
                ) : (
                  group.map((ex, ei) => (
                    <ExerciseRow
                      key={`${gi}-${ei}`}
                      ex={ex}
                      tag={straightLabel(session.groups, gi, ei)}
                      dayIdx={0}
                      gIdx={gi}
                      eIdx={ei}
                      caps={caps}
                      excluded={program.meta.excluded}
                      swapKey={swapKey}
                      setSwapKey={setSwapKey}
                      onSwap={onSwap}
                    />
                  ))
                )
              )}

              {session.finisher && (
                <div className="rounded-2xl border border-dashed border-ember/40 bg-ember/5 p-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ember-deep">
                    Finisher
                  </div>
                  <div className="mt-1.5 font-display text-lg font-bold uppercase text-ink-900">
                    {session.finisher.name}
                  </div>
                  <p className="mt-1 text-sm text-ink-700">{session.finisher.detail}</p>
                  <p className="mt-1 text-xs text-ink-400">{session.finisher.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* ask for cues */}
          <p className="text-center text-sm leading-relaxed text-ink-500">
            Want cues on how to do any of these moves?{" "}
            <Link
              href="/#message"
              className="font-semibold text-ember-deep underline-offset-2 hover:underline"
            >
              Message me
            </Link>{" "}
            and I'll talk you through it.
          </p>

          {/* cooldown */}
          <div className="rounded-5xl border hairline bg-ink-50/60 p-6 text-center md:p-8">
            {locked && unlocksAt ? (
              <>
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  <LockSimple size={13} weight="bold" />
                  Next free session in {countdown(unlocksAt - now)}
                </div>
                <p className="mx-auto mt-3 max-w-md text-sm text-ink-600">
                  Your session is saved on this device. Keep swapping moves to
                  fine-tune it, or come back next week to build a fresh one.
                </p>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartOver}
                className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-700 transition hover:bg-ink-100"
              >
                <ArrowsClockwise size={15} weight="bold" />
                Build a new session
              </button>
            )}
          </div>

          {/* "doesn't fit you? jump on a call" */}
          <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-6 text-center text-canvas shadow-diffusion md:p-8">
            <div className="pointer-events-none absolute inset-0 speed-stripes" />
            <div className="relative">
              <h3 className="mx-auto max-w-[24ch] font-display text-2xl font-bold uppercase leading-[0.95] tracking-[0.01em] md:text-3xl">
                If this plan doesn&apos;t fit you, jump on a call.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-canvas/70">
                Niggles, no time, or not sure it suits you? My online 1:1 coaching
                builds the whole thing around your life, your body and your goals,
                with me checking in every week.
              </p>
              <Link
                href="/apply/online"
                className="btn-ember mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.14em]"
              >
                Apply for online 1:1 coaching
                <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          </div>

          {/* soft Instagram CTA */}
          <p className="text-center text-sm leading-relaxed text-ink-500">
            Want a second pair of eyes on this, or something more tailored?{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-ember-deep underline-offset-2 hover:underline"
            >
              <InstagramLogo size={15} weight="bold" />
              Send me a message on Instagram
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------

function SupersetGroup({
  group,
  letter,
  single,
  dayIdx,
  gIdx,
  caps,
  excluded,
  swapKey,
  setSwapKey,
  onSwap,
}: {
  group: BuiltExercise[];
  letter: string;
  single: boolean;
  dayIdx: number;
  gIdx: number;
  caps: ReturnType<typeof capsFromKeys>;
  excluded: string[];
  swapKey: string | null;
  setSwapKey: (v: string | null) => void;
  onSwap: (d: number, g: number, e: number, name: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-ink-50/50 p-1.5">
      {!single && (
        <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          {group.length === 3 ? "Tri-set" : "Superset"} · back to back
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        {group.map((ex, ei) => (
          <ExerciseRow
            key={ei}
            ex={ex}
            tag={single ? letter : `${letter}${ei + 1}`}
            dayIdx={dayIdx}
            gIdx={gIdx}
            eIdx={ei}
            caps={caps}
            excluded={excluded}
            swapKey={swapKey}
            setSwapKey={setSwapKey}
            onSwap={onSwap}
            nested
          />
        ))}
      </div>
    </div>
  );
}

function ExerciseRow({
  ex,
  tag,
  dayIdx,
  gIdx,
  eIdx,
  caps,
  excluded,
  swapKey,
  setSwapKey,
  onSwap,
  nested,
}: {
  ex: BuiltExercise;
  tag: string;
  dayIdx: number;
  gIdx: number;
  eIdx: number;
  caps: ReturnType<typeof capsFromKeys>;
  excluded: string[];
  swapKey: string | null;
  setSwapKey: (v: string | null) => void;
  onSwap: (d: number, g: number, e: number, name: string) => void;
  nested?: boolean;
}) {
  const key = `${dayIdx}-${gIdx}-${eIdx}`;
  const open = swapKey === key;
  const options = useMemo(
    () => (open ? swapOptions(ex.name, ex.candidates, caps, excluded) : []),
    [open, ex.name, ex.candidates, caps, excluded]
  );

  return (
    <div
      className={`rounded-2xl ${nested ? "bg-white" : "border hairline bg-white"} p-3.5`}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-ink-900 font-mono text-[11px] font-bold text-canvas">
          {tag}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-semibold uppercase leading-tight tracking-[0.01em] text-ink-900">
            {ex.name}
          </div>
          <div className="mt-1 text-[11px] text-ink-400">
            <span className="font-mono uppercase tracking-[0.12em] text-ink-500">
              {ex.bodyPart}
            </span>
          </div>
        </div>
        <div className="flex flex-none items-center gap-3">
          <div className="text-right">
            <div className="font-display text-lg font-bold leading-none text-ink-900">
              {ex.sets} × {ex.reps}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-400">
              sets · reps
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSwapKey(open ? null : key)}
            aria-label={`Swap ${ex.name}`}
            className={`grid h-9 w-9 place-items-center rounded-full border transition ${
              open
                ? "border-ember bg-ember/10 text-ember-deep"
                : "hairline text-ink-500 hover:bg-ink-100 hover:text-ink-900"
            }`}
          >
            {open ? <X size={15} weight="bold" /> : <ArrowsClockwise size={15} weight="bold" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 border-t hairline pt-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            Swap for
          </div>
          {options.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => onSwap(dayIdx, gIdx, eIdx, o)}
                  className="rounded-full border hairline px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-ink-700 transition hover:border-ember/40 hover:text-ink-900"
                >
                  {o}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-ink-500">
              No other options for your kit. This is the best fit here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CantPicker({
  search,
  setSearch,
  picked,
  setPicked,
  text,
  setText,
}: {
  search: string;
  setSearch: (v: string) => void;
  picked: Set<string>;
  setPicked: (v: Set<string>) => void;
  text: string;
  setText: (v: string) => void;
}) {
  const q = search.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return [];
    return ALL_EXERCISE_NAMES.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [q]);

  function toggle(name: string) {
    const n = new Set(picked);
    n.has(name) ? n.delete(name) : n.add(name);
    setPicked(n);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <MagnifyingGlass
          size={18}
          weight="bold"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises to leave out"
          className="w-full rounded-2xl border hairline bg-canvas py-3 pl-11 pr-4 text-base text-ink-900 outline-none transition focus:border-ember/50"
        />
      </div>

      {matches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {matches.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition ${
                picked.has(n)
                  ? "bg-ink-900 text-canvas"
                  : "border hairline text-ink-700 hover:bg-ink-100"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {picked.size > 0 && (
        <div>
          <div className={label}>Leaving out</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from(picked).map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1.5 rounded-full bg-ember/10 px-3 py-1.5 text-xs font-semibold text-ember-deep"
              >
                {n}
                <button type="button" onClick={() => toggle(n)} aria-label={`Keep ${n}`}>
                  <X size={12} weight="bold" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="cant-text" className={label}>
          Or type your own (commas to separate)
        </label>
        <input
          id="cant-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. overhead press, deep squats"
          className="mt-2 w-full rounded-2xl border hairline bg-canvas px-4 py-3 text-base text-ink-900 outline-none transition focus:border-ember/50"
        />
      </div>
    </div>
  );
}

function Question({
  title,
  help,
  children,
}: {
  title: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold uppercase leading-[0.95] tracking-[0.01em] text-ink-900 md:text-3xl">
        {title}
      </h2>
      {help && <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-500">{help}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function OptionButton({
  active,
  onClick,
  tall,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tall?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl border text-center transition ${
        tall ? "items-start p-5 text-left" : "p-4"
      } ${
        active
          ? "border-ember/60 bg-ember/5 text-ink-900 shadow-ember-glow"
          : "hairline text-ink-700 hover:-translate-y-0.5 hover:bg-ink-50"
      }`}
    >
      {children}
    </button>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] transition ${
        active ? "bg-ink-900 text-canvas" : "border hairline text-ink-600 hover:bg-ink-100"
      }`}
    >
      {children}
    </button>
  );
}

function DarkTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-canvas/80">
      {children}
    </span>
  );
}

// straight-sets letter: count exercises before this one across earlier groups.
function straightLabel(groups: BuiltExercise[][], gi: number, ei: number): string {
  let idx = ei;
  for (let i = 0; i < gi; i++) idx += groups[i].length;
  return String.fromCharCode(65 + idx);
}

function countdown(ms: number): string {
  if (ms <= 0) return "now";
  const d = Math.floor(ms / (24 * 3600 * 1000));
  const h = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((ms % (3600 * 1000)) / 60000);
  return `${h}h ${m}m`;
}
