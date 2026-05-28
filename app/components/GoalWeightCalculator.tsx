"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LockSimple, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import {
  subscribeEmail,
  isValidEmail,
  cleanMailchimpMessage,
} from "../lib/mailchimpClient";
import { BodyFatFigure, BodyFatControls, type Sex } from "./BodyFatSelector";
import { CountUp } from "./motion";

const RATES = [
  { key: "slow", label: "Slow", rate: 0.005, sub: "0.5% / wk" },
  { key: "moderate", label: "Moderate", rate: 0.01, sub: "1% / wk" },
  { key: "aggressive", label: "Aggressive", rate: 0.015, sub: "1.5% / wk" },
] as const;

type Snapshot = { weight: number; currentBf: number; goalBf: number };
type Projection = { week: number; weight: number; lost: number }[];
type Daily = { t: number; trend: number; weight: number }[];

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : "-");

// Small seeded PRNG so the daily weigh-in scatter is stable across re-renders
// but changes when the inputs change.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Realistic DAILY weigh-in series: a front-loaded trend (a big early
// water/glycogen drop, then a slower fat-loss decline that levels off near the
// goal) with day-to-day water fluctuation layered on top (spikes and whooshes).
function buildDaily(
  start: number,
  goal: number,
  totalWeeks: number,
  seed: number
): Daily {
  const rand = mulberry32(seed);
  const delta = Math.max(0, start - goal);
  const T = Math.max(1, totalWeeks);

  // split the loss into a fast water/glycogen part and a slower fat part
  const waterPart = Math.min(0.35 * delta, Math.min(3, start * 0.03));
  const fatPart = delta - waterPart;
  const tauW = 0.7; // water clears over ~1-2 weeks
  const tauF = Math.max(1.5, T / 3); // fat loss decays across the timeline
  const normW = 1 - Math.exp(-T / tauW);
  const normF = 1 - Math.exp(-T / tauF);
  const trendAt = (t: number) => {
    const aW = normW > 0 ? (1 - Math.exp(-t / tauW)) / normW : 1;
    const aF = normF > 0 ? (1 - Math.exp(-t / tauF)) / normF : 1;
    return start - waterPart * aW - fatPart * aF;
  };

  const amp = Math.max(0.3, start * 0.0085); // typical daily water swing
  const totalDays = Math.round(T * 7);
  const step = Math.max(1, Math.ceil(totalDays / 140)); // keep the chart legible

  const out: Daily = [];
  let walk = 0;
  for (let d = 0; d <= totalDays; d += step) {
    const t = d / 7;
    const tr = trendAt(t);
    let weight: number;
    if (d === 0) {
      weight = start; // first weigh-in is exact
    } else {
      walk = 0.55 * walk + 0.45 * (rand() * 2 - 1) * amp; // mean-reverting wobble
      let noise = walk;
      if (rand() < 0.12) noise += (rand() * 2 - 1) * amp * 2.2; // spike / whoosh
      weight = tr + noise;
    }
    const hi = start + amp * 1.6;
    const lo = goal - amp * 1.2;
    out.push({ t, trend: tr, weight: Math.min(hi, Math.max(lo, weight)) });
  }
  if (out[out.length - 1].t < T) {
    out.push({ t: T, trend: goal, weight: goal + (rand() * 2 - 1) * amp * 0.6 });
  }
  return out;
}

function compute(s: Snapshot, rate: number) {
  const fatMass = s.weight * (s.currentBf / 100);
  const leanBodyMass = s.weight - fatMass;
  const goalWeight = leanBodyMass / (1 - s.goalBf / 100);
  const requiredLoss = s.weight - goalWeight;

  const projection: Projection = [{ week: 0, weight: s.weight, lost: 0 }];
  let prev = s.weight;
  let estimatedWeeks = 52;
  let reached = false;

  for (let w = 1; w <= 52; w++) {
    let next = prev * (1 - rate);
    if (next <= goalWeight) {
      next = goalWeight; // clamp, never overshoot below goal
      projection.push({ week: w, weight: next, lost: s.weight - next });
      estimatedWeeks = w;
      reached = true;
      break;
    }
    projection.push({ week: w, weight: next, lost: s.weight - next });
    prev = next;
  }

  const lastWeek = projection[projection.length - 1].week;
  const seed =
    (Math.round(s.weight * 100) * 2654435761) ^
    (Math.round(s.goalBf * 100) * 40503) ^
    (Math.round(rate * 10000) * 2246822519);
  const daily = buildDaily(s.weight, goalWeight, lastWeek, seed);

  return {
    goalWeight,
    requiredLoss,
    projection,
    estimatedWeeks,
    reached,
    daily,
    lastWeek,
  };
}

