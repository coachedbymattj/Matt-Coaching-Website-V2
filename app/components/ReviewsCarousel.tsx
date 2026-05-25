"use client";

import { useReducedMotion } from "framer-motion";
import { useFeaturable } from "../lib/useFeaturable";
import { GoogleG, Stars } from "./GoogleMark";

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function SkeletonRow() {
  return (
    <div className="flex gap-5 px-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-56 w-[320px] flex-none animate-pulse rounded-4xl border hairline bg-white sm:w-[400px]"
        />
      ))}
    </div>
  );
}

export function ReviewsCarousel() {
  const reduce = useReducedMotion();
  const { data, loading } = useFeaturable();
  const reviews = data?.reviews ?? [];

  if (loading && reviews.length === 0) return <SkeletonRow />;
  if (reviews.length === 0) return null;

  // Duplicate for a seamless loop; reduced motion gets a single, scrollable row.
  const items = reduce ? reviews : [...reviews, ...reviews];

  return (
    <div className={`overflow-hidden ${reduce ? "overflow-x-auto" : ""}`}>
      <div
        className={`flex w-max gap-5 ${
          reduce
            ? "px-6"
            : "animate-marquee hover:[animation-play-state:paused]"
        }`}
      >
        {items.map((r, i) => (
          <figure
            key={i}
            className="flex w-[320px] shrink-0 flex-col justify-between gap-6 rounded-4xl border hairline bg-white p-7 shadow-diffusion-sm sm:w-[400px]"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <GoogleG size={16} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    Google review
                  </span>
                </span>
                <Stars
                  rating={r.starRating}
                  size={14}
                  emptyColor="rgba(16,16,16,0.15)"
                />
              </div>
              <blockquote className="mt-4 line-clamp-6 text-base leading-relaxed text-ink-800">
                {r.comment}
              </blockquote>
            </div>
            <figcaption className="flex items-center gap-3">
              {r.reviewer.profilePhotoUrl ? (
                <img
                  src={r.reviewer.profilePhotoUrl}
                  alt=""
                  width={36}
                  height={36}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 flex-none rounded-full object-cover"
                />
              ) : (
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-ink-100 font-display text-sm font-bold text-ink-500">
                  {r.reviewer.displayName.charAt(0)}
                </span>
              )}
              <div>
                <div className="font-display text-base font-semibold uppercase leading-none tracking-[0.02em] text-ink-900">
                  {r.reviewer.displayName}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                  {fmtDate(r.createTime)}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
