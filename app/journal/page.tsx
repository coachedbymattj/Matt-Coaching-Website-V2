import Link from "next/link";
import {
  ArrowUpRight,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import {
  getCampaigns,
  formatPubDate,
  MAILCHIMP_SIGNUP_URL,
  MAILCHIMP_ARCHIVE_URL,
  type Campaign,
} from "../lib/mailchimp";

export const revalidate = 3600;

export default async function JournalPage() {
  const campaigns = await getCampaigns();
  const featured = campaigns[0];
  const rest = campaigns.slice(1);

  return (
    <>
      {/* Header */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 md:pt-32">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
                Journal · Field notes from the practice
              </div>
              <h1 className="mt-6 font-display text-[clamp(3rem,7.2vw,5.6rem)] font-bold uppercase leading-[0.86] tracking-[-0.02em] text-ink-900">
                What I'm thinking about,<br />
                <span className="text-ember-grad">when I'm not coaching.</span>
              </h1>
            </div>
            <p className="md:col-span-4 max-w-md text-base leading-relaxed text-ink-600">
              Long-ish form essays on programming, nutrition, behaviour, and the
              quiet psychology of getting in shape as an adult. Sent to my email
              community first, archived here.
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="bg-canvas pt-20 md:pt-28">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grain relative overflow-hidden rounded-5xl bg-ink-950 p-8 text-canvas shadow-diffusion md:p-12">
            <div className="pointer-events-none absolute inset-0 rounded-5xl border border-white/10 shadow-inner-glass" />
            <div className="pointer-events-none absolute inset-0 speed-stripes" />
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-canvas/15 bg-canvas/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-canvas/80">
                  <EnvelopeSimple size={14} weight="regular" />
                  Email community
                </div>
                <h2 className="mt-5 max-w-xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] md:text-5xl">
                  Get the next essay direct.
                </h2>
                <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-canvas/70">
                  One email when there's something worth saying, never on a
                  schedule. Subscribers get the essays before they land on the
                  Journal, plus the occasional working note that never gets
                  published.
                </p>
              </div>
              <div className="md:col-span-4 md:justify-self-end">
                <a
                  href={MAILCHIMP_SIGNUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ember group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.12em]"
                >
                  Join the community
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured email */}
      {featured ? (
        <section className="bg-canvas py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              Most recent · {formatPubDate(featured.pubDate)}
            </div>

            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 block rounded-5xl border hairline bg-white p-8 shadow-diffusion-sm transition hover:-translate-y-0.5 active:translate-y-[1px] md:p-12"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
                <div className="md:col-span-9">
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                    <span>{formatPubDate(featured.pubDate)}</span>
                    <span className="h-1 w-1 rounded-full bg-ink-300" />
                    <span>{featured.readMinutes} min read</span>
                  </div>
                  <h2 className="mt-5 max-w-[24ch] font-display text-4xl font-bold leading-[0.95] tracking-[-0.01em] text-ink-900 md:text-6xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-ink-600 md:text-lg">
                      {featured.excerpt}
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 md:justify-self-end">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition group-hover:gap-3">
                    Read the email
                    <ArrowUpRight size={16} weight="bold" />
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>
      ) : (
        <section className="bg-canvas py-20 md:py-28">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              Coming soon
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-ink-900 md:text-5xl">
              First essay is being written.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              Join the email community above to be among the first to read it.
            </p>
          </div>
        </section>
      )}

      {/* Index of older emails */}
      {rest.length > 0 && (
        <section className="bg-canvas pb-24 md:pb-32">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
              Earlier essays
            </div>

            <ul className="mt-8 divide-y hairline border-y hairline">
              {rest.map((email) => (
                <li key={email.link}>
                  <a
                    href={email.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-12 gap-6 py-8 transition hover:bg-ink-50/60 md:py-10"
                  >
                    <div className="col-span-4 md:col-span-2">
                      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                        {formatPubDate(email.pubDate)}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-ink-400">
                        {email.readMinutes} min
                      </div>
                    </div>
                    <div className="col-span-8 md:col-span-7">
                      <h3 className="font-display text-xl font-semibold leading-[1.05] tracking-[0.005em] text-ink-900 md:text-2xl">
                        {email.title}
                      </h3>
                      {email.excerpt && (
                        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink-600 md:text-base">
                          {email.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="col-span-12 self-center md:col-span-3 md:text-right">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition group-hover:text-ink-900 group-hover:gap-3">
                        Read
                        <ArrowUpRight size={14} weight="bold" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 text-center">
              <a
                href={MAILCHIMP_ARCHIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500 transition hover:text-ink-900"
              >
                Full archive on Mailchimp
                <ArrowUpRight size={12} weight="bold" />
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
