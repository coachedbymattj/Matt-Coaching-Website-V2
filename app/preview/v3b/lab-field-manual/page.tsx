import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../../../components/motion";
import { results } from "../../../lib/results";

export const metadata = {
  title: "V3B · Lab / Field Manual · Preview",
};

const beliefs = [
  {
    n: "03",
    code: "PR-03",
    t: "No trends, just what works",
    b: "Ignore the fads and do what is proven.",
  },
  {
    n: "04",
    code: "PR-04",
    t: "Sacrifice is part of it",
    b: "You cannot always flexible-diet; sometimes the hard call has to be made.",
  },
];

// Two recent results to show as instrument readout rows
const readoutRows = results.slice(0, 4);

export default function LabFieldManualPreview() {
  return (
    <>
      {/* ───── HERO ───── */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1400px] px-6 pt-20 md:pt-24">
          {/* manual-style header strip */}
          <div className="flex items-center justify-between border-b hairline pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
            <span>Sec. 00 · Intake</span>
            <span className="hidden md:inline">Doc · CBMJ / Field Manual rev. 03</span>
            <span>Page 001 / 048</span>
          </div>

          <div className="grid grid-cols-12 gap-0 py-0 md:gap-0">
            {/* LEFT instrument rail (dark) */}
            <aside className="relative col-span-12 overflow-hidden bg-ink-950 text-canvas md:col-span-4">
              <div className="pointer-events-none absolute inset-0 speed-stripes" />
              {/* hairline tick column */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-3 w-px bg-canvas/10"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-3 flex flex-col justify-between py-10 text-canvas/30"
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className={`block h-px bg-canvas/30 ${
                      i % 4 === 0 ? "w-4" : "w-2"
                    } -translate-x-1/2`}
                  />
                ))}
              </div>

              <div className="relative px-8 py-12 md:px-10 md:py-14">
                {/* vertical mono label */}
                <div className="mb-10 font-mono text-[10px] uppercase tracking-[0.32em] text-ember-soft">
                  01 · Intake — Live
                </div>

                <Readout label="Active clients" value="14 / 14" status="full" />
                <Readout label="Spots, next intake" value="2" status="live" />
                <Readout label="Next start" value="Jun · 2026" />
                <Readout label="Avg. fat loss · 12 wk" value="−6.8 kg" />
                <Readout label="Avg. check-ins" value="52 / yr" />

                <div className="mt-12 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/40">
                  Rev. 2026.05 — verified
                </div>
              </div>
            </aside>

            {/* RIGHT canvas with headline */}
            <div className="col-span-12 px-6 py-16 md:col-span-8 md:px-12 md:py-20">
              {/* page module marker */}
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ember-deep">
                Hero / 00 — Subject brief
              </div>

              <Reveal>
                <h1 className="mt-6 font-display text-[clamp(2.6rem,6.6vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900">
                  If getting fitter
                  <br />
                  feels like your <span className="text-ember-grad">Everest</span>,
                  <br />
                  you are who I help.
                </h1>
              </Reveal>

              {/* spec table under the headline */}
              <div className="mt-10 grid grid-cols-12 gap-4 border-t hairline pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                <SpecCell k="Subject" v="Working professional" />
                <SpecCell k="Protocol" v="12 / 24 / 52 wk" />
                <SpecCell k="Mode" v="Online · In-person" />
              </div>

              <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-ink-700 md:text-lg">
                The reality shows up in the small moments. Out of breath after
                one flight of stairs. On the last hole of your belt. Planning a
                holiday around your shape instead of what you actually want to
                do. Engineered protocols. Measured outcomes. A real human
                reading your data every week.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3 border-t hairline pt-8">
                <Link
                  href="/apply"
                  className="btn-ember group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
                >
                  Open intake form
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/level-zero"
                  className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100"
                >
                  Use the instruments
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── WHAT I STAND FOR — module panels ───── */}
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex items-end justify-between border-b hairline pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
            <span>Module 02 · Principles</span>
            <span>2 of 5 shown</span>
          </div>

          <h2 className="mt-10 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
            What I stand for.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {beliefs.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-3xl border hairline bg-white p-7 transition hover:shadow-diffusion-sm md:p-9">
                  {/* corner code chip */}
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
                    <span className="text-ember-deep">{v.code}</span>
                    <span className="text-ink-400">Principle · {v.n} / 05</span>
                  </div>

                  {/* tick rule */}
                  <div
                    aria-hidden
                    className="my-6 flex items-end gap-[3px] text-ink-200"
                  >
                    {Array.from({ length: 40 }).map((_, k) => (
                      <span
                        key={k}
                        className={`block w-px bg-current ${
                          k % 5 === 0 ? "h-3" : "h-2"
                        }`}
                      />
                    ))}
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-ember animate-ember-pulse" />
                  </div>

                  <h3 className="font-display text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.005em] text-ink-900 md:text-4xl">
                    {v.t}.
                  </h3>
                  <p className="mt-5 max-w-[52ch] text-base leading-[1.65] text-ink-700">
                    {v.b}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── DATA READOUT — transformations as instrument rows ───── */}
      <section className="grain relative overflow-hidden bg-ink-950 py-24 text-canvas md:py-32">
        <div className="pointer-events-none absolute inset-0 speed-stripes" />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <div className="flex items-end justify-between border-b border-canvas/10 pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/60">
            <span>Module 03 · Outcomes log</span>
            <span>Last 4 of 47</span>
          </div>

          <h2 className="mt-10 max-w-2xl font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-5xl">
            Outcomes you can measure.
          </h2>

          {/* table of results, instrument style */}
          <div className="mt-12">
            <div className="grid grid-cols-12 gap-4 border-b border-canvas/10 pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/50">
              <span className="col-span-1">No.</span>
              <span className="col-span-3">Subject</span>
              <span className="col-span-4">Result</span>
              <span className="col-span-4 text-right">Window</span>
            </div>
            {readoutRows.map((r, i) => (
              <Reveal
                key={r.slug}
                delay={i * 0.04}
                className="grid grid-cols-12 items-center gap-4 border-b border-canvas/10 py-5"
              >
                <span className="col-span-1 font-mono text-[11px] tabular-nums text-canvas/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-3 font-display text-lg font-semibold uppercase tracking-[0.01em] md:text-xl">
                  {r.name}
                </span>
                <span className="col-span-4 font-mono text-[13px] tabular-nums text-ember-soft md:text-sm">
                  {r.headline}
                </span>
                <span className="col-span-4 text-right font-mono text-[12px] uppercase tracking-[0.16em] text-canvas/70">
                  {r.detail}
                </span>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-canvas/10 pt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/50">
            <span>Source · client weigh-ins · verified</span>
            <Link
              href="/results"
              className="inline-flex items-center gap-2 text-ember-soft hover:text-canvas"
            >
              Full case log →
            </Link>
          </div>
        </div>
      </section>

      <PreviewFoot code="V3B" name="Lab / Field Manual" />
    </>
  );
}

function Readout({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "live" | "full";
}) {
  return (
    <div className="mb-7 last:mb-0">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/50">
        {status === "live" && (
          <span className="inline-block h-2 w-2 rounded-full bg-ember animate-ember-pulse" />
        )}
        {status === "full" && (
          <span className="inline-block h-2 w-2 rounded-full bg-canvas/30" />
        )}
        <span>{label}</span>
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight text-canvas md:text-4xl">
        {value}
      </div>
    </div>
  );
}

function SpecCell({ k, v }: { k: string; v: string }) {
  return (
    <div className="col-span-12 sm:col-span-4">
      <div className="text-ink-400">{k}</div>
      <div className="mt-1 text-ink-900">{v}</div>
    </div>
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
