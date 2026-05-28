import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../../../components/motion";
import { results } from "../../../lib/results";

export const metadata = {
  title: "V3C · Heat & Ash · Preview",
};

const beliefs = [
  {
    n: "02",
    t: "Built for you, built to last",
    b: "A plan that fits your life now and compounds into the long-term result.",
  },
  {
    n: "05",
    t: "Fitness to enjoy life",
    b: "Looking good is a bonus; the real win is using your fitness to live better.",
  },
];

const featured = results.slice(0, 3);

export default function HeatAndAshPreview() {
  return (
    <>
      {/* ───── HERO — full bleed portrait, title-card headline ───── */}
      <section className="relative isolate overflow-hidden bg-ink-950 text-canvas">
        {/* portrait, warm duotone via colour layers */}
        <div className="absolute inset-0">
          <img
            src="/career/about-portrait.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
          />
          {/* warm fire-rim gradient on the right */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#8e3a29]/35 via-transparent to-transparent mix-blend-overlay" />
          {/* deep ink wash from the bottom for headline legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/10" />
          {/* subtle ember glow centre-right (firelight) */}
          <div className="pointer-events-none absolute right-[12%] top-[40%] h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-ember/30 blur-3xl" />
          {/* speed-stripes whisper */}
          <div className="pointer-events-none absolute inset-0 speed-stripes opacity-70" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-between px-6 pb-16 pt-24 md:pt-28">
          {/* top corner mark */}
          <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/70">
            <span>Coached by Matt J</span>
            <span className="hidden md:inline">A film about getting fitter</span>
            <span>Reel 01</span>
          </div>

          {/* bottom title-card */}
          <Reveal y={20}>
            <div className="max-w-5xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember-soft">
                Opening title · 00:00
              </div>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,9.4vw,8.5rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-canvas">
                If getting fitter
                <br />
                feels like your{" "}
                <span className="relative inline-block">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg,#e8623f 0%,#d97a64 55%,#c8553d 100%)",
                    }}
                  >
                    Everest
                  </span>
                  <span
                    aria-hidden
                    className="absolute -inset-x-2 -inset-y-1 -z-10 rounded-full bg-ember/30 blur-2xl"
                  />
                </span>
                ,<br />
                <span className="text-canvas/60">I&rsquo;ll get you to the top.</span>
              </h1>

              <div className="mt-10 grid grid-cols-1 items-end gap-6 md:grid-cols-12">
                <p className="md:col-span-7 max-w-[58ch] text-lg leading-[1.6] text-canvas/80">
                  The reality shows up in the small moments. Out of breath after
                  one flight of stairs. On the last hole of your belt. I help
                  you become someone who is not dreading each year older and
                  quietly accepting that this is just the way it is.
                </p>

                <div className="md:col-span-5 md:col-start-9 md:justify-self-end">
                  <Link
                    href="/apply"
                    className="btn-ember group inline-flex items-center gap-2 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.16em]"
                  >
                    Apply for coaching
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                  <div className="mt-3 text-right font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/60">
                    Next intake · Jun · 2026
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── WHAT I STAND FOR — quiet canvas scene ───── */}
      <section className="bg-canvas py-32 md:py-48">
        <div className="mx-auto max-w-[1100px] px-6">
          <Reveal>
            <div className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-ember-deep">
              Scene 02 · What I stand for
            </div>
          </Reveal>

          <ol className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-32">
            {beliefs.map((v, i) => (
              <Reveal
                key={v.t}
                delay={i * 0.06}
                className={`grid grid-cols-12 items-center gap-8 ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* number side */}
                <div className="col-span-12 md:col-span-4 [direction:ltr]">
                  <div
                    className="font-display text-[clamp(7rem,18vw,14rem)] font-bold leading-[0.85] text-transparent"
                    style={{
                      WebkitTextStroke: "1.5px rgba(142,58,41,0.55)",
                    }}
                  >
                    {v.n}
                  </div>
                </div>

                {/* belief text */}
                <div className="col-span-12 md:col-span-8 [direction:ltr]">
                  <h3 className="font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.005em] text-ink-900 md:text-6xl">
                    {v.t}.
                  </h3>
                  <p className="mt-6 max-w-[55ch] text-xl leading-[1.55] text-ink-700">
                    {v.b}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── TRANSFORMATIONS — quiet image trio with warm tint ───── */}
      <section className="relative overflow-hidden bg-ink-950 py-24 text-canvas md:py-32">
        {/* warm ember wash */}
        <div className="pointer-events-none absolute -left-[10%] top-[20%] h-[480px] w-[480px] rounded-full bg-ember/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 speed-stripes opacity-60" />

        <div className="relative mx-auto max-w-[1400px] px-6">
          <Reveal className="max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember-soft">
              Scene 03 · Recent transformations
            </div>
            <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-7xl">
              Bodies you can
              <br />
              <span className="text-canvas/50">recognise.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.06}>
                <figure className="group">
                  <div
                    className="relative overflow-hidden rounded-3xl bg-ink-900"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <img
                      src={c.img}
                      alt={`${c.name} transformation: ${c.headline}.`}
                      className="absolute inset-0 h-full w-full object-contain object-bottom transition duration-700 group-hover:scale-[1.02]"
                    />
                    {/* warm duotone overlay */}
                    <div
                      aria-hidden
                      className="absolute inset-0 mix-blend-multiply"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(142,58,41,0) 30%, rgba(142,58,41,0.45) 100%)",
                      }}
                    />
                    {/* faint top vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-transparent" />
                  </div>
                  <figcaption className="mt-5 flex items-baseline justify-between">
                    <div>
                      <div className="font-display text-2xl font-semibold uppercase tracking-[0.01em]">
                        {c.name}
                      </div>
                      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
                        {c.headline}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-canvas/50">
                      {c.detail}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-canvas/10 pt-8 font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/50">
            <span>Fade to black · end of reel 01</span>
            <Link
              href="/results"
              className="inline-flex items-center gap-2 text-ember-soft hover:text-canvas"
            >
              Watch the full reel →
            </Link>
          </div>
        </div>
      </section>

      <PreviewFoot code="V3C" name="Heat & Ash" />
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
