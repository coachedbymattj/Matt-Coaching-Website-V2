"use client";

import { useFeaturable } from "../lib/useFeaturable";
import { GoogleG, Stars } from "./GoogleMark";

export function GoogleRatingBadge() {
  const { data } = useFeaturable();

  // Hide gracefully while loading, on error, or with no reviews.
  if (!data || data.totalReviewCount === 0) return null;

  const { averageRating, totalReviewCount, profileUrl } = data;

  return (
    <a
      href={profileUrl ?? "https://www.google.com"}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-2xl border border-canvas/15 bg-canvas/5 px-4 py-3 transition hover:bg-canvas/10"
      aria-label={`Rated ${averageRating.toFixed(1)} out of 5 from ${totalReviewCount} Google reviews`}
    >
      <GoogleG size={22} />
      <span className="flex flex-col">
        <span className="flex items-center gap-2">
          <span className="font-display text-lg font-bold leading-none text-canvas">
            {averageRating.toFixed(1)}
          </span>
          <Stars rating={averageRating} size={13} />
        </span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/55">
          {totalReviewCount} Google review{totalReviewCount === 1 ? "" : "s"}
        </span>
      </span>
    </a>
  );
}
