"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "../motion";

// Real asset already in /public — same one the V3C preview uses.
const PORTRAIT_SRC = "/career/about-portrait.webp";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-canvas">
      {/* ── warm-duotone background ── */}
      <div className="absolute inset-0">
        {/* base portrait, slightly desaturated and held under the warm wash */}
        <img
          src={PORTRAIT_SRC}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-top opacity-65 [filter:grayscale(40%)_contrast(1.05)]"
          loading="eager"
          fetchPriority="high"
        />
        {/* warm fire-rim from the right — ember-deep multiply for shadow warmth */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(270deg, rgba(142,58,41,0.55) 0%, rgba(142,58,41,0.15) 35%, transparent 70%)",
          }}
        />
        {/* deep ink wash from the bottom so the headline always sits legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/10" />
        {/* ember firelight glow, centre-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[10%] top-[42%] h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-ember/30 blur-3xl animate-glow-pulse"
        />
        {/* speed-stripes whisper for athletic texture (in addition to global .grain) */}
        <div className="pointer-events-none absolute inset-0 speed-stripes opacity-70" />
      </div>

      {/* ── content ── */}
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-between px-6 pb-14 pt-24 md:pb-20 md:pt-28">
        {/* TOP-LEFT MARK */}
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/80">
          Coached by Matt J
        </div>

        {/* BOTTOM — headline + CTA */}
        <div className="grid grid-cols-12 items-end gap-8">
          <Reveal y={20} className="col-span-12 md:col-span-9">
            <h1 className="font-display text-[clamp(2.8rem,9.4vw,8.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-canvas">
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
              ,
              <br />
              <span className="text-canvas/55">you are who I help.</span>
            </h1>
          </Reveal>

          <Reveal
            delay={0.08}
            className="col-span-12 md:col-span-3 md:justify-self-end"
          >
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
            <div className="mt-3 text-right font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/60">
              Next intake · Jun · 2026
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
