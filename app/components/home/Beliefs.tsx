import { Reveal } from "../motion";

const beliefs = [
  {
    n: "01",
    t: "Honesty",
    b: "Get clear and honest about what you really want, then go and get it.",
  },
  {
    n: "02",
    t: "Built for you, built to last",
    b: "A plan that fits your life now and compounds into the long-term result.",
  },
  {
    n: "03",
    t: "No trends, just what works",
    b: "Ignore the fads and do what is proven.",
  },
  {
    n: "04",
    t: "Sacrifice is part of it",
    b: "You cannot always flexible-diet; sometimes the hard call has to be made.",
  },
  {
    n: "05",
    t: "Fitness to enjoy life",
    b: "Looking good is a bonus; the real win is using your fitness to live better.",
  },
];

export function HomeBeliefs() {
  return (
    <section className="border-b hairline bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              02 / 10 — Principles
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
              What I
              <br />
              stand for.
            </h2>
            <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-ink-600">
              Five rules under everything I write for a client. They do not
              change with trends.
            </p>
          </Reveal>

          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <ol>
              {beliefs.map((v, i) => (
                <Reveal
                  key={v.t}
                  delay={i * 0.04}
                  className="grid grid-cols-12 gap-6 border-t hairline py-10 first:border-t-0 first:pt-0"
                >
                  <div className="col-span-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                    {v.n}
                  </div>
                  <div className="col-span-10">
                    <h3 className="font-display text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.005em] text-ink-900 md:text-4xl">
                      {v.t}.
                    </h3>
                    <p className="mt-5 max-w-[55ch] text-[17px] leading-[1.65] text-ink-700">
                      {v.b}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
