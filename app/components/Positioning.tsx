import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

/* Editorial positioning strap. Used near the top of the homepage and the
   results page so the visitor knows who I coach in one line. Includes a
   small link down to the transformations gallery on the homepage. */
export function Positioning() {
  return (
    <section className="border-b hairline bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              Who I coach
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <p className="font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.01em] text-ink-900 md:text-6xl">
              Total beginner to{" "}
              <span className="relative inline-block">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg,#e8623f 0%,#d97a64 55%,#c8553d 100%)",
                  }}
                >
                  photoshoot ready
                </span>
                <span
                  aria-hidden
                  className="absolute -inset-x-3 -inset-y-2 -z-10 rounded-full bg-ember/20 blur-2xl"
                />
              </span>
              .
            </p>
            <Link
              href="/#transformations"
              className="group mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-600 transition hover:text-ember-deep"
            >
              <span className="text-ember-deep">→</span>
              <span>See the transformations gallery</span>
              <ArrowUpRight
                size={12}
                weight="bold"
                className="text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember-deep"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
