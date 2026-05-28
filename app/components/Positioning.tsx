/* Editorial positioning strap. Used near the top of the homepage and the
   results page so the visitor knows who I coach in one line. */
export function Positioning() {
  return (
    <section className="border-b hairline bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember-deep">
              Who I coach
            </div>
          </div>
          <p className="col-span-12 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.01em] text-ink-900 md:col-span-9 md:text-6xl">
            Total beginner to{" "}
            <span className="relative inline-block">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg,#e8623f 0%,#d97a64 55%,#c8553d 100%)",
                }}
              >
                photoshoot ready
              </span>
              <span
                aria-hidden
                className="absolute -inset-x-3 -inset-y-2 -z-10 rounded-full bg-ember/20 blur-2xl"
              />
            </span>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
