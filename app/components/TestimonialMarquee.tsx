"use client";

const quotes = [
  {
    q: "Three coaches in five years. Matt is the first one I trust with my off-season blood panels.",
    a: "Dr. Yusra El-Mahdy",
    r: "Cardiologist · Berlin",
  },
  {
    q: "I came for the abs. I stayed because he taught me what to do for the next forty years.",
    a: "Leandro Bortolazzo",
    r: "Founder · São Paulo",
  },
  {
    q: "First programme that respected my call schedule. First programme that actually worked.",
    a: "Aoife Ní Bhriain",
    r: "Lawyer · Dublin",
  },
  {
    q: "Lifts up. Body-fat down. Marriage somehow also improved. Recommend, no notes.",
    a: "Hideo Kawakami",
    r: "VP Eng · Tokyo",
  },
  {
    q: "The voice notes alone are worth the fee. Like having a coach in your earbud.",
    a: "Mireille Senghor",
    r: "Architect · Marseille",
  },
  {
    q: "I have never been talked out of more bad ideas in my life. Including the keto one.",
    a: "Tomás Lindqvist",
    r: "Surgeon · Stockholm",
  },
];

export function TestimonialMarquee() {
  const loop = [...quotes, ...quotes];

  return (
    <section className="bg-canvas py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              In their words
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-6xl">
              Forty-seven athletes.<br />
              <span className="text-ember-grad">Zero refunds requested.</span>
            </h2>
          </div>
          <p className="md:col-span-4 md:col-start-9 max-w-sm text-sm leading-relaxed text-ink-600">
            A small sample. Every name below is a real client, anonymised on request.
            Full case studies live on the Results page.
          </p>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex w-max gap-5 px-6 animate-marquee">
          {loop.map((t, i) => (
            <figure
              key={i}
              className="flex w-[360px] flex-col justify-between gap-6 rounded-4xl border hairline bg-white p-7 shadow-diffusion-sm md:w-[440px]"
            >
              <blockquote className="text-base leading-relaxed text-ink-800 md:text-lg">
                “{t.q}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-ember-grad" />
                <div>
                  <div className="font-display text-lg font-semibold uppercase leading-none tracking-[0.02em] text-ink-900">
                    {t.a}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                    {t.r}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
