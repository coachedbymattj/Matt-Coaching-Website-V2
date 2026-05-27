import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const directions = [
  {
    slug: "v3a/performance-annual",
    code: "V3A",
    name: "Performance Annual",
    tag: "Athletic editorial",
    line: "A tighter, type-led performance magazine.",
  },
  {
    slug: "v3b/lab-field-manual",
    code: "V3B",
    name: "Lab / Field Manual",
    tag: "Coaching as engineering",
    line: "Instruments, data, and clear procedure.",
  },
  {
    slug: "v3c/heat-and-ash",
    code: "V3C",
    name: "Heat & Ash",
    tag: "Cinematic athletic",
    line: "Portrait-led, warm, ember as firelight.",
  },
];

export const metadata = { title: "Preview · v3 directions · Coached by Matt J" };

export default function PreviewIndex() {
  return (
    <section className="bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
          Preview · v3 directions
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-7xl">
          Three small homepage prototypes. Pick one.
        </h1>
        <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-ink-600 md:text-lg">
          Each route stages the same real content (Everest hook, one or two
          beliefs, a results strip) in a distinct visual direction. The live
          site is untouched.
        </p>

        <ol className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {directions.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/preview/${d.slug}`}
                className="group block h-full rounded-4xl border hairline bg-white p-7 shadow-diffusion-sm transition hover:-translate-y-0.5 hover:shadow-diffusion md:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                    {d.code}
                  </span>
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    className="text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-900"
                  />
                </div>
                <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                  {d.tag}
                </div>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-ink-900">
                  {d.name}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-600">
                  {d.line}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
