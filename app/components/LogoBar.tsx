export function LogoBar() {
  const names = [
    "Goldman Sachs",
    "DeepMind",
    "Linklaters",
    "Karolinska",
    "ICONIQ",
    "Bain & Co",
    "Stripe",
    "ECB",
  ];
  return (
    <section className="border-y hairline bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
            Clients write for me from
          </span>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {names.map((n) => (
              <li
                key={n}
                className="font-display text-base font-semibold uppercase tracking-[0.04em] text-ink-500 transition-colors hover:text-ink-800 md:text-lg"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
