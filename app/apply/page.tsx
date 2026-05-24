import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Globe,
  UsersThree,
  Clock,
  Lock,
} from "@phosphor-icons/react/dist/ssr";

const paths = [
  {
    slug: "in-person",
    eyebrow: "01 · Amsterdam studio · €100 / session",
    name: "In-Person 1:1 Coaching",
    pitch:
      "Face-to-face coaching in the studio. Every set coached, every cue corrected on the floor, best fit if you want hands-on technique work or if you train better with someone in the room.",
    fit: [
      "You can train in person in Amsterdam",
      "You want hands-on coaching, not just programming",
      "You want flexible billing, per session, block, or subscription",
    ],
    icon: <MapPin size={18} weight="regular" />,
    badge: "Always open",
  },
  {
    slug: "online",
    eyebrow: "02 · Anywhere in the world · €150 / 4 weeks",
    name: "Online 1:1 Coaching",
    pitch:
      "Bespoke programming, weekly check-ins, voice-note form reviews and a coach in your pocket. Built for working professionals who already know their way around a gym.",
    fit: [
      "You can train consistently 3–6 hours per week",
      "You have at least 12 months of training experience",
      "You want a coach who knows your week before you do",
    ],
    icon: <Globe size={18} weight="regular" />,
    badge: "Most popular",
    accent: true,
  },
  {
    slug: "melt",
    eyebrow: "03 · Group programme · €89 / 10 weeks",
    name: "MELT · Online Group Coaching",
    pitch:
      "A 10-week structured fat-loss programme delivered to a small online group. Eight weeks of focused fat loss, then two weeks teaching you how to keep it, the part most programmes skip.",
    fit: [
      "You prefer training alongside a community",
      "You want structure without the bespoke price tag",
      "You can commit to a fixed 10-week block",
    ],
    icon: <UsersThree size={18} weight="regular" />,
    badge: "Runs three times a year",
  },
];

export default function ApplyPage() {
  return (
    <>
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 md:pt-32">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                Apply · Three coaching paths
              </div>
              <h1 className="mt-6 font-display text-[clamp(3rem,7.4vw,5.8rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
                One coach.<br />
                <span className="text-ember-grad">Three ways in.</span>
              </h1>
              <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-ink-600">
                Pick the path that fits how you actually live, not the one that
                sounds most impressive. Every form below goes straight to my inbox
               , I read each one and reply personally inside 48 working hours.
              </p>
            </div>
            <aside className="md:col-span-4 self-end">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border hairline bg-canvas text-ink-700">
                    <Clock size={16} weight="regular" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-ink-900">
                      48-hour reply
                    </div>
                    <div className="text-sm text-ink-500">
                      Working days. Usually faster.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border hairline bg-canvas text-ink-700">
                    <Lock size={16} weight="regular" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-ink-900">
                      Stays private
                    </div>
                    <div className="text-sm text-ink-500">
                      Your story is never anyone's marketing.
                    </div>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {paths.map((p, i) => {
              const span =
                i === 0
                  ? "md:col-span-5"
                  : i === 1
                  ? "md:col-span-7"
                  : "md:col-span-12";
              return (
                <li key={p.slug} className={span}>
                  <Link
                    href={`/apply/${p.slug}`}
                    className={
                      p.accent
                        ? "group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-5xl bg-ink-950 p-8 text-canvas shadow-diffusion transition active:translate-y-[1px] md:p-10"
                        : "group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-5xl border hairline bg-white p-8 shadow-diffusion-sm transition hover:-translate-y-0.5 active:translate-y-[1px] md:p-10"
                    }
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/5" />

                    <div className="flex flex-col gap-7">
                      <div
                        className={`flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] ${
                          p.accent ? "text-canvas/60" : "text-ink-500"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={
                              p.accent
                                ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-canvas/10 text-canvas"
                                : "inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-ink-700"
                            }
                          >
                            {p.icon}
                          </span>
                          {p.eyebrow}
                        </span>
                        <span
                          className={
                            p.accent
                              ? "rounded-full bg-ember/20 px-2 py-0.5 text-ember-soft"
                              : "rounded-full bg-ink-50 px-2 py-0.5 text-ink-600"
                          }
                        >
                          {p.badge}
                        </span>
                      </div>

                      <h2
                        className={`max-w-[20ch] font-display text-3xl font-bold uppercase leading-[0.92] tracking-[-0.01em] md:text-4xl ${
                          p.accent ? "text-canvas" : "text-ink-900"
                        }`}
                      >
                        {p.name}
                      </h2>

                      <p
                        className={`max-w-[52ch] text-base leading-relaxed ${
                          p.accent ? "text-canvas/75" : "text-ink-600"
                        }`}
                      >
                        {p.pitch}
                      </p>

                      <ul
                        className={`space-y-2 text-sm leading-relaxed ${
                          p.accent ? "text-canvas/80" : "text-ink-700"
                        }`}
                      >
                        {p.fit.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3">
                            <span
                              className={
                                p.accent
                                  ? "mt-2 h-1 w-3 flex-none rounded-full bg-canvas/40"
                                  : "mt-2 h-1 w-3 flex-none rounded-full bg-ink-300"
                              }
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className={`flex items-center justify-between border-t pt-5 ${
                        p.accent ? "border-ink-800" : "hairline"
                      }`}
                    >
                      <span
                        className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                          p.accent ? "text-canvas/55" : "text-ink-500"
                        }`}
                      >
                        Start application
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 text-sm font-medium transition group-hover:gap-3 ${
                          p.accent ? "text-canvas" : "text-ink-900"
                        }`}
                      >
                        Open form
                        <ArrowUpRight size={16} weight="bold" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mx-auto mt-16 max-w-[64ch] text-center text-sm leading-relaxed text-ink-500">
            Not sure which fits? Pick the one closest, fill it in, and tell me in
            the “anything else” box. I'd rather move you to the right path than
            sell you the wrong one.
          </p>
        </div>
      </section>
    </>
  );
}
