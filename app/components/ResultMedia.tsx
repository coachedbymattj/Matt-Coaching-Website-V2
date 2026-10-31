"use client";

import { useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ResultCase } from "../lib/results";

// Swipe threshold in px — short enough to feel responsive, long enough that a
// tap or a vertical scroll never flips the image by accident.
const SWIPE_MIN = 40;

/**
 * The image area of a results card. A case with `views` (e.g. front and back)
 * gets a swipeable gallery that occupies exactly the same space as a single
 * image, so cards stay on the same grid rhythm.
 */
export function ResultMedia({ data: c }: { data: ResultCase }) {
  const views = c.views ?? [];
  const multi = views.length > 1;

  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);

  if (!multi) {
    return (
      <div className="overflow-hidden">
        <img
          src={c.img}
          alt={`${c.name} before and after. ${c.headline}, ${c.detail}.`}
          width={900}
          height={1000}
          loading="lazy"
          className="block h-auto w-full transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const go = (next: number) => setI((next + views.length) % views.length);

  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > SWIPE_MIN) go(i + (dx < 0 ? 1 : -1));
        startX.current = null;
      }}
    >
      {/* Track: every view is laid out in a row and slid across, so the box
          keeps one fixed height and nothing reflows when you swipe. */}
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {views.map((v, idx) => (
          <img
            key={v.src}
            src={v.src}
            alt={`${c.name} ${v.label.toLowerCase()} view, before and after. ${c.headline}, ${c.detail}.`}
            width={900}
            height={1000}
            loading={idx === 0 ? "lazy" : "eager"}
            className="block h-auto w-full flex-none"
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(i - 1)}
        aria-label={`Show ${views[(i - 1 + views.length) % views.length].label.toLowerCase()} view`}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink-950/55 p-2 text-canvas backdrop-blur transition hover:bg-ink-950/80 focus-visible:bg-ink-950/80"
      >
        <CaretLeft size={16} weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => go(i + 1)}
        aria-label={`Show ${views[(i + 1) % views.length].label.toLowerCase()} view`}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink-950/55 p-2 text-canvas backdrop-blur transition hover:bg-ink-950/80 focus-visible:bg-ink-950/80"
      >
        <CaretRight size={16} weight="bold" />
      </button>

      {/* Labelled pills double as the position indicator */}
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {views.map((v, idx) => (
          <button
            key={v.src}
            type="button"
            onClick={() => setI(idx)}
            aria-current={idx === i}
            aria-label={`Show ${v.label.toLowerCase()} view`}
            className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur transition ${
              idx === i
                ? "bg-canvas text-ink-900"
                : "bg-ink-950/55 text-canvas/80 hover:bg-ink-950/80"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
