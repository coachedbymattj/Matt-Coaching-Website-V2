"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

// Module-level flag: true only for the very first render of the session.
// We skip the transition on first load so it never delays first paint / LCP.
let firstLoad = true;

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const isFirst = useRef(firstLoad);

  useEffect(() => {
    firstLoad = false;
  }, []);

  if (isFirst.current || reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
