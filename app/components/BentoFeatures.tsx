"use client";

import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  Brain,
  Lightning,
  ForkKnife,
  Sparkle,
  ChartLineUp,
  Waveform,
} from "@phosphor-icons/react";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

/* 1. Intelligent List, items auto-sort to mimic AI prioritization */
const IntelligentList = memo(function IntelligentList() {
  const seed = [
    { id: "a", t: "Hinge progression · 3x6 @ RPE 8", w: 5 },
    { id: "b", t: "Zone 2 · 35 min, nasal-only", w: 3 },
    { id: "c", t: "Protein target · 168g", w: 4 },
    { id: "d", t: "Mobility · T-spine + ankles", w: 2 },
  ];
  const [items, setItems] = useState(seed);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        const copy = [...prev];
        const i = Math.floor(Math.random() * copy.length);
        const j = Math.floor(Math.random() * copy.length);
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return copy;
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="flex flex-col gap-2">
      {items.map((it) => (
        <motion.li
          key={it.id}
          layout
          layoutId={it.id}
          transition={spring}
          className="flex items-center justify-between rounded-2xl border hairline bg-canvas px-3 py-2.5 text-sm"
        >
          <span className="flex items-center gap-2 text-ink-800">
            <span className="font-mono text-[10px] text-ink-400">
              {String(it.w).padStart(2, "0")}
            </span>
            {it.t}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            today
          </span>
        </motion.li>
      ))}
    </ul>
  );
});

/* 2. Command Input, typewriter prompts */
const CommandInput = memo(function CommandInput() {
  const prompts = [
    "Why is my deadlift stalling at 160kg?",
    "Build me a 4-day split around shift work",
    "How do I cut without losing strength?",
    "Plan a refeed week, I have a wedding Saturday",
  ];
  const [pIdx, setPIdx] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const current = prompts[pIdx];
    if (chars < current.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 38);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setChars(0);
      setPIdx((i) => (i + 1) % prompts.length);
    }, 1700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars, pIdx]);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border hairline bg-canvas px-4 py-3 font-mono text-sm">
        <span className="text-ink-400">ask matt&nbsp;›&nbsp;</span>
        <span className="text-ink-900">
          {prompts[pIdx].slice(0, chars)}
        </span>
        <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-[1px] bg-ink-900 align-middle animate-breathe" />
      </div>
      <div className="flex items-center gap-2 text-[11px] text-ink-500">
        <Sparkle size={12} weight="fill" className="text-ember" />
        <span>Avg reply · 47 min in working hours</span>
      </div>
    </div>
  );
});

