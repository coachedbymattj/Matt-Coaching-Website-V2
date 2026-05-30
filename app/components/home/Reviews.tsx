"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "../motion";
import { useFeaturable } from "../../lib/useFeaturable";
import { GoogleG, Stars } from "../GoogleMark";

function PullQuoteSkeleton() {
  return (
    <div>
      <div className="h-12 w-6 animate-pulse rounded bg-ink-100" />
      <div className="mt-4 h-7 w-full animate-pulse rounded bg-ink-100" />
      <div className="mt-2 h-7 w-[88%] animate-pulse rounded bg-ink-100" />
      <div className="mt-2 h-7 w-[72%] animate-pulse rounded bg-ink-100" />
      <div className="mt-6 h-3 w-44 animate-pulse rounded bg-ink-100" />
    </div>
  );
}

function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    .toUpperCase();
}

export function HomeReviews() {
  const { data, loading } = useFeaturable();
  const reviews = data?.reviews ?? [];

  // Prefer the two longest 5-star reviews so the pull-quotes carry weight.
  const featured = [...reviews]
    .filter((r) => (r.starRating ?? 0) >= 5)
    .sort((a, b) => (b.comment?.length ?? 0) - (a.comment?.length ?? 0))
    .slice(0, 2);

  return (
    <section className="border-b hairline bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              05 / 07 — In their words
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-6xl">
              Don&apos;t just take my
              <br />
              word for it.
            </h2>
            <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-ink-600">
              Real reviews from real clients, straight from Google.
              {data?.totalReviewCount ? (
                <>
                  {" "}
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                    {data.totalReviewCount} reviews ·{" "}
                    {data.averageRating.toFixed(1)} avg.
                  </span>
                </>
              ) : null}
            </p>
          </Reveal>

          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
              {loading && featured.length === 0 ? (
                <>
                  <PullQuoteSkeleton />
                  <PullQuoteSkeleton />
                </>
              ) : featured.length > 0 ? (
                featured.map((r, i) => (
                  <Reveal key={r.reviewId ?? i} delay={i * 0.06}>
                    <figure>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <GoogleG size={16} />
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
                            Google review
                          </span>
                        </span>
                        <Stars
                          rating={r.starRating ?? 5}
                          size={14}
                          emptyColor="rgba(16,16,16,0.15)"
                        />
                      </div>

                      <span
                        aria-hidden
                        className="mt-5 inline-block font-display text-7xl font-bold leading-none text-ember-deep"
                      >
                        &ldquo;
                      </span>
                      <blockquote className="mt-2 text-2xl leading-[1.3] text-ink-900 md:text-[26px]">
                        {r.comment}
                      </blockquote>

                      <figcaption className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                        <span className="text-ink-900">
                          — {r.reviewer?.displayName ?? "Anonymous"}
                        </span>
                        {fmtDate(r.createTime) && (
                          <>
                            <span>·</span>
                            <span>{fmtDate(r.createTime)}</span>
                          </>
                        )}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))
              ) : (
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                  Reviews unavailable right now ·{" "}
                  <Link
                    href="/results"
                    className="text-ember-deep hover:text-ink-900"
                  >
                    see the case files →
                  </Link>
                </p>
              )}
            </div>

            <div className="mt-14 flex items-center justify-between border-t hairline pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              <span>Source · Google Business Profile · live</span>
              {data?.profileUrl ? (
                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-700 hover:text-ember-deep"
                >
                  Read every review
                  <ArrowUpRight size={14} weight="bold" />
                </a>
              ) : (
                <Link
                  href="/results"
                  className="inline-flex items-center gap-2 text-ink-700 hover:text-ember-deep"
                >
                  See the case files
                  <ArrowUpRight size={14} weight="bold" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
