"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LockSimple, ArrowRight } from "@phosphor-icons/react";

// Set once, in any browser, after a valid email submit on any Level Zero tool.
// While present, every tool reveals its result without re-gating.
const STORAGE_KEY = "lz_unlocked";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberUnlocked() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode / storage disabled — fine, just won't persist */
  }
}

type Props = {
  /** Display name of the tool, used as the Mailchimp tag (e.g. "Macro Calculator"). */
  tool: string;
  /** The result to reveal once the gate is cleared. */
  children: ReactNode;
  /** Optional heading shown on the gate card. */
  title?: string;
  /** Optional label for the submit button. */
  submitLabel?: string;
  /** Fires once when the result becomes visible (via submit OR a remembered unlock). */
  onUnlock?: () => void;
};

export function ResultGate({
  tool,
  children,
  title = "Unlock your result",
  submitLabel = "Unlock my result",
  onUnlock,
}: Props) {
  const reduce = useReducedMotion();

  // Start locked on the server and first client paint to avoid hydration
  // mismatch; the effect below reveals immediately if already unlocked.
  const [revealed, setRevealed] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const firedUnlock = useRef(false);

  // Reveal once and notify the parent at most once.
  function reveal() {
    setRevealed(true);
    if (!firedUnlock.current) {
      firedUnlock.current = true;
      onUnlock?.();
    }
  }

  // Skip the gate entirely if this browser already unlocked elsewhere.
  useEffect(() => {
    if (hasUnlocked()) reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    if (submitting) return;
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), tool, website }),
      });
      if (res.ok) {
        rememberUnlocked();
        reveal();
        return;
      }
      // Malformed-email rejection is the one case worth surfacing inline.
      if (res.status === 400) {
        setError("Please enter a valid email address.");
        return;
      }
      // Any other backend issue: remember + reveal anyway, never trap the user.
      rememberUnlocked();
      reveal();
    } catch {
      // API unreachable — reveal the result rather than blocking on a hiccup.
      rememberUnlocked();
      reveal();
    } finally {
      setSubmitting(false);
    }
  }

  if (revealed) return <>{children}</>;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
      className="rounded-5xl border border-ember/30 bg-white p-6 shadow-ember-glow md:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ember/10 text-ember-deep">
          <LockSimple size={18} weight="bold" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-2xl font-semibold uppercase leading-none tracking-[0.01em] text-ink-900">
            {title}
          </h3>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-600">
            Enter your email to unlock your result. You&apos;ll also get
            coaching emails from Coached by Matt J — unsubscribe anytime.
          </p>

          {/* Honeypot: visually hidden, off the tab order, ignored by humans. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`lz-website-${tool}`}>Leave this field empty</label>
            <input
              id={`lz-website-${tool}`}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              disabled={submitting}
              aria-label="Email address"
              aria-invalid={!!error}
              className="w-full flex-1 rounded-full border hairline bg-canvas px-5 py-3 text-base text-ink-900 outline-none transition focus:border-ember/50 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-ember inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-60"
            >
              {submitting ? "Sending…" : submitLabel}
              {!submitting && <ArrowRight size={16} weight="bold" />}
            </button>
          </div>

          <p className="mt-3 min-h-[1rem] text-xs leading-snug text-ember-deep" aria-live="polite">
            {error}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
