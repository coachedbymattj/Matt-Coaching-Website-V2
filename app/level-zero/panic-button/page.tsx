import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LazyPanicButton } from "../../components/lazy";

export const metadata: Metadata = {
  title: "Panic Button · Level Zero · Coached by Matt J",
  description:
    "Struggling right now? Type what's going on, answer a few quick questions and get a straight answer on what to do next.",
};

export default function PanicButtonPage() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-24 md:pt-32">
        <Link
          href="/level-zero"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft size={12} weight="bold" />
          Back to Level Zero
        </Link>

        <header className="mt-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
            Level Zero · Tool 01
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,4.4rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
            Panic <span className="text-ember-grad">Button</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-600 md:text-lg">
            In-the-moment coaching for when things go sideways. Fast, calm and
            straight to the point.
          </p>
        </header>

        <div className="mt-10">
          <LazyPanicButton />
        </div>

        <p className="mt-12 border-t hairline pt-6 text-xs leading-relaxed text-ink-500">
          General coaching guidance, not medical advice. If something feels
          seriously wrong, speak to your doctor. In an emergency, call your
          local emergency number.
        </p>
      </div>
    </section>
  );
}
