"use client";

import { useEffect, useState } from "react";
import { fetchFeaturable, type FeaturableData } from "./featurable";

/** Client hook: fetches the Featurable widget JSON once and shares the cached result. */
export function useFeaturable() {
  const [data, setData] = useState<FeaturableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchFeaturable().then((d) => {
      if (!alive) return;
      setData(d);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading };
}
