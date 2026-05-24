"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Barbell } from "@phosphor-icons/react";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20, delay: i * 0.08 },
  }),
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 items-end gap-10 px-6 pb-16 pt-24 md:grid-cols-12 md:gap-8 md:pt-32">
        {/* Left column: copy */}
        <div className="md:col-span-7">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            <motion.div
              custom={0}
              variants={reveal}
              className="inline-flex w-fit items-center gap-2 rounded-full border hairline bg-canvas/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ember-pulse" />
              Now accepting 4 athletes · Spring intake
            </motion.div>

            <motion.h1
              custom={1}
              variants={reveal}
              className="font-display text-[clamp(3rem,8.4vw,7rem)] font-bold uppercase leading-[0.85] tracking-[-0.02em] text-ink-900"
            >
              Bodies are built<br />
              in <span className="text-ember-grad">twelve weeks.</span><br />
              <span className="text-ink-400">Identities, in twelve months.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={reveal}
              className="max-w-[58ch] text-base leading-relaxed text-ink-600 md:text-lg"
            >
              I coach working professionals to leaner, stronger, more capable bodies, without the
              white-knuckled diets, weekend rebounds, or hour-a-day gym sessions. Engineered protocols.
              Measured outcomes. A real human reading your data every week.
            </motion.p>

            <motion.div
              custom={3}
              variants={reveal}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/apply"
                className="btn-ember group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
              >
                Apply for the next intake
                <ArrowUpRight size={16} weight="bold" className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/results"
                className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100 active:translate-y-[1px]"
              >
                See transformations
                <span className="font-mono text-[11px] text-ember">/47</span>
              </Link>
            </motion.div>

            <motion.dl
              custom={4}
              variants={reveal}
              className="mt-6 grid max-w-2xl grid-cols-3 divide-x divide-ink-200/70 border-y hairline py-5"
            >
              {[
                { k: "47.2%", l: "Avg. body-fat reduction · 16 wk" },
                { k: "1,284", l: "Sessions programmed in 2025" },
                { k: "9.4 / 10", l: "Client NPS, rolling Q1" },
              ].map((s) => (
                <div key={s.k} className="px-4 first:pl-0 last:pr-0">
                  <dt className="font-mono text-2xl tracking-tight text-ink-900 md:text-3xl">
                    {s.k}
                  </dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-500">
                    {s.l}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>

        {/* Right column: portrait card with refraction edge */}
        <motion.aside
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 22, delay: 0.3 }}
          className="md:col-span-5"
        >
          <div className="relative">
            <div
              className="relative overflow-hidden rounded-5xl border hairline bg-ink-900 shadow-diffusion"
              style={{ aspectRatio: "4 / 5" }}
            >
              {/* Image */}
              <img
                src="https://picsum.photos/seed/cbmj-portrait-04/900/1125"
                alt="Matt J coaching a client through a heavy back-squat set"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                loading="eager"
              />
              {/* Gradient fade for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
              {/* Inner refraction edge */}
              <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/10 shadow-inner-glass" />

              {/* Floating badge */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-canvas/90 backdrop-blur">
                <Barbell size={14} weight="bold" /> Live block · Wk 7 / 12
              </div>

              {/* Caption */}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-canvas/70">
                    Currently coaching
                  </div>
                  <div className="mt-1 text-lg font-medium leading-tight text-canvas">
                    Aoife Ní Bhriain<br />
                    <span className="text-canvas/70 text-sm font-normal">
                      Lawyer · Dublin · −9.4kg in 14wk
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-canvas px-3 py-1.5 font-mono text-[11px] text-ink-900">
                  +1 (312) 847-1928
                </div>
              </div>
            </div>

            {/* Floating data chip */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 bottom-12 hidden rounded-3xl border hairline bg-canvas p-4 shadow-diffusion-sm md:block"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Adherence · 28-day
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl tracking-tight text-ink-900">94.3</span>
                <span className="text-xs text-ink-500">%</span>
              </div>
              <div className="mt-3 flex items-end gap-1">
                {[8, 12, 6, 14, 10, 16, 13].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-sm bg-ember"
                    style={{ height: `${h * 2}px`, opacity: 0.5 + i * 0.07 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.aside>
      </div>

      {/* Hairline divider */}
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex items-center justify-between border-t hairline py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
          <span>N 52°22′ · E 4°53′ · Amsterdam, NL</span>
          <span className="hidden md:inline">Programming · Nutrition · Accountability</span>
          <span>SCROLL ↓</span>
        </div>
      </div>
    </section>
  );
}
