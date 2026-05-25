import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ResultsShowcase } from "../components/ResultsShowcase";
import { NijatReviewCard } from "../components/NijatReviewCard";
import { results as cases } from "../lib/results";
import { Reveal } from "../components/motion";

export default function ResultsPage() {
  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 md:pt-32">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                Client results
              </div>
              <h1 className="mt-6 font-display text-[clamp(3rem,7.6vw,6rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
                Real people.<br />
                <span className="text-ember-grad">Real numbers.</span>
              </h1>
            </div>
            <p className="md:col-span-4 self-end max-w-md text-base leading-relaxed text-ink-600">
              A selection of recent client transformations. Every photo and
              every figure below is theirs, shared with their permission.
            </p>
          </div>
        </div>
      </section>

      <ResultsShowcase cases={cases} />

      <section className="bg-canvas py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="mb-10 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Every transformation
          </div>
          <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) =>
              c.slug === "nijat" ? (
                <NijatReviewCard key={c.slug} data={c} />
              ) : (
                <article
                  key={c.slug}
                  className="group overflow-hidden rounded-4xl border hairline bg-ink-900 shadow-diffusion-sm transition duration-500 hover:-translate-y-1 hover:shadow-diffusion"
                >
                  <div className="overflow-hidden">
                    <img
                      src={c.img}
                      alt={`${c.name} before and after. ${c.headline}, ${c.detail}.`}
                      width={900}
                      height={825}
                      loading="lazy"
                      className="block h-auto w-full transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-3 px-5 py-4 text-canvas">
                    <div>
                      <div className="font-display text-xl font-semibold uppercase leading-none tracking-[0.02em]">
                        {c.name}
                      </div>
                      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-canvas/55">
                        {c.detail}
                      </div>
                    </div>
                    <div className="rounded-full bg-ember-grad px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-canvas">
                      {c.headline}
                    </div>
                  </div>
                </article>
              )
            )}
          </Reveal>

          <div className="mt-20 flex flex-col items-start gap-4 rounded-5xl border hairline bg-white p-10 shadow-diffusion-sm md:flex-row md:items-center md:justify-between md:p-14">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                Could be you next
              </div>
              <h2 className="mt-3 max-w-xl font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-5xl">
                Apply for the spring intake.
              </h2>
            </div>
            <Link
              href="/apply"
              className="btn-ember inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
            >
              Start application <ArrowUpRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
