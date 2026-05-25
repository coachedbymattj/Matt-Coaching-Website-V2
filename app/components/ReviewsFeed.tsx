import Script from "next/script";
import { FEATURABLE_WIDGET_ID, FEATURABLE_BUNDLE } from "../lib/featurable";

export function ReviewsFeed() {
  return (
    <section className="bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              Google reviews
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-6xl">
              Don&apos;t just take my word for it
            </h2>
          </div>
          <p className="md:col-span-4 max-w-sm text-base leading-relaxed text-ink-600">
            Real reviews from real clients.
          </p>
        </div>

        {/* Featurable widget, auto-updates from Google via the client bundle */}
        <div className="mt-12">
          <div
            id={`featurable-${FEATURABLE_WIDGET_ID}`}
            data-featurable-async
          />
        </div>
      </div>

      <Script src={FEATURABLE_BUNDLE} strategy="lazyOnload" />
    </section>
  );
}
