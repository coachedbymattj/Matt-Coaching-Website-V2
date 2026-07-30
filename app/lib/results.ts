// Single source of truth for client transformation results.
// Used by the Results page (full grid + showcase) and the homepage strip.
// Order is most-recent first.

export type ResultCase = {
  slug: string;
  name: string;
  headline: string;
  detail: string;
  /** Primary image. Also the still used anywhere that shows a single frame. */
  img: string;
  /**
   * Optional extra views of the same transformation (e.g. front and back).
   * When present, the results card lets you swipe between them in the space
   * a single image would take. `img` should be the first entry.
   */
  views?: { src: string; label: string }[];
};

export const results: ResultCase[] = [
  {
    slug: "noah",
    name: "Noah",
    headline: "Dropped 11.9kg",
    detail: "67.5kg to 55.6kg",
    img: "/results/noah-front.webp",
    views: [
      { src: "/results/noah-front.webp", label: "Front" },
      { src: "/results/noah-back.webp", label: "Back" },
    ],
  },
  {
    slug: "paul",
    name: "Paul",
    headline: "Dropped 8.6kg",
    detail: "103.4kg to 94.8kg",
    img: "/results/paul.webp",
  },
  {
    slug: "elin",
    name: "Elin",
    headline: "Dropped 9.5kg",
    detail: "Week 1 to Week 13",
    img: "/results/elin.webp",
  },
  {
    slug: "nijat",
    name: "Nijat",
    headline: "Dropped 7.9kg",
    detail: "78.3kg to 70.4kg",
    img: "/results/nijat.webp",
  },
  {
    slug: "adrian",
    name: "Adrian",
    headline: "Full recomp",
    detail: "Dec 2024 to March 2025",
    img: "/results/adrian.webp",
  },
  {
    slug: "natalia",
    name: "Natalia",
    headline: "Photoshoot ready",
    detail: "Week 1 to Week 34",
    img: "/results/natalia.webp",
  },
  {
    slug: "jim",
    name: "Jim",
    headline: "Dropped 10kg",
    detail: "Week 1 to Week 12",
    img: "/results/jim.webp",
  },
  {
    slug: "liam",
    name: "Liam",
    headline: "Full recomp",
    detail: "99.8kg to 97.2kg",
    img: "/results/liam.webp",
  },
  {
    slug: "rebecca",
    name: "Rebecca",
    headline: "Got abs",
    detail: "Month 1 to Month 6",
    img: "/results/rebecca.webp",
  },
  {
    slug: "chitvan",
    name: "Chitvan",
    headline: "Dropped 9.7kg",
    detail: "71.7kg to 62kg",
    img: "/results/chitvan.webp",
  },
];
