"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowCounterClockwise,
  Check,
  Copy,
  Lightbulb,
  MagnifyingGlass,
  PaperPlaneTilt,
  PencilSimple,
  Prohibit,
  X,
} from "@phosphor-icons/react";
import {
  CATEGORIES,
  CONFIDENT,
  EXPERIENCE_LABEL,
  GENDER_LABEL,
  GOAL_LABEL,
  MATT_EMAIL,
  TIPS,
  blocksFor,
  buildEmail,
  byId,
  hasGoalBranch,
  scenarioVisible,
  search,
  triageFor,
  type Block,
  type Experience,
  type Gender,
  type Goal,
  type Profile,
  type Scenario,
} from "../lib/panicButton";

type Step = "profile" | "home" | "search" | "triage" | "response" | "tips";

const STORAGE_KEY = "cbmj-panic-profile";

function loadProfile(): Profile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Profile;
    if (p && GOAL_LABEL[p.goal] && GENDER_LABEL[p.gender] && EXPERIENCE_LABEL[p.experience])
      return p;
  } catch {
    /* storage blocked or corrupt: ask again */
  }
  return null;
}

function saveProfile(p: Profile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* private mode: profile just lasts for this visit */
  }
}

const labelClass = "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";
const cardClass = "rounded-5xl border hairline bg-white p-6 shadow-diffusion-sm md:p-8";
const primaryBtn =
  "btn-ember inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:filter-none";
const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border hairline px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100";

function BackButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500 transition hover:text-ink-900"
    >
      <ArrowLeft size={12} weight="bold" />
      {children}
    </button>
  );
}

/** Segmented single-choice control (used for profile + Yes/No). */
function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  size = "md",
}: {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  size?: "md" | "sm";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full font-bold uppercase transition ${
              size === "sm"
                ? "min-w-[64px] px-4 py-2 text-[11px] tracking-[0.14em]"
                : "px-4 py-2.5 text-xs tracking-[0.1em]"
            } ${
              active
                ? "bg-ink-900 text-canvas"
                : "border hairline bg-white text-ink-600 hover:bg-ink-100"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-3.5 text-[15px] leading-relaxed text-ink-700 md:text-base">
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i}>{b.text}</p>;
        if (b.type === "label" || b.type === "goal")
          return (
            <div key={i} className="rounded-2xl bg-ink-50 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember-deep">
                {b.type === "goal" ? `Your goal · ${GOAL_LABEL[b.goal]}` : b.label}
              </div>
              <p className="mt-1.5">{b.text}</p>
            </div>
          );
        const List = b.ordered ? "ol" : "ul";
        return (
          <div key={i}>
            {b.label && (
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ember-deep">
                {b.label}
              </div>
            )}
            <List className="flex flex-col gap-2">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ember/10 font-mono text-[10px] text-ember-deep">
                    {b.ordered ? j + 1 : <Check size={10} weight="bold" />}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </List>
          </div>
        );
      })}
    </div>
  );
}

function TipsList() {
  return (
    <div className="flex flex-col gap-3">
      {TIPS.map((t, i) => (
        <div key={t.id} className="rounded-4xl border hairline bg-white p-5 md:p-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-ember-deep">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-[0.01em] text-ink-900">
              {t.title}
            </h3>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{t.text}</p>
        </div>
      ))}
    </div>
  );
}

/** "Message Matt" panel: pre-filled email + copy fallback for no mail app. */
function MessageMatt({
  query,
  scenario,
  answers,
  profile,
  intro,
}: {
  query: string;
  scenario: Scenario | null;
  answers: { q: string; a: boolean }[];
  profile: Profile | null;
  intro: string;
}) {
  const email = buildEmail({ query, scenario, answers, profile });
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked: the address is shown below anyway */
    }
  }

  return (
    <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-6 text-canvas shadow-diffusion md:p-8">
      <div className="pointer-events-none absolute inset-0 speed-stripes" />
      <div className="relative">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
          Send Matt a message directly
        </div>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-canvas/75">{intro}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={email.href} className={primaryBtn}>
            <PaperPlaneTilt size={16} weight="bold" />
            Email Matt
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-canvas/15 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-canvas transition hover:bg-canvas hover:text-ink-900"
          >
            {copied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
            {copied ? "Copied" : "Copy message"}
          </button>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-canvas/45">
          No mail app? Copy it and send to {MATT_EMAIL}
        </p>
      </div>
    </div>
  );
}

