"use client";

import dynamic from "next/dynamic";

// Client-side code-splitting for the heavy, interactive tools (each pulls in
// Framer Motion + its own logic). ssr:false keeps them out of the initial
// route bundle; a lightweight skeleton shows while the chunk loads.
function Skeleton() {
  return (
    <div className="rounded-5xl border hairline bg-white p-6 shadow-diffusion-sm md:p-8">
      <div className="h-5 w-44 animate-pulse rounded bg-ink-100" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-14 animate-pulse rounded-2xl bg-ink-100" />
        <div className="h-14 animate-pulse rounded-2xl bg-ink-100" />
        <div className="h-14 animate-pulse rounded-2xl bg-ink-100" />
      </div>
      <div className="mt-6 h-11 w-40 animate-pulse rounded-full bg-ink-100" />
    </div>
  );
}

export const LazyGoalWeightCalculator = dynamic(
  () => import("./GoalWeightCalculator").then((m) => m.GoalWeightCalculator),
  { ssr: false, loading: () => <Skeleton /> }
);

export const LazyMacroCalculator = dynamic(
  () => import("./MacroCalculator").then((m) => m.MacroCalculator),
  { ssr: false, loading: () => <Skeleton /> }
);

export const LazyExerciseSwapper = dynamic(
  () => import("./ExerciseSwapper").then((m) => m.ExerciseSwapper),
  { ssr: false, loading: () => <Skeleton /> }
);

export const LazySessionBuilder = dynamic(
  () => import("./SessionBuilder").then((m) => m.SessionBuilder),
  { ssr: false, loading: () => <Skeleton /> }
);
