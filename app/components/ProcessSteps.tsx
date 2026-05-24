"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    label: "Diagnostic",
    title: "A 90-minute call before a single rep is written.",
    body: "Training history, injuries, life schedule, food preferences, sleep, stress, motivation profile. Lab markers reviewed where available. I write a 12-page case file, your case file.",
  },
  {
    n: "02",
    label: "Calibration",
    title: "Weeks 1–3 are spent learning your physiology.",
    body: "Volume tolerance, recovery rate, hunger signals, technique. We deliberately under-load so we can see how you respond, not how you should respond on paper.",
  },
  {
    n: "03",
    label: "Block training",
    title: "Twelve weeks of progressive overload + auto-regulation.",
    body: "Programming adapts every Sunday based on the prior week's data. No two blocks are identical. We push hard where you adapt; we pull back where you don't.",
  },
  {
    n: "04",
    label: "Hand-off",
    title: "You leave with the skills to never need a coach again.",
    body: "Every protocol is annotated with the why. By month six, most clients run their own deloads and macro shifts. Coaching becomes optional, not infrastructure.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              How it works
            </div>
            <h2 className="mt-4 max-w-md font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.01em] text-ink-900 md:text-6xl">
              Four phases.<br />
              <span className="text-ember-grad">No mystery.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-600">
              The whole programme is documented openly because trust starts with
              transparency, not testimonials.
            </p>
          </div>

          <ol className="md:col-span-7 md:col-start-6 flex flex-col">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 90, damping: 22, delay: i * 0.06 }}
                className="group grid grid-cols-12 gap-6 border-t hairline py-8 first:border-t-0 first:pt-0"
              >
                <div className="col-span-3 md:col-span-2">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                    {s.label}
                  </div>
                  <div className="mt-1 font-display text-5xl font-bold leading-none text-ink-200 transition-colors group-hover:text-ember md:text-6xl">
                    {s.n}
                  </div>
                </div>
                <div className="col-span-9 md:col-span-10">
                  <h3 className="font-display text-2xl font-semibold uppercase leading-[0.95] tracking-[0.01em] text-ink-900 md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-600 md:text-base">
                    {s.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
