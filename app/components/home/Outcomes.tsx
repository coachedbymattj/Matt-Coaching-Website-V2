import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../motion";
import { results } from "../../lib/results";

const rows = results.slice(0, 6);
const photos = results.slice(0, 4);

export function HomeOutcomes() {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 py-24 text-canvas md:py-32">
      <div className="pointer-events-none absolute inset-0 speed-stripes" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-ember/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* heading + meta */}
        <div className="grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 md:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ember-soft">
              Recent transformations
            </div>
            <h2 className="mt-5 max-w-2xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-6xl">
              Outcomes you can measure.
              <br />
              <span className="text-canvas/55">Bodies you can recognise.</span>
            </h2>
          </Reveal>
          <Reveal
            delay={0.05}
            className="col-span-12 md:col-span-4 md:col-start-9 md:self-end"
          >
            <p className="text-canvas/75">
              Every result here is a real client. Names and numbers are
              theirs. See them all on the results page.
            </p>
          </Reveal>
        </div>

        {/* before / after photos — the proof, ahead of the numbers */}
        <div className="strip -mx-6 mt-14 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0">
          <ul className="flex w-max gap-4 md:grid md:w-auto md:grid-cols-4 md:gap-5">
            {photos.map((c, i) => (
              <li key={c.slug} className="w-[260px] flex-none md:w-auto">
                <Reveal delay={i * 0.05}>
                  <Link
                    href="/results"
                    className="group block overflow-hidden rounded-4xl border border-canvas/10 bg-ink-900"
                  >
                    <img
                      src={c.img}
                      alt={`${c.name} before and after. ${c.headline}, ${c.detail}.`}
                      width={900}
                      height={1000}
                      loading="lazy"
                      className="block h-auto w-full transition duration-700 group-hover:scale-[1.03]"
                    />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* instrument table */}
        <div className="mt-14">
          <div className="grid grid-cols-12 gap-4 border-b border-canvas/10 pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/50">
            <span className="col-span-1">No.</span>
            <span className="col-span-4 md:col-span-3">Client</span>
            <span className="col-span-7 md:col-span-4">Result</span>
            <span className="hidden text-right md:col-span-4 md:block">Details</span>
          </div>

          {rows.map((r, i) => (
            <Reveal
              key={r.slug}
              delay={i * 0.035}
              className="grid grid-cols-12 items-center gap-4 border-b border-canvas/10 py-5"
            >
              <span className="col-span-1 font-mono text-[11px] tabular-nums text-canvas/55">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-4 font-display text-lg font-semibold uppercase tracking-[0.01em] md:col-span-3 md:text-xl">
                {r.name}
              </span>
              <span className="col-span-7 font-mono text-sm tabular-nums text-ember-soft md:col-span-4">
                {r.headline}
                <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-canvas/60 md:hidden">
                  {r.detail}
                </span>
              </span>
              <span className="hidden text-right font-mono text-[12px] uppercase tracking-[0.16em] text-canvas/70 md:col-span-4 md:block">
                {r.detail}
              </span>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-canvas/10 pt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/55">
          <span>Real clients · shared with permission</span>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 rounded-full border border-canvas/15 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-canvas transition hover:bg-canvas hover:text-ink-900"
          >
            See all results
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
