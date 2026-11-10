import Link from "next/link";
import { ArrowUpRight, Globe, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "../motion";

const paths = [
  {
    href: "/apply/in-person",
    icon: <MapPin size={16} weight="regular" />,
    eyebrow: "In-person · Amsterdam",
    name: "Face-to-face coaching",
    pitch:
      "Every set coached and every cue corrected on the gym floor, with online support between sessions.",
    price: "€100",
    priceNote: "per 60-minute session",
    cta: "Apply for in-person",
    dark: false,
    span: "md:col-span-5",
  },
  {
    href: "/apply/online",
    icon: <Globe size={16} weight="regular" />,
    eyebrow: "Online · Anywhere",
    name: "Online 1:1 coaching",
    pitch:
      "Your programme and nutrition in the app, a personal video review every week, and a direct line to me in between.",
    price: "By application",
    priceNote: "",
    cta: "Apply for online",
    dark: true,
    span: "md:col-span-7",
  },
];

/* Home page summary of the two ways to work with Matt, so a first-time
   visitor learns what is on offer without leaving the page. */
export function HomePaths() {
  return (
    <section className="border-b hairline bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              Coaching
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-6xl">
              Two ways to work with me.
            </h2>
          </Reveal>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-600 transition hover:text-ember-deep"
          >
            Compare both in detail
            <ArrowUpRight
              size={12}
              weight="bold"
              className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          {paths.map((p, i) => (
            <li key={p.href} className={p.span}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link
                  href={p.href}
                  className={`group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-5xl p-8 transition active:translate-y-[1px] md:p-10 ${
                    p.dark
                      ? "bg-ink-950 text-canvas shadow-diffusion"
                      : "border hairline bg-white shadow-diffusion-sm hover:-translate-y-0.5"
                  }`}
                >
                  {p.dark && (
                    <div className="pointer-events-none absolute inset-0 speed-stripes" />
                  )}
                  <div className="relative">
                    <div
                      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] ${
                        p.dark ? "text-canvas/65" : "text-ink-500"
                      }`}
                    >
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                          p.dark
                            ? "bg-canvas/10 text-canvas"
                            : "bg-ink-100 text-ink-700"
                        }`}
                      >
                        {p.icon}
                      </span>
                      {p.eyebrow}
                    </div>
                    <h3 className="mt-6 font-display text-3xl font-bold uppercase leading-[0.92] tracking-[-0.01em] md:text-4xl">
                      {p.name}
                    </h3>
                    <p
                      className={`mt-4 max-w-[48ch] text-base leading-relaxed ${
                        p.dark ? "text-canvas/75" : "text-ink-600"
                      }`}
                    >
                      {p.pitch}
                    </p>
                  </div>

                  <div
                    className={`relative flex flex-wrap items-end justify-between gap-4 border-t pt-6 ${
                      p.dark ? "border-canvas/10" : "hairline"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-mono text-3xl tracking-tight">
                        {p.price}
                      </span>
                      {p.priceNote && (
                        <span
                          className={`text-sm ${
                            p.dark ? "text-canvas/60" : "text-ink-500"
                          }`}
                        >
                          {p.priceNote}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] transition-[gap] group-hover:gap-3">
                      {p.cta}
                      <ArrowUpRight size={16} weight="bold" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
