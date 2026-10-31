import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { LazyGoalWeightCalculator } from "../../components/lazy";
import { ResultGate } from "../../components/level-zero/ResultGate";

export const metadata: Metadata = {
  title: "Goal Weight Calculator · Level Zero · Coached by Matt J",
  description:
    "Work out your goal weight from your body-fat %, then unlock a free week-by-week projection of how to get there.",
};

export default function GoalWeightPage() {
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
            Level Zero · Tool 02
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,4.4rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
            Goal Weight <span className="text-ember-grad">Calculator</span>
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-600 md:text-lg">
            Enter your numbers to find your ideal goal weight from your body-fat
            percentage, then see exactly how many weeks it takes at your chosen
            pace.
          </p>
        </header>

        <div className="mt-10">
          <ResultGate
            tool="Goal Weight Calculator"
            title="Enter your email to start"
            blurb="Enter your email to open the calculator, then get your goal weight and a full week-by-week plan to reach it."
            submitLabel="Start the calculator"
          >
            <LazyGoalWeightCalculator />
          </ResultGate>
        </div>
      </div>
    </section>
  );
}
