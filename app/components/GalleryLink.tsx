import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

/* Small editorial "see also" strap that links back to the auto-cycling
   transformations gallery on the homepage. Same treatment everywhere so the
   cross-page connection feels intentional. */
export function GalleryLink() {
  return (
    <section className="border-t hairline bg-canvas py-10">
      <div className="mx-auto max-w-[1400px] px-6">
        <Link
          href="/#transformations"
          className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-700 transition hover:text-ember-deep"
        >
          <span className="text-ember-deep">→</span>
          <span>More transformations</span>
          <span aria-hidden className="text-ink-300">·</span>
          <span className="text-ink-500 transition group-hover:text-ink-700">
            View the gallery on the homepage
          </span>
          <ArrowUpRight
            size={12}
            weight="bold"
            className="text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember-deep"
          />
        </Link>
      </div>
    </section>
  );
}
