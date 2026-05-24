"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LockSimple,
  CheckCircle,
  ArrowRight,
  CaretDown,
  Warning,
} from "@phosphor-icons/react";
import {
  subscribeEmail,
  isValidEmail,
  cleanMailchimpMessage,
} from "../lib/mailchimpClient";
import { BodyFatSelector } from "./BodyFatSelector";

const PACES = [
  { key: "gentle", label: "Gentle", rate: 0.005, sub: "0.5% / wk" },
  { key: "steady", label: "Steady", rate: 0.0075, sub: "0.75% / wk" },
  { key: "aggressive", label: "Aggressive", rate: 0.01, sub: "1% / wk" },
] as const;

const CALORIE_FLOOR = 1200;

type Snapshot = { bodyweight: number; bodyFat: number };

const whole = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("en-GB") : "-";

function activityCategory(vRaw: number) {
  const v = Math.round(vRaw * 10) / 10;
  if (v <= 1.2)
    return {
      name: "Very Sedentary",
      desc: "Desk job, minimal movement, no structured exercise",
    };
  if (v <= 1.4)
    return {
      name: "Lightly Active",
      desc: "Light movement, light exercise 1-3x/week",
    };
  if (v === 1.5)
    return {
      name: "Recommended Baseline",
      desc: "Mix of movement + workouts 3-4x/week",
    };
  if (v <= 1.7)
    return {
      name: "Moderately Active",
      desc: "Regular training plus active commute/standing job",
    };
  if (v <= 1.8)
    return {
      name: "Active Job",
      desc: "Manual labour / on your feet all day, plus training",
    };
  if (v <= 2.2)
    return {
      name: "Very Active",
      desc: "Intense daily training and/or very demanding job",
    };
  if (v <= 3.0)
    return {
      name: "Athlete Level",
      desc: "Competitive sport, multiple sessions/day",
    };
  return {
    name: "Extreme/Expedition",
    desc: "Elite endurance, extreme environments",
  };
}

// One-liner under the Fat % slider (protein is fixed, so fat trades off carbs).
function fatBlurb(fatPctOfCalories: number) {
  const pct = Math.round(fatPctOfCalories * 100);
  if (pct <= 29)
    return "More carbs left over, great for fuelling hard training and people who love carbs.";
  if (pct <= 39) return "An even mix of fats and carbs, a safe default.";
  return "Fewer carbs, suits people who prefer fattier foods or feel better on lower carb.";
}

// All intermediate math lives here and is never rendered.
function compute(
  s: Snapshot,
  activity: number,
  weeklyLossRate: number,
  proteinFactor: number,
  fatPctOfCalories: number
) {
  const fatMass = s.bodyweight * (s.bodyFat / 100);
  const leanBodyMass = s.bodyweight - fatMass;
  const rmr = 370 + 21.6 * leanBodyMass; // Katch-McArdle
  const maintenance = rmr * activity;
  const dailyDeficit = (s.bodyweight * weeklyLossRate * 7700) / 7;
  const calorieTarget = maintenance - dailyDeficit;

  const proteinG = leanBodyMass * proteinFactor;
  const proteinKcal = proteinG * 4;
  const fatKcal = fatPctOfCalories * calorieTarget;
  const fatG = fatKcal / 9;
  const carbKcal = calorieTarget - proteinKcal - fatKcal;
  const carbG = carbKcal / 4;
  const fibreG = Math.ceil((calorieTarget / 1000) * 15); // 15g per 1000 kcal

  return {
    maintenance,
    calorieTarget,
    proteinG,
    fatG,
    carbG: Math.max(0, carbG),
    fibreG,
    belowFloor: calorieTarget < CALORIE_FLOOR,
  };
}

