import { LogoBar } from "./components/LogoBar";
import { MessageBox } from "./components/MessageBox";
import { Positioning } from "./components/Positioning";
import { HomeHero } from "./components/home/Hero";
import { HomePaths } from "./components/home/Paths";
import { HomeDeliveryStack } from "./components/home/DeliveryStack";
import { HomeOutcomes } from "./components/home/Outcomes";
import { HomeProcess } from "./components/home/Process";
import { HomeReviews } from "./components/home/Reviews";
import { HomeGallery } from "./components/home/Gallery";
import { HomeCta } from "./components/home/Cta";

export default function HomePage() {
  return (
    <>
      {/* 00 · Hero — editorial */}
      <HomeHero />

      {/* Trust strip */}
      <LogoBar />

      {/* Positioning strap — "total beginner to photoshoot ready" */}
      <Positioning />

      {/* The two coaching paths, with the in-person price */}
      <HomePaths />

      {/* 04 · Delivery stack — editorial channels + LAB instrument panel for the app (intentional seam) */}
      <HomeDeliveryStack />

      {/* 05 · Outcomes log — LAB on dark ink */}
      <HomeOutcomes />

      {/* 06 · How I work — editorial */}
      <HomeProcess />

      {/* 07 · In their words — editorial pull-quotes */}
      <HomeReviews />

      {/* Got a question */}
      <div className="bg-canvas pt-16 md:pt-24" />
      <MessageBox />

      {/* Gallery coda — auto-cycling carousel, anchor target #transformations */}
      <HomeGallery />

      {/* 09 · Apply — editorial dark CTA */}
      <HomeCta />
    </>
  );
}
