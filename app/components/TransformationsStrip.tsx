"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { results } from "../lib/results";

// Same source as the Results page; show the 3 most recent.
const cases = results.slice(0, 3);

export function TransformationsStrip() {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 py-24 text-canvas md:py-32">
      <div className="pointer-events-none absolute inset-0 speed-stripes" />
      <div className="relative mx-auto max-w-[1400px] px-6">
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

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cases.map((c, i) => (
            <motion.article
              key={c.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 90, damping: 20, delay: i * 0.08 }}
            >
              <Link href="/results" className="group block">
                <div
                  className="relative overflow-hidden rounded-5xl border border-canvas/10 bg-ink-900 shadow-diffusion"
                  style={{ aspectRatio: "10 / 9" }}
                >
                  <img
                    src={c.img}
                    alt={`${c.name} transformation: ${c.headline}, ${c.detail}.`}
                    width={900}
                    height={825}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/10 shadow-inner-glass" />

                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-canvas/90 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember animate-breathe" />
                    Case · 0{i + 1}
                  </div>

                  <div className="absolute inset-x-5 bottom-5 flex justify-end">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900 opacity-0 transition duration-300 group-hover:opacity-100">
                      See all results
                      <ArrowUpRight size={12} weight="bold" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
