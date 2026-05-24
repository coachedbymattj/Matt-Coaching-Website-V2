import type { Metadata } from "next";
import { LeadFormShell } from "../../components/LeadFormShell";

export const metadata: Metadata = {
  title: "MELT · Online Group Coaching · Coached by Matt J",
  description:
    "Apply for MELT, a structured online group coaching programme. Lower investment, same coaching standards, a small group of peers.",
};

export default function ApplyMeltPage() {
  return (
    <LeadFormShell
      eyebrow="Path 03 · MELT · Group programme"
      title="Structure, accountability, a small group."
      intro="MELT is a fixed-length group coaching programme built around sustainable fat loss and strength retention. Same programming standards as my 1:1 work, at a lower price point, delivered to a small group that keeps each other honest."
      whatHappensNext={[
        "Fill in the form below to register your interest, about 4 minutes.",
        "I'll email you within 48 working hours with start dates and onboarding details.",
        "If MELT is the right fit, you'll secure your spot and join the next intake.",
      ]}
      formUrl="https://public.1fit.com/leadforms/019c9f62-a14a-7203-bb3d-22546476d2bc"
    />
  );
}
