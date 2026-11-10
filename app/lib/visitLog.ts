// Server-only visit log. Every page view is written as its own append-only
// record so entries are never rewritten after the fact.
//
// Storage: Netlify Blobs in production. In local development (where Blobs is
// not configured) records fall back to JSON files under .data/visit-log so the
// feature can be exercised with `npm run dev`.

import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

export type Visit = {
  /** Server receive time, ISO 8601 in UTC. */
  t: string;
  ip: string;
  path: string;
  referrer: string;
  userAgent: string;
  language: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
};

const STORE_NAME = "visit-log";
const LOCAL_DIR = path.join(process.cwd(), ".data", "visit-log");
const isDev = process.env.NODE_ENV !== "production";

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function dayOf(iso: string) {
  return iso.slice(0, 10);
}

function keyFor(v: Visit) {
  const rand = Math.random().toString(36).slice(2, 8);
  // ISO timestamps sort chronologically as plain strings.
  return `${dayOf(v.t)}/${v.t.replace(/[:.]/g, "-")}-${rand}`;
}

export async function recordVisit(v: Visit): Promise<void> {
  const key = keyFor(v);
  try {
    await store().setJSON(key, v);
  } catch (err) {
    if (!isDev) throw err;
    const file = path.join(LOCAL_DIR, `${key}.json`);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(v));
  }
}

async function readDay(day: string): Promise<Visit[]> {
  try {
    const s = store();
    const { blobs } = await s.list({ prefix: `${day}/` });
    const out: Visit[] = [];
    // Fetch in small batches to stay well inside function limits.
    for (let i = 0; i < blobs.length; i += 25) {
      const batch = await Promise.all(
        blobs
          .slice(i, i + 25)
          .map((b) => s.get(b.key, { type: "json" }) as Promise<Visit | null>)
      );
      for (const v of batch) if (v) out.push(v);
    }
    return out;
  } catch (err) {
    if (!isDev) throw err;
    try {
      const dir = path.join(LOCAL_DIR, day);
      const files = await fs.readdir(dir);
      const out: Visit[] = [];
      for (const f of files) {
        out.push(JSON.parse(await fs.readFile(path.join(dir, f), "utf8")));
      }
      return out;
    } catch {
      return [];
    }
  }
}

/** All visits between two UTC days (inclusive, YYYY-MM-DD), oldest first. */
export async function readVisits(from: string, to: string): Promise<Visit[]> {
  const days: string[] = [];
  const end = new Date(`${to}T00:00:00Z`).getTime();
  for (
    let d = new Date(`${from}T00:00:00Z`).getTime();
    d <= end && days.length < 92;
    d += 86400000
  ) {
    days.push(new Date(d).toISOString().slice(0, 10));
  }
  const perDay = await Promise.all(days.map(readDay));
  return perDay.flat().sort((a, b) => a.t.localeCompare(b.t));
}

/** The visitor's IP as seen by Netlify's edge (falls back for local dev). */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-nf-client-connection-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Netlify's geo lookup for the request, when present. */
export function clientGeo(headers: Headers) {
  const empty = { country: "", region: "", city: "", timezone: "" };
  const raw = headers.get("x-nf-geo");
  if (!raw) return empty;
  try {
    const json = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const g = JSON.parse(json);
    return {
      country: String(g?.country?.name || g?.country?.code || ""),
      region: String(g?.subdivision?.name || g?.subdivision?.code || ""),
      city: String(g?.city || ""),
      timezone: String(g?.timezone || ""),
    };
  } catch {
    return empty;
  }
}
