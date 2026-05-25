"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { results } from "../lib/results";

export function TransformationsStrip() {
  const reduce = useReducedMotion();
  // Duplicate for a seamless loop; reduced motion gets a single, scrollable row.
  const items = reduce ? results : [...results, ...results];

  return (
    <section className="grain relative overflow-hidden bg-ink-950 py-24 text-canvas md:py-32">
      <div className="pointer-events-none absolute inset-0 speed-stripes" />
      <div className="relative mx-auto mb-12 max-w-[1400px] px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
              Recent transformations
            </div>
            <h2 className="mt-4 max-w-xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-6xl">
              Outcomes you can measure.<br />
              Bodies you can recognise.
            </h2>
          </div>
          <Link
            href="/results"
            className="btn-ember inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
          >
            Check out the results
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>
      </div>

      <div className={`relative overflow-hidden ${reduce ? "overflow-x-auto" : ""}`}>
        <div
          className={`flex w-max gap-4 ${
            reduce ? "px-6" : "animate-marquee hover:[animation-play-state:paused]"
          }`}
        >
          {items.map((c, i) => (
            <Link
              key={i}
              href="/results"
              className="group block w-[280px] shrink-0 sm:w-[340px]"
            >
              <div
                className="relative overflow-hidden rounded-4xl border border-canvas/10 bg-ink-900 shadow-diffusion"
                style={{ aspectRatio: "10 / 9" }}
              >
                <img
                  src={c.img}
                  alt={`${c.name} transformation: ${c.headline}.`}
                  width={900}
                  height={825}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 rounded-4xl border border-white/10 shadow-inner-glass" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
