import type { Metadata } from "next";
import { LeadFormShell } from "../../components/LeadFormShell";

export const metadata: Metadata = {
  title: "Online 1:1 Coaching · Apply · Coached by Matt J",
  description:
    "Apply for online 1:1 coaching. Bespoke programming, voice-note form reviews, and weekly check-ins for working professionals.",
};

export default function ApplyOnlinePage() {
  return (
    <LeadFormShell
      eyebrow="Path 02 · Online 1:1"
      title="A coach in your pocket, wherever you train."
      intro="Bespoke programming in the app, weekly check-ins, training-video form analysis, and open chat between sessions. Built for clients who already know their way around a gym and want the 1:1 standard from anywhere in the world."
      whatHappensNext={[
        "Fill in the short form below, about 7 minutes.",
        "I'll review and reply inside 48 working hours, working days.",
        "If we're a fit, I send a calendar link for a 60-minute video diagnostic. We start block one the following Monday.",
      ]}
      formUrl="https://public.1fit.com/leadforms/0198555c-3110-7270-837d-e0af7242a7ee"
    />
  );
}
