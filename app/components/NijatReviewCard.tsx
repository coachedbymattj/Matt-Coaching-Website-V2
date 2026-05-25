"use client";

import { useState } from "react";
import { useFeaturable } from "../lib/useFeaturable";
import { findReviewByAuthor } from "../lib/featurable";
import { GoogleG, Stars } from "./GoogleMark";

type ResultCase = {
  slug: string;
  name: string;
  headline: string;
  detail: string;
  img: string;
};

function formatMonth(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function NijatReviewCard({ data: c }: { data: ResultCase }) {
  const { data } = useFeaturable();
  const [open, setOpen] = useState(false);
  const review = findReviewByAuthor(data, "nijat");

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-4xl border hairline bg-ink-900 shadow-diffusion-sm transition duration-500 hover:-translate-y-1 hover:shadow-diffusion"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
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

      {/* Google review (hidden gracefully if not in the feed) */}
      {review && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-auto block border-t border-white/10 px-5 py-4 text-left transition hover:bg-white/[0.03]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <GoogleG size={14} />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/55">
                Google review
              </span>
            </span>
            <Stars rating={review.starRating} size={12} />
          </div>

          <p
            className={`mt-2.5 text-sm leading-relaxed text-canvas/85 ${
              open ? "" : "line-clamp-2"
            }`}
          >
            &ldquo;{review.comment}&rdquo;
          </p>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/45">
              {review.reviewer.displayName}
              {review.createTime ? ` · ${formatMonth(review.createTime)}` : ""}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember-soft">
              {open ? "Show less" : "Read more"}
            </span>
          </div>
        </button>
      )}
    </article>
  );
}
