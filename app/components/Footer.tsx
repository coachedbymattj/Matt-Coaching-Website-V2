import Link from "next/link";
import { InstagramLogo, YoutubeLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { GoogleRatingBadge } from "./GoogleRatingBadge";

export function Footer() {
  return (
    <footer className="grain relative mt-32 overflow-hidden border-t hairline bg-ink-950 text-canvas">
      <div className="pointer-events-none absolute inset-0 speed-stripes" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-ink-300">
              Coached_by_Matt_J
            </div>
            <p className="mt-6 max-w-md font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-canvas md:text-5xl">
              Train with intention.<br />
              Transform with <span className="text-ember-grad">proof.</span>
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-300">
              Online body transformation coaching for working professionals.
              Twelve-week protocols engineered around your calendar, your kitchen, and your gym.
            </p>
            <div className="mt-8">
              <GoogleRatingBadge />
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Pages
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                { href: "/about", label: "About Matt" },
                { href: "/services", label: "Coaching tiers" },
                { href: "/results", label: "Client transformations" },
                { href: "/journal", label: "Journal" },
                { href: "/apply", label: "Apply for coaching" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ink-200 transition hover:text-canvas"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Channels
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a className="inline-flex items-center gap-2 text-ink-200 hover:text-canvas" href="mailto:coachedbymattj@gmail.com">
                  <EnvelopeSimple size={16} weight="regular" />
                  coachedbymattj@gmail.com
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 text-ink-200 hover:text-canvas" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <InstagramLogo size={16} weight="regular" />
                  @coachedbymattj
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 text-ink-200 hover:text-canvas" href="https://www.youtube.com/@CoachedByMattJ" target="_blank" rel="noopener noreferrer">
                  <YoutubeLogo size={16} weight="regular" />
                  @CoachedByMattJ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-800 pt-8 text-xs text-ink-400 md:flex-row md:items-center md:justify-between">
          <span className="font-mono">
            © {new Date().getFullYear()} Coached by Matt J. All protocols proprietary.
          </span>
          <span className="font-mono uppercase tracking-[0.18em]">
            Built in Amsterdam · Coaching globally
          </span>
        </div>
      </div>
    </footer>
  );
}
