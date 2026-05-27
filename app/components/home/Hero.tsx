"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "../motion";

export function HomeHero() {
  return (
    <section className="relative border-b hairline bg-canvas">
      {/* slow ember warm wash behind the type */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-12%] top-[6%] -z-10 h-[460px] w-[460px] rounded-full bg-ember/15 blur-3xl animate-glow-pulse"
      />

      <div className="mx-auto max-w-[1400px] px-6 pt-24 md:pt-32">
        {/* running header */}
        <div className="flex items-baseline justify-between border-b hairline pb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
          <span>Coached by Matt J — Vol. 03</span>
          <span className="hidden md:inline">Amsterdam · NL</span>
          <span>Hero / 00</span>
        </div>

        <div className="grid grid-cols-12 gap-6 pb-20 pt-16 md:pb-28 md:pt-24">
          {/* gutter section number */}
          <div className="col-span-12 md:col-span-1">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              00 / 10
            </div>
          </div>

          <Reveal className="col-span-12 md:col-span-10 md:col-start-2">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              A field report on transformation
            </div>
            <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] text-ink-900">
              If getting fitter
              <br />
              feels like your{" "}
              <span className="relative inline-block">
                <span className="text-ember-grad">Everest</span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[6px] w-full -skew-x-[12deg] bg-ember-grad opacity-90"
                />
              </span>
              ,
              <br />
              <span className="text-ink-400">you are who I help.</span>
            </h1>
          </Reveal>

          {/* narrow body column drop */}
          <Reveal
            delay={0.06}
            className="col-span-12 mt-12 md:col-span-5 md:col-start-2"
          >
            <p className="text-[17px] leading-[1.6] text-ink-700 md:text-lg">
              The reality shows up in the small moments. Out of breath after
              one flight of stairs. On the last hole of your belt. Planning a
              holiday around your shape instead of what you actually want to
              do. I help you become someone who is not dreading each year
              older and quietly accepting that this is just the way it is.
            </p>
          </Reveal>

          <Reveal
            delay={0.12}
            className="col-span-12 md:col-span-5 md:col-start-8 md:self-end"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/apply"
                className="btn-ember group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
              >
                Apply for the next intake
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/results"
                className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100"
              >
                Read the case files
                <ArrowUpRight size={16} weight="bold" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="flex items-center justify-between border-t hairline py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
          <span>Programming · Nutrition · Accountability</span>
          <span className="hidden md:inline">N 52°22′ · E 4°53′</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
