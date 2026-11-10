import { clientGeo, clientIp, recordVisit } from "../../lib/visitLog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const clip = (s: unknown, max: number) =>
  typeof s === "string" ? s.slice(0, max) : "";

// Receives one beacon per page view from <VisitBeacon />. The IP, time and
// location are taken from the request itself, never from the browser payload.
export async function POST(request: Request) {
  let body: { p?: unknown; r?: unknown } = {};
  try {
    body = JSON.parse(await request.text());
  } catch {
    // An unreadable payload is still a visit worth recording.
  }

  const h = request.headers;
  try {
    await recordVisit({
      t: new Date().toISOString(),
      ip: clientIp(h),
      path: clip(body.p, 300) || "unknown",
      referrer: clip(body.r, 500),
      userAgent: clip(h.get("user-agent"), 400),
      language: clip(h.get("accept-language"), 100),
      ...clientGeo(h),
    });
  } catch (err) {
    console.error("[visit-log] write failed:", err);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
