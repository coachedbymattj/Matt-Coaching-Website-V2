import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";



const timeline = [
  {
    year: "2012",
    title: "Caretaker & cleaner, Danestone Community Centre · Aberdeen",
    body: "Four years running the community centre floor, with a concurrent stint as a Leisure Attendant at De Vere Village, mostly poolside and the change rooms. Where I first learned what it takes to serve the public well.",
  },
  {
    year: "2016",
    title: "Fitness Advisor, Bannatyne Group · Aberdeen",
    body: "Entry into fitness. Eighteen months on the gym floor, building my first set of client results and learning what actually works when you're the one accountable for delivering them.",
    img: "/career/2016-bannatyne.webp",
  },
  {
    year: "2018",
    title: "Personal Trainer, Nuffield Health · Aberdeen",
    body: "Stepped into 1:1 personal training. Built my first proper client list, delivered the results that came with it, and started obsessing about programming as a craft.",
    img: "/career/2018-nuffield.webp",
  },
  {
    year: "2019",
    title: "Ultimate Performance · Amsterdam",
    body: "Moved to the Netherlands and joined Ultimate Performance, one of the most rigorous coaching brands in the world. Four and a half years progressing through Personal Trainer, Mentor, Engagement Mentor, and Assistant Trainer Manager, delivering client transformations while mentoring the next bench of coaches into doing the same.",
    img: "/career/2019-up.webp",
  },
  {
    year: "2024",
    title: "Head Trainer, ONE Human Performance Institute · Amsterdam",
    body: "Ten months mentoring the coaching team and helping build their mentoring systems, all while continuing to deliver client results on the floor myself.",
    img: "/career/2024-one.webp",
    imgClass: "h-full w-full object-cover object-[18%_78%] scale-[1.9] origin-[18%_78%]",
  },
  {
    year: "2025",
    title: "Founded Coached by Matt J",
    body: "Went independent. A capped roster, three coaching paths, and full control over the standard.",
    img: "/career/2025-cbmj.webp",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b hairline">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 pb-20 pt-24 md:grid-cols-12 md:pt-32">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              About · Matthew Johnstone
            </div>
            <h1 className="mt-6 font-display text-[clamp(3rem,7.6vw,6rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
              Aberdeen to Amsterdam.<br />
              <span className="text-ember-grad">One uncompromising thesis.</span>
            </h1>
            <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-ink-600">
              You can engineer almost any adult body into the version of itself the
              owner wants, provided the programme is honest about their life and
              their physiology. Most coaching fails at one or both. This practice is
              built to fail at neither.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="btn-ember inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
              >
                Apply for coaching <ArrowUpRight size={16} weight="bold" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100 active:translate-y-[1px]"
              >
                See coaching tiers
              </Link>
            </div>
          </div>

          <aside className="md:col-span-5">
            <div
              className="relative overflow-hidden rounded-5xl border hairline bg-ink-900 shadow-diffusion"
              style={{ aspectRatio: "5 / 6" }}
            >
              <img
                src="/career/about-portrait.webp"
                alt="Matthew Johnstone"
                className="absolute inset-0 h-full w-full object-cover object-top opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/15 to-transparent" />
              <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/10 shadow-inner-glass" />
              <div className="absolute inset-x-6 bottom-6 text-canvas">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-canvas/70">
                  Amsterdam, NL
                </div>
                <div className="mt-1 text-xl font-medium leading-tight md:text-2xl">
                  Matthew Johnstone
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Beliefs */}
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                Working beliefs
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
                What I'll never sell you.
              </h2>
            </div>
            <ol className="md:col-span-7 md:col-start-6">
              {[
                {
                  t: "Adherence beats optimisation.",
                  b: "A B+ programme you finish always beats an A+ programme you abandon. Most coaching writes for the latter and wonders why retention sucks.",
                },
                {
                  t: "Calories matter. So does Tuesday at 9pm.",
                  b: "If your plan doesn't survive contact with a board meeting, a sick child, or a hangover, it isn't a plan. It's a fantasy.",
                },
                {
                  t: "Strength is the substrate.",
                  b: "I will not coach a fat-loss block that erodes your strength base. Lean mass is the asset class with the longest compounding window in your body.",
                },
                {
                  t: "I work for your future self, not your present mood.",
                  b: "Coaching that always tells you what you want to hear isn't coaching. Expect to be challenged, civilly, every week.",
                },
              ].map((b, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 gap-6 border-t hairline py-8 first:border-t-0 first:pt-0"
                >
                  <div className="col-span-2 font-display text-4xl font-bold leading-none text-ink-200">
                    0{i + 1}
                  </div>
                  <div className="col-span-10">
                    <h3 className="font-display text-2xl font-semibold uppercase tracking-[0.01em] text-ink-900">
                      {b.t}
                    </h3>
                    <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-600">
                      {b.b}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="grain relative overflow-hidden bg-ink-950 py-24 text-canvas md:py-32">
        <div className="pointer-events-none absolute inset-0 speed-stripes" />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <div className="max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
              Trajectory
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] md:text-5xl">
              How I got here.
            </h2>
          </div>
          <ol className="mt-16 max-w-4xl md:mt-20">
              {timeline.map((t) => (
                <li
                  key={t.year}
                  className="grid grid-cols-12 gap-6 border-t border-ink-800 py-8 first:border-t-0 first:pt-0"
                >
                  <div className="col-span-5 flex flex-col gap-3 md:col-span-3">
                    <div className="font-display text-3xl font-bold leading-none text-ember-soft md:text-4xl">
                      {t.year}
                    </div>
                    {t.img && (
                      <div className="aspect-[4/5] w-28 overflow-hidden rounded-2xl border border-canvas/10 bg-ink-800 md:w-36">
                        <img
                          src={t.img}
                          alt=""
                          className={(t as { imgClass?: string }).imgClass ?? "h-full w-full object-cover object-top"}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-span-7 md:col-span-9">
                    <h3 className="font-display text-xl font-semibold uppercase leading-[1.05] tracking-[0.01em] md:text-2xl">
                      {t.title}
                    </h3>
                    <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-canvas/70">
                      {t.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
        </div>
      </section>


    </>
  );
}
