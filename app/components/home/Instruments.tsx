"use client";

import Link from "next/link";
import { ArrowUpRight, Brain, ChartLineUp, ForkKnife } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "../motion";

/* Mini body-fat instrument: a static slider with an ember tick on the live value.
   Not interactive on the homepage — it teases the full slider on /level-zero. */
function BodyFatInstrument() {
  const stops = [10, 15, 20, 25, 30, 35] as const;
  const [active, setActive] = useState<number>(20);

  // gentle auto-advance so the readout breathes
  useEffect(() => {
    let i = 2;
    const id = setInterval(() => {
      i = (i + 1) % stops.length;
      setActive(stops[i]);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const note = useMemo(() => {
    if (active <= 12) return "Lean · sustainable target for an athlete";
    if (active <= 17) return "Fit & healthy · the strong, sustainable range";
    if (active <= 22) return "Healthy average · room to lean out";
    if (active <= 27) return "Upper limit of acceptable · risk climbs";
    return "High · health markers begin to suffer";
  }, [active]);

  return (
    <article className="relative h-full overflow-hidden rounded-3xl border hairline bg-white p-7 md:p-8">
      {/* code chip + REC */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
        <span className="text-ember-deep">IN-04 · Body-fat sweep</span>
        <span className="inline-flex items-center gap-1.5 text-ember-deep">
          <span className="inline-block h-2 w-2 rounded-full bg-ember animate-ember-pulse" />
          REC
        </span>
      </div>

      {/* the slider */}
      <div className="mt-9">
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
          <span>Live readout</span>
          <span className="font-display text-4xl font-semibold tabular-nums tracking-tight text-ink-900 md:text-5xl">
            {active}
            <span className="ml-1 text-base font-mono uppercase tracking-[0.22em] text-ink-400">
              % bf
            </span>
          </span>
        </div>

        {/* the track */}
        <div className="relative mt-6 h-10">
          {/* baseline rule */}
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ink-200" />
          {/* tick marks */}
          <div className="absolute inset-0 flex items-center justify-between">
            {stops.map((s) => {
              const on = s === active;
              return (
                <div key={s} className="relative flex flex-col items-center">
                  <span
                    aria-hidden
                    className={`block w-px ${on ? "h-6 bg-ember" : "h-4 bg-ink-300"}`}
                  />
                  <span
                    className={`mt-2 font-mono text-[10px] uppercase tracking-[0.18em] ${
                      on ? "text-ember-deep" : "text-ink-400"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* note */}
        <p className="mt-9 max-w-[44ch] border-t hairline pt-5 text-sm leading-[1.6] text-ink-700">
          {note}.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t hairline pt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
        <span>Calibration · 10–35 % range</span>
        <Link
          href="/level-zero"
          className="inline-flex items-center gap-1.5 text-ember-deep hover:text-ink-900"
        >
          Use full instrument →
        </Link>
      </div>
    </article>
  );
}

/* Mini live-status readout — what the system sees this week. */
function LiveSignals() {
  const rows = [
    { d: "Mon · 06:40", s: "Lower · Heavy", c: "live" as const },
    { d: "Tue · 06:40", s: "Conditioning · Z2", c: "queued" as const },
    { d: "Wed · 06:40", s: "Upper · Push focus", c: "queued" as const },
    { d: "Thu · 06:40", s: "Posterior chain", c: "queued" as const },
  ];
  return (
    <article className="relative h-full overflow-hidden rounded-3xl border hairline bg-white p-7 md:p-8">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
        <span className="text-ember-deep">IN-02 · Live schedule</span>
        <span className="text-ink-400">Synced · 12 m ago</span>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.d}
            className="flex items-center justify-between rounded-2xl border hairline bg-canvas px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span
                className={
                  r.c === "live"
                    ? "h-2 w-2 rounded-full bg-ember animate-ember-pulse"
                    : "h-2 w-2 rounded-full bg-ink-200"
                }
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                {r.d}
              </span>
              <span className="text-sm text-ink-800">{r.s}</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
              {r.c}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

/* Mini macro-tile carousel, lab-style. */
function MacroSignals() {
  const tiles = [
    { k: "Protein", v: "168 g", t: "+3 g vs last wk" },
    { k: "Calories", v: "2,470", t: "−180 cut" },
    { k: "Steps", v: "11,420", t: "7-day avg" },
    { k: "Sleep", v: "7h 18m", t: "+22 m" },
    { k: "HRV", v: "62 ms", t: "+4" },
    { k: "RHR", v: "54 bpm", t: "−1" },
    { k: "Sessions", v: "4 / 4", t: "complete" },
  ];
  const loop = [...tiles, ...tiles];
  return (
    <article className="relative h-full overflow-hidden rounded-3xl border hairline bg-white p-7 pb-9 md:p-8 md:pb-10">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
        <span className="text-ember-deep">IN-03 · Macro stream</span>
        <span className="text-ink-400">Rolling 7 d</span>
      </div>
      <div className="-mx-8 mt-6 overflow-hidden">
        <div className="flex w-max gap-3 px-8 animate-marquee">
          {loop.map((t, i) => (
            <div
              key={i}
              className="flex w-[180px] flex-col gap-1 rounded-2xl border hairline bg-canvas px-4 py-3"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">
                {t.k}
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums tracking-tight text-ink-900">
                {t.v}
              </span>
              <span className="text-[11px] text-ink-500">{t.t}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/* Form-check instrument with highlighted cue. */
function FormCheckInstrument() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2800);
    }, 4400);
    return () => clearInterval(id);
  }, []);
  return (
    <article className="relative h-full overflow-hidden rounded-3xl border hairline bg-white p-7 md:p-8">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
        <span className="text-ember-deep">IN-01 · Form check</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/10 px-2 py-0.5 text-ember-deep">
          reviewed
        </span>
      </div>
      <p className="mt-6 max-w-[34ch] text-[15px] leading-snug text-ink-800">
        “<motion.span
          className="rounded bg-ember/15 px-1"
          animate={{
            backgroundColor: [
              "rgba(200,85,61,0.0)",
              "rgba(200,85,61,0.18)",
              "rgba(200,85,61,0.0)",
            ],
          }}
          transition={{ duration: 3.4, repeat: Infinity }}
        >
          Brace harder before unracking
        </motion.span>
        , your spine extension at the top is bleeding bar speed by rep 3. Cue:
        ribs down, glutes on, then walk-out.”
      </p>
      <AnimatePresence>
        {pulse && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="absolute bottom-6 right-6 rounded-full bg-ink-900 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-canvas shadow-diffusion-sm"
          >
            New voice note · 0:47
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function HomeInstruments() {
  return (
    <section className="border-b hairline bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* INTENTIONAL SEAM — switch to manual / lab voice */}
        <div className="flex items-end justify-between border-b hairline pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
          <span>Module 04 · Instruments — Live</span>
          <span className="hidden md:inline">Doc · CBMJ / Field Manual rev. 03</span>
          <span>Page 014 / 048</span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ember-deep">
              04 / 10 — The system
            </div>
            <h2 className="mt-4 max-w-md font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-6xl">
              A coach who reads your week before you do.
            </h2>
          </Reveal>
          <Reveal
            delay={0.05}
            className="md:col-span-6 md:col-start-7 max-w-[58ch] self-end"
          >
            <p className="text-base leading-relaxed text-ink-700">
              Every block is engineered around the data you generate, sleep,
              lifts, food, stress, life. The app surfaces what matters; I do
              the thinking and write the call. You just train.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-ember animate-ember-pulse" />
                4 instruments live
              </span>
              <span className="text-ink-300">·</span>
              <Link
                href="/level-zero"
                className="inline-flex items-center gap-1.5 text-ember-deep hover:text-ink-900"
              >
                Open the full panel →
              </Link>
            </div>
          </Reveal>
        </div>

        {/* instrument grid */}
        <Reveal className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-7">
            <BodyFatInstrument />
          </div>
          <div className="md:col-span-5">
            <FormCheckInstrument />
          </div>
          <div className="md:col-span-7">
            <LiveSignals />
          </div>
          <div className="md:col-span-5">
            <MacroSignals />
          </div>
        </Reveal>

        {/* foot mark */}
        <div className="mt-12 flex items-center justify-between border-t hairline pt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
          <span>Source · client devices · last 24 h</span>
          <Link
            href="/level-zero"
            className="inline-flex items-center gap-2 rounded-full border hairline px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-700 transition hover:bg-ink-100"
          >
            Open instrument panel
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
