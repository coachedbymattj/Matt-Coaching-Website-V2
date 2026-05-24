"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

export type ShowcaseCase = {
  slug: string;
  name: string;
  headline: string;
  detail: string;
  img: string;
};

const SWIPE_CONFIDENCE = 8000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

export function ResultsShowcase({ cases }: { cases: ShowcaseCase[] }) {
  const reduce = useReducedMotion();
  const [[page, dir], setPage] = useState<[number, number]>([0, 0]);
  const n = cases.length;
  const index = ((page % n) + n) % n;
  const active = cases[index];

  const paginate = (d: number) => setPage([page + d, d]);
  const goTo = (i: number) => {
    if (i === index) return;
    setPage([i, i > index ? 1 : -1]);
  };

  // Auto-advance every 5s; pauses on hover. (Reduced-motion users still get the
  // auto-advance, just as a fade rather than a horizontal slide — see variants.)
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(() => setPage(([p]) => [p + 1, 1]), 5000);
    return () => clearInterval(id);
  }, [paused, n, page]);

  const variants = {
    enter: (d: number) => ({ x: reduce ? 0 : d > 0 ? 64 : -64, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : d > 0 ? -64 : 64, opacity: 0 }),
  };

  return (
    <section className="bg-canvas pt-20 md:pt-28">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              Featured transformations
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-4xl">
              Swipe through the wins.
            </h2>
          </div>
          <div className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 md:block">
            Drag · swipe · or use the arrows
          </div>
        </div>

        <div
          className="grain relative mx-auto mt-8 w-full max-w-md overflow-hidden rounded-5xl border border-white/10 bg-ink-950 shadow-diffusion"
          role="group"
          aria-roledescription="carousel"
          aria-label="Client transformations"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute inset-0 speed-stripes" />

          <div className="relative aspect-[10/9]">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 320, damping: 34 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -SWIPE_CONFIDENCE || offset.x < -80) paginate(1);
                  else if (swipe > SWIPE_CONFIDENCE || offset.x > 80)
                    paginate(-1);
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <img
                  src={active.img}
                  alt={`${active.name} before and after. ${active.headline}, ${active.detail}.`}
                  className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous transformation"
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-canvas/90 text-ink-900 shadow-diffusion-sm backdrop-blur transition hover:bg-white active:scale-95 md:left-5"
            >
              <ArrowLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next transformation"
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-canvas/90 text-ink-900 shadow-diffusion-sm backdrop-blur transition hover:bg-white active:scale-95 md:right-5"
            >
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>

          {/* Caption */}
          <div className="relative flex items-end justify-between gap-4 border-t border-white/10 px-5 py-4 text-canvas md:px-8 md:py-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
                Case {String(index + 1).padStart(2, "0")} /{" "}
                {String(n).padStart(2, "0")}
              </div>
              <div className="mt-1 font-display text-2xl font-semibold uppercase leading-none tracking-[0.02em] md:text-3xl">
                {active.name}
              </div>
              <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-canvas/55">
                {active.detail}
              </div>
            </div>
            <div className="flex-none rounded-full bg-ember-grad px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white">
              {active.headline}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {cases.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${c.name}`}
              aria-current={i === index}
              className={
                i === index
                  ? "h-2 w-7 rounded-full bg-ember-grad transition-all"
                  : "h-2 w-2 rounded-full bg-ink-300 transition-all hover:bg-ink-400"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
