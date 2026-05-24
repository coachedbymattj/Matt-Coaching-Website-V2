"use client";

import { useEffect, useState } from "react";

export const BF_STOPS = [10, 15, 20, 25, 30, 35] as const;
export type Sex = "male" | "female";

const NOTES: Record<Sex, Record<number, string>> = {
  male: {
    10: "Lean and athletic. Healthy. Going much lower is hard to sustain and can lower testosterone, energy and mood.",
    15: "Fit and healthy. A strong, sustainable target for most men.",
    20: "Average and acceptable. Healthy, with room to lean out.",
    25: "Upper limit of acceptable. Health risk starts to climb here.",
    30: "High. Raised risk of high blood pressure, blood sugar and cholesterol.",
    35: "Obese range. Much higher risk of heart disease, type 2 diabetes and joint strain.",
  },
  female: {
    10: "Below essential fat. Risk of hormone disruption, loss of periods, bone density loss and fertility problems. Not safe for most women.",
    15: "Very lean, competition level. Okay short term for athletes, but watch for hormonal or menstrual changes if held too long.",
    20: "Lean and athletic. Healthy and strong.",
    25: "Healthy average. A great sustainable range for most women.",
    30: "Acceptable, upper end. Healthy with room to improve.",
    35: "High. Raised risk of metabolic and cardiovascular issues.",
  },
};

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** Controlled sex (optional). If omitted, the component manages its own. */
  sex?: Sex;
  onSexChange?: (s: Sex) => void;
  defaultSex?: Sex;
  showSexToggle?: boolean;
  showDisclaimers?: boolean;
  idPrefix?: string;
};

export function BodyFatSelector({
  label,
  value,
  onChange,
  sex: controlledSex,
  onSexChange,
  defaultSex = "male",
  showSexToggle = true,
  showDisclaimers = true,
  idPrefix = "bf",
}: Props) {
  const [internalSex, setInternalSex] = useState<Sex>(defaultSex);
  const sex = controlledSex ?? internalSex;
  const setSex = (s: Sex) =>
    onSexChange ? onSexChange(s) : setInternalSex(s);

  // Preload the current sex's figures so sliding swaps instantly (smooth morph).
  useEffect(() => {
    BF_STOPS.forEach((s) => {
      const img = new window.Image();
      img.src = `/bodyfat/${sex}-${s}.png`;
    });
  }, [sex]);

  const note = NOTES[sex][value] ?? "";
  const labelClass =
    "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={labelClass}>{label}</span>
        {showSexToggle && (
          <div
            role="radiogroup"
            aria-label="Sex"
            className="flex rounded-full border hairline bg-canvas p-0.5"
          >
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={sex === s}
                onClick={() => setSex(s)}
                className={`rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] transition ${
                  sex === s
                    ? "bg-ink-900 text-canvas"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {s === "male" ? "Male" : "Female"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[260px,1fr] sm:items-center">
        {/* Fixed image frame: the figure swaps in place as the value changes */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-3xl border hairline bg-ink-950">
          <img
            src={`/bodyfat/${sex}-${value}.png`}
            alt={`${sex === "male" ? "Male" : "Female"} figure at approximately ${value}% body fat`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950/80 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <div className="font-display text-4xl font-bold leading-none tracking-[-0.01em] text-canvas">
              {value}
              <span className="ml-0.5 text-xl text-canvas/60">%</span>
            </div>
          </div>
        </div>

        {/* Controls + note */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
              Estimated body fat
            </div>
            <div className="mt-0.5 font-display text-5xl font-bold uppercase leading-none tracking-[-0.01em] text-ink-900">
              {value}
              <span className="ml-1 text-2xl text-ink-400">%</span>
            </div>
          </div>

          <div>
            <input
              id={`${idPrefix}-slider`}
              type="range"
              min={10}
              max={35}
              step={5}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              aria-label={`${label} estimate`}
              aria-valuetext={`${value} percent`}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-ember"
            />
            <div className="mt-2 flex justify-between">
              {BF_STOPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange(s)}
                  aria-pressed={value === s}
                  className={`font-mono text-[11px] tabular-nums transition ${
                    value === s
                      ? "font-bold text-ember-deep"
                      : "text-ink-400 hover:text-ink-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ink-600">{note}</p>
        </div>
      </div>

      {showDisclaimers && (
        <div className="rounded-3xl border hairline bg-ink-50/60 p-4">
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2.5 text-xs leading-snug text-ink-500">
              <span className="mt-1.5 h-1 w-3 flex-none rounded-full bg-ink-300" />
              This is an estimate only.
            </li>
            <li className="flex items-start gap-2.5 text-xs leading-snug text-ink-500">
              <span className="mt-1.5 h-1 w-3 flex-none rounded-full bg-ink-300" />
              Most people underestimate their body fat, so be honest and round up
              if unsure.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
