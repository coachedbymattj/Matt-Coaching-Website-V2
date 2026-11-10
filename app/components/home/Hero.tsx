"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "../motion";

// New gym hero shot (portrait) — drives the right-hand panel of the split hero.
const HERO_SRC = "/hero-gym.webp";

export function HomeHero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-ink-950 text-canvas">
      <div className="grid grid-cols-1 md:min-h-[100dvh] md:grid-cols-12">
        {/* ── LEFT — copy on black with diagonal pinstripe texture ── */}
        <div className="relative order-2 flex items-center md:order-1 md:col-span-7 md:min-h-[100dvh]">
          <div aria-hidden className="pointer-events-none absolute inset-0 speed-stripes" />
          {/* slow ember firelight glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-6%] top-[18%] h-80 w-80 rounded-full bg-ember/20 blur-3xl animate-glow-pulse"
          />

          <div className="relative z-10 flex w-full max-w-[760px] flex-col gap-8 px-6 py-16 sm:px-10 md:py-24 md:pr-10 md:[padding-left:max(2.5rem,calc((100vw-1400px)/2+1.5rem))]">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/60">
              Coached by Matt J
            </div>

            <Reveal y={20}>
              <h1 className="font-display text-[clamp(2.5rem,5.4vw,4.9rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-canvas">
                If getting fitter feels like your{" "}
                <span className="relative inline-block">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg,#e8623f 0%,#d97a64 55%,#c8553d 100%)",
                    }}
                  >
                    Everest
                  </span>
                  <span
                    aria-hidden
                    className="absolute -inset-x-3 -inset-y-2 -z-10 rounded-full bg-ember/30 blur-2xl"
                  />
                </span>
                ,{" "}
                <span className="text-canvas/55">I&rsquo;ll get you to the top.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.08}>
              <Link
                href="/apply"
                className="btn-ember group inline-flex items-center gap-2 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.16em]"
              >
                Apply for coaching
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* ── RIGHT — full-bleed gym photo (top / right / bottom edges, no padding) ── */}
        <div className="relative order-1 h-[70vh] md:order-2 md:col-span-5 md:h-auto md:min-h-[100dvh]">
          <img
            src={HERO_SRC}
            srcSet="/hero-gym-sm.webp 760w, /hero-gym.webp 1300w"
            sizes="(max-width: 768px) 100vw, 45vw"
            alt="Matt J standing lean and conditioned on the gym floor"
            width={1300}
            height={1950}
            className="absolute inset-0 h-full w-full object-cover object-top md:object-center"
            loading="eager"
            fetchPriority="high"
          />
          {/* soft seam: the black left column bleeds into the photo's left edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/30 to-transparent md:via-ink-950/40"
          />
          {/* mobile: bottom fade into the text block below */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-950 to-transparent md:hidden"
          />
        </div>
      </div>
    </section>
  );
}
