import type { Metadata } from "next";
import { VisitLogViewer } from "./VisitLogViewer";

export const metadata: Metadata = {
  title: "Visit log · Private",
  robots: { index: false, follow: false },
};

export default function VisitLogPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-24 pt-16 md:pt-24">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
        Private · Site owner only
      </div>
      <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-6xl">
        Visit log
      </h1>
      <VisitLogViewer />
    </section>
  );
}