export function GoalWeightCalculator() {
  const reduce = useReducedMotion();

  // raw input strings (controlled)
  const [weight, setWeight] = useState("");
  const [currentBf, setCurrentBf] = useState(20);
  const [goalBf, setGoalBf] = useState(15);
  const [sex, setSex] = useState<Sex>("male");
  const [rate, setRate] = useState<number>(0.01);

  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // email gate
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // result recomputes live when the rate toggle changes
  const result = useMemo(
    () => (snapshot ? compute(snapshot, rate) : null),
    [snapshot, rate]
  );

  const rateLabel = RATES.find((r) => r.rate === rate)?.label ?? "Moderate";

  function handleCalculate() {
    const w = parseFloat(weight);
    const next: Record<string, string> = {};

    if (!Number.isFinite(w) || w <= 0)
      next.weight = "Enter your current weight in kg.";
    if (goalBf >= currentBf)
      next.goalBf =
        "Your goal body fat must be lower than your current body fat.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setSnapshot(null);
      return;
    }
    setSnapshot({ weight: w, currentBf, goalBf });
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
        setStatusMsg("You're in! Your full plan is unlocked below.");
      } else {
        const clean = cleanMailchimpMessage(res.msg);
        setStatusMsg(
          clean
            ? `${clean} Your plan is unlocked below anyway.`
            : "You're already on the list, plan unlocked below."
        );
      }
    } catch {
      setStatusMsg(
        "Couldn't reach the mailing list right now, but your plan is unlocked below."
      );
    } finally {
      setSubmitting(false);
      setUnlocked(true); // never block them from their result
    }
  }

  const inputClass =
    "w-full rounded-2xl border hairline bg-canvas px-4 py-3 font-mono text-lg text-ink-900 outline-none transition focus:border-ember/50";
  const labelClass =
    "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- INPUTS ---------- */}
      <div className="rounded-5xl border hairline bg-white p-6 shadow-diffusion-sm md:p-8">
        <div className="flex flex-col gap-8">
          {/* Current weight (left) + Sex toggle (right) on one row,
              packed close together, baseline-aligned. Stacks on mobile. */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="flex w-full flex-col gap-2 sm:max-w-[260px]">
              <label htmlFor="gw-weight" className={labelClass}>
                Current weight (kg)
              </label>
              <input
                id="gw-weight"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                placeholder="e.g. 84.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={inputClass}
                aria-invalid={!!errors.weight}
              />
              {errors.weight && (
                <p className="text-xs leading-snug text-ember-deep">
                  {errors.weight}
                </p>
              )}
            </div>

            {/* Shared sex toggle: one control for BOTH tiles. */}
            <div
              role="radiogroup"
              aria-label="Sex"
              className="flex self-start rounded-full border hairline bg-canvas p-0.5 sm:self-end"
            >
              {(["male", "female"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={sex === s}
                  onClick={() => setSex(s)}
                  className={`rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                    sex === s
                      ? "bg-ink-900 text-canvas"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  {s === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>

          {/* Current + Goal tiles: side by side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold uppercase leading-none tracking-[0.02em] text-ink-900 md:text-3xl">
                  Current
                </div>
                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                  Body fat %
                </div>
              </div>
              <BodyFatFigure sex={sex} value={currentBf} />
              <BodyFatControls
                label="Current body fat %"
                value={currentBf}
                onChange={setCurrentBf}
                sex={sex}
                onSexChange={setSex}
                showLabel={false}
                showSexToggle={false}
                showDisclaimers={false}
                idPrefix="gw-cur"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold uppercase leading-none tracking-[0.02em] text-ink-900 md:text-3xl">
                  Goal
                </div>
                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                  Body fat %
                </div>
              </div>
              <BodyFatFigure sex={sex} value={goalBf} />
              <BodyFatControls
                label="Goal body fat %"
                value={goalBf}
                onChange={setGoalBf}
                sex={sex}
                onSexChange={setSex}
                showLabel={false}
                showSexToggle={false}
                showDisclaimers={false}
                idPrefix="gw-goal"
              />
              {errors.goalBf && (
                <p className="text-xs leading-snug text-ember-deep">
                  {errors.goalBf}
                </p>
              )}
            </div>
          </div>

          {/* shared disclaimers (one set under both tiles) */}
          <div className="rounded-3xl border hairline bg-ink-50/60 p-4">
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2.5 text-xs leading-snug text-ink-500">
                <span className="mt-1.5 h-1 w-3 flex-none rounded-full bg-ink-300" />
                This is an estimate only.
              </li>
              <li className="flex items-start gap-2.5 text-xs leading-snug text-ink-500">
                <span className="mt-1.5 h-1 w-3 flex-none rounded-full bg-ink-300" />
                Most people underestimate their body fat, so be honest and round
                up if unsure.
              </li>
            </ul>
          </div>
        </div>

        {/* rate toggle */}
        <div className="mt-7">
          <div className={labelClass}>Pace of fat loss</div>
          <div
            role="radiogroup"
            aria-label="Pace of fat loss"
            className="mt-3 grid grid-cols-3 gap-2 rounded-full border hairline bg-canvas p-1"
          >
            {RATES.map((r) => {
              const selected = r.rate === rate;
              return (
                <button
                  key={r.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setRate(r.rate)}
                  className={`flex flex-col items-center justify-center rounded-full px-2 py-2.5 text-center transition ${
                    selected
                      ? "bg-ink-900 text-canvas"
                      : "text-ink-600 hover:bg-ink-100"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.1em]">
                    {r.label}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                      selected ? "text-canvas/70" : "text-ink-400"
                    }`}
                  >
                    {r.sub}
                  </span>
                </button>
              );
            })}
          </div>
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

      {/* ---------- HEADLINE RESULT ---------- */}
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
              Your result
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
                  Goal weight
                </div>
                <div className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-[-0.01em] md:text-6xl">
                  <CountUp value={result.goalWeight} decimals={1} />
                  <span className="ml-1 text-2xl text-canvas/50">kg</span>
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
                  Required loss
                </div>
                <div className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-[-0.01em] text-ember-soft md:text-6xl">
                  <CountUp value={result.requiredLoss} decimals={1} />
                  <span className="ml-1 text-2xl text-canvas/40">kg</span>
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
                  Time to goal
                </div>
                <div className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-[-0.01em] md:text-6xl">
                  {result.reached ? `≈${result.estimatedWeeks}` : "52+"}
                  <span className="ml-1 text-2xl text-canvas/50">wks</span>
                </div>
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/40">
                  at {rateLabel} pace
                </div>
              </div>
            </div>
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
                Unlock your week-by-week plan
              </h3>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-600">
                Enter your email to reveal your full {result.reached ? result.estimatedWeeks : "52+"}-week
                projection, a week-by-week chart and table you can train against.
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
                  {submitting ? "Sending…" : "Unlock my plan"}
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

      {/* ---------- DETAILED PLAN (revealed after email) ---------- */}
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

          {/* Chart */}
          <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-6 text-canvas shadow-diffusion md:p-8">
            <div className="pointer-events-none absolute inset-0 speed-stripes" />
            <div className="relative">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
                  Projected weigh-ins
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/40">
                  {rateLabel} · {fmt(rate * 100)}% / wk
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-canvas/45">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-canvas/60" />
                  Daily weigh-ins
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full bg-ember-bright" />
                  Trend
                </span>
              </div>
              <ProjectionChart
                daily={result.daily}
                goalWeight={result.goalWeight}
                currentWeight={result.projection[0].weight}
                lastWeek={result.lastWeek}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-5xl border hairline bg-white shadow-diffusion-sm">
            <div className="flex items-center justify-between border-b hairline px-6 py-4">
              <h3 className="font-display text-xl font-semibold uppercase tracking-[0.01em] text-ink-900">
                Week-by-week
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                {result.projection.length - 1} weeks
              </span>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b hairline font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    <th className="px-6 py-3 font-normal">Week</th>
                    <th className="px-6 py-3 text-right font-normal">
                      Weight (kg)
                    </th>
                    <th className="px-6 py-3 text-right font-normal">
                      Lost (kg)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.projection.map((p) => (
                    <tr
                      key={p.week}
                      className="border-b border-ink-100/60 last:border-0 odd:bg-ink-50/40"
                    >
                      <td className="px-6 py-2.5 font-mono text-sm text-ink-500">
                        {String(p.week).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-2.5 text-right font-mono text-sm text-ink-900">
                        {fmt(p.weight)}
                      </td>
                      <td className="px-6 py-2.5 text-right font-mono text-sm text-ember-deep">
                        {p.lost > 0 ? `−${fmt(p.lost)}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            Switch pace above to update your plan live
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Inline SVG weigh-in chart (no chart library) ---------- */
function ProjectionChart({
  daily,
  goalWeight,
  currentWeight,
  lastWeek,
}: {
  daily: Daily;
  goalWeight: number;
  currentWeight: number;
  lastWeek: number;
}) {
  const W = 640;
  const H = 260;
  const padL = 46;
  const padR = 18;
  const padT = 18;
  const padB = 30;

  const lw = Math.max(1, lastWeek);
  const weights = daily.map((p) => p.weight);
  const dataMax = Math.max(currentWeight, ...weights);
  const dataMin = Math.min(goalWeight, ...weights);
  const padY = Math.max(0.5, (dataMax - dataMin) * 0.08);
  const yMax = dataMax + padY;
  const yMin = dataMin - padY;

  const x = (t: number) => padL + (t / lw) * (W - padL - padR);
  const y = (wt: number) =>
    padT + (1 - (wt - yMin) / (yMax - yMin)) * (H - padT - padB);

  const baseline = H - padB;
  const trendPts = daily.map((p) => `${x(p.t)},${y(p.trend)}`);
  const weighPts = daily.map((p) => `${x(p.t)},${y(p.weight)}`);
  const areaPath = `M ${x(0)},${baseline} L ${trendPts.join(
    " L "
  )} L ${x(lw)},${baseline} Z`;
  const goalY = y(goalWeight);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-4 h-auto w-full"
      role="img"
      aria-label={`Projected daily weigh-ins from ${currentWeight.toFixed(
        1
      )} kg toward ${goalWeight.toFixed(
        1
      )} kg over ${lw} weeks: a larger initial drop, then leveling off, with day-to-day fluctuation.`}
    >
      <defs>
        <linearGradient id="gw-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8623f" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#e8623f" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* goal line */}
      <line
        x1={padL}
        y1={goalY}
        x2={W - padR}
        y2={goalY}
        stroke="rgba(244,241,236,0.28)"
        strokeWidth="1"
        strokeDasharray="4 5"
      />
      <text
        x={padL}
        y={goalY - 6}
        fill="rgba(244,241,236,0.5)"
        fontSize="11"
        fontFamily="monospace"
      >
        goal {goalWeight.toFixed(1)}kg
      </text>

      {/* y-axis end labels */}
      <text
        x={8}
        y={y(currentWeight) + 4}
        fill="rgba(244,241,236,0.45)"
        fontSize="11"
        fontFamily="monospace"
      >
        {currentWeight.toFixed(0)}
      </text>
      <text
        x={8}
        y={goalY + 4}
        fill="rgba(244,241,236,0.45)"
        fontSize="11"
        fontFamily="monospace"
      >
        {goalWeight.toFixed(0)}
      </text>

      {/* area under the trend */}
      <path d={areaPath} fill="url(#gw-area)" />

      {/* trend halo */}
      <polyline
        points={trendPts.join(" ")}
        fill="none"
        stroke="#e8623f"
        strokeOpacity="0.18"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* daily weigh-ins: faint connecting line + dots */}
      <polyline
        points={weighPts.join(" ")}
        fill="none"
        stroke="rgba(244,241,236,0.3)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {daily.map((p, i) => (
        <circle
          key={i}
          cx={x(p.t)}
          cy={y(p.weight)}
          r="2"
          fill="rgba(244,241,236,0.6)"
        />
      ))}

      {/* trend line (bold) */}
      <polyline
        points={trendPts.join(" ")}
        fill="none"
        stroke="#e8623f"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* start + goal markers */}
      <circle cx={x(0)} cy={y(currentWeight)} r="4.5" fill="#f4f1ec" />
      <circle cx={x(lw)} cy={y(goalWeight)} r="5" fill="#e8623f" />

      {/* x-axis labels */}
      <text
        x={x(0)}
        y={H - 8}
        fill="rgba(244,241,236,0.45)"
        fontSize="11"
        fontFamily="monospace"
        textAnchor="start"
      >
        Wk 0
      </text>
      <text
        x={x(lw)}
        y={H - 8}
        fill="rgba(244,241,236,0.45)"
        fontSize="11"
        fontFamily="monospace"
        textAnchor="end"
      >
        Wk {lw}
      </text>
    </svg>
  );
}
