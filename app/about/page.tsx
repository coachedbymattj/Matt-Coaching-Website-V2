import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../components/motion";

const values = [
  {
    t: "Honesty",
    b: "Get clear and honest about what you really want, then go and get it.",
  },
  {
    t: "Built for you, built to last",
    b: "A plan that fits your life now and compounds into the long-term result.",
  },
  {
    t: "No trends, just what works",
    b: "Ignore the fads and do what is proven.",
  },
  {
    t: "Sacrifice is part of it",
    b: "You cannot always flexible-diet; sometimes the hard call has to be made.",
  },
  {
    t: "Fitness to enjoy life",
    b: "Looking good is a bonus; the real win is using your fitness to live better.",
  },
];

const howICoach = [
  "I will not tell you things are okay when they are not.",
  "I will never tell you that you can't do something, but every choice has a consequence.",
  "I don't believe in one single method. There is more than one road to Rome.",
];

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
      {/* PART 1 — Intro */}
      <section className="border-b hairline">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 pb-20 pt-24 md:grid-cols-12 md:pt-32">
          <Reveal className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              About · Matthew Johnstone
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.3rem,5.4vw,4.4rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-ink-900">
              If getting fitter feels like your{" "}
              <span className="text-ember-grad">Everest</span>, you are who I
              help.
            </h1>
            <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-ink-600">
              The reality shows up in the small moments. Out of breath after one
              flight of stairs. On the last hole of your belt. Planning a holiday
              around your shape instead of what you actually want to do. I help
              you become someone who is not dreading each year older and quietly
              accepting that this is just the way it is. No crash diets that hand
              you a few rules and teach you nothing. No being told to just diet
              harder without ever being shown how.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-5">
            <div
              className="relative overflow-hidden rounded-5xl border hairline bg-ink-900 shadow-diffusion"
              style={{ aspectRatio: "5 / 6" }}
            >
              <img
                src="/career/about-portrait.webp"
                alt="Matthew Johnstone"
                width={1000}
                height={1200}
                loading="eager"
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
          </Reveal>
        </div>
      </section>

      {/* PART 2 — What I stand for */}
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                Principles
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
                What I stand for.
              </h2>
            </Reveal>
            <Reveal delay={0.05} className="md:col-span-7 md:col-start-6">
              <ol>
                {values.map((v, i) => (
                  <li
                    key={v.t}
                    className="grid grid-cols-12 gap-6 border-t hairline py-8 first:border-t-0 first:pt-0"
                  >
                    <div className="col-span-2 font-display text-4xl font-bold leading-none text-ink-200">
                      0{i + 1}
                    </div>
                    <div className="col-span-10">
                      <h3 className="font-display text-2xl font-semibold uppercase tracking-[0.01em] text-ink-900">
                        {v.t}
                      </h3>
                      <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-600">
                        {v.b}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PART 3 — How I coach */}
      <section className="bg-canvas pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              My approach
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
              How I coach.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {howICoach.map((p, i) => (
              <Reveal key={p} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col gap-5 rounded-4xl border hairline bg-white p-7 shadow-diffusion-sm md:p-8">
                  <div className="font-display text-4xl font-bold leading-none text-ink-200">
                    0{i + 1}
                  </div>
                  <p className="text-lg leading-relaxed text-ink-800">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Career timeline (kept) */}
      <section className="grain relative overflow-hidden bg-ink-950 py-24 text-canvas md:py-32">
        <div className="pointer-events-none absolute inset-0 speed-stripes" />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <Reveal className="max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
              Trajectory
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] md:text-5xl">
              How I got here.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
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
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <Reveal>
            <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-10 text-canvas shadow-diffusion md:p-16">
              <div className="pointer-events-none absolute inset-0 speed-stripes" />
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />
              <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
                    Start here
                  </div>
                  <h2 className="mt-3 max-w-xl font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-6xl">
                    Ready to start the climb?
                  </h2>
                </div>
                <Link
                  href="/apply"
                  className="btn-ember inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.12em]"
                >
                  Apply for coaching
                  <ArrowUpRight size={18} weight="bold" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
