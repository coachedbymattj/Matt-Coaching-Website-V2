"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

const cases = [
  {
    name: "Aoife Ní Bhriain",
    role: "M&A lawyer · 34",
    metric: "−9.4 kg",
    sub: "14 weeks · maintained 3-rep deadlift PR",
    seed: "transform-aoife-12",
  },
  {
    name: "Tomás Lindqvist",
    role: "Surgeon · 41",
    metric: "+6.1 kg lean",
    sub: "22 weeks · returned to competitive Brazilian Jiu-Jitsu",
    seed: "transform-tomas-08",
  },
  {
    name: "Priya Sundaresan",
    role: "Product director · 38",
    metric: "21.4% → 14.7% BF",
    sub: "18 weeks · zero meals tracked after week 9",
    seed: "transform-priya-19",
  },
];

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
            className="inline-flex items-center gap-2 rounded-full border border-canvas/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-canvas transition hover:bg-canvas hover:text-ink-900 active:translate-y-[1px]"
          >
            All 47 client stories
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12">
          {cases.map((c, i) => (
            <motion.article
              key={c.seed}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 90, damping: 20, delay: i * 0.08 }}
              className={
                i === 0
                  ? "md:col-span-5 md:row-span-2"
                  : i === 1
                  ? "md:col-span-7"
                  : "md:col-span-7"
              }
            >
              <div
                className="group relative overflow-hidden rounded-5xl border border-canvas/10 bg-ink-900 shadow-diffusion"
                style={{ aspectRatio: i === 0 ? "4 / 5" : "16 / 9" }}
              >
                <img
                  src={`https://picsum.photos/seed/${c.seed}/1200/900`}
                  alt={`${c.name} transformation`}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/10 shadow-inner-glass" />

                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-canvas/90 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember animate-breathe" />
                  Case · 0{i + 1}
                </div>

                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="font-display text-2xl font-semibold uppercase leading-none tracking-[0.01em] md:text-3xl">
                      {c.name}
                    </div>
                    <div className="mt-1.5 text-sm text-canvas/70">{c.role}</div>
                    <div className="mt-3 text-sm text-canvas/80">{c.sub}</div>
                  </div>
                  <div className="rounded-2xl bg-canvas px-3 py-2 text-right">
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-500">
                      Result
                    </div>
                    <div className="font-mono text-lg leading-tight text-ink-900">
                      {c.metric}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
