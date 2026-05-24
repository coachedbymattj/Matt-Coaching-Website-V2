import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ExerciseSwapper } from "../../components/ExerciseSwapper";

export const metadata: Metadata = {
  title: "Exercise Swapper · Level Zero · Coached by Matt J",
  description:
    "Type an exercise and get coach-approved alternatives that train the same muscle and movement.",
};

export default function ExerciseSwapPage() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-24 md:pt-32">
        <Link
          href="/level-zero"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft size={12} weight="bold" />
          Back to Level Zero
        </Link>

        <header className="mt-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
            Level Zero · Tool 04
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,4.4rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
            Exercise <span className="text-ember-grad">Swapper</span>
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-600 md:text-lg">
            Type or pick an exercise and get coach-approved alternatives that
            train the same muscle and movement.
          </p>
        </header>

        <div className="mt-10">
          <ExerciseSwapper />
        </div>
      </div>
    </section>
  );
}
