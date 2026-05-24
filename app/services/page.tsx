import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  MapPin,
  Globe,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

const oneToOne = [
  {
    slug: "in-person",
    icon: <MapPin size={16} weight="regular" />,
    eyebrow: "In-Person · 1:1 · Amsterdam",
    name: "Face-to-face coaching",
    price: "€100",
    cadence: "per 1-hour session · billed how it suits you",
    availability: "Always open · Amsterdam studio",
    pitch:
      "Sessions delivered under my eye, in the studio. The full diagnostic, every set coached, every cue corrected on the floor. Best fit for clients who want hands-on technique work or who train better with someone in the room.",
    includes: [
      "60-minute coached session, programmed in advance",
      "Real-time technique coaching and load adjustment",
      "Flexible ways to pay",
      "Pay-per-session, billed at month-end for what you actually did",
      "Monthly subscription for the regulars who train consistently",
    ],
    accent: false,
    applyHref: "/apply/in-person",
    span: "md:col-span-5",
  },
  {
    slug: "online",
    icon: <Globe size={16} weight="regular" />,
    eyebrow: "Online · 1:1",
    name: "Bespoke remote coaching",
    price: "€150",
    cadence: "every 4 weeks · cancel any month",
    availability: "Always open",
    pitch:
      "Weekly Loom-based coaching, bespoke programming in the app, and a coach you can message between sessions. Engineered around your gym, your schedule, and your life, the 1:1 standard, from anywhere in the world.",
    includes: [
      "Weekly check-ins. You send me a check-in video walking through your week, the highs and lows. I reply with a Loom video looking at your app data, feedback, programming tweaks, form analysis on any clips you've sent into the Google Drive.",
      "Bespoke training programmed in the app with my coaching cues on every exercise, plus a space for you to log pain, energy and flare-ups as you train.",
      "Nutrition framework with cut, maintain and bulk phases paced from your check-in photos.",
      "Catch-up calls when you want one, not always needed, always available.",
      "Open chat between check-ins, ask me anything, anytime, like we're talking now.",
    ],
    accent: true,
    applyHref: "/apply/online",
    span: "md:col-span-7",
  },
];

const melt = {
  icon: <UsersThree size={18} weight="regular" />,
  eyebrow: "MELT · Group programme",
  name: "MELT",
  price: "€89",
  cadence: "for 8 weeks fat loss + 2 weeks maintenance",
  availability: "Runs three times a year · January, March, September",
  pitch:
    "A 10-week structured fat-loss programme delivered to a small online group. Eight weeks of focused fat loss followed by two weeks teaching you how to keep it, the part nine in ten programmes skip. Lower investment, same coaching standards.",
  includes: [
    "8-week structured fat-loss training & nutrition protocol",
    "2 bonus weeks coaching how to maintain the result",
    "Weekly group check-in + community accountability",
    "Direct access to me through the group feed",
    "Single-payment, fixed-length, no rolling fees",
  ],
  applyHref: "/apply/melt",
};

