"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    label: "Interest",
    body: "You reach out via the form or DM. Tell me what you’re after.",
  },
  {
    n: "02",
    label: "Match call",
    body: "We jump on a 45-minute call. Goals, context, and whether we’d actually enjoy working together. No pitch.",
  },
  {
    n: "03",
    label: "Onboarding",
    body: "You fill in the questionnaires and assessments. Sometimes we follow up with a call to walk through your answers. Holidays, traditions, life context — all of it factored in.",
  },
  {
    n: "04",
    label: "The first weeks",
    body: "Back to basics, done extremely well. Showing up to check-ins, giving as much feedback as you can. Building the foundation everything else sits on.",
  },
  {
    n: "05",
    label: "Progression",
    body: "We map the whole picture and start moving towards the original goal. Real life is built in, not worked around.",
  },
];

export function HomeProcess() {
  return (
    <section className="border-b hairline bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              06 / 10 — How I work
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.88] tracking-[-0.01em] text-ink-900 md:text-6xl">
              How we
              <br />
              <span className="text-ember-grad">start.</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-ink-600">
              Five steps from first message to settled-in. Open, predictable,
              no pitch.
            </p>
          </div>

          <ol className="col-span-12 md:col-span-8 md:col-start-5">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 22,
                  delay: i * 0.06,
                }}
                className="flex flex-col gap-4 border-t hairline py-10 first:border-t-0 first:pt-0 md:grid md:grid-cols-12 md:gap-6"
              >
                <div className="md:col-span-3">
                  <div className="font-mono text-7xl leading-none tracking-tight text-ember-deep tabular-nums md:text-8xl">
                    {s.n}
                  </div>
                  <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                    {s.label}
                  </div>
                </div>
                <p className="text-[17px] leading-[1.6] text-ink-700 md:col-span-9 md:self-center md:text-lg">
                  {s.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
