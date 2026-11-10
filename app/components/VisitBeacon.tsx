"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Reports each page view to /api/v so it lands in the visit log. */
export function VisitBeacon() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastSent.current === pathname) return; // one record per page view
    lastSent.current = pathname;
    const payload = JSON.stringify({
      p: pathname + window.location.search,
      r: document.referrer,
    });
    try {
      if (!navigator.sendBeacon?.("/api/v", payload)) {
        fetch("/api/v", { method: "POST", body: payload, keepalive: true }).catch(
          () => {}
        );
      }
    } catch {
      // Logging must never break the page.
    }
  }, [pathname]);

  return null;
}