/* 3. Live Status, breathing dots + overshoot badge */
const LiveStatus = memo(function LiveStatus() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2800);
    }, 4400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col gap-3">
      {[
        { d: "Mon 06:40", s: "Lower · Heavy", c: "live" },
        { d: "Tue 06:40", s: "Conditioning · Z2", c: "queued" },
        { d: "Wed 06:40", s: "Upper · Push focus", c: "queued" },
      ].map((row) => (
        <div
          key={row.d}
          className="flex items-center justify-between rounded-2xl border hairline bg-canvas px-3 py-2.5 text-sm"
        >
          <div className="flex items-center gap-3">
            <span
              className={
                row.c === "live"
                  ? "h-2 w-2 rounded-full bg-ember animate-breathe"
                  : "h-2 w-2 rounded-full bg-ink-200"
              }
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
              {row.d}
            </span>
            <span className="text-ink-800">{row.s}</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            {row.c}
          </span>
        </div>
      ))}

      <AnimatePresence>
        {pulse && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 16 }}
            className="absolute -top-3 right-2 rounded-full bg-ink-900 px-3 py-1.5 text-[11px] font-medium text-canvas shadow-diffusion-sm"
          >
            New form check from Aoife ·  +12s
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/* 4. Infinite carousel of macro tags */
const MacroStream = memo(function MacroStream() {
  const tiles = [
    { k: "Protein", v: "168g", t: "+3g vs last wk" },
    { k: "Calories", v: "2,470", t: "−180 cut" },
    { k: "Steps", v: "11,420", t: "7-day avg" },
    { k: "Sleep", v: "7h 18m", t: "+22m" },
    { k: "HRV", v: "62 ms", t: "+4" },
    { k: "RHR", v: "54 bpm", t: "−1" },
    { k: "Sessions", v: "4 / 4", t: "complete" },
  ];
  const loop = [...tiles, ...tiles];

  return (
    <div className="-mx-8 overflow-hidden">
      <div className="flex w-max gap-3 px-8 animate-marquee">
        {loop.map((t, i) => (
          <div
            key={i}
            className="flex w-[180px] flex-col gap-1 rounded-2xl border hairline bg-canvas px-4 py-3"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
              {t.k}
            </span>
            <span className="font-mono text-xl text-ink-900">{t.v}</span>
            <span className="text-[11px] text-ink-500">{t.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* 5. Magnetic CTA-style focus card with form-check highlight */
const FocusCard = memo(function FocusCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tx = useTransform(x, [-50, 50], [-6, 6]);
  const ty = useTransform(y, [-50, 50], [-4, 4]);

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set(e.clientX - (r.left + r.width / 2));
        y.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: tx, y: ty }}
      className="relative h-full overflow-hidden rounded-3xl border hairline bg-canvas p-5"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          Form check
        </span>
        <span className="rounded-full bg-ember/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ember-deep">
          reviewed
        </span>
      </div>
      <p className="mt-3 max-w-[28ch] text-sm leading-snug text-ink-700">
        “<motion.span
          className="rounded bg-ember/15 px-1"
          animate={{ backgroundColor: ["rgba(200,85,61,0.0)", "rgba(200,85,61,0.18)", "rgba(200,85,61,0.0)"] }}
          transition={{ duration: 3.4, repeat: Infinity }}
        >Brace harder before unracking</motion.span>, your spine extension at the top
        is bleeding bar speed by rep 3. Cue: ribs down, glutes on, then walk-out.”
      </p>
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.4 }}
        className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full border hairline bg-canvas px-2.5 py-1.5 text-[11px] text-ink-700 shadow-diffusion-sm"
      >
        <Waveform size={12} weight="bold" /> Voice note · 0:47
      </motion.div>
    </motion.div>
  );
});

/* Card chrome */
function Card({
  span,
  icon,
  label,
  title,
  children,
}: {
  span: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-4 ${span}`}>
      <div className="rounded-5xl border hairline bg-white p-8 shadow-diffusion">
        <div className="flex items-center gap-2 text-ink-600">
          <span className="rounded-xl bg-ember/10 p-1.5 text-ember-deep">{icon}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
            {label}
          </span>
        </div>
        <div className="mt-5">{children}</div>
      </div>
      <div className="px-2">
        <h3 className="font-display text-xl font-semibold uppercase tracking-[0.01em] text-ink-900">
          {title}
        </h3>
      </div>
    </div>
  );
}

export function BentoFeatures() {
  return (
    <section className="bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              The system · 04 of 12
            </div>
            <h2 className="mt-4 max-w-md font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-6xl">
              A coach who reads your week before you do.
            </h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 max-w-[58ch] self-end text-base leading-relaxed text-ink-600">
            Every block is engineered around the data you generate, sleep, lifts, food,
            stress, life. The app surfaces what matters; I do the thinking and write
            the call. You just train.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          <Card
            span="md:col-span-5"
            icon={<Brain size={14} weight="bold" />}
            label="Intelligent programming"
            title="Your week, re-prioritized every Sunday at 6pm."
          >
            <IntelligentList />
          </Card>

          <Card
            span="md:col-span-7"
            icon={<Lightning size={14} weight="bold" />}
            label="Always-on coach"
            title="Ask anything. Get a real answer, not a chatbot."
          >
            <CommandInput />
          </Card>

          <Card
            span="md:col-span-7"
            icon={<ChartLineUp size={14} weight="bold" />}
            label="Live schedule"
            title="Sessions and check-ins, synced to your calendar."
          >
            <LiveStatus />
          </Card>

          <Card
            span="md:col-span-5"
            icon={<ForkKnife size={14} weight="bold" />}
            label="Macro stream"
            title="Daily inputs that actually move the needle."
          >
            <MacroStream />
          </Card>

          <Card
            span="md:col-span-12"
            icon={<Sparkle size={14} weight="bold" />}
            label="Form library"
            title="Voice-note feedback on every lift you film."
          >
            <FocusCard />
          </Card>
        </div>
      </div>
    </section>
  );
}