const faqs = [
  {
    q: "Do I need a gym?",
    a: "Ideally yes, but I've programmed full transformations out of a hotel chain, a garage with one barbell, and a 3-piece kettlebell setup. Tell me what you have, I'll design around it.",
  },
  {
    q: "What if I'm a complete beginner?",
    a: "Welcome. Beginners adapt faster than anyone, your first 12 weeks will likely produce results others spend years chasing. In-person 1:1 is the strongest fit; we can move to online once your technique is locked in.",
  },
  {
    q: "Can I pause online coaching if life implodes?",
    a: "Yes. The 4-week billing means you can pause at the end of any block, no questions asked. The protocol is built around real life, not in defiance of it.",
  },
  {
    q: "Why is there an application form?",
    a: "Because not every body is a fit for this practice, and not every coach is a fit for every body. The form tells me if I'm the right person to write for you.",
  },
  {
    q: "When does the next MELT group open?",
    a: "MELT runs three times a year, January, March and September. If you apply between rounds, I'll add you to the waitlist and email you the moment doors open.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b hairline">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 pb-20 pt-24 md:grid-cols-12 md:pt-32">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              Coaching
            </div>
            <h1 className="mt-6 font-display text-[clamp(3rem,7.4vw,5.8rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
              One coach.<br />
              <span className="text-ember-grad">Three ways to work with me.</span>
            </h1>
            <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink-600">
              All three are written and run by me personally, the difference is
              where you train, how often you check in, and how much structure
              suits the life you actually live.
            </p>
          </div>
          <aside className="md:col-span-3 md:col-start-10 self-end">
            <div className="rounded-4xl border hairline bg-canvas p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                What's open now
              </div>
              <ul className="mt-4 space-y-3 text-sm text-ink-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-ember animate-breathe" />
                  In-Person 1:1 · always open
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-ember animate-breathe" />
                  Online 1:1 · always open
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-ink-300" />
                  MELT · runs in Jan, Mar, Sep
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* 1:1 Tiers, asymmetric 5 / 7 split */}
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {oneToOne.map((tier) => (
              <div key={tier.slug} className={tier.span}>
                <div
                  className={
                    tier.accent
                      ? "relative flex h-full flex-col rounded-5xl bg-ink-950 p-8 text-canvas shadow-diffusion md:p-10"
                      : "relative flex h-full flex-col rounded-5xl border hairline bg-white p-8 shadow-diffusion-sm md:p-10"
                  }
                >
                  <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/5" />

                  <div
                    className={`flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] ${
                      tier.accent ? "text-canvas/60" : "text-ink-500"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={
                          tier.accent
                            ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-canvas/10 text-canvas"
                            : "inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-ink-700"
                        }
                      >
                        {tier.icon}
                      </span>
                      {tier.eyebrow}
                    </span>
                    {tier.accent && (
                      <span className="rounded-full bg-ember/20 px-2 py-0.5 text-ember-soft">
                        Most chosen
                      </span>
                    )}
                  </div>

                  <h2
                    className={`mt-6 font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] md:text-5xl ${
                      tier.accent ? "text-canvas" : "text-ink-900"
                    }`}
                  >
                    {tier.name}
                  </h2>

                  <p
                    className={`mt-4 max-w-[44ch] text-base leading-relaxed ${
                      tier.accent ? "text-canvas/75" : "text-ink-600"
                    }`}
                  >
                    {tier.pitch}
                  </p>

                  <div
                    className={`mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-6 ${
                      tier.accent ? "border-ink-800" : "hairline"
                    }`}
                  >
                    <span
                      className={`font-mono text-4xl tracking-tight md:text-5xl ${
                        tier.accent ? "text-canvas" : "text-ink-900"
                      }`}
                    >
                      {tier.price}
                    </span>
                    <span
                      className={`text-sm ${
                        tier.accent ? "text-canvas/60" : "text-ink-500"
                      }`}
                    >
                      {tier.cadence}
                    </span>
                  </div>

                  <div
                    className={`mt-3 font-mono text-[11px] uppercase tracking-[0.18em] ${
                      tier.accent ? "text-canvas/60" : "text-ink-500"
                    }`}
                  >
                    {tier.availability}
                  </div>

                  <ul className="mt-7 space-y-3">
                    {tier.includes.map((inc) => (
                      <li
                        key={inc}
                        className={`flex items-start gap-3 text-sm leading-relaxed ${
                          tier.accent ? "text-canvas/85" : "text-ink-700"
                        }`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                            tier.accent
                              ? "bg-canvas text-ink-900"
                              : "bg-ink-900 text-canvas"
                          }`}
                        >
                          <Check size={11} weight="bold" />
                        </span>
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-12">
                    <Link
                      href={tier.applyHref}
                      className="btn-ember inline-flex items-center justify-center gap-2 self-start rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      Apply for {tier.eyebrow.split(" · ")[0]} 1:1
                      <ArrowUpRight size={16} weight="bold" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MELT, full-width feature card */}
          <div className="mt-6">
            <div className="relative overflow-hidden rounded-5xl border hairline bg-white p-8 shadow-diffusion-sm md:p-12">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
                <div className="md:col-span-7">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ember/10 text-ember-deep">
                      {melt.icon}
                    </span>
                    {melt.eyebrow}
                  </div>
                  <h2 className="mt-5 max-w-[14ch] font-display text-6xl font-bold uppercase leading-[0.82] tracking-[-0.02em] text-ink-900 md:text-8xl">
                    {melt.name}
                  </h2>
                  <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-ink-600 md:text-lg">
                    {melt.pitch}
                  </p>
                </div>

                <div className="md:col-span-5">
                  <div className="rounded-4xl bg-ink-50 p-6 md:p-8">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-5xl tracking-tight text-ink-900">
                        {melt.price}
                      </span>
                      <span className="text-sm text-ink-500">
                        one-time payment
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-ink-600">
                      {melt.cadence}
                    </div>
                    <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                      {melt.availability}
                    </div>

                    <ul className="mt-7 space-y-3">
                      {melt.includes.map((inc) => (
                        <li
                          key={inc}
                          className="flex items-start gap-3 text-sm leading-relaxed text-ink-700"
                        >
                          <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-ink-900 text-canvas">
                            <Check size={11} weight="bold" />
                          </span>
                          {inc}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={melt.applyHref}
                      className="btn-ember mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      Join the MELT waitlist
                      <ArrowUpRight size={16} weight="bold" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ inline */}
          <div className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                FAQ · the honest version
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-5xl">
                Questions you'd<br />ask a friend.
              </h2>
            </div>
            <dl className="md:col-span-7 md:col-start-6">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="grid grid-cols-12 gap-6 border-t hairline py-8 first:border-t-0 first:pt-0"
                >
                  <dt className="col-span-12 font-display text-xl font-semibold uppercase leading-[1.05] tracking-[0.01em] text-ink-900 md:col-span-4">
                    {f.q}
                  </dt>
                  <dd className="col-span-12 max-w-[60ch] text-base leading-relaxed text-ink-600 md:col-span-8">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
