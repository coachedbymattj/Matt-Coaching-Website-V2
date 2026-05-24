// Featurable Google-reviews widget (public, no API key needed).
// Pure module (no React) so it is safe to import from both server and
// client components. The client hook lives in ./useFeaturable.
export const FEATURABLE_WIDGET_ID = "2879afc6-b66b-4adc-b13c-0b21506652f5";
export const FEATURABLE_API = `https://featurable.com/api/v1/widgets/${FEATURABLE_WIDGET_ID}`;
export const FEATURABLE_BUNDLE = "https://featurable.com/assets/bundle.js";

export type FeaturableReview = {
  reviewId: string;
  reviewer: { displayName: string; profilePhotoUrl?: string };
  starRating: number;
  comment: string;
  createTime: string;
};

export type FeaturableData = {
  averageRating: number;
  totalReviewCount: number;
  reviews: FeaturableReview[];
  profileUrl: string | null;
};

// Module-level cache so the footer badge and Nijat's review share one request.
let cache: FeaturableData | null = null;
let inflight: Promise<FeaturableData | null> | null = null;

export async function fetchFeaturable(): Promise<FeaturableData | null> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = fetch(FEATURABLE_API)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d || d.success === false) return null;
      cache = {
        averageRating: Number(d.averageRating) || 0,
        totalReviewCount: Number(d.totalReviewCount) || 0,
        reviews: Array.isArray(d.reviews) ? d.reviews : [],
        profileUrl: typeof d.profileUrl === "string" ? d.profileUrl : null,
      };
      return cache;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Find the first review whose author name contains `name` (case-insensitive). */
export function findReviewByAuthor(
  data: FeaturableData | null,
  name: string
): FeaturableReview | null {
  if (!data) return null;
  const needle = name.toLowerCase();
  return (
    data.reviews.find((r) =>
      r.reviewer?.displayName?.toLowerCase().includes(needle)
    ) ?? null
  );
}
