"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

// Gallery images live in public/images/gallery/, cropped to 4:5 portrait
// (1080×1350). Any slot that 404s falls back to a styled placeholder
// rectangle so the layout stays intact.
const SLOTS = [
  "/images/gallery/matt-portrait.webp",
  "/images/gallery/4.png",
  "/images/gallery/matt-shoot-bts.webp",
  "/images/gallery/matt-guinness.webp",
  "/images/gallery/5.png",
  "/images/gallery/matt-shoot-mirror.webp",
] as const;

// Repeat the set so one half of the marquee track is always wider than the
// viewport and the loop never shows a gap.
const LOOP = [...SLOTS, ...SLOTS];

function Slide({ src, n }: { src: string; n: number }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="grain relative flex h-full w-full items-center justify-center bg-ink-900 text-canvas">
        <div className="pointer-events-none absolute inset-0 speed-stripes opacity-60" />
        <div className="relative flex flex-col items-center gap-2 text-canvas/55">
          <span className="font-display text-6xl font-bold leading-none tabular-nums">
            {String(n).padStart(2, "0")}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
            {src}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

/* Each tile is aspect-[4/5] portrait to match the 1080×1350 source. The
   marquee track renders the loop set twice so it translates -50% without a
   visible snap. */
function Tile({ src, n }: { src: string; n: number }) {
  return (
    <div className="aspect-[4/5] w-[280px] flex-none overflow-hidden bg-ink-900 sm:w-[340px] md:w-[380px]">
      <Slide src={src} n={n} />
    </div>
  );
}

export function HomeGallery() {
  const reduce = useReducedMotion();

  return (
    <section
      id="transformations"
      className="scroll-mt-24 border-y hairline bg-canvas py-24 md:py-32"
    >
      {/* Section header — meta lives above the marquee so the strip can
         run full-bleed underneath. */}
      <div className="mx-auto mb-14 max-w-[1400px] px-6 md:mb-20">
        <div className="grid grid-cols-12 gap-6 md:items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              More transformations
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-6xl">
              The gallery.
            </h2>
          </div>
        </div>
      </div>

      {/* Marquee band — full bleed of the page. Hairline rule top + bottom. */}
      <div className="relative overflow-hidden border-y hairline bg-canvas">
        {reduce ? (
          /* Reduced motion: static row of the gallery images. */
          <div className="mx-auto max-w-[1400px] px-6 py-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {SLOTS.map((src, i) => (
                <Tile key={src} src={src} n={i + 1} />
              ))}
            </div>
          </div>
        ) : (
          /* Continuous right-to-left marquee. The loop set renders twice so
             translating the track -50% lands the second copy exactly where
             the first one started — seamless loop, no snap. */
          <div
            className="flex w-max gap-4 py-6 animate-marquee hover:[animation-play-state:paused]"
            style={{ animationDuration: "50s" }}
          >
            {[...LOOP, ...LOOP].map((src, i) => (
              <Tile key={`${src}-${i}`} src={src} n={(i % SLOTS.length) + 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
