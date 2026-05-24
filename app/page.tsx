import { Hero } from "./components/Hero";
import { LogoBar } from "./components/LogoBar";
import { BentoFeatures } from "./components/BentoFeatures";
import { TransformationsStrip } from "./components/TransformationsStrip";
import { ProcessSteps } from "./components/ProcessSteps";
import { TestimonialMarquee } from "./components/TestimonialMarquee";
import { ReviewsFeed } from "./components/ReviewsFeed";
import { CtaBanner } from "./components/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoBar />
      <BentoFeatures />
      <TransformationsStrip />
      <ProcessSteps />
      <TestimonialMarquee />
      <ReviewsFeed />
      <CtaBanner />
    </>
  );
}
