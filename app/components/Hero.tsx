"use client";

import Link from "next/link";
import { ArrowUpRight, Barbell } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* slow ember glow (decorative, behind content, does not gate paint) */}
      <div className="pointer-events-none absolute right-[-8%] top-[12%] -z-10 h-72 w-72 rounded-full bg-ember/20 blur-3xl animate-glow-pulse" />
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 items-end gap-10 px-6 pb-16 pt-24 md:grid-cols-12 md:gap-8 md:pt-32">
        {/* Left column: copy (rendered statically so it paints instantly — LCP) */}
        <div className="md:col-span-7">
          <div className="flex flex-col gap-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border hairline bg-canvas/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ember-pulse" />
              Now accepting 4 athletes · Spring intake
            </div>

            <h1 className="font-display text-[clamp(3rem,8.4vw,7rem)] font-bold uppercase leading-[0.85] tracking-[-0.02em] text-ink-900">
              Bodies are built<br />
              in <span className="text-ember-grad">twelve weeks.</span><br />
              <span className="text-ink-400">Identities, in twelve months.</span>
            </h1>

            <p className="max-w-[58ch] text-base leading-relaxed text-ink-600 md:text-lg">
              I coach working professionals to leaner, stronger, more capable bodies, without the
              white-knuckled diets, weekend rebounds, or hour-a-day gym sessions. Engineered protocols.
              Measured outcomes. A real human reading your data every week.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/apply"
                className="btn-ember group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
              >
                Apply for the next intake
                <ArrowUpRight size={16} weight="bold" className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/results"
                className="group inline-flex items-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100 active:translate-y-[1px]"
              >
                See the results
                <ArrowUpRight size={16} weight="bold" className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: portrait card */}
        <aside className="md:col-span-5">
          <div className="relative">
            <div
              className="relative overflow-hidden rounded-5xl border hairline bg-ink-900 shadow-diffusion"
              style={{ aspectRatio: "4 / 5" }}
            >
              <img
                src="/hero-portrait.webp"
                srcSet="/hero-portrait-sm.webp 420w, /hero-portrait.webp 640w"
                sizes="(max-width: 768px) 92vw, 42vw"
                alt="Matt J coaching a client through a heavy back-squat set"
                width={640}
                height={800}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
              {/* slow drifting speed-stripes over the portrait */}
              <div className="pointer-events-none absolute inset-0 speed-stripes animate-drift-slow" />
              <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/10 shadow-inner-glass" />

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-canvas/90 backdrop-blur">
                <Barbell size={14} weight="bold" /> Online & in-person
              </div>

            </div>

          </div>
        </aside>
      </div>

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
