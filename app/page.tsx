import { LogoBar } from "./components/LogoBar";
import { MessageBox } from "./components/MessageBox";
import { Positioning } from "./components/Positioning";
import { HomeHero } from "./components/home/Hero";
import { HomeBeliefs } from "./components/home/Beliefs";
import { HomePrinciples } from "./components/home/Principles";
import { HomeDeliveryStack } from "./components/home/DeliveryStack";
import { HomeOutcomes } from "./components/home/Outcomes";
import { HomeProcess } from "./components/home/Process";
import { HomeReviews } from "./components/home/Reviews";
import { HomeGallery } from "./components/home/Gallery";
import { HomeCta } from "./components/home/Cta";

/* Small editorial section-number bar — used above the sections that don't get
   their own gutter number (LogoBar, MessageBox). Keeps the magazine rhythm. */
function SectionRail({
  number,
  title,
  meta,
}: {
  number: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="flex items-baseline justify-between border-b hairline pb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-500">
        <span>
          {number} — {title}
        </span>
        {meta ? <span className="hidden md:inline">{meta}</span> : <span />}
        <span>Coached by Matt J</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 00 · Hero — editorial */}
      <HomeHero />

      {/* 01 · Trust strip — editorial running header above existing LogoBar */}
      <div className="bg-canvas pt-10">
        <SectionRail
          number="01 / 10"
          title="Trust"
          meta="Clients write for me from"
        />
      </div>
      <LogoBar />

      {/* Positioning strap — "total beginner to photoshoot ready" */}
      <Positioning />

      {/* 02 · What I stand for — editorial */}
      <HomeBeliefs />

      {/* 03 · How I coach — editorial */}
      <HomePrinciples />

      {/* 04 · Delivery stack — editorial channels + LAB instrument panel for the app (intentional seam) */}
      <HomeDeliveryStack />

      {/* 05 · Outcomes log — LAB on dark ink */}
      <HomeOutcomes />

      {/* 06 · How I work — editorial */}
      <HomeProcess />

      {/* 07 · In their words — editorial pull-quotes */}
      <HomeReviews />

      {/* 08 · Got a question — editorial running header above existing MessageBox */}
      <div className="bg-canvas pt-10">
        <SectionRail
          number="08 / 10"
          title="Message"
          meta="Direct line to the coach"
        />
      </div>
      <MessageBox />

      {/* Gallery coda — auto-cycling carousel, anchor target #transformations */}
      <HomeGallery />

      {/* 09 · Apply — editorial dark CTA */}
      <HomeCta />
    </>
  );
}
