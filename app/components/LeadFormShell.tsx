import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Lock,
} from "@phosphor-icons/react/dist/ssr";

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  whatHappensNext: string[];
  formUrl: string;
};

export function LeadFormShell({
  eyebrow,
  title,
  intro,
  whatHappensNext,
  formUrl,
}: Props) {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-24 md:pt-32">
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft size={12} weight="bold" />
          All coaching paths
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
          <header className="md:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              {eyebrow}
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,5.6vw,4.6rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-ink-900">
              {title}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-600">
              {intro}
            </p>

            <div className="mt-10 rounded-4xl border hairline bg-white p-6 shadow-diffusion-sm">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
                What happens next
              </div>
              <ol className="mt-4 space-y-3">
                {whatHappensNext.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-700"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-ink-900 font-mono text-[10px] text-canvas">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3 text-sm text-ink-600">
                <Clock size={16} weight="regular" className="mt-0.5 text-ink-500" />
                <span>
                  <span className="font-medium text-ink-900">48 hours</span> · I
                  read every application personally
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-ink-600">
                <Lock size={16} weight="regular" className="mt-0.5 text-ink-500" />
                <span>
                  <span className="font-medium text-ink-900">Stays private</span>
                  {" "}· nothing is shared without your written consent
                </span>
              </li>
            </ul>

            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500 transition hover:text-ink-900"
            >
              Form not loading? Open in new tab
              <ArrowUpRight size={12} weight="bold" />
            </a>
          </header>

          <div className="md:col-span-7">
            <div className="overflow-hidden rounded-5xl border hairline bg-white shadow-diffusion">
              <iframe
                src={formUrl}
                title={`${title} application form`}
                className="h-[1080px] w-full md:h-[1180px]"
                loading="lazy"
                allow="clipboard-write; camera; microphone; autoplay"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
