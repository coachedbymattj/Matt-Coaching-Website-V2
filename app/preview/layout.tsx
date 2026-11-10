import type { Metadata } from "next";

// Internal design drafts: keep them out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