export function PanicButton() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Partial<Profile>>({});
  const [step, setStep] = useState<Step>("home");

  const [query, setQuery] = useState("");
  const [browseCat, setBrowseCat] = useState<string | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [followUp, setFollowUp] = useState<null | boolean>(null);
  const [helped, setHelped] = useState<null | boolean>(null);

  // Profile is remembered on this device only.
  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setStep(p ? "home" : "profile");
    setReady(true);
  }, []);

  // Keep the top of the tool in view on every step change.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = rootRef.current;
    if (el && el.getBoundingClientRect().top < 0)
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [step, scenario, reduce]);

  const matches = useMemo(() => search(query, profile), [query, profile]);
  const confident = matches.length > 0 && matches[0].score >= CONFIDENT;
  const questions = scenario ? triageFor(scenario, profile) : [];
  const answeredList = questions
    .map((t, i) => (i in answers ? { q: t.q, a: answers[i] } : null))
    .filter((x): x is { q: string; a: boolean } => x !== null);
  const allAnswered = answeredList.length === questions.length;

  function openScenario(s: Scenario) {
    setScenario(s);
    setAnswers({});
    setFollowUp(null);
    setHelped(null);
    setStep(triageFor(s, profile).length > 0 ? "triage" : "response");
  }

  function startOver() {
    setQuery("");
    setBrowseCat(null);
    setScenario(null);
    setAnswers({});
    setStep("search");
  }

  function editProfile() {
    setDraft(profile ?? {});
    setStep("profile");
  }

  function submitProfile() {
    if (!draft.goal || !draft.gender || !draft.experience) return;
    const p = draft as Profile;
    saveProfile(p);
    setProfile(p);
    setStep("home");
  }

  if (!ready) {
    return <div className={`${cardClass} h-80 animate-pulse`} aria-hidden="true" />;
  }

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -6 },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  };

  let body: ReactNode = null;

  // ---------- PROFILE ----------
  if (step === "profile") {
    const complete = !!(draft.goal && draft.gender && draft.experience);
    body = (
      <div className="flex flex-col gap-6">
        {profile && <BackButton onClick={() => setStep("home")}>Back</BackButton>}
        <div className={cardClass}>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
            {profile ? "Edit your details" : "Before you start · 10 seconds"}
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-4xl">
            Tell me a bit about you
          </h2>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-600">
            So the answers fit your goal, not someone else&apos;s. Saved on this device only. No
            login, nothing sent anywhere.
          </p>

          <div className="mt-8 flex flex-col gap-7">
            <fieldset>
              <legend className={labelClass}>Your goal</legend>
              <div className="mt-3">
                <Segmented<Goal>
                  label="Your goal"
                  value={draft.goal ?? null}
                  onChange={(goal) => setDraft((d) => ({ ...d, goal }))}
                  options={(Object.keys(GOAL_LABEL) as Goal[]).map((v) => ({
                    value: v,
                    label: GOAL_LABEL[v],
                  }))}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend className={labelClass}>Gender</legend>
              <div className="mt-3">
                <Segmented<Gender>
                  label="Gender"
                  value={draft.gender ?? null}
                  onChange={(gender) => setDraft((d) => ({ ...d, gender }))}
                  options={(Object.keys(GENDER_LABEL) as Gender[]).map((v) => ({
                    value: v,
                    label: GENDER_LABEL[v],
                  }))}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend className={labelClass}>Training experience</legend>
              <div className="mt-3">
                <Segmented<Experience>
                  label="Training experience"
                  value={draft.experience ?? null}
                  onChange={(experience) => setDraft((d) => ({ ...d, experience }))}
                  options={(Object.keys(EXPERIENCE_LABEL) as Experience[]).map((v) => ({
                    value: v,
                    label: EXPERIENCE_LABEL[v],
                  }))}
                />
              </div>
            </fieldset>
          </div>

          <div className="mt-8 border-t hairline pt-6">
            <button type="button" disabled={!complete} onClick={submitProfile} className={primaryBtn}>
              {profile ? "Save" : "Continue"}
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- HOME ----------
  else if (step === "home") {
    body = (
      <div className="flex flex-col gap-5">
        <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 px-6 py-12 text-center text-canvas shadow-diffusion md:py-16">
          <div className="pointer-events-none absolute inset-0 speed-stripes" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/25 blur-3xl animate-glow-pulse" />
          <div className="relative flex flex-col items-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
              Struggling right now?
            </div>
            <div className="relative mt-8 grid place-items-center">
              {!reduce && (
                <>
                  <motion.span
                    aria-hidden="true"
                    className="absolute h-52 w-52 rounded-full border border-ember/50 md:h-60 md:w-60"
                    animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute h-52 w-52 rounded-full border border-ember/40 md:h-60 md:w-60"
                    animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
                  />
                </>
              )}
              <button
                type="button"
                onClick={() => setStep("search")}
                className="btn-ember relative grid h-52 w-52 place-items-center rounded-full ring-8 ring-ember/15 md:h-60 md:w-60"
                style={{ outlineOffset: 6 }}
              >
                <span className="flex flex-col items-center">
                  <span className="font-display text-5xl font-bold uppercase leading-none tracking-[0.02em] md:text-6xl">
                    Panic
                  </span>
                  <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/80">
                    Tap for help
                  </span>
                </span>
              </button>
            </div>
            <p className="mt-10 max-w-[38ch] text-[15px] leading-relaxed text-canvas/70">
              Tell me what&apos;s going on in your own words. Answer a couple of quick questions.
              Get a straight answer on what to do next.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => setStep("tips")} className={secondaryBtn}>
            <Lightbulb size={16} weight="bold" />
            Quick tips
          </button>
          {profile && (
            <button
              type="button"
              onClick={editProfile}
              className="inline-flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 transition hover:text-ink-900"
            >
              {GOAL_LABEL[profile.goal]} · {GENDER_LABEL[profile.gender]}
              <PencilSimple size={12} weight="bold" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- SEARCH ----------
  else if (step === "search") {
    const q = query.trim();
    const cat = CATEGORIES.find((c) => c.id === browseCat);
    body = (
      <div className="flex flex-col gap-5">
        <BackButton onClick={() => setStep("home")}>Back</BackButton>
        <div className={cardClass}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (confident) openScenario(matches[0].scenario);
            }}
          >
            <label
              htmlFor="pb-query"
              className="font-display text-3xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-4xl"
            >
              What&apos;s going on?
            </label>
            <div className="relative mt-5">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                ref={inputRef}
                autoFocus
                id="pb-query"
                type="text"
                autoComplete="off"
                enterKeyHint="search"
                placeholder="e.g. I ate way too much last night"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl border hairline bg-canvas py-3.5 pl-11 pr-11 text-base text-ink-900 outline-none transition focus:border-ember/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear"
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>
          </form>

          {/* live matches */}
          {q.length >= 2 && (
            <div className="mt-6" aria-live="polite">
              {matches.length > 0 && (
                <>
                  <div className={labelClass}>
                    {confident ? "Closest match" : "Not sure I've got that one. Closest I have:"}
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {matches.map((m, i) => {
                      const best = confident && i === 0;
                      return (
                        <button
                          key={m.scenario.id}
                          type="button"
                          onClick={() => openScenario(m.scenario)}
                          className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-diffusion-sm ${
                            best ? "border-ember/40 bg-ember/[0.04]" : "hairline bg-white"
                          }`}
                        >
                          <span>
                            <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                              {m.scenario.category}
                            </span>
                            <span className="mt-1 block font-display text-lg font-semibold uppercase leading-tight tracking-[0.01em] text-ink-900">
                              {m.scenario.title}
                            </span>
                          </span>
                          <ArrowRight
                            size={18}
                            weight="bold"
                            className="shrink-0 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-ember-deep"
                          />
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {!confident && (
                <p className="mt-5 text-sm leading-relaxed text-ink-600">
                  {matches.length === 0
                    ? "I haven't got a ready answer for that one. Try different words, browse below, or send it straight to me."
                    : "None of these right? Send it straight to me."}
                </p>
              )}
            </div>
          )}

          {/* browse */}
          <div className="mt-8 border-t hairline pt-6">
            <div className={labelClass}>Or browse by topic</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = browseCat === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setBrowseCat(active ? null : c.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                      active ? "bg-ink-900 text-canvas" : "border hairline text-ink-600 hover:bg-ink-100"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            {cat && (
              <div className="mt-4 flex flex-col divide-y divide-ink-100 rounded-2xl border hairline">
                {cat.scenarios
                  .filter((s) => scenarioVisible(s, profile))
                  .map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => openScenario(s)}
                      className="group flex items-center justify-between gap-4 px-4 py-3 text-left text-[15px] text-ink-800 transition first:rounded-t-2xl last:rounded-b-2xl hover:bg-ink-50"
                    >
                      {s.title}
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="shrink-0 text-ink-300 transition group-hover:text-ember-deep"
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {q.length >= 2 && !confident && (
          <MessageMatt
            query={query}
            scenario={null}
            answers={[]}
            profile={profile}
            intro="Your message comes pre-filled with what you typed, so I've got the full picture when it lands. Add anything else and I'll get back to you personally."
          />
        )}
      </div>
    );
  }

  // ---------- TRIAGE ----------
  else if (step === "triage" && scenario) {
    body = (
      <div className="flex flex-col gap-5">
        <BackButton onClick={() => setStep("search")}>Back</BackButton>
        <div className={cardClass}>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
            Quick check · {answeredList.length} / {questions.length} answered
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-4xl">
            {scenario.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
            Answer these honestly. Yes or no, no overthinking.
          </p>

          <ol className="mt-7 flex flex-col divide-y divide-ink-100 border-y border-ink-100">
            {questions.map((t, i) => (
              <li
                key={t.q}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span className="flex gap-3 text-[15px] leading-snug text-ink-800">
                  <span className="mt-0.5 font-mono text-[11px] text-ink-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{t.q}</span>
                </span>
                <div className="shrink-0 pl-7 sm:pl-0">
                  <Segmented<"yes" | "no">
                    size="sm"
                    label={t.q}
                    value={i in answers ? (answers[i] ? "yes" : "no") : null}
                    onChange={(v) => setAnswers((a) => ({ ...a, [i]: v === "yes" }))}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                  />
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-7">
            <button
              type="button"
              disabled={!allAnswered}
              onClick={() => setStep("response")}
              className={primaryBtn}
            >
              Show me what to do
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RESPONSE ----------
  else if (step === "response" && scenario) {
    const sections = [
      { n: "01", title: "What's probably happening", blocks: scenario.happening },
      { n: "02", title: "What to do next", blocks: scenario.next },
      { n: "03", title: "What not to do", blocks: scenario.avoid },
    ];
    const fu = scenario.followUp;
    const fuScenario = fu?.scenario ? byId(fu.scenario) : null;

    body = (
      <div className="flex flex-col gap-5">
        <BackButton
          onClick={() => setStep(triageFor(scenario, profile).length > 0 ? "triage" : "search")}
        >
          Back
        </BackButton>

        <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-6 text-canvas shadow-diffusion md:p-8">
          <div className="pointer-events-none absolute inset-0 speed-stripes" />
          <div className="relative">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-soft">
              Coach&apos;s answer
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.92] tracking-[-0.01em] md:text-4xl">
              {scenario.title}
            </h2>
            {profile && hasGoalBranch(scenario) && (
              <div className="mt-4 inline-flex rounded-full bg-ember/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ember-soft">
                Tailored to your goal · {GOAL_LABEL[profile.goal]}
              </div>
            )}
          </div>
        </div>

        {sections.map((s) => (
          <section key={s.n} className={cardClass}>
            <div className="flex items-center gap-3">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full font-mono text-[11px] ${
                  s.n === "03" ? "bg-ink-900 text-canvas" : "bg-ember/10 text-ember-deep"
                }`}
              >
                {s.n === "03" ? <Prohibit size={14} weight="bold" /> : s.n}
              </span>
              <h3 className="font-display text-2xl font-bold uppercase leading-none tracking-[0.01em] text-ink-900">
                {s.title}
              </h3>
            </div>
            <div className="mt-5">
              <Blocks blocks={blocksFor(s.blocks, profile)} />
            </div>
          </section>
        ))}

        {fu && (
          <div className="rounded-4xl border hairline bg-ink-50/60 p-5 md:p-6">
            <p className="text-[15px] font-semibold leading-snug text-ink-900">{fu.question}</p>
            <div className="mt-3">
              <Segmented<"yes" | "no">
                size="sm"
                label={fu.question}
                value={followUp === null ? null : followUp ? "yes" : "no"}
                onChange={(v) => setFollowUp(v === "yes")}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
            {followUp && fu.tips && (
              <div className="mt-5">
                <TipsList />
              </div>
            )}
            {followUp && fuScenario && (
              <button
                type="button"
                onClick={() => openScenario(fuScenario)}
                className={`${primaryBtn} mt-5`}
              >
                {fuScenario.title}
                <ArrowRight size={16} weight="bold" />
              </button>
            )}
          </div>
        )}

        {/* Did this answer your question? */}
        <div className={cardClass}>
          <div className="font-display text-2xl font-bold uppercase leading-none tracking-[0.01em] text-ink-900">
            Did this answer your question?
          </div>
          <div className="mt-4">
            <Segmented<"yes" | "no">
              size="sm"
              label="Did this answer your question?"
              value={helped === null ? null : helped ? "yes" : "no"}
              onChange={(v) => setHelped(v === "yes")}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>
          {helped === true && (
            <div className="mt-6 border-t hairline pt-6">
              <p className="text-[15px] leading-relaxed text-ink-700">
                Good. Now go and do it. Come back any time something knocks you off.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={startOver} className={secondaryBtn}>
                  <ArrowCounterClockwise size={16} weight="bold" />
                  Something else
                </button>
                <button type="button" onClick={() => setStep("home")} className={secondaryBtn}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {helped === false && (
          <MessageMatt
            query={query}
            scenario={scenario}
            answers={answeredList}
            profile={profile}
            intro="Your message comes pre-filled with what you searched and how you answered, so I've got the full context. Add anything else and I'll get back to you personally."
          />
        )}
      </div>
    );
  }

  // ---------- QUICK TIPS ----------
  else if (step === "tips") {
    body = (
      <div className="flex flex-col gap-5">
        <BackButton onClick={() => setStep("home")}>Back</BackButton>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
            Quick tips
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-4xl">
            Helpful dieting tools
          </h2>
        </div>
        <TipsList />
        <button type="button" onClick={() => setStep("search")} className={`${primaryBtn} self-start`}>
          I need the panic button
          <ArrowRight size={16} weight="bold" />
        </button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={`${step}-${scenario?.id ?? ""}`} {...fade}>
          {body}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
