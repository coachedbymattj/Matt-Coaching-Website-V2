import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { VisitBeacon } from "./components/VisitBeacon";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coachedbymattj.com"),
  title: "Coached by Matt J · Body transformation, engineered",
  description:
    "Online coaching for working professionals who want a leaner, stronger, more capable body. Coaching built around your life, not the other way around.",
  openGraph: {
    title: "Coached by Matt J",
    description:
      "Online body transformation coaching. Engineered protocols. Measured outcomes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${GeistMono.variable}`}
    >
      <body className="grain min-h-[100dvh] bg-canvas font-sans text-ink-900 antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <VisitBeacon />
      </body>
    </html>
  );
}
