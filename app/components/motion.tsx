"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Gentle scroll reveal: fade + slide up as it enters view (once).
 * GPU-friendly (opacity + translate). Renders static under reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts a number up when it scrolls into view, and smoothly re-animates if the
 * value changes (e.g. live calculator updates). Reduced motion shows the value
 * immediately. `tabular-nums` keeps width stable so there is no layout shift.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.1,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);

  const fmt = (n: number) =>
    prefix +
    n.toLocaleString("en-GB", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  const [display, setDisplay] = useState(() => fmt(0));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      setDisplay(fmt(value));
      return;
    }
    if (!inView) return;
    const controls = animate(mv, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(fmt(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {display}
    </span>
  );
}
