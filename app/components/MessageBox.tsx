import Link from "next/link";
import {
  EnvelopeSimple,
  InstagramLogo,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";

const EMAIL = "coachedbymattj@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/coachedbymattj/";

export function MessageBox() {
  return (
    <section id="message" className="scroll-mt-24 bg-canvas pb-24 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative overflow-hidden rounded-5xl border hairline bg-white p-8 shadow-diffusion md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                Got a question?
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-5xl">
                Message me.
              </h2>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink-600">
                Stuck on form, not sure where to start, or want a cue on a
                specific move? Send me a message and I'll come back to you.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`mailto:${EMAIL}`}
                  className="btn-ember inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em]"
                >
                  <EnvelopeSimple size={16} weight="bold" />
                  Email me
                </a>
                {INSTAGRAM_URL && (
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-ink-700 transition hover:bg-ink-100"
                  >
                    <InstagramLogo size={16} weight="bold" />
                    DM on Instagram
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-5 md:justify-self-end">
              <div className="rounded-4xl border hairline bg-ink-50/60 p-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  Ready for the full thing?
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Get everything built and adjusted around you, week to week, with
                  my online 1:1 coaching.
                </p>
                <Link
                  href="/apply/online"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-ink-900 transition hover:gap-3"
                >
                  Online 1:1 coaching
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
