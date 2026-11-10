import { timingSafeEqual } from "crypto";
import { clientIp, readVisits } from "../../lib/visitLog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DAY = /^\d{4}-\d{2}-\d{2}$/;

function authorised(given: string | null): boolean {
  const expected = process.env.VISIT_LOG_KEY;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Private read access to the visit log. Requires the VISIT_LOG_KEY password
// (set in the Netlify environment) in the x-log-key header.
export async function GET(request: Request) {
  if (!process.env.VISIT_LOG_KEY) {
    return Response.json(
      { error: "VISIT_LOG_KEY is not set on the server." },
      { status: 503 }
    );
  }
  if (!authorised(request.headers.get("x-log-key"))) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }

  const url = new URL(request.url);
  const today = new Date().toISOString().slice(0, 10);
  const from = url.searchParams.get("from") || today;
  const to = url.searchParams.get("to") || today;
  if (!DAY.test(from) || !DAY.test(to) || from > to) {
    return Response.json({ error: "Invalid date range." }, { status: 400 });
  }

  try {
    const visits = await readVisits(from, to);
    return Response.json(
      { visits, yourIp: clientIp(request.headers) },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    console.error("[visit-log] read failed:", err);
    return Response.json({ error: "Could not read the log." }, { status: 500 });
  }
}
