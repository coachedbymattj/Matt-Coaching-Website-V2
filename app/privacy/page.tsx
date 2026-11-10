import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy · Coached by Matt J",
  description:
    "What personal data this website collects, why, and how to get in touch about it.",
  alternates: { canonical: "https://coachedbymattj.com/privacy" },
};

const sections = [
  {
    h: "Who is responsible",
    p: [
      "This website is run by Matthew Johnstone, trading as Coached by Matt J, Amsterdam, the Netherlands. For anything in this notice, email coachedbymattj@gmail.com.",
    ],
  },
  {
    h: "Visit logs",
    p: [
      "When you open a page on this site, the server records the date and time, the page requested, your IP address, the approximate location derived from it (city and country), your browser and device type, your language setting and the page you came from.",
      "These logs are kept to keep the site secure, to detect and investigate misuse, and where necessary to establish, exercise or defend legal claims. The legal basis is legitimate interest (GDPR Art. 6(1)(f)). Logs are kept only for as long as those purposes require.",
    ],
  },
  {
    h: "Applications and email",
    p: [
      "Coaching applications are submitted through forms provided by 1Fit, and the email community is managed with Mailchimp. Information you enter there is processed by those providers on my behalf so that I can reply to you and, if you sign up, send you emails. You can unsubscribe from any email at any time.",
    ],
  },
  {
    h: "Who sees your data",
    p: [
      "The site is hosted by Netlify, which processes visit data on my behalf. Data is not sold. It is shared with others only where required by law or where needed for legal advice or legal proceedings.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You can ask for access to your personal data, for it to be corrected or deleted, or object to its use, by emailing the address above. You also have the right to complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-24 md:pt-32">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
        Privacy notice
      </div>
      <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.01em] text-ink-900 md:text-6xl">
        Your data on this site.
      </h1>
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.01em] text-ink-900">
              {s.h}
            </h2>
            {s.p.map((t) => (
              <p key={t} className="mt-3 text-base leading-relaxed text-ink-600">
                {t}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
