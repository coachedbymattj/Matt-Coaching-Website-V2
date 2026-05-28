"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// TODO: upload the eight gallery images to public/images/gallery/1.png … 8.png.
// Until they exist, each slot falls back to a styled placeholder rectangle so
// the layout stays intact. Once you upload the files the carousel picks them
// up automatically with no code change required.
const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

function Slide({ n }: { n: number }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="grain relative flex h-full w-full items-center justify-center bg-ink-900 text-canvas">
        <div className="pointer-events-none absolute inset-0 speed-stripes opacity-60" />
        <div className="relative flex flex-col items-center gap-2 text-canvas/55">
          <span className="font-display text-7xl font-bold leading-none tabular-nums">
            {String(n).padStart(2, "0")}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
            /images/gallery/{n}.png
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={`/images/gallery/${n}.png`}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export function HomeGallery() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLOTS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section
      id="transformations"
      className="scroll-mt-24 border-y hairline bg-canvas py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* left meta column */}
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              More transformations
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-6xl">
              The
              <br />
              gallery.
            </h2>
            <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-ink-600">
              Eight clients, one frame at a time. Photo and figures shared with
              their permission.
            </p>
          </div>

          {/* gallery */}
          <div className="col-span-12 md:col-span-9">
            {reduce ? (
              /* Reduced motion: scrollable static strip */
              <div className="-mx-6 overflow-x-auto px-6">
                <div className="flex w-max gap-4">
                  {SLOTS.map((n) => (
                    <div
                      key={n}
                      className="aspect-[3/4] w-[260px] flex-none overflow-hidden bg-ink-900"
                    >
                      <Slide n={n} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Auto-cycling crossfade carousel */
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-ink-900">
                {SLOTS.map((n, i) => (
                  <div
                    key={n}
                    aria-hidden={i !== active}
                    className="absolute inset-0 transition-opacity duration-[700ms] ease-out"
                    style={{ opacity: i === active ? 1 : 0 }}
                  >
                    <Slide n={n} />
                  </div>
                ))}

                {/* progress / position ticks */}
                <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                  {SLOTS.map((n, i) => (
                    <span
                      key={n}
                      aria-hidden
                      className={`block h-[3px] rounded-full transition-all duration-500 ${
                        i === active ? "w-8 bg-ember" : "w-3 bg-canvas/40"
                      }`}
                    />
                  ))}
                </div>

                {/* slot counter */}
                <div className="pointer-events-none absolute right-5 top-5 z-10 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/70">
                  {String(active + 1).padStart(2, "0")} / {String(SLOTS.length).padStart(2, "0")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