export function MacroCalculator() {
  const reduce = useReducedMotion();

  // client-facing inputs
  const [bodyweight, setBodyweight] = useState("");
  const [bodyFat, setBodyFat] = useState(20);
  const [activity, setActivity] = useState(1.5);
  const [pace, setPace] = useState(0.0075);

  // advanced (collapsed)
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [proteinFactor, setProteinFactor] = useState(2.8);
  const [fatPct, setFatPct] = useState(0.25);

  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // email gate
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const result = useMemo(
    () =>
      snapshot
        ? compute(snapshot, activity, pace, proteinFactor, fatPct)
        : null,
    [snapshot, activity, pace, proteinFactor, fatPct]
  );

  const cat = activityCategory(activity);

  function handleCalculate() {
    const bw = parseFloat(bodyweight);
    const next: Record<string, string> = {};

    if (!Number.isFinite(bw) || bw <= 0)
      next.bodyweight = "Enter your bodyweight in kg.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setSnapshot(null);
      return;
    }
    setSnapshot({ bodyweight: bw, bodyFat });
  }

  async function handleSubscribe() {
    if (!isValidEmail(email)) {
      setStatusMsg("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    setStatusMsg("");
    try {
      const res = await subscribeEmail(email);
      if (res.result === "success") {
        setStatusMsg("You're in! Your full macro breakdown is unlocked below.");
      } else {
        const clean = cleanMailchimpMessage(res.msg);
        setStatusMsg(
          clean
            ? `${clean} Your macros are unlocked below anyway.`
            : "You're already on the list, macros unlocked below."
        );
      }
    } catch {
      setStatusMsg(
        "Couldn't reach the mailing list right now, but your macros are unlocked below."
      );
    } finally {
      setSubmitting(false);
      setUnlocked(true);
    }
  }

  const inputClass =
    "w-full rounded-2xl border hairline bg-canvas px-4 py-3 font-mono text-lg text-ink-900 outline-none transition focus:border-ember/50";
  const labelClass =
    "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";
  const rangeClass =
    "mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-ember";

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- INPUTS ---------- */}
      <div className="rounded-5xl border hairline bg-white p-6 shadow-diffusion-sm md:p-8">
        {/* bodyweight */}
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <label htmlFor="mc-bw" className={labelClass}>
            Bodyweight (kg)
          </label>
          <input
            id="mc-bw"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            placeholder="e.g. 84"
            value={bodyweight}
            onChange={(e) => setBodyweight(e.target.value)}
            className={inputClass}
            aria-invalid={!!errors.bodyweight}
          />
          {errors.bodyweight && (
            <p className="text-xs leading-snug text-ember-deep">
              {errors.bodyweight}
            </p>
          )}
        </div>

        {/* body fat selector */}
        <div className="mt-8">
          <BodyFatSelector
            label="Body fat %"
            value={bodyFat}
            onChange={setBodyFat}
            idPrefix="mc-bf"
          />
        </div>

        {/* activity slider */}
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <label htmlFor="mc-activity" className={labelClass}>
              Activity level
            </label>
            <span className="font-mono text-sm text-ink-900">
              {activity.toFixed(1)}
            </span>
          </div>
          <input
            id="mc-activity"
            type="range"
            min="1.1"
            max="4.0"
            step="0.1"
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.target.value))}
            className={rangeClass}
            aria-valuetext={`${activity.toFixed(1)}, ${cat.name}`}
          />
          <div className="mt-3 rounded-2xl bg-ink-50 px-4 py-3">
            <div className="font-display text-lg font-semibold uppercase tracking-[0.01em] text-ink-900">
              {cat.name}
            </div>
            <div className="mt-0.5 text-sm leading-snug text-ink-600">
              {cat.desc}
            </div>
          </div>
        </div>

        {/* pace selector */}
        <div className="mt-7">
          <div className={labelClass}>Goal pace</div>
          <div
            role="radiogroup"
            aria-label="Goal pace"
            className="mt-3 grid grid-cols-3 gap-2 rounded-full border hairline bg-canvas p-1"
          >
            {PACES.map((p) => {
              const selected = p.rate === pace;
              return (
                <button
                  key={p.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPace(p.rate)}
                  className={`flex flex-col items-center justify-center rounded-full px-2 py-2.5 text-center transition ${
                    selected
                      ? "bg-ink-900 text-canvas"
                      : "text-ink-600 hover:bg-ink-100"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.1em]">
                    {p.label}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                      selected ? "text-canvas/70" : "text-ink-400"
                    }`}
                  >
                    {p.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* advanced (collapsed) */}
        <div className="mt-6 border-t hairline pt-5">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            aria-expanded={advancedOpen}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 transition hover:text-ink-900"
          >
            <CaretDown
              size={12}
              weight="bold"
              className={`transition ${advancedOpen ? "rotate-180" : ""}`}
            />
            Advanced settings (optional)
          </button>

          {advancedOpen && (
            <div className="mt-4 flex flex-col gap-6 rounded-3xl border hairline bg-canvas p-5">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="mc-protein" className={labelClass}>
                    Protein (g per kg lean mass)
                  </label>
                  <span className="font-mono text-sm text-ink-900">
                    {proteinFactor.toFixed(1)}
                  </span>
                </div>
                <input
                  id="mc-protein"
                  type="range"
                  min="2.0"
                  max="3.0"
                  step="0.1"
                  value={proteinFactor}
                  onChange={(e) => setProteinFactor(parseFloat(e.target.value))}
                  className={rangeClass}
                />
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Grams of protein per kg of your lean mass (bodyweight minus
                  fat, not total weight). More protein protects muscle while
                  losing fat and keeps you fuller. Guide: 2.0-2.2 general
                  maintenance, 2.3-2.6 most people training and dieting, 2.7-3.0
                  aggressive fat loss or max muscle retention.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="mc-fat" className={labelClass}>
                    Fat (% of calories)
                  </label>
                  <span className="font-mono text-sm text-ink-900">
                    {Math.round(fatPct * 100)}%
                  </span>
                </div>
                <input
                  id="mc-fat"
                  type="range"
                  min="0.25"
                  max="0.45"
                  step="0.05"
                  value={fatPct}
                  onChange={(e) => setFatPct(parseFloat(e.target.value))}
                  className={rangeClass}
                />
                <div className="mt-2 flex justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
                  <span>Lower fat (more carbs)</span>
                  <span className="text-right">Higher fat (fewer carbs)</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">
                  {fatBlurb(fatPct)}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="btn-ember mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] sm:w-auto"
        >
          {snapshot ? "Recalculate" : "Calculate"}
          <ArrowRight size={16} weight="bold" />
        </button>
      </div>

      {/* ---------- HEADLINE RESULT (calorie target) ---------- */}
      {result && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-6 text-canvas shadow-diffusion md:p-10"
        >
          <div className="pointer-events-none absolute inset-0 speed-stripes" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-ember/20 blur-3xl" />

          <div className="relative">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
              Your daily target
            </div>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
                  Daily calorie target
                </div>
                <div className="mt-1 font-display text-6xl font-bold uppercase leading-none tracking-[-0.01em] md:text-7xl">
                  {whole(result.calorieTarget)}
                  <span className="ml-2 text-2xl text-canvas/50">kcal</span>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
                  Est. maintenance
                </div>
                <div className="mt-1 font-mono text-2xl text-canvas/80">
                  {whole(result.maintenance)} kcal
                </div>
              </div>
            </div>

            {result.belowFloor && (
              <div className="mt-6 flex items-start gap-2 rounded-2xl bg-ember/15 px-4 py-3 text-sm leading-snug text-ember-soft">
                <Warning size={18} weight="fill" className="mt-0.5 flex-none" />
                <span>
                  This target dips below a safe floor (about {CALORIE_FLOOR}{" "}
                  kcal). Choose a gentler pace above.
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ---------- EMAIL GATE ---------- */}
      {result && !unlocked && (
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
                Unlock your full macro breakdown
              </h3>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-600">
                Enter your email to reveal your daily protein, fat and carb
                targets to hit that calorie number.
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
                    if (e.key === "Enter") handleSubscribe();
                  }}
                  className="w-full flex-1 rounded-full border hairline bg-canvas px-5 py-3 text-base text-ink-900 outline-none transition focus:border-ember/50"
                  aria-label="Email address"
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={submitting}
                  className="btn-ember inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Unlock my macros"}
                  {!submitting && <ArrowRight size={16} weight="bold" />}
                </button>
              </div>

              {statusMsg && (
                <p
                  className="mt-3 text-xs leading-snug text-ember-deep"
                  aria-live="polite"
                >
                  {statusMsg}
                </p>
              )}

              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                One email when there's something worth saying · unsubscribe anytime
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---------- MACRO BREAKDOWN (revealed after email) ---------- */}
      {result && unlocked && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          className="flex flex-col gap-6"
        >
          {statusMsg && (
            <div
              className="flex items-center gap-2 rounded-full bg-ember/10 px-4 py-2.5 text-xs font-medium text-ember-deep"
              aria-live="polite"
            >
              <CheckCircle size={16} weight="fill" />
              {statusMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { k: "Protein", v: result.proteinG },
              { k: "Fat", v: result.fatG },
              { k: "Carbs", v: result.carbG },
            ].map((m) => (
              <div
                key={m.k}
                className="rounded-4xl border hairline bg-white p-6 shadow-diffusion-sm"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember-deep">
                  {m.k}
                </div>
                <div className="mt-2 font-display text-5xl font-bold uppercase leading-none tracking-[-0.01em] text-ink-900">
                  {whole(m.v)}
                  <span className="ml-1 text-2xl text-ink-400">g</span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                  per day
                </div>
              </div>
            ))}
          </div>

          {/* Fibre target */}
          <div className="flex flex-col gap-3 rounded-4xl border border-ember/30 bg-white p-6 shadow-diffusion-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember-deep">
                Fibre
              </span>
              <span className="font-display text-4xl font-bold uppercase leading-none tracking-[-0.01em] text-ink-900">
                {whole(result.fibreG)}
                <span className="ml-1 text-xl text-ink-400">g</span>
              </span>
            </div>
            <p className="max-w-[46ch] text-xs leading-snug text-ink-500">
              Aim for at least this much fibre per day. Fibre is part of your
              carbs, not extra, so it does not change your calories.
            </p>
          </div>

          {/* Disclaimers */}
          <div className="rounded-3xl border hairline bg-ink-50/60 p-5">
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-start gap-2.5 text-sm leading-snug text-ink-600">
                <span className="mt-2 h-1 w-3 flex-none rounded-full bg-ink-300" />
                This is an estimate of your calories, not an exact prescription.
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-snug text-ink-600">
                <span className="mt-2 h-1 w-3 flex-none rounded-full bg-ink-300" />
                Most people underestimate their body fat, so be honest and round
                up if unsure.
              </li>
            </ul>
          </div>

          <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            Adjust activity, pace or advanced settings above to update live
          </p>
        </motion.div>
      )}
    </div>
  );
}
