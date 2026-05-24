import type { Metadata } from "next";
import { LeadFormShell } from "../../components/LeadFormShell";

export const metadata: Metadata = {
  title: "In-Person 1:1 Coaching · Apply · Coached by Matt J",
  description:
    "Apply for in-person 1:1 coaching in Amsterdam. Bespoke programming, hands-on technique, weekly accountability.",
};

export default function ApplyInPersonPage() {
  return (
    <LeadFormShell
      eyebrow="Path 01 · In-Person 1:1"
      title="Train under my eye, every session."
      intro="A focused, hands-on engagement for clients training with me in Amsterdam. You bring the ambition; I bring the programming, the technique work, and a week-by-week plan that bends around your life. Billing is flexible: pay per session or as a monthly subscription."
      whatHappensNext={[
        "Fill in the short form below, takes about 5 minutes.",
        "I'll reply within 48 working hours with a calendar link for a 30-minute discovery call.",
        "If we're a fit, we book your diagnostic session and begin block one.",
      ]}
      formUrl="https://public.1fit.com/leadforms/019e3b5a-b9cf-7149-a058-fc9cc733ac7c"
    />
  );
}
