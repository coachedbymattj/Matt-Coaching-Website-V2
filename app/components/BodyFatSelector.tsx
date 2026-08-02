"use client";

import { useEffect, useState } from "react";

export const BF_STOPS = [10, 15, 20, 25, 30, 35] as const;
export const BF_MIN = 10;
export const BF_MAX = 35;
export type Sex = "male" | "female";

/**
 * Any body-fat value is allowed, but reference photos only exist at the 5%
 * stops — so the figure (and its health note) snap to the closest one and act
 * as a guide either side of the number the visitor actually entered.
 */
export function nearestStop(v: number): number {
  return BF_STOPS.reduce((best, s) =>
    Math.abs(s - v) < Math.abs(best - v) ? s : best
  );
}

/** Trim the trailing ".0" so 17 reads as "17" and 17.5 stays "17.5". */
export const fmtBf = (v: number) =>
  Number.isInteger(v) ? String(v) : v.toFixed(1);

const clampBf = (v: number) => Math.min(BF_MAX, Math.max(BF_MIN, v));

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

/**
 * The morphing body-fat figure. Stands on its own so it can sit in a column
 * beside the calculator (see GoalWeightCalculator / MacroCalculator).
 */
export function BodyFatFigure({
  sex,
  value,
  caption,
}: {
  sex: Sex;
  value: number;
  caption?: string;
}) {
  // Preload the current sex's figures so sliding swaps instantly (smooth morph).
  useEffect(() => {
    BF_STOPS.forEach((s) => {
      const img = new window.Image();
      img.src = `/bodyfat/${sex}-${s}.webp`;
    });
  }, [sex]);

  const stop = nearestStop(value);
  const isBetween = value !== stop;

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-3xl border hairline bg-ink-950">
      <img
        src={`/bodyfat/${sex}-${stop}.webp`}
        alt={`${sex === "male" ? "Male" : "Female"} reference figure at approximately ${stop}% body fat`}
        width={600}
        height={804}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950/85 to-transparent" />
      {caption && (
        <div className="absolute left-4 top-4 rounded-full bg-ink-950/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-canvas/80 backdrop-blur">
          {caption}
        </div>
      )}
      <div className="absolute bottom-3 left-4">
        <div className="font-display text-4xl font-bold leading-none tracking-[-0.01em] text-canvas">
          {fmtBf(value)}
          <span className="ml-0.5 text-xl text-canvas/60">%</span>
        </div>
        {/* Make it explicit that the photo is the nearest guide, not the exact
            number, so a visitor on 17% is not confused by a 15% figure. */}
        {isBetween && (
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/55">
            Photo guide · {stop}%
          </div>
        )}
      </div>
    </div>
  );
}

type ControlsProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** Controlled sex (optional). If omitted, the component manages its own. */
  sex?: Sex;
  onSexChange?: (s: Sex) => void;
  defaultSex?: Sex;
  showSexToggle?: boolean;
  showLabel?: boolean;
  showDisclaimers?: boolean;
  idPrefix?: string;
};

/** Sex toggle + snapping slider + health note. Pairs with BodyFatFigure. */
export function BodyFatControls({
  label,
  value,
  onChange,
  sex: controlledSex,
  onSexChange,
  defaultSex = "male",
  showSexToggle = true,
  showLabel = true,
  showDisclaimers = true,
  idPrefix = "bf",
}: ControlsProps) {
  const [internalSex, setInternalSex] = useState<Sex>(defaultSex);
  const sex = controlledSex ?? internalSex;
  const setSex = (s: Sex) => (onSexChange ? onSexChange(s) : setInternalSex(s));

  // Health notes are written per 5% band, so read the one for the closest stop.
  const note = NOTES[sex][nearestStop(value)] ?? "";
  const labelClass =
    "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";

  // Local draft so half-typed values ("1", "") aren't clamped mid-keystroke.
  // Anything already valid applies live, so the figure tracks as you type and
  // a value still in the box can't be missed if you never leave the field.
  const [draft, setDraft] = useState<string | null>(null);
  const type = (raw: string) => {
    setDraft(raw);
    const n = parseFloat(raw);
    if (Number.isFinite(n) && n >= BF_MIN && n <= BF_MAX) {
      onChange(Math.round(n * 2) / 2);
    }
  };
  const commit = (raw: string) => {
    const n = parseFloat(raw);
    onChange(Number.isFinite(n) ? clampBf(Math.round(n * 2) / 2) : value);
    setDraft(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {(showLabel || showSexToggle) && (
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showLabel && <span className={labelClass}>{label}</span>}
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
      )}

      <div>
        <div className="flex items-center gap-3">
          <input
            id={`${idPrefix}-slider`}
            type="range"
            min={BF_MIN}
            max={BF_MAX}
            step={0.5}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            aria-label={`${label} estimate`}
            aria-valuetext={`${fmtBf(value)} percent`}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-ink-200 accent-ember"
          />
          {/* Type an exact figure — the slider covers whole percents, this also
              takes half percents for anyone working from a DEXA or caliper read. */}
          <label htmlFor={`${idPrefix}-exact`} className="sr-only">
            {label} exact value
          </label>
          <div className="relative flex-none">
            <input
              id={`${idPrefix}-exact`}
              type="number"
              inputMode="decimal"
              min={BF_MIN}
              max={BF_MAX}
              step={0.5}
              value={draft ?? fmtBf(value)}
              onChange={(e) => type(e.target.value)}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
              }}
              className="w-[4.75rem] rounded-full border hairline bg-canvas py-1.5 pl-3 pr-6 text-right font-mono text-sm tabular-nums text-ink-900 outline-none transition focus:border-ember/50"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-400">
              %
            </span>
          </div>
        </div>

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
                  : nearestStop(value) === s
                    ? "text-ink-600"
                    : "text-ink-400 hover:text-ink-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-ink-600">{note}</p>

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
