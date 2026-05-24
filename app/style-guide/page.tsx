import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Style Guide · Coached by Matt J",
  description: "Live brand and design system reference.",
  robots: { index: false, follow: false },
};

const INK = [
  ["ink-50", "#f7f7f6"],
  ["ink-100", "#ececea"],
  ["ink-200", "#d6d6d2"],
  ["ink-300", "#b3b3ac"],
  ["ink-400", "#86867d"],
  ["ink-500", "#5d5d55"],
  ["ink-600", "#3f3f3a"],
  ["ink-700", "#2a2a26"],
  ["ink-800", "#1a1a17"],
  ["ink-900", "#101010"],
  ["ink-950", "#0a0a09"],
];
const EMBER = [
  ["ember", "#c8553d"],
  ["ember-soft", "#d97a64"],
  ["ember-deep", "#8e3a29"],
  ["ember-bright", "#e8623f"],
];

function Block({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <section className="border-t hairline pt-10">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
        {title}
      </div>
      {sub && <p className="mt-2 max-w-[60ch] text-sm text-ink-500">{sub}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border hairline bg-white">
      <div className="h-16" style={{ backgroundColor: hex }} />
      <div className="px-3 py-2">
        <div className="font-mono text-[11px] text-ink-900">{name}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-400">
          {hex}
        </div>
      </div>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-24 md:pt-32">
        <header className="pb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
            Internal reference
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,4.6rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
            Brand &amp; <span className="text-ember-grad">Design System</span>
          </h1>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-600 md:text-lg">
            A living swatch of every token, font, button, radius, shadow and
            effect. The static reference lives in BRAND.md.
          </p>
        </header>

        <div className="flex flex-col gap-12">
          {/* COLOURS */}
          <Block title="Colours" sub="Ink neutral scale, ember accent, canvas.">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {INK.map(([n, h]) => (
                <Swatch key={n} name={n} hex={h} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {EMBER.map(([n, h]) => (
                <Swatch key={n} name={n} hex={h} />
              ))}
              <Swatch name="canvas" hex="#f4f1ec" />
            </div>
          </Block>

          {/* TYPOGRAPHY */}
          <Block
            title="Typography"
            sub="Barlow Condensed (display), Barlow (body), Geist Mono (data/labels)."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-4xl border hairline bg-white p-6">
                <div className="font-display text-6xl font-bold uppercase leading-none tracking-[-0.01em] text-ink-900">
                  Aa
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ember-deep">
                  font-display
                </div>
                <div className="mt-1 text-sm text-ink-600">
                  Barlow Condensed · 500/600/700
                </div>
                <div className="mt-3 font-display text-2xl font-bold uppercase tracking-[-0.01em] text-ink-900">
                  Bodies are built
                </div>
                <div className="mt-1 text-xs text-ink-400">
                  Headings, numerals, wordmark
                </div>
              </div>

              <div className="rounded-4xl border hairline bg-white p-6">
                <div className="text-6xl font-medium leading-none text-ink-900">
                  Aa
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ember-deep">
                  font-sans
                </div>
                <div className="mt-1 text-sm text-ink-600">
                  Barlow · 300/400/500/600/700
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  Engineered protocols, measured outcomes, body copy and inputs.
                </p>
              </div>

              <div className="rounded-4xl border hairline bg-white p-6">
                <div className="font-mono text-6xl leading-none text-ink-900">
                  Aa
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ember-deep">
                  font-mono
                </div>
                <div className="mt-1 text-sm text-ink-600">Geist Mono</div>
                <div className="mt-3 font-mono text-sm text-ink-900">
                  47.2% · 1,284 · 9.4 / 10
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500">
                  Eyebrows · data · badges
                </div>
              </div>
            </div>
          </Block>

          {/* BUTTONS */}
          <Block title="Buttons & chips">
            <div className="flex flex-wrap items-center gap-3">
              <span className="btn-ember inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]">
                Primary · btn-ember
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700">
                Secondary outline
              </span>
              <span className="inline-flex rounded-full border hairline bg-canvas p-1">
                <span className="rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-canvas">
                  On
                </span>
                <span className="rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-600">
                  Off
                </span>
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-ink-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-600">
                neutral tag
              </span>
              <span className="rounded-full bg-ember/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ember-deep">
                accent tag
              </span>
            </div>
            {/* secondary on dark */}
            <div className="mt-4 grain relative overflow-hidden rounded-3xl bg-ink-950 p-5">
              <div className="pointer-events-none absolute inset-0 speed-stripes" />
              <span className="relative inline-flex items-center gap-2 rounded-full border border-canvas/15 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-canvas">
                Secondary on dark
              </span>
            </div>
          </Block>

          {/* RADIUS */}
          <Block title="Border radius">
            <div className="flex flex-wrap items-end gap-4">
              {[
                ["rounded-2xl", "rounded-2xl"],
                ["rounded-4xl (2rem)", "rounded-4xl"],
                ["rounded-5xl (2.5rem)", "rounded-5xl"],
                ["rounded-full", "rounded-full"],
              ].map(([label, cls]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className={`h-20 w-20 border hairline bg-white ${cls}`} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Block>

          {/* SHADOWS */}
          <Block title="Shadows">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["shadow-diffusion", "shadow-diffusion"],
                ["shadow-diffusion-sm", "shadow-diffusion-sm"],
                ["shadow-ember-glow", "shadow-ember-glow"],
              ].map(([label, cls]) => (
                <div
                  key={label}
                  className={`rounded-4xl border hairline bg-white p-6 ${cls}`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                    {label}
                  </span>
                </div>
              ))}
              <div className="relative overflow-hidden rounded-4xl bg-ink-950 p-6 shadow-inner-glass">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-canvas/60">
                  shadow-inner-glass
                </span>
              </div>
            </div>
          </Block>

          {/* GRADIENTS */}
          <Block title="Gradients">
            <div className="flex flex-col gap-4">
              <div className="h-12 rounded-full bg-ember-grad" />
              <div className="font-display text-4xl font-bold uppercase tracking-[-0.01em] text-ink-900">
                Transform with <span className="text-ember-grad">proof.</span>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                <span>bg-ember-grad</span>
                <span>·</span>
                <span>.text-ember-grad</span>
                <span>·</span>
                <span>.btn-ember gradient</span>
              </div>
            </div>
          </Block>

          {/* TEXTURE & EFFECTS */}
          <Block
            title="Texture & effects"
            sub="grain is applied globally to the page; shown in context on dark panels."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grain relative h-28 overflow-hidden rounded-3xl bg-ink-950">
                <div className="pointer-events-none absolute inset-0 speed-stripes" />
                <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.14em] text-canvas/60">
                  speed-stripes + grain
                </span>
              </div>
              <div className="flex items-center justify-center rounded-3xl border hairline bg-white">
                <span className="ember-mark font-display text-3xl font-bold uppercase tracking-[-0.01em] text-ink-900">
                  ember-mark
                </span>
              </div>
              <div className="flex items-center justify-center rounded-3xl border hairline bg-white py-8">
                <span className="shimmer-text font-display text-3xl font-bold uppercase tracking-[-0.01em]">
                  shimmer-text
                </span>
              </div>
              <div className="flex items-center justify-around rounded-3xl border hairline bg-white py-4">
                <span className="text-stroke font-display text-6xl font-bold">
                  47
                </span>
                <div className="rounded-2xl bg-ink-950 px-5 py-3">
                  <span className="text-stroke-canvas font-display text-6xl font-bold">
                    12
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="rounded-2xl border hairline px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">
                .hairline (on light)
              </div>
              <div className="rounded-2xl border hairline-dark bg-ink-950 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-canvas/60">
                .hairline-dark (on dark)
              </div>
            </div>
          </Block>

          {/* ANIMATIONS */}
          <Block title="Animations" sub="Live (respect prefers-reduced-motion).">
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-950 py-4">
                <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-xl font-bold uppercase tracking-[0.02em] text-canvas/70">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i}>Coached by Matt J · animate-marquee ·</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-ember animate-breathe" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">
                    animate-breathe
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-ember-bright animate-ember-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">
                    animate-ember-pulse
                  </span>
                </div>
              </div>
            </div>
          </Block>
        </div>
      </div>
    </section>
  );
}
