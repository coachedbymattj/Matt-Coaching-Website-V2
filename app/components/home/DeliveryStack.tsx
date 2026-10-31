import { Reveal } from "../motion";

/* ── 01 · Customised app — Lab / Instrument treatment ───────────────────── */
function CustomAppPanel() {
  const readouts = [
    { k: "Sleep", v: "7h 18m", live: false },
    { k: "HRV", v: "62 ms", live: true },
    { k: "Heart rate", v: "54 bpm", live: false },
    { k: "Weight", v: "84.2 kg", live: false },
  ];

  return (
    <article className="grain relative overflow-hidden rounded-4xl bg-ink-950 p-8 text-canvas shadow-diffusion md:p-12">
      {/* speed-stripes texture */}
      <div className="pointer-events-none absolute inset-0 speed-stripes" />

      {/* 1px ember tick column on the left edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-8 left-3 flex flex-col justify-between"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className={`block h-px ${
              i % 4 === 0 ? "w-3 bg-ember/70" : "w-2 bg-canvas/15"
            }`}
          />
        ))}
      </div>

      <div className="relative">
        {/* code chip + REC */}
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]">
          <span className="text-ember-soft">01 / 04 · The instrument</span>
          <span className="inline-flex items-center gap-1.5 text-ember-soft">
            <span className="inline-block h-2 w-2 rounded-full bg-ember animate-ember-pulse" />
            REC
          </span>
        </div>

        {/* headline */}
        <h3 className="mt-7 max-w-3xl font-display text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.005em] text-canvas md:text-5xl">
          A customised app, built around you.
        </h3>

        {/* body */}
        <ul className="mt-7 grid max-w-3xl grid-cols-1 gap-2 text-[15px] leading-[1.55] text-canvas/80 md:text-base">
          <li>
            Your training programmes, nutrition, and macros, all in one place.
          </li>
          <li>Daily check-ins.</li>
          <li>
            Connects to your Health app: sleep, HRV, heart rate, weight, every
            signal that matters.
          </li>
          <li>I see what you see, so I can adjust in real time.</li>
        </ul>

        {/* live readouts */}
        <div className="mt-10 border-t border-canvas/10 pt-6">
          <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/55">
            <span>Live readout · last sync 06 m ago</span>
            <span>Source · your Health app</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {readouts.map((r) => (
              <div key={r.k}>
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-canvas/55">
                  {r.live ? (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember animate-ember-pulse" />
                  ) : (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-canvas/25" />
                  )}
                  <span>{r.k}</span>
                </div>
                <div className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight text-canvas md:text-4xl">
                  {r.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── 02–04 · Human channels — Editorial treatment ───────────────────────── */
const channels = [
  {
    n: "02",
    t: "Weekly Loom feedback",
    bullets: [
      "A short, personal video review every week.",
      "Voice and screen, walking through your numbers, your training, what to change.",
      "Not a templated email.",
    ],
  },
  {
    n: "03",
    t: "Form check on Google Drive",
    bullets: [
      "Upload a clip of any lift.",
      "I review it, mark up what to fix, send it back.",
      "As often as you need it.",
    ],
  },
  {
    n: "04",
    t: "WhatsApp for everything else",
    bullets: [
      "Direct line.",
      "Quick questions, mid-session checks, life stuff that affects training.",
      "One human, one thread.",
    ],
  },
];

export function HomeDeliveryStack() {
  return (
    <section className="border-b hairline bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* section header */}
        <div className="grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              02 / 07— How we work together
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-6xl">
              The delivery stack.
            </h2>
          </Reveal>
          <Reveal
            delay={0.05}
            className="col-span-12 md:col-span-6 md:col-start-7 max-w-[58ch] self-end"
          >
            <p className="text-base leading-relaxed text-ink-700">
              Four channels. One coach. The app is the instrument that watches
              your week; the rest is me, on a direct line, doing the thinking
              and writing the call.
            </p>
          </Reveal>
        </div>

        {/* 01 — instrument panel (the seam) */}
        <Reveal className="mt-14">
          <CustomAppPanel />
        </Reveal>

        {/* 02–04 — editorial channel rows */}
        <div className="mt-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              The human channels
            </div>
            <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-ink-600">
              Where the actual coaching happens. No portal logins, no
              chatbots, no ticket queues.
            </p>
          </div>

          <ol className="col-span-12 md:col-span-8 md:col-start-5">
            {channels.map((c, i) => (
              <Reveal
                key={c.n}
                delay={i * 0.05}
                className="grid grid-cols-12 gap-6 border-t hairline py-10 first:border-t-0 first:pt-0"
              >
                <div className="col-span-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                  {c.n} / 04
                </div>
                <div className="col-span-10">
                  <h3 className="font-display text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.005em] text-ink-900 md:text-4xl">
                    {c.t}.
                  </h3>
                  <ul className="mt-5 flex max-w-[55ch] flex-col gap-1.5 text-[17px] leading-[1.55] text-ink-700">
                    {c.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
