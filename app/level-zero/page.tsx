import type { Metadata } from "next";
import Link from "next/link";
import {
  LockSimple,
  ArrowUpRight,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { Reveal } from "../components/motion";

export const metadata: Metadata = {
  title: "Level Zero · Free tools · Coached by Matt J",
  description:
    "Level Zero, a room of free tools to take the first step: panic-button coaching, a goal weight calculator, macro tools and more.",
};

type Tool =
  | {
      kind: "external";
      n: string;
      title: string;
      desc: string;
      href: string;
      icon: string;
    }
  | {
      kind: "internal";
      n: string;
      title: string;
      desc: string;
      href: string;
      icon: string;
    }
  | {
      kind: "soon";
      n: string;
      title: string;
      desc?: string;
      note: string;
      icon: string;
    };

const tools: Tool[] = [
  {
    kind: "external",
    n: "01",
    title: "Panic Button",
    desc: "In-the-moment coaching when you're struggling.",
    href: "https://panicbtn-mhvwst4c.manus.space/",
    icon: "/icons/panic-button.webp",
  },
  {
    kind: "internal",
    n: "02",
    title: "Goal Weight Calculator",
    desc: "Find your ideal goal weight from your body-fat %.",
    href: "/level-zero/goal-weight",
    icon: "/icons/goal-weight.webp",
  },
  {
    kind: "internal",
    n: "03",
    title: "Macro Calculator",
    desc: "Work out your daily macros.",
    href: "/level-zero/macro",
    icon: "/icons/macro.webp",
  },
  {
    kind: "internal",
    n: "04",
    title: "Exercise Swaps",
    desc: "Find a smart alternative for any exercise.",
    href: "/level-zero/exercise-swap",
    icon: "/icons/exercise-swapper.webp",
  },
  // TODO (Session Builder): when built, limit free use to 1 session per 7 days
  // so people can't pull unlimited free sessions. Static site = soft client-side
  // limit only (localStorage cooldown + countdown to next allowed use); bypassable
  // via incognito / clearing storage / another device. True per-user enforcement
  // needs accounts or a backend. Optionally email-gate each generation (Mailchimp).
  {
    kind: "soon",
    n: "05",
    title: "Session Builder",
    desc: "Put together a balanced training session in minutes.",
    note: "Coming soon",
    icon: "/icons/session-builder.webp",
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    kind: "soon" as const,
    n: String(i + 6).padStart(2, "0"),
    title: "New tool incoming",
    note: "Coming soon",
    icon: "/icons/coming-soon.webp",
  })),
];

function ToolCardChrome({
  icon,
  n,
  muted,
  children,
  footer,
}: {
  icon: string;
  n: string;
  muted?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <img
            src={icon}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            className={`h-12 w-12 rounded-2xl object-cover ${muted ? "opacity-80" : ""}`}
          />
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
              muted ? "text-ink-300" : "text-ink-400"
            }`}
          >
            Tool {n}
          </span>
        </div>
        {children}
      </div>
      {footer}
    </>
  );
}

export default function LevelZeroPage() {
  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink-950 text-canvas">
        <div className="pointer-events-none absolute inset-0 speed-stripes" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />
        <div className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-24 md:pb-20 md:pt-32">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ember-pulse" />
            Free tools · No login
          </div>
          <h1 className="mt-5 font-display text-[clamp(3rem,9vw,7rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em]">
            Level <span className="text-ember-grad">Zero</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-canvas/70 md:text-lg lg:whitespace-nowrap">
            Your starting line, a room of free tools to take the first step,
            before you ever apply.
          </p>
        </div>
      </section>

      {/* Tool grid */}
      <section className="bg-canvas py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => {
              const delay = Math.min(i, 5) * 0.05;
              if (tool.kind === "soon") {
                return (
                  <Reveal key={tool.n} delay={delay} className="h-full">
                  <div
                    aria-disabled="true"
                    className="flex h-full cursor-default flex-col justify-between gap-8 rounded-4xl border border-dashed border-ink-300/60 bg-ink-50/50 p-7 md:p-8"
                  >
                    <ToolCardChrome icon={tool.icon} n={tool.n} muted>
                      <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-[0.95] tracking-[0.01em] text-ink-400">
                        {tool.title}
                      </h3>
                      {tool.desc && (
                        <p className="mt-2.5 text-sm leading-relaxed text-ink-400">
                          {tool.desc}
                        </p>
                      )}
                    </ToolCardChrome>
                    {
                      <div className="flex items-center gap-2 border-t border-ink-200/70 pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
                        <LockSimple size={12} weight="bold" />
                        {tool.note}
                      </div>
                    }
                  </div>
                  </Reveal>
                );
              }

              const isExternal = tool.kind === "external";
              const cardClass =
                "group flex h-full flex-col justify-between gap-8 rounded-4xl border hairline bg-white p-7 shadow-diffusion-sm transition duration-300 hover:-translate-y-1 hover:border-ember/40 hover:shadow-ember-glow focus-visible:-translate-y-1 active:translate-y-0 active:scale-[0.99] md:p-8";
              const footer = (
                <div className="flex items-center justify-between border-t hairline pt-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                    {isExternal ? "Opens in new tab" : "Open tool"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.12em] text-ink-900 transition group-hover:gap-2.5">
                    Open
                    {isExternal ? (
                      <ArrowUpRight size={16} weight="bold" />
                    ) : (
                      <ArrowRight size={16} weight="bold" />
                    )}
                  </span>
                </div>
              );
              const inner = (
                <ToolCardChrome icon={tool.icon} n={tool.n} footer={footer}>
                  <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-[0.95] tracking-[0.01em] text-ink-900">
                    {tool.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                    {tool.desc}
                  </p>
                </ToolCardChrome>
              );

              const card = isExternal ? (
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              ) : (
                <Link href={tool.href} className={cardClass}>
                  {inner}
                </Link>
              );
              return (
                <Reveal key={tool.n} delay={delay} className="h-full">
                  {card}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
