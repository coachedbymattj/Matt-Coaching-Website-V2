"use client";

import { useMemo, useState } from "react";
import type { Visit } from "../../lib/visitLog";

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

const amsterdam = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  dateStyle: "medium",
  timeStyle: "medium",
});

function device(ua: string) {
  const os = /iPhone|iPad/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
    ? "Android"
    : /Windows/.test(ua)
    ? "Windows"
    : /Mac OS X/.test(ua)
    ? "Mac"
    : /Linux/.test(ua)
    ? "Linux"
    : "Other";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Firefox\//.test(ua)
    ? "Firefox"
    : /Chrome\//.test(ua)
    ? "Chrome"
    : /Safari\//.test(ua)
    ? "Safari"
    : /bot|crawl|spider/i.test(ua)
    ? "Bot"
    : "Other";
  return `${os} · ${browser}`;
}

function toCsv(rows: Visit[]) {
  const cols: (keyof Visit)[] = [
    "t",
    "ip",
    "path",
    "referrer",
    "country",
    "region",
    "city",
    "timezone",
    "language",
    "userAgent",
  ];
  const esc = (s: string) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  return [
    ["time_utc", ...cols.slice(1)].join(","),
    ...rows.map((r) => cols.map((c) => esc(r[c])).join(",")),
  ].join("\r\n");
}

const label =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500";
const input =
  "mt-2 w-full rounded-2xl border hairline bg-white px-4 py-3 text-base text-ink-900";
const th = "px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500";
const td = "px-3 py-2 align-top text-sm text-ink-800";

export function VisitLogViewer() {
  const today = isoDay(new Date());
  const [key, setKey] = useState("");
  const [from, setFrom] = useState(isoDay(new Date(Date.now() - 6 * 86400000)));
  const [to, setTo] = useState(today);
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [yourIp, setYourIp] = useState("");
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/visit-log?from=${from}&to=${to}`, {
        headers: { "x-log-key": key },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load the log.");
      setVisits(data.visits);
      setYourIp(data.yourIp);
    } catch (err) {
      setVisits(null);
      setError(err instanceof Error ? err.message : "Could not load the log.");
    } finally {
      setBusy(false);
    }
  }

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const rows = visits ?? [];
    if (!q) return rows;
    return rows.filter((v) =>
      [v.ip, v.path, v.city, v.country, v.referrer, v.userAgent]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [visits, filter]);

  const byIp = useMemo(() => {
    const m = new Map<
      string,
      { ip: string; n: number; first: string; last: string; where: string }
    >();
    for (const v of shown) {
      const row = m.get(v.ip);
      if (row) {
        row.n += 1;
        row.last = v.t;
      } else {
        m.set(v.ip, {
          ip: v.ip,
          n: 1,
          first: v.t,
          last: v.t,
          where: [v.city, v.country].filter(Boolean).join(", "),
        });
      }
    }
    return Array.from(m.values()).sort((a, b) => b.n - a.n);
  }, [shown]);

  function download() {
    const blob = new Blob([toCsv(shown)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `visit-log_${from}_to_${to}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="mt-10">
      <form
        onSubmit={load}
        className="grid grid-cols-1 gap-4 rounded-4xl border hairline bg-white p-6 shadow-diffusion-sm sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end"
      >
        <label className={label}>
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={input}
          />
        </label>
        <label className={label}>
          From (UTC)
          <input
            type="date"
            required
            max={to}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={input}
          />
        </label>
        <label className={label}>
          To (UTC)
          <input
            type="date"
            required
            min={from}
            max={today}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={input}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="btn-ember rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-60"
        >
          {busy ? "Loading…" : "Load log"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-ember-deep">
          {error}
        </p>
      )}

      {visits && (
        <>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <label className={`${label} sm:w-80`}>
              Filter (IP, page, city…)
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={input}
              />
            </label>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-ink-600">
                {shown.length} page views · {byIp.length} IP addresses
              </span>
              <button
                type="button"
                onClick={download}
                disabled={shown.length === 0}
                className="rounded-full border hairline px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100 disabled:opacity-50"
              >
                Download CSV
              </button>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="mt-8 text-sm text-ink-600">
              No visits recorded in this range.
            </p>
          ) : (
            <>
              <h2 className="mt-10 font-display text-2xl font-semibold uppercase text-ink-900">
                By IP address
              </h2>
              <div className="mt-4 overflow-x-auto rounded-3xl border hairline bg-white">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="border-b hairline">
                      <th className={th}>IP address</th>
                      <th className={th}>Views</th>
                      <th className={th}>Location</th>
                      <th className={th}>First seen (Amsterdam)</th>
                      <th className={th}>Last seen (Amsterdam)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byIp.map((r) => (
                      <tr key={r.ip} className="border-b hairline last:border-0">
                        <td className={`${td} font-mono`}>
                          <button
                            type="button"
                            onClick={() => setFilter(r.ip)}
                            className="underline decoration-ink-300 underline-offset-4 hover:decoration-ember"
                          >
                            {r.ip}
                          </button>
                          {r.ip === yourIp && (
                            <span className="ml-2 rounded-full bg-ink-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-600">
                              you
                            </span>
                          )}
                        </td>
                        <td className={`${td} font-mono tabular-nums`}>{r.n}</td>
                        <td className={td}>{r.where || "—"}</td>
                        <td className={td}>{amsterdam.format(new Date(r.first))}</td>
                        <td className={td}>{amsterdam.format(new Date(r.last))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="mt-10 font-display text-2xl font-semibold uppercase text-ink-900">
                Every page view
              </h2>
              <div className="mt-4 overflow-x-auto rounded-3xl border hairline bg-white">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b hairline">
                      <th className={th}>Time (UTC)</th>
                      <th className={th}>IP address</th>
                      <th className={th}>Page</th>
                      <th className={th}>Location</th>
                      <th className={th}>Device</th>
                      <th className={th}>Came from</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...shown].reverse().map((v, i) => (
                      <tr key={v.t + i} className="border-b hairline last:border-0">
                        <td className={`${td} whitespace-nowrap font-mono text-xs`}>
                          {v.t.replace("T", " ").replace("Z", "")}
                        </td>
                        <td className={`${td} font-mono`}>{v.ip}</td>
                        <td className={`${td} break-all`}>{v.path}</td>
                        <td className={td}>
                          {[v.city, v.country].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className={td} title={v.userAgent}>
                          {device(v.userAgent)}
                        </td>
                        <td className={`${td} break-all`}>{v.referrer || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
