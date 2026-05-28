import { Reveal } from "../motion";

const principles = [
  {
    n: "01",
    body: "I will not tell you things are okay when they are not.",
  },
  {
    n: "02",
    body: "I will never tell you that you can't do something, but every choice has a consequence.",
  },
  {
    n: "03",
    body: "I don't believe in one single method. There is more than one road to Rome.",
  },
];

export function HomePrinciples() {
  return (
    <section className="border-b hairline bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              03 / 10 — My approach
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
              How I
              <br />
              coach.
            </h2>
          </Reveal>

          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {principles.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.06}>
                  <li className="flex h-full flex-col gap-7 rounded-4xl border hairline bg-white p-8 shadow-diffusion-sm">
                    <div className="font-mono text-5xl leading-none tracking-tight text-ink-900 tabular-nums md:text-6xl">
                      {p.n}
                    </div>
                    <p className="text-[19px] leading-[1.45] text-ink-900">
                      {p.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
