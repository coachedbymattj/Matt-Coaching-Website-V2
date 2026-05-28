"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

export function HomeCta() {
  return (
    <section className="bg-canvas pb-24 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex items-end justify-between border-b hairline pb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
          <span>09 / 10 — Apply</span>
          <span>Closing soon</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
          className="grain relative mt-10 overflow-hidden rounded-5xl bg-ink-950 p-10 text-canvas shadow-diffusion md:p-16"
        >
          <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/10 shadow-inner-glass" />
          <div className="pointer-events-none absolute inset-0 speed-stripes" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h2 className="font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.01em] md:text-7xl">
                You don&apos;t need more motivation.
                <br />
                You need{" "}
                <span className="text-ember-grad">someone in your corner.</span>
              </h2>
              <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-canvas/75 md:text-lg">
                Coaching is application-only. If we&apos;re a fit, you&apos;ll
                hear back in 48 hours with a calendar link for the diagnostic
                call.
              </p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Link
                href="/apply"
                className="btn-ember group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.12em]"
              >
                Start the application
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-canvas/55">
                7-minute form · No payment requested
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
