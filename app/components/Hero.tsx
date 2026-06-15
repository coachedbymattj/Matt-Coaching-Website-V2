"use client";

import Link from "next/link";
import { ArrowUpRight, Barbell } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink-950 text-canvas">
      <div className="grid grid-cols-1 md:min-h-[100dvh] md:grid-cols-12">
        {/* LEFT — copy on black with diagonal pinstripe texture (LCP, paints instantly) */}
        <div className="relative order-2 flex items-center md:order-1 md:col-span-7 md:min-h-[100dvh]">
          <div className="pointer-events-none absolute inset-0 speed-stripes" />
          {/* slow ember glow (decorative, behind content) */}
          <div className="pointer-events-none absolute left-[-6%] top-[16%] h-72 w-72 rounded-full bg-ember/15 blur-3xl animate-glow-pulse" />

          <div className="relative z-10 flex w-full max-w-[760px] flex-col gap-7 px-6 py-14 sm:px-10 md:py-24 md:pr-10 md:[padding-left:max(2.5rem,calc((100vw-1400px)/2+1.5rem))] lg:gap-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-canvas/50">
              Coached by Matt&nbsp;J
            </div>

            <h1 className="font-display text-[clamp(2.5rem,5.6vw,5rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-canvas">
              If getting fitter feels like your{" "}
              <span className="text-ember-grad">Everest</span>, I&apos;ll get you
              to the top.
            </h1>

            <p className="max-w-[52ch] text-base leading-relaxed text-canvas/70 md:text-lg">
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
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-canvas/90 transition hover:bg-white/5 active:translate-y-[1px]"
              >
                See the results
                <ArrowUpRight size={16} weight="bold" className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-canvas/40">
              <span>N 52°22′ · E 4°53′ · Amsterdam, NL</span>
            </div>
          </div>
        </div>

        {/* RIGHT — full-bleed gym photo (top / right / bottom edges, no padding) */}
        <div className="relative order-1 h-[70vh] md:order-2 md:col-span-5 md:h-auto md:min-h-[100dvh]">
          <img
            src="/hero-gym.webp"
            srcSet="/hero-gym-sm.webp 760w, /hero-gym.webp 1300w"
            sizes="(max-width: 768px) 100vw, 45vw"
            alt="Matt J standing lean and conditioned on the gym floor"
            width={1300}
            height={1950}
            className="absolute inset-0 h-full w-full object-cover object-top md:object-center"
            loading="eager"
            fetchPriority="high"
          />
          {/* soft seam: black left column bleeds into the photo's left edge */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/30 to-transparent md:via-ink-950/40" />
          {/* mobile: bottom fade into the text block below */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-950 to-transparent md:hidden" />

          <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-canvas/90 backdrop-blur">
            <Barbell size={14} weight="bold" /> Online & in-person
          </div>
        </div>
      </div>
    </section>
  );
}
