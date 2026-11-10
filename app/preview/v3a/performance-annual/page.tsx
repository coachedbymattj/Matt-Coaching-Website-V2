import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../../../components/motion";
import { results } from "../../../lib/results";

export const metadata = {
  title: "V3A · Performance Annual · Preview",
};

const beliefs = [
  {
    n: "01",
    t: "Honesty",
    b: "Get clear and honest about what you really want, then go and get it.",
  },
  {
    n: "03",
    t: "No trends, just what works",
    b: "Ignore the fads and do what is proven.",
  },
];

const pullQuotes = [
  {
    quote:
      "Matt is the first coach who treated my training and food like a system, not a punishment. Twelve weeks in, I look and move like a different person.",
    name: "Paul",
    meta: "12-week protocol · −8.6 kg",
  },
  {
    quote:
      "It is the boring weekly check-in that does it. Nothing flashy, just a coach who reads the numbers and tells me the next call.",
    name: "Elin",
    meta: "13-week protocol · −9.5 kg",
  },
];

export default function PerformanceAnnualPreview() {
  return (
    <>
      {/* ───── HERO ───── */}
      <section className="border-b hairline bg-canvas">
        <div className="mx-auto max-w-[1400px] px-6 pt-24 md:pt-32">
          {/* top running header, magazine style */}
          <div className="flex items-baseline justify-between border-b hairline pb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            <span>Coached by Matt J — Vol. 03</span>
            <span className="hidden md:inline">Amsterdam · NL</span>
            <span>Hero / 00</span>
          </div>

          <div className="grid grid-cols-12 gap-6 pb-20 pt-16 md:pb-28 md:pt-24">
            {/* left gutter section number */}
            <div className="col-span-12 md:col-span-1">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                00 / 12
              </div>
            </div>

            <Reveal className="col-span-12 md:col-span-10 md:col-start-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                A field report on transformation
              </div>
              <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] text-ink-900">
                If getting fitter
                <br />
                feels like your{" "}
                <span className="relative inline-block">
                  <span className="text-ember-grad">Everest</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-[6px] w-full -skew-x-[12deg] bg-ember-grad opacity-90"
                  />
                </span>
                ,
                <br />
                <span className="text-ink-400">I&rsquo;ll get you to the top.</span>
              </h1>
            </Reveal>

            {/* deliberate column drop: narrow body */}
            <div className="col-span-12 mt-12 md:col-span-5 md:col-start-2">
              <p className="text-[17px] leading-[1.6] text-ink-700 md:text-lg">
                The reality shows up in the small moments. Out of breath after
                one flight of stairs. On the last hole of your belt. Planning a
                holiday around your shape instead of what you actually want to
                do. I help you become someone who is not dreading each year
                older and quietly accepting that this is just the way it is.
              </p>
            </div>

            <div className="col-span-12 md:col-span-5 md:col-start-8 md:self-end">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/apply"
                  className="btn-ember group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
                >
                  Apply for the next intake
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/results"
                  className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100"
                >
                  Read the case files
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </div>

          {/* bottom rail */}
          <div className="flex items-center justify-between border-t hairline py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            <span>Programming · Nutrition · Accountability</span>
            <span className="hidden md:inline">N 52°22′ · E 4°53′</span>
            <span>Scroll ↓</span>
          </div>
        </div>
      </section>

      {/* ───── WHAT I STAND FOR — editorial 2 beliefs ───── */}
      <section className="border-b hairline bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-12 gap-6">
            <Reveal className="col-span-12 md:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                02 / 12 — Principles
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
                What I
                <br />
                stand for.
              </h2>
            </Reveal>

            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <ol>
                {beliefs.map((v, i) => (
                  <Reveal
                    key={v.t}
                    delay={i * 0.05}
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

      {/* ───── REVIEWS — editorial pull-quote pair ───── */}
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                03 / 12 — In their words
              </div>
            </div>
            <div className="col-span-12 grid grid-cols-1 gap-12 md:col-span-9 md:grid-cols-2 md:gap-16">
              {pullQuotes.map((q, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <figure>
                    <span className="font-display text-6xl leading-none text-ember-deep">
                      &ldquo;
                    </span>
                    <blockquote className="mt-2 text-2xl leading-[1.3] text-ink-900 md:text-3xl">
                      {q.quote}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                      <span className="text-ink-900">— {q.name}</span>
                      <span>·</span>
                      <span>{q.meta}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── PREVIEW FOOT ───── */}
      <PreviewFoot code="V3A" name="Performance Annual" />
    </>
  );
}

function PreviewFoot({ code, name }: { code: string; name: string }) {
  return (
    <section className="border-t hairline bg-canvas py-10">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
        <span>
          Preview · {code} · {name}
        </span>
        <Link
          href="/preview"
          className="inline-flex items-center gap-2 text-ink-700 hover:text-ember-deep"
        >
          ← All directions
        </Link>
      </div>
    </section>
  );
}
