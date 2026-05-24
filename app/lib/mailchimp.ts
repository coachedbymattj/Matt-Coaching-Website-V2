import { XMLParser } from "fast-xml-parser";

export const MAILCHIMP_FEED_URL =
  "https://us17.campaign-archive.com/feed?u=882dc8da460ec580a87ec6cf2&id=6e7349c940";

export const MAILCHIMP_ARCHIVE_URL =
  "https://us17.campaign-archive.com/home/?u=882dc8da460ec580a87ec6cf2&id=6e7349c940";

export const MAILCHIMP_SIGNUP_URL =
  "https://mailchi.mp/c63b1de81cdb/coachedbymattj-email-community";

export type Campaign = {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  readMinutes: number;
};

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExcerpt(html: string, maxLength = 220): string {
  const text = stripHtml(html);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${truncated}…`;
}

function estimateReadMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(MAILCHIMP_FEED_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      cdataPropName: "__cdata",
    });
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item;
    if (!items) return [];
    const itemsArray = Array.isArray(items) ? items : [items];

    return itemsArray
      .map((item: Record<string, unknown>) => {
        const rawDescription =
          (item.description as { __cdata?: string } | string | undefined);
        const description =
          typeof rawDescription === "string"
            ? rawDescription
            : rawDescription?.__cdata ?? "";
        const rawTitle = item.title as { __cdata?: string } | string | undefined;
        const title =
          typeof rawTitle === "string" ? rawTitle : rawTitle?.__cdata ?? "";
        return {
          title,
          link: (item.link as string) || "",
          pubDate: (item.pubDate as string) || "",
          excerpt: extractExcerpt(description),
          readMinutes: estimateReadMinutes(description),
        };
      })
      .filter((c) => c.title && c.link);
  } catch (err) {
    console.error("[mailchimp] fetch failed:", err);
    return [];
  }
}

export function formatPubDate(pubDate: string): string {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return pubDate;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
